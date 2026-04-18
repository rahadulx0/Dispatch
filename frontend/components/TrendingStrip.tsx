import Link from 'next/link';
import type { Blog } from '@/lib/types';
import { formatTimeAgo } from '@/lib/api';

interface Props {
  items: Blog[];
}

export default function TrendingStrip({ items }: Props) {
  if (!items.length) return null;
  return (
    <section className="bg-ink-50">
      <div className="container-news py-8">
        <div className="flex items-end justify-between border-b-2 border-ink pb-2">
          <div>
            <span className="kicker">Trending</span>
            <h2 className="font-serif text-2xl font-black tracking-tight text-ink">Most read this week</h2>
          </div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-ink-400">
            By views · last 7 days
          </span>
        </div>
        <ol className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((b, i) => (
            <li key={b._id} className="flex gap-4 border-t border-ink-100 pt-4">
              <span className="font-serif text-4xl font-black tracking-tight text-brand-500">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <span className="kicker">{b.category}</span>
                <Link href={`/blog/${b.slug}`} className="mt-1 block">
                  <h3 className="headline text-[17px] leading-snug hover:text-brand-600">{b.title}</h3>
                </Link>
                <p className="mt-1 byline">
                  {formatTimeAgo(b.publishedAt || b.createdAt)} · {b.views.toLocaleString()} views
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
