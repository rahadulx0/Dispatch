'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/lib/types';

interface Props {
  roles: Role[];
  children: React.ReactNode;
}

export default function RequireRole({ roles, children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace('/');
    }
  }, [user, loading, roles, router]);

  if (loading || !user || !roles.includes(user.role)) {
    return (
      <div className="container-news py-24 text-center font-sans text-sm uppercase tracking-[0.1em] text-ink-400">
        Checking access…
      </div>
    );
  }
  return <>{children}</>;
}
