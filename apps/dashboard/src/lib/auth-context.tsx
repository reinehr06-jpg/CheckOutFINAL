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

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

      if (!res.ok) {
        throw new Error('Invalid token');
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        return data.data.user;
      }
      throw new Error('Invalid response');
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem('basileia_token');
      localStorage.removeItem('basileia_user');
      return null;
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('basileia_token');
    const storedUser = localStorage.getItem('basileia_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      fetchUser(storedToken).then(fetchedUser => {
        if (!fetchedUser) {
          router.push('/login');
        }
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser, router]);

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
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('basileia_token');
    localStorage.removeItem('basileia_user');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
