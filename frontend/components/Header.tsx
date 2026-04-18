'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES } from '@/lib/types';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [now, setNow] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white">
      {/* Utility bar */}
      <div className="border-b border-ink-100 bg-ink text-white">
        <div className="container-news flex h-9 items-center justify-between text-[11px] font-sans uppercase tracking-[0.08em]">
          <div className="hidden items-center gap-4 md:flex">
            <span className="flex items-center gap-2">
              <span className="live-dot bg-brand-500" aria-hidden />
              <span>Live</span>
            </span>
            <span className="text-white/60">{now}</span>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            {loading ? null : user ? (
              <>
                {user.role === 'admin' ? (
                  <Link href="/admin" className="text-brand-300 hover:text-brand-100">
                    Admin
                  </Link>
                ) : null}
                <Link href="/dashboard" className="hover:text-brand-300">
                  Dashboard
                </Link>
                <Link href="/write" className="hover:text-brand-300">
                  Write
                </Link>
                <button onClick={() => void logout()} className="hover:text-brand-300">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-brand-300">
                  Sign in
                </Link>
                <Link href="/register" className="hover:text-brand-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="container-news flex items-center justify-between gap-6 py-6">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center border border-ink text-ink lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </button>

        <Link href="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center bg-brand-500 font-serif text-2xl font-black text-white"
          >
            D
          </span>
          <span className="font-serif text-3xl font-black tracking-tight text-ink">
            {process.env.NEXT_PUBLIC_SITE_NAME || 'Dispatch'}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <form onSubmit={handleSearch} className="flex items-center border border-ink-200 focus-within:border-ink">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories"
              className="h-10 w-56 bg-transparent px-3 font-sans text-sm text-ink placeholder-ink-300 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center bg-ink text-white hover:bg-brand-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <Link href="/write" className="btn-primary">
            Write a story
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center border border-ink text-ink lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {searchOpen && (
        <div className="border-t border-ink-100 lg:hidden">
          <form onSubmit={handleSearch} className="container-news flex items-center gap-2 py-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories"
              className="flex-1 border-b border-ink-200 bg-transparent py-2 font-sans text-sm focus:border-ink focus:outline-none"
              autoFocus
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Primary nav */}
      <nav className="border-t border-ink-100">
        <div className="container-news">
          <ul className="hidden items-center gap-1 overflow-x-auto lg:flex">
            {CATEGORIES.map((c) => {
              const href = `/category/${c.toLowerCase()}`;
              const active = pathname === href;
              return (
                <li key={c}>
                  <Link
                    href={href}
                    className={`inline-block whitespace-nowrap px-4 py-3 font-sans text-[13px] font-bold uppercase tracking-[0.08em] transition-colors ${
                      active ? 'text-brand-600' : 'text-ink hover:text-brand-500'
                    }`}
                  >
                    {c}
                  </Link>
                </li>
              );
            })}
          </ul>

          {menuOpen && (
            <ul className="flex flex-col lg:hidden">
              {CATEGORIES.map((c) => (
                <li key={c} className="border-t border-ink-100 first:border-t-0">
                  <Link
                    href={`/category/${c.toLowerCase()}`}
                    className="block px-4 py-3 font-sans text-sm font-bold uppercase tracking-[0.08em] text-ink"
                  >
                    {c}
                  </Link>
                </li>
              ))}
              <li className="border-t border-ink-100">
                <Link
                  href="/write"
                  className="block px-4 py-3 font-sans text-sm font-bold uppercase tracking-[0.08em] text-brand-600"
                >
                  Write a story
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}
