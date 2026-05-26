'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from './use-auth';

export function useRequireAuth(adminOnly = false) {
  const { isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(`/${locale}/auth/login`);
      return;
    }
    if (adminOnly && !isAdmin()) {
      router.replace(`/${locale}`);
    }
  }, []);
}