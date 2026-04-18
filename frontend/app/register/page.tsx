'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      router.replace('/dashboard');
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
        <h1 className="mt-2 font-serif text-5xl font-black tracking-tight text-ink">
          Become a contributor
        </h1>
        <p className="mt-3 font-serif text-base text-ink-500">
          Register to publish stories, manage drafts, and build your portfolio.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <label className="block">
            <span className="eyebrow">Full name</span>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field mt-1"
              placeholder="Jane Doe"
            />
          </label>

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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field mt-1"
              placeholder="At least 8 characters"
            />
          </label>

          <label className="block">
            <span className="eyebrow">Confirm password</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field mt-1"
              placeholder="Repeat your password"
            />
          </label>

          {error ? (
            <p className="border-l-2 border-brand-500 bg-brand-50 px-3 py-2 font-sans text-sm text-ink">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-8 border-t border-ink-100 pt-6 font-sans text-sm text-ink-500">
          Already have an account?{' '}
          <Link href="/login" className="link-underline font-semibold text-ink">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
