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
  Terminal
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
  { name: 'Auditoria', icon: Terminal, href: '/dashboard/audit' },
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

        {/* RESUMO da Auditoria (visível apenas na rota /dashboard/audit) */}
        {pathname.startsWith('/dashboard/audit') && (
          <div className="p-4 bg-brand-soft/20 border-t border-border/50 space-y-3 mx-2 rounded-2xl mb-2 text-left animate-in fade-in duration-200">
            <p className="px-1 text-[9px] font-black text-slate uppercase tracking-widest opacity-40">
              Resumo da auditoria
            </p>
            <p className="px-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider -mt-2.5">
              Últimas 24 horas
            </p>
            <div className="space-y-2">
              {[
                { label: 'Eventos registrados', count: '24.812' },
                { label: 'Usuários ativos', count: '32' },
                { label: 'Entidades impactadas', count: '158' },
                { label: 'Sistemas envolvidos', count: '8' },
                { label: 'Ações críticas', count: '71' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-ink/75">{s.label}</span>
                  <span className="text-[11px] font-black text-ink">{s.count}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/30 flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-slate-400">Último evento</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-ink">10:21:19</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Toggle */}
        <div className="p-3 border-t border-border/50">
           <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-slate/30 hover:text-brand hover:bg-brand-soft transition-all">
             <ChevronLeft className="w-4 h-4" />
           </button>
        </div>
      </div>
    </aside>
  );
}
