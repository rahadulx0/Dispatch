import Link from 'next/link';

interface Props {
  title: string;
  href?: string;
  kicker?: string;
}

export default function SectionHeader({ title, href, kicker }: Props) {
  return (
    <div className="flex items-end justify-between border-b-2 border-ink pb-2">
      <div>
        {kicker ? <span className="kicker">{kicker}</span> : null}
        <h2 className="font-serif text-2xl font-black tracking-tight text-ink">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500 hover:text-brand-500"
        >
          See all →
        </Link>
      ) : null}
    </div>
  );
}
