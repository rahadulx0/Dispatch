import Link from 'next/link';
import type { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { api } from '@/lib/api';
import type { PaginatedBlogs } from '@/lib/types';

export const revalidate = 30;

interface Params {
  searchParams: { q?: string; page?: string };
}

export function generateMetadata({ searchParams }: Params): Metadata {
  const q = searchParams.q?.trim();
  return {
    title: q ? `Search: ${q}` : 'Search',
    robots: { index: false },
  };
}

export default async function SearchPage({ searchParams }: Params) {
  const q = (searchParams.q || '').trim();
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);

  let data: PaginatedBlogs | null = null;
  let error: string | null = null;
  if (q) {
    try {
      data = await api.listBlogs({ q, page, limit: 12 });
    } catch (err) {
      error = (err as Error).message;
    }
  }

  return (
    <section className="container-news py-10">
      <header className="border-b-2 border-ink pb-4">
        <span className="kicker">Search</span>
        <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">
          {q ? `Results for “${q}”` : 'Search stories'}
        </h1>
        {data ? (
          <p className="mt-2 font-sans text-sm text-ink-400">
            {data.total} result{data.total === 1 ? '' : 's'}
          </p>
        ) : null}
      </header>

      <form action="/search" method="get" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search stories"
          className="input-field"
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {error ? (
        <p className="mt-8 border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm">{error}</p>
      ) : null}

      {!q ? (
        <p className="mt-12 font-serif text-lg text-ink-400">
          Enter a search term above to find stories by title or content.
        </p>
      ) : data && data.items.length === 0 ? (
        <p className="mt-12 font-serif text-lg text-ink-400">
          No stories matched your search. Try different keywords.
        </p>
      ) : data ? (
        <>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((b) => (
              <BlogCard key={b._id} blog={b} variant="default" />
            ))}
          </div>

          {data.pages > 1 ? (
            <nav className="mt-12 flex items-center justify-center gap-2 border-t border-ink-100 pt-6">
              {page > 1 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className="border border-ink px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] hover:border-brand-500 hover:text-brand-500"
                >
                  ← Previous
                </Link>
              ) : null}
              <span className="font-sans text-sm text-ink-500">
                Page {page} of {data.pages}
              </span>
              {page < data.pages ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className="border border-ink px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] hover:border-brand-500 hover:text-brand-500"
                >
                  Next →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
