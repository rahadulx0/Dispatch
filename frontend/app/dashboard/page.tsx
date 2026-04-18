'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { api, formatDate } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Blog } from '@/lib/types';

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { items: list } = await api.myBlogs();
      setItems(list);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(id: string) {
    if (!confirm('Delete this story permanently?')) return;
    try {
      await api.deleteBlog(id);
      setItems((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  const drafts = items.filter((b) => b.status === 'draft');
  const published = items.filter((b) => b.status === 'published');

  return (
    <section className="container-news py-10">
      <div className="flex flex-col gap-4 border-b-2 border-ink pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="kicker">Dashboard</span>
          <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">
            Welcome, {user?.name.split(' ')[0]}.
          </h1>
          <p className="mt-2 font-serif text-ink-500">
            {items.length} {items.length === 1 ? 'story' : 'stories'} · {published.length} published · {drafts.length} draft{drafts.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link href="/write" className="btn-primary">
          Write a new story
        </Link>
      </div>

      {error ? (
        <p className="mt-6 border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-10">
        <List title="Published" empty="No published stories yet." items={published} onDelete={onDelete} loading={loading} />
        <List title="Drafts" empty="No drafts." items={drafts} onDelete={onDelete} loading={loading} />
      </div>
    </section>
  );
}

function List({
  title,
  empty,
  items,
  onDelete,
  loading,
}: {
  title: string;
  empty: string;
  items: Blog[];
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div>
      <h2 className="border-b-2 border-ink pb-2 font-serif text-2xl font-black tracking-tight">
        {title} <span className="font-sans text-sm font-bold text-ink-400">({items.length})</span>
      </h2>
      {loading ? (
        <p className="mt-4 font-sans text-sm uppercase tracking-[0.1em] text-ink-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 font-serif text-ink-400">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-ink-100">
          {items.map((b) => (
            <li key={b._id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <span className="kicker">{b.category}</span>
                <h3 className="mt-1 font-serif text-xl font-bold">
                  {b.status === 'published' ? (
                    <Link href={`/blog/${b.slug}`} className="hover:text-brand-500">
                      {b.title}
                    </Link>
                  ) : (
                    b.title
                  )}
                </h3>
                <p className="mt-1 byline">
                  {formatDate(b.updatedAt)} · {b.readingTime} min read · {b.views} views
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/edit/${b._id}`}
                  className="border border-ink px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] hover:border-brand-500 hover:text-brand-500"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(b._id)}
                  className="border border-ink-200 px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 hover:border-brand-500 hover:text-brand-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
