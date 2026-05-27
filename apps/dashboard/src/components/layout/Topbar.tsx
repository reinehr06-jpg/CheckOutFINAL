'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  ChevronDown, 
  Sun,
  Moon,
  LogOut,
  LayoutGrid,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanySwitcher } from './CompanySwitcher';
import { useAuth } from '@/lib/auth-context';

interface TopbarProps {
  title?: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  const { user, isMaster, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('basileia-theme') || localStorage.getItem('basileia_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem('basileia-theme') || localStorage.getItem('basileia_theme');
      if (saved === 'dark') {
        setDark(true);
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (saved === 'light') {
        setDark(false);
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        const matches = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(matches);
        if (matches) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    };
    
    // Check theme on mount
    handleThemeChange();
    
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('basileia-theme', next ? 'dark' : 'light');
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'owner': return 'Owner';
      case 'admin': return 'Admin';
      case 'finance': return 'Financeiro';
      case 'developer': return 'Dev';
      case 'support': return 'Suporte';
      default: return role;
    }
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="h-[46px] 2xl:h-[54px] px-4 2xl:px-6 flex items-center justify-between sticky top-0 z-20 w-full transition-all duration-300 bg-white/40 backdrop-blur-md border-b border-white/20">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-[480px] group mr-6">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/40 group-focus-within:text-brand transition-colors">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar transacao, cliente, pedido ou evento"
          aria-label="Buscar"
          className="w-full bg-white/60 border border-border/50 rounded-xl pl-10 pr-10 py-1.5 2xl:py-2 text-[12px] 2xl:text-[13px] font-medium text-ink placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all shadow-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1 py-0.5 bg-background border border-border rounded text-[9px] font-black text-slate/30 uppercase tracking-tighter">
          K
        </div>
      </div>

      {/* Company Switcher (Super Admin) */}
      <CompanySwitcher />

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 2xl:gap-3">
        {/* Notifications */}
        <button onClick={() => router.push('/dashboard/trust')} className="relative p-1.5 2xl:p-2 text-slate/40 hover:text-brand hover:bg-brand-soft rounded-lg transition-all cursor-pointer" aria-label="Notificações">
          <Bell className="w-4.5 h-4.5" />
        </button>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-1.5 2xl:p-2 text-slate/40 hover:text-brand hover:bg-brand-soft rounded-lg transition-all cursor-pointer" aria-label="Alternar tema">
          {dark ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
        </button>

        <div className="h-6 w-px bg-border/40 mx-0.5 2xl:mx-1.5" />

        {/* User Profile */}
        <div className="relative">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-1 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[11.5px] 2xl:text-[12px] font-black text-ink leading-tight group-hover:text-brand transition-colors">{user?.name || 'Usuario'}</p>
              <p className="text-[9px] 2xl:text-[9.5px] font-bold text-slate/40 uppercase tracking-tight">{roleLabel(user?.role || '')}</p>
            </div>
            <div className="w-7.5 h-7.5 2xl:w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-brand/20 to-brand-accent/20 p-0.5 border border-brand/10 group-hover:scale-105 transition-transform overflow-hidden shadow-md">
              <div className="w-full h-full bg-brand/20 text-brand font-black text-[10px] flex items-center justify-center rounded-[7px]">{initials}</div>
            </div>
          </div>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-border shadow-xl z-50 py-2">
                {user && (
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-sm font-black text-ink">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate/50 truncate">{user.email}</p>
                    <p className="text-[9px] font-bold text-brand mt-0.5">{roleLabel(user.role)}</p>
                  </div>
                )}
                <button onClick={() => { setShowUserMenu(false); router.push('/dashboard/settings'); }} className="w-full px-3 py-2 text-left text-[12px] font-bold text-ink hover:bg-brand-soft flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Minha conta
                </button>
                <button onClick={() => { setShowUserMenu(false); router.push('/dashboard/settings'); }} className="w-full px-3 py-2 text-left text-[12px] font-bold text-ink hover:bg-brand-soft flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5" /> Configuracoes
                </button>
                {isMaster && (
                  <a href="/dashboard/super-admin" className="w-full px-3 py-2 text-left text-[12px] font-bold text-brand hover:bg-brand-soft flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Super Admin
                  </a>
                )}
                <div className="border-t border-border/50 mt-1 pt-1">
                  <button onClick={logout} className="w-full px-3 py-2 text-left text-[12px] font-bold text-danger hover:bg-danger/5 flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" /> Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
