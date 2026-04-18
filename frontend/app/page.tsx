import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import SectionHeader from '@/components/SectionHeader';
import Ticker from '@/components/Ticker';
import TrendingStrip from '@/components/TrendingStrip';
import { api } from '@/lib/api';
import type { Blog, FeaturedResponse } from '@/lib/types';

export const revalidate = 30;

async function getHome(): Promise<{
  featured: FeaturedResponse | null;
  trending: Blog[];
}> {
  const [featured, trending] = await Promise.all([
    api.getFeatured().catch(() => null),
    api.getTrending().then((d) => d.items).catch<Blog[]>(() => []),
  ]);
  return { featured, trending };
}

export default async function HomePage() {
  const { featured, trending } = await getHome();

  if (!featured || (!featured.hero && featured.topStories.length === 0)) {
    return <EmptyState />;
  }

  const { hero, topStories, byCategory } = featured;
  const tickerItems = [hero, ...topStories].filter(Boolean).slice(0, 6) as NonNullable<typeof hero>[];

  return (
    <>
      {tickerItems.length ? <Ticker items={tickerItems} /> : null}

      <section className="container-news py-8">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hero ? <BlogCard blog={hero} variant="hero" /> : null}
          </div>

          <aside className="space-y-6 border-t border-ink-100 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
              Top stories
            </h2>
            <ul className="space-y-5 divide-y divide-ink-100">
              {topStories.slice(0, 5).map((b, i) => (
                <li key={b._id} className={i === 0 ? '' : 'pt-5'}>
                  <BlogCard blog={b} variant="list" />
                </li>
              ))}
              {topStories.length === 0 ? (
                <li className="font-serif text-sm text-ink-400">No additional stories yet.</li>
              ) : null}
            </ul>
          </aside>
        </div>
      </section>

      {trending.length ? <TrendingStrip items={trending} /> : null}

      {topStories.length > 3 ? (
        <section className="container-news rule-top py-10">
          <SectionHeader title="More to read" href="/category/world" kicker="Latest" />
          <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {topStories.slice(0, 6).map((b) => (
              <BlogCard key={b._id} blog={b} variant="default" />
            ))}
          </div>
        </section>
      ) : null}

      {byCategory.map((group) =>
        group.items.length ? (
          <section key={group.category} className="container-news rule-top py-10">
            <SectionHeader
              title={group.category}
              href={`/category/${group.category.toLowerCase()}`}
            />
            <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {group.items.slice(0, 4).map((b) => (
                <BlogCard key={b._id} blog={b} variant="compact" />
              ))}
            </div>
          </section>
        ) : null
      )}

      <section className="mt-12 border-t border-ink-100 bg-ink-50">
        <div className="container-news flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-3xl font-bold leading-tight text-ink">
              Have a story to tell?
            </h3>
            <p className="mt-2 max-w-xl font-serif text-ink-500">
              Register to start publishing your reporting, analysis, or commentary on our
              independent platform. All contributors get a full-featured editor.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/register" className="btn-primary">
              Register
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <section className="container-news py-24 text-center">
      <span className="kicker">Fresh install</span>
      <h1 className="mt-4 font-serif text-5xl font-black tracking-tight text-ink">
        Nothing published yet.
      </h1>
      <p className="mt-4 font-serif text-lg text-ink-500">
        The API is reachable but the database is empty. Register an account and publish your first
        story to see the homepage come to life.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/register" className="btn-primary">Create an account</Link>
        <Link href="/login" className="btn-secondary">Sign in</Link>
      </div>
    </section>
  );
}
