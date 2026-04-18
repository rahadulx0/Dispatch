import Link from 'next/link';
import { CATEGORIES } from '@/lib/types';

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Dispatch';
  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink text-white">
      <div className="container-news py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center bg-brand-500 font-serif text-2xl font-black text-white"
              >
                D
              </span>
              <span className="font-serif text-2xl font-black tracking-tight">{siteName}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-white/70">
              Independent journalism, commentary, and analysis from writers across the globe.
              Register to publish your own reporting.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-white/60">
              Sections
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c}>
                  <Link href={`/category/${c.toLowerCase()}`} className="text-white/85 hover:text-brand-300">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[12px] font-bold uppercase tracking-[0.1em] text-white/60">
              Account
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/login" className="text-white/85 hover:text-brand-300">Sign in</Link></li>
              <li><Link href="/register" className="text-white/85 hover:text-brand-300">Register</Link></li>
              <li><Link href="/write" className="text-white/85 hover:text-brand-300">Write a story</Link></li>
              <li><Link href="/dashboard" className="text-white/85 hover:text-brand-300">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p className="font-sans uppercase tracking-[0.08em]">Built with Next.js · Node.js · MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
