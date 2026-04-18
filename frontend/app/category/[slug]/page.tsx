import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/lib/types';

export const revalidate = 60;

interface Params {
  params: { slug: string };
}

function resolveCategory(slug: string): string | null {
  const lower = slug.toLowerCase();
  const match = CATEGORIES.find((c) => c.toLowerCase() === lower);
  return match || null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = resolveCategory(params.slug);
  if (!category) return { title: 'Not found' };
  return { title: category };
}

export default async function CategoryPage({ params }: Params) {
  const category = resolveCategory(params.slug);
  if (!category) notFound();

  const data = await api.listBlogs({ category, limit: 30 }).catch(() => null);
  const items = data?.items || [];

  const [lead, ...rest] = items;

  return (
    <section className="container-news py-10">
      <header className="border-b-2 border-ink pb-4">
        <span className="kicker">Section</span>
        <h1 className="mt-2 font-serif text-6xl font-black tracking-tight text-ink">{category}</h1>
      </header>

      {items.length === 0 ? (
        <p className="mt-10 font-serif text-lg text-ink-400">
          No stories in {category} yet. Be the first to contribute.
        </p>
      ) : (
        <>
          {lead ? (
            <div className="mt-10 border-b border-ink-100 pb-10">
              <BlogCard blog={lead} variant="hero" />
            </div>
          ) : null}

          {rest.length ? (
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((b) => (
                <BlogCard key={b._id} blog={b} variant="default" />
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
