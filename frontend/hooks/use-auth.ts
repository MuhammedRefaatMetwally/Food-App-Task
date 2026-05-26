'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { api } from '@/lib/api';
import { getQueryClient } from '@/lib/query-client';
import { AuthResponse, User } from '@/types';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const locale = useLocale();
  const qc = getQueryClient();

  const getUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  };

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const isLoggedIn = () => !!getToken();
  const isAdmin = () => getUser()?.role === 'ADMIN';

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', data.access_token);
    const profile = await api.get<User>('/auth/profile');
    localStorage.setItem('user', JSON.stringify(profile.data));
    qc.invalidateQueries();
    router.push(`/${locale}`);
    toast.success('Welcome back!');
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    localStorage.setItem('token', data.access_token);
    const profile = await api.get<User>('/auth/profile');
    localStorage.setItem('user', JSON.stringify(profile.data));
    qc.invalidateQueries();
    router.push(`/${locale}`);
    toast.success('Account created!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    qc.clear();
    router.push(`/${locale}/auth/login`);
  };

  return { login, register, logout, getUser, isLoggedIn, isAdmin };
}