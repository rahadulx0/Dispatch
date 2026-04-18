import Link from 'next/link';
import type { Blog } from '@/lib/types';

interface Props {
  items: Blog[];
}

export default function Ticker({ items }: Props) {
  if (!items.length) return null;
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-ink-100 bg-white">
      <div className="container-news flex items-center gap-4 py-2">
        <span className="flex flex-shrink-0 items-center gap-2 bg-brand-500 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-white">
          <span className="live-dot bg-white" aria-hidden />
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="ticker-track flex gap-10 whitespace-nowrap">
            {list.map((b, idx) => (
              <Link
                key={`${b._id}-${idx}`}
                href={`/blog/${b.slug}`}
                className="font-sans text-sm text-ink hover:text-brand-500"
              >
                <span className="font-semibold uppercase tracking-[0.05em] text-brand-600">{b.category}</span>
                <span className="mx-2 text-ink-300">|</span>
                <span>{b.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
