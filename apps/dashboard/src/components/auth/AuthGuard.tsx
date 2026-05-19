'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('basileia_token');
    
    // Se nao tem token e nao esta na pagina de login, redireciona
    if (!token && !pathname.startsWith('/login') && !pathname.startsWith('/forgot-password') && !pathname.startsWith('/reset-password')) {
      router.push('/login');
      return;
    }

    // Se tem token e esta na pagina de login, redireciona pro dashboard
    if (token && pathname.startsWith('/login')) {
      router.push('/dashboard');
      return;
    }
  }, [pathname, router]);

  return <>{children}</>;
}
