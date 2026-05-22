'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  two_factor_enabled?: boolean;
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
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isMaster: boolean;
  availableCompanies: Company[];
  switchCompany: (companyId: number) => void;
  activeCompanyId: number | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setClientCookie(name: string, value: string, days: number = 1) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

function removeClientCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Invalid token');

      const data = await res.json();
      const userData = data.success ? data.data.user : data;

      setUser(userData);
      return userData;
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem('basileia_token');
      localStorage.removeItem('basileia_user');
      removeClientCookie('basileia_session');
      return null;
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('basileia_token');

    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken).then((fetchedUser) => {
        if (fetchedUser) {
          setClientCookie('basileia_session', storedToken);
        }
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error?.message || 'Credenciais invalidas');
    }

    const newToken = data.data.token;
    const newUser = data.data.user;

    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('basileia_token', newToken);
    localStorage.setItem('basileia_user', JSON.stringify(newUser));
    setClientCookie('basileia_session', newToken);

    if (newUser.role === 'super_admin') {
      try {
        const companiesRes = await fetch(`${API_URL}/api/v1/auth/master/companies`, {
          headers: { 'Authorization': `Bearer ${newToken}` },
        });
        const companiesData = await companiesRes.json();
        if (companiesData.success) {
          setAvailableCompanies(companiesData.data);
        }
      } catch {}
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('basileia_token');
    localStorage.removeItem('basileia_user');
    removeClientCookie('basileia_session');
    setAvailableCompanies([]);
    setActiveCompanyId(null);
    router.push('/login');
  }, [router]);

  const isMaster = user?.role === 'super_admin';

  const switchCompany = useCallback((companyId: number) => {
    setActiveCompanyId(companyId);
    localStorage.setItem('basileia_active_company', String(companyId));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, login, logout, isLoading,
      isMaster, availableCompanies, switchCompany, activeCompanyId,
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
