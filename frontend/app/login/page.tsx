'use client';

import { FormEvent, Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-news py-16">
      <div className="mx-auto max-w-md">
        <span className="kicker">Account</span>
        <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">Sign in</h1>
        <p className="mt-3 font-serif text-base text-ink-500">
          Continue to your contributor dashboard to publish and manage your stories.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field mt-1"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm text-ink">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 border-t border-ink-100 pt-6 font-sans text-sm text-ink-500">
          Don’t have an account?{' '}
          <Link href="/register" className="link-underline font-semibold text-ink">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
