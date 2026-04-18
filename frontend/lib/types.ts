export type Role = 'author' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  bio?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Author {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  email?: string;
  role?: Role;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  author: Author;
  views: number;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBlogs {
  items: Blog[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface FeaturedResponse {
  hero: Blog | null;
  topStories: Blog[];
  byCategory: Array<{ category: string; items: Blog[] }>;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AdminStats {
  users: number;
  authors: number;
  admins: number;
  blogs: number;
  published: number;
  drafts: number;
  views: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  bio?: string;
  avatar?: string;
  createdAt?: string;
}

export interface PaginatedAdminUsers {
  items: AdminUser[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const CATEGORIES = [
  'AI',
  'Programming',
  'Startups',
  'Security',
  'Software',
  'Gadgets',
  'Mobile',
  'Tutorials',
  'Reviews',
] as const;

export type Category = (typeof CATEGORIES)[number];
