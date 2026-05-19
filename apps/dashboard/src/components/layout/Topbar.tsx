'use client';

import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  ChevronDown, 
  Sun,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title?: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  return (
    <header className="h-[46px] 2xl:h-[54px] px-4 2xl:px-6 flex items-center justify-between sticky top-0 z-20 w-full transition-all duration-300 bg-white/40 backdrop-blur-md border-b border-white/20">
      {/* Search Bar - Professional & Expansive */}
      <div className="relative flex-1 max-w-[480px] group mr-6">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/40 group-focus-within:text-brand transition-colors">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar transação, cliente, pedido ou evento"
          className="w-full bg-white/60 border border-border/50 rounded-xl pl-10 pr-10 py-1.5 2xl:py-2 text-[12px] 2xl:text-[13px] font-medium text-ink placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/40 transition-all shadow-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1 py-0.5 bg-background border border-border rounded text-[9px] font-black text-slate/30 uppercase tracking-tighter">
          ⌘ K
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 2xl:gap-3">
        {/* Notifications */}
        <div className="relative p-1.5 2xl:p-2 text-slate/40 hover:text-brand hover:bg-brand-soft rounded-lg transition-all cursor-pointer">
          <Bell className="w-4.5 h-4.5" />
          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-brand text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white">
            12
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-1.5 2xl:p-2 text-slate/40 hover:text-brand hover:bg-brand-soft rounded-lg transition-all cursor-pointer">
          <Sun className="w-4.5 h-4.5" />
        </div>

        {/* Scope Selector */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-border rounded-lg cursor-pointer hover:bg-brand-soft transition-all shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(22,163,74,0.4)]" />
          <span className="text-[11px] 2xl:text-[11.5px] font-bold text-ink">Todos os sistemas</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate/30" />
        </div>

        <div className="h-6 w-px bg-border/40 mx-0.5 2xl:mx-1.5" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[11.5px] 2xl:text-[12px] font-black text-ink leading-tight group-hover:text-brand transition-colors">Vinícius</p>
            <p className="text-[9px] 2xl:text-[9.5px] font-bold text-slate/40 uppercase tracking-tight">Admin</p>
          </div>
          <div className="w-7.5 h-7.5 2xl:w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-brand/20 to-brand-accent/20 p-0.5 border border-brand/10 group-hover:scale-105 transition-transform overflow-hidden shadow-md">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vinicius" 
              alt="User profile" 
              className="w-full h-full object-cover rounded-[7px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
