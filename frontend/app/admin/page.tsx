'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import RequireRole from '@/components/RequireRole';
import { api, formatDate } from '@/lib/api';
import type { AdminStats, AdminUser, Blog, PaginatedBlogs, Role } from '@/lib/types';

type Tab = 'overview' | 'blogs' | 'users';

export default function AdminPage() {
  return (
    <RequireRole roles={['admin']}>
      <Admin />
    </RequireRole>
  );
}

function Admin() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <section className="container-news py-10">
      <header className="border-b-2 border-ink pb-4">
        <span className="kicker">Administration</span>
        <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">Admin console</h1>
        <p className="mt-2 font-serif text-ink-500">Moderate content, review users, and track platform health.</p>
      </header>

      <div className="mt-6 flex gap-1 border-b border-ink-100">
        {(['overview', 'blogs', 'users'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
              tab === t ? 'border-ink text-ink' : 'border-transparent text-ink-400 hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'overview' ? <Overview /> : tab === 'blogs' ? <BlogsPanel /> : <UsersPanel />}
      </div>
    </section>
  );
}

function Overview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.adminStats().then(setStats).catch((err) => setError((err as Error).message));
  }, []);

  if (error) return <p className="border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm">{error}</p>;
  if (!stats) return <p className="font-sans text-sm uppercase tracking-[0.1em] text-ink-400">Loading…</p>;

  const tiles: Array<{ label: string; value: number }> = [
    { label: 'Users', value: stats.users },
    { label: 'Admins', value: stats.admins },
    { label: 'Authors', value: stats.authors },
    { label: 'Blogs', value: stats.blogs },
    { label: 'Published', value: stats.published },
    { label: 'Drafts', value: stats.drafts },
    { label: 'Total views', value: stats.views },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="border-l-2 border-brand-500 bg-ink-50 p-5">
          <p className="eyebrow">{t.label}</p>
          <p className="mt-2 font-serif text-4xl font-black text-ink">{t.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function BlogsPanel() {
  const [data, setData] = useState<PaginatedBlogs | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (params: { q?: string; status?: string; page?: number } = {}) => {
      setLoading(true);
      try {
        const res = await api.adminListBlogs({ q: params.q ?? q, status: params.status ?? status, page: params.page || 1 });
        setData(res);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [q, status]
  );

  useEffect(() => {
    void load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function moderate(b: Blog, to: 'draft' | 'published') {
    try {
      await api.adminModerateBlog(b._id, to);
      await load({ page: data?.page || 1 });
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function remove(b: Blog) {
    if (!confirm(`Delete "${b.title}"?`)) return;
    try {
      await api.adminDeleteBlog(b._id);
      await load({ page: data?.page || 1 });
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void load({ page: 1 });
        }}
        className="flex flex-wrap items-end gap-3 border-b border-ink-100 pb-4"
      >
        <label className="min-w-[200px] flex-1">
          <span className="eyebrow">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title or excerpt"
            className="input-field mt-1"
          />
        </label>
        <label>
          <span className="eyebrow">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 block border border-ink-200 bg-white px-3 py-2 font-sans text-sm"
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </label>
        <button type="submit" className="btn-primary">Apply</button>
      </form>

      {error ? <p className="mt-4 border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm">{error}</p> : null}
      {loading ? <p className="mt-4 font-sans text-sm uppercase tracking-[0.1em] text-ink-400">Loading…</p> : null}

      {data ? (
        <table className="mt-4 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-ink-200">
              <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Title</th>
              <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Author</th>
              <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Category</th>
              <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Status</th>
              <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Created</th>
              <th className="py-3 text-right font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((b) => (
              <tr key={b._id} className="border-b border-ink-100 align-top">
                <td className="py-3 pr-4 font-serif text-sm">
                  <Link href={`/blog/${b.slug}`} className="font-semibold hover:text-brand-500">
                    {b.title}
                  </Link>
                </td>
                <td className="py-3 pr-4 font-sans text-sm text-ink-500">{b.author?.name}</td>
                <td className="py-3 pr-4 font-sans text-sm text-ink-500">{b.category}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-block px-2 py-0.5 font-sans text-[11px] font-bold uppercase tracking-[0.1em] ${
                      b.status === 'published' ? 'bg-ink text-white' : 'bg-ink-100 text-ink-500'
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-3 pr-4 font-sans text-sm text-ink-500">{formatDate(b.createdAt)}</td>
                <td className="py-3 text-right">
                  <div className="inline-flex gap-2">
                    {b.status === 'published' ? (
                      <button
                        type="button"
                        onClick={() => void moderate(b, 'draft')}
                        className="border border-ink-200 px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] hover:border-ink"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void moderate(b, 'published')}
                        className="border border-ink px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] hover:border-brand-500 hover:text-brand-500"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void remove(b)}
                      className="border border-ink-200 px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500 hover:border-brand-500 hover:text-brand-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

function UsersPanel() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (searchQ?: string) => {
    setLoading(true);
    try {
      const res = await api.adminListUsers({ q: searchQ ?? q });
      setItems(res.items);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeRole(id: string, role: Role) {
    try {
      await api.adminUpdateUserRole(id, role);
      setItems((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  async function remove(u: AdminUser) {
    if (!confirm(`Delete ${u.name} and all their posts?`)) return;
    try {
      await api.adminDeleteUser(u.id);
      setItems((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void load();
        }}
        className="flex items-end gap-3 border-b border-ink-100 pb-4"
      >
        <label className="flex-1">
          <span className="eyebrow">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or email"
            className="input-field mt-1"
          />
        </label>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {error ? <p className="mt-4 border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm">{error}</p> : null}
      {loading ? <p className="mt-4 font-sans text-sm uppercase tracking-[0.1em] text-ink-400">Loading…</p> : null}

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-200">
            <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Name</th>
            <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Email</th>
            <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Role</th>
            <th className="py-3 font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Joined</th>
            <th className="py-3 text-right font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id} className="border-b border-ink-100 align-top">
              <td className="py-3 pr-4 font-serif">{u.name}</td>
              <td className="py-3 pr-4 font-sans text-sm text-ink-500">{u.email}</td>
              <td className="py-3 pr-4">
                <select
                  value={u.role}
                  onChange={(e) => void changeRole(u.id, e.target.value as Role)}
                  className="border border-ink-200 bg-white px-2 py-1 font-sans text-xs"
                >
                  <option value="author">author</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="py-3 pr-4 font-sans text-sm text-ink-500">{formatDate(u.createdAt)}</td>
              <td className="py-3 text-right">
                <button
                  type="button"
                  onClick={() => void remove(u)}
                  className="border border-ink-200 px-2 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500 hover:border-brand-500 hover:text-brand-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
