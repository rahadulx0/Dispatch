'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(pathname || '/');
      router.replace(`/login?next=${next}`);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <div className="container-news py-24 text-center font-sans text-sm uppercase tracking-[0.1em] text-ink-400">
        Checking session…
      </div>
    );
  }
  return <>{children}</>;
}
