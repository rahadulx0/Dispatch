import type {
  AdminStats,
  AdminUser,
  AuthResponse,
  Blog,
  FeaturedResponse,
  PaginatedAdminUsers,
  PaginatedBlogs,
  Role,
  User,
} from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, { message: string }>;
  constructor(message: string, status: number, errors?: Record<string, { message: string }>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Access token lives in memory. The refresh token is set as an httpOnly cookie
// AND mirrored to localStorage so sessions survive device restart and third-
// party cookie blocking (cross-site deploys). The refresh endpoint accepts
// the token from either the cookie or the request body.
const REFRESH_STORAGE_KEY = 'blogs.refreshToken';
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  listeners.forEach((l) => l(token));
}

export function subscribeAccessToken(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(REFRESH_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredRefreshToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.localStorage.setItem(REFRESH_STORAGE_KEY, token);
    else window.localStorage.removeItem(REFRESH_STORAGE_KEY);
  } catch {
    // ignore quota / privacy-mode errors
  }
}

type FetchOptions = RequestInit & {
  auth?: boolean;
  skipRefresh?: boolean;
  next?: { revalidate?: number; tags?: string[] };
};

function buildHeaders(options: FetchOptions): Headers {
  const headers = new Headers(options.headers as HeadersInit | undefined);
  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData) && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (options.auth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return headers;
}

async function rawFetch<T>(path: string, options: FetchOptions): Promise<T> {
  const { next, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    headers: buildHeaders(options),
    credentials: 'include',
  };
  if (next) (init as RequestInit & { next?: unknown }).next = next;

  const res = await fetch(`${API_URL}${path}`, init);
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.errors);
  }
  return (data || ({} as T)) as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function tryRefresh(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const stored = getStoredRefreshToken();
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stored ? { refreshToken: stored } : {}),
      });
      if (!res.ok) {
        if (res.status === 401) setStoredRefreshToken(null);
        return null;
      }
      const data = (await res.json()) as AuthResponse;
      setAccessToken(data.accessToken);
      if (data.refreshToken) setStoredRefreshToken(data.refreshToken);
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  try {
    return await rawFetch<T>(path, options);
  } catch (err) {
    if (
      err instanceof ApiError &&
      err.status === 401 &&
      options.auth &&
      !options.skipRefresh &&
      typeof window !== 'undefined'
    ) {
      const newToken = await tryRefresh();
      if (newToken) {
        return rawFetch<T>(path, { ...options, skipRefresh: true });
      }
      setAccessToken(null);
      setStoredRefreshToken(null);
    }
    throw err;
  }
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  refresh: () => tryRefresh(),
  logout: () =>
    request<{ ok: boolean }>('/api/auth/logout', { method: 'POST', auth: true }).catch(() => ({
      ok: false,
    })),
  me: () => request<{ user: User }>('/api/auth/me', { auth: true }),
  updateProfile: (body: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>) =>
    request<{ user: User }>('/api/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      auth: true,
    }),

  // Blogs
  listBlogs: (params: {
    page?: number;
    limit?: number;
    category?: string;
    q?: string;
    tag?: string;
  } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const query = qs.toString();
    return request<PaginatedBlogs>(`/api/blogs${query ? `?${query}` : ''}`, {
      next: { revalidate: 30 },
    });
  },
  getFeatured: () =>
    request<FeaturedResponse>('/api/blogs/featured', { next: { revalidate: 30 } }),
  getTrending: () =>
    request<{ items: Blog[] }>('/api/blogs/trending', { next: { revalidate: 60 } }),
  getBlog: (slug: string) =>
    request<{ blog: Blog; related: Blog[] }>(`/api/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 15 },
    }),
  myBlogs: () =>
    request<{ items: Blog[] }>('/api/blogs/mine', { auth: true, cache: 'no-store' }),
  myBlog: (id: string) =>
    request<{ blog: Blog }>(`/api/blogs/mine/${encodeURIComponent(id)}`, {
      auth: true,
      cache: 'no-store',
    }),
  createBlog: (body: Partial<Blog>) =>
    request<{ blog: Blog }>('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: true,
    }),
  updateBlog: (id: string, body: Partial<Blog>) =>
    request<{ blog: Blog }>(`/api/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      auth: true,
    }),
  deleteBlog: (id: string) =>
    request<{ ok: boolean }>(`/api/blogs/${id}`, { method: 'DELETE', auth: true }),
  categories: () => request<{ categories: string[] }>('/api/blogs/categories'),
  allSlugs: () =>
    request<{ items: Array<{ slug: string; updatedAt: string; publishedAt?: string }> }>(
      '/api/blogs/slugs',
      { next: { revalidate: 300 } }
    ),

  // Upload
  uploadImage: async (file: File): Promise<{ url: string; key: string }> => {
    const form = new FormData();
    form.append('image', file);
    return request('/api/upload/image', { method: 'POST', body: form, auth: true });
  },
  deleteMedia: (key: string) =>
    request<{ ok: boolean }>(`/api/upload/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      auth: true,
    }),

  // Admin
  adminStats: () => request<AdminStats>('/api/admin/stats', { auth: true, cache: 'no-store' }),
  adminListUsers: (params: { page?: number; q?: string } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const query = qs.toString();
    return request<PaginatedAdminUsers>(
      `/api/admin/users${query ? `?${query}` : ''}`,
      { auth: true, cache: 'no-store' }
    );
  },
  adminUpdateUserRole: (id: string, role: Role) =>
    request<{ user: AdminUser }>(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
      auth: true,
    }),
  adminDeleteUser: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE', auth: true }),
  adminListBlogs: (params: { page?: number; q?: string; status?: string } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const query = qs.toString();
    return request<PaginatedBlogs>(`/api/admin/blogs${query ? `?${query}` : ''}`, {
      auth: true,
      cache: 'no-store',
    });
  },
  adminModerateBlog: (id: string, status: 'draft' | 'published') =>
    request<{ blog: Blog }>(`/api/admin/blogs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      auth: true,
    }),
  adminDeleteBlog: (id: string) =>
    request<{ ok: boolean }>(`/api/admin/blogs/${id}`, { method: 'DELETE', auth: true }),
};

export function formatDate(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeAgo(value?: string) {
  if (!value) return '';
  const now = Date.now();
  const then = new Date(value).getTime();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`;
  return formatDate(value);
}
