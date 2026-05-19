'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Monitor,
  ShoppingCart, 
  CreditCard, 
  Repeat, 
  Activity,
  Zap,
  ChevronRight,
  Globe,
  ChevronLeft,
  Terminal,
  Settings2,
  ChevronDown,
  GitBranch
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Visão Geral', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Sistemas', icon: Monitor, href: '/dashboard/systems' },
  { name: 'Checkouts', icon: CreditCard, href: '/dashboard/checkouts' },
  { name: 'Gateways', icon: Globe, href: '/dashboard/gateways' },
  { name: 'Vendas', icon: ShoppingCart, href: '/dashboard/orders' },
  { name: 'Pagamentos', icon: Activity, href: '/dashboard/payments' },
  { name: 'Assinaturas', icon: Repeat, href: '/dashboard/subscriptions' },
  { name: 'Webhooks', icon: Zap, href: '/dashboard/webhooks' },
  { name: 'Roteamento', icon: GitBranch, href: '/dashboard/routing' },
  { name: 'Auditoria', icon: Terminal, href: '/dashboard/audit' },
  { name: 'Configurações', icon: Settings2, href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[228px] 2xl:w-[260px] h-screen p-2 2xl:p-3 flex flex-col z-20 shrink-0 transition-all duration-300">
      <div className="flex-1 bg-white/70 backdrop-blur-xl border border-border rounded-[24px] flex flex-col overflow-hidden shadow-2xl shadow-brand/5">
        {/* Brand */}
        <div className="p-5 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <span className="text-ink font-black text-[17px] tracking-tight">Basileia Pay</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 no-scrollbar space-y-5">
          <div className="space-y-1">
            <p className="px-3 text-[9px] font-black text-slate uppercase tracking-widest mb-2 opacity-30">
              HUB OPERACIONAL
            </p>
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 2xl:py-2.5 rounded-xl transition-all duration-300 relative h-[40px] 2xl:h-[44px]",
                      isActive 
                        ? "bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/20" 
                        : "text-slate hover:bg-brand-soft hover:text-brand"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-slate/40 group-hover:text-brand"
                    )} />
                    <span className={cn(
                      "font-bold text-[12.5px]",
                      isActive ? "text-white" : "text-slate"
                    )}>
                      {item.name}
                    </span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bloco Empresa (acima do avatar, apenas para rota settings) */}
        {pathname.startsWith('/dashboard/settings') && (
          <div className="mx-2.5 mb-2.5 p-3 rounded-[16px] border border-[#E8DDFD] bg-white/80 text-left shadow-sm">
            <div className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                🛡 Basileia Corp
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-green-700 bg-green-50 px-1.5 py-0.2 rounded uppercase tracking-wider">
                Produção
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1">ID: 5312</p>
          </div>
        )}

        {/* Bottom Toggle / Usuário Block */}
        <div className="p-3 border-t border-border/50">
          {pathname.startsWith('/dashboard/settings') ? (
            <div className="flex items-center justify-between w-full cursor-pointer px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-accent text-white flex items-center justify-center font-black text-xs shadow-md">
                  GS
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-black text-slate-900 leading-tight truncate">Gabriel Silva</p>
                  <p className="text-[10px] font-semibold text-slate-400 leading-none truncate">admin@basileia.com</p>
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </div>
          ) : (
            <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-slate/30 hover:text-brand hover:bg-brand-soft transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
