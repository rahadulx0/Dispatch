import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/lib/types';

export const revalidate = 3600;

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'yearly', priority: 0.1 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.toLowerCase()}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: 0.7,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { items } = await api.allSlugs();
    blogPages = items.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch {
    // If backend unreachable at build time, skip — sitemap revalidates hourly.
  }

  return [...staticPages, ...categoryPages, ...blogPages];
}
