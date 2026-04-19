'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, getAccessToken, setAccessToken, setStoredRefreshToken } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      if (!getAccessToken()) {
        await api.refresh();
      }
      if (getAccessToken()) {
        const { user: u } = await api.me();
        setUser(u);
      } else {
        setUser(null);
      }
    } catch {
      setAccessToken(null);
      setStoredRefreshToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, accessToken, refreshToken } = await api.login({ email, password });
    setAccessToken(accessToken);
    if (refreshToken) setStoredRefreshToken(refreshToken);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { user: u, accessToken, refreshToken } = await api.register({ name, email, password });
    setAccessToken(accessToken);
    if (refreshToken) setStoredRefreshToken(refreshToken);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setAccessToken(null);
    setStoredRefreshToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    await bootstrap();
  }, [bootstrap]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
