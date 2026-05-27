'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchWithTimeout, getCsrfToken } from '@/lib/api';

type User = {
  id: string;
  uuid?: string;
  name: string;
  email: string;
  role: string;
  two_factor_enabled?: boolean;
  needs_2fa_setup?: boolean;
  company_id?: number | null;
  is_master?: boolean;
};

type Company = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  status: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ needs_2fa_setup?: boolean }>;
  logout: () => void;
  isLoading: boolean;
  isMaster: boolean;
  isAuthenticated: boolean;
  availableCompanies: Company[];
  switchCompany: (companyId: number) => void;
  activeCompanyId: number | null;
  checkSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = useCallback(async () => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/user`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      const userData = data.success ? data.data : data;

      setUser(userData);

      // Load active company from cookie
      const match = document.cookie.match(/(?:^|;\s*)basileia_active_company=(\d+)/);
      if (match) setActiveCompanyId(Number(match[1]));

      // Fetch companies list for super_admin users to populate switcher on refresh
      if (userData.role === 'super_admin') {
        try {
          const companiesRes = await fetchWithTimeout(`${API_URL}/api/v1/auth/master/companies`, {
            headers: { 'Accept': 'application/json' },
            credentials: 'include',
          });
          const companiesData = await companiesRes.json();
          if (companiesData.success) {
            setAvailableCompanies(companiesData.data);
          }
        } catch (err) {
          console.error('Failed to load companies in checkSession:', err);
        }
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkSession().finally(() => setIsLoading(false));
  }, [checkSession]);

  const login = useCallback(async (email: string, password: string) => {
    // Initialize CSRF token
    await fetchWithTimeout(`${API_URL}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    });

    const csrfToken = getCsrfToken();
    const res = await fetchWithTimeout(`${API_URL}/api/v2/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || data.error?.message || 'Credenciais inválidas');
    }

    const userData = data.data?.user || data.user || data.data;
    setUser(userData);

    if (userData.role === 'super_admin') {
      try {
        const companiesRes = await fetchWithTimeout(`${API_URL}/api/v1/auth/master/companies`, {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        const companiesData = await companiesRes.json();
        if (companiesData.success) {
          setAvailableCompanies(companiesData.data);
        }
      } catch (err) {
        console.error('Failed to load companies:', err);
      }
    }

    return { needs_2fa_setup: userData.needs_2fa_setup ?? data.needs_2fa_setup ?? false };
  }, []);

  const logout = useCallback(async () => {
    try {
      const csrfToken = getCsrfToken();
      await fetchWithTimeout(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
        },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    setUser(null);
    setAvailableCompanies([]);
    setActiveCompanyId(null);
    router.push('/login');
  }, [router]);

  const isMaster = user?.role === 'super_admin';
  const isAuthenticated = !!user;

  const switchCompany = useCallback((companyId: number) => {
    setActiveCompanyId(companyId);
    document.cookie = `basileia_active_company=${companyId}; path=/; SameSite=Lax; Secure; Max-Age=86400`;
  }, []);

  return (
    <AuthContext.Provider value={{
      user, login, logout, isLoading,
      isMaster, isAuthenticated, availableCompanies, switchCompany, activeCompanyId,
      checkSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
