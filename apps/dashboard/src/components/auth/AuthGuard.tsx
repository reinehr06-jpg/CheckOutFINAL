'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const token = user || localStorage.getItem('basileia_token');

    const isAuthRoute =
      pathname.startsWith('/login') ||
      pathname.startsWith('/2fa') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/reset-password');

    const isPublicRoute =
      pathname.startsWith('/session-expired') ||
      pathname.startsWith('/restricted');

    if (!token && !isAuthRoute && !isPublicRoute) {
      router.push('/login');
      return;
    }

    if (token && isAuthRoute) {
      router.push('/dashboard');
      return;
    }
  }, [pathname, router, user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0FF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
