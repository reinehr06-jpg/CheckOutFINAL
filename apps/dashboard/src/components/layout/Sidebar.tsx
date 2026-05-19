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
  GitBranch,
  Code2,
  Bell,
  Users,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuGroups = [
  {
    title: 'HUB EXECUTIVO',
    items: [
      { name: 'Visão Geral', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Sistemas', icon: Monitor, href: '/dashboard/systems' },
      { name: 'Gateways', icon: Globe, href: '/dashboard/gateways' },
      { name: 'Checkouts', icon: CreditCard, href: '/dashboard/checkouts', hasStudioBadge: true },
      { name: 'Clientes', icon: Users, href: '/dashboard/payments' },
      { name: 'Assinaturas', icon: Repeat, href: '/dashboard/subscriptions' },
      { name: 'Relatórios', icon: BarChart3, href: '/dashboard/bci' },
      { name: 'Alertas', icon: Bell, href: '/dashboard/trust' }
    ]
  },
  {
    title: 'OPERAÇÕES',
    items: [
      { name: 'Operações', icon: ShoppingCart, href: '/dashboard/orders' },
      { name: 'Webhooks', icon: Zap, href: '/dashboard/webhooks' },
      { name: 'Recovery', icon: Activity, href: '/recovery' }
    ]
  },
  {
    title: 'AUDITORIA',
    items: [
      { name: 'Auditoria', icon: Terminal, href: '/dashboard/audit' },
      { name: 'Roteamento', icon: GitBranch, href: '/dashboard/routing' },
      { name: 'Desenvolvedores', icon: Code2, href: '/dashboard/developers' },
      { name: 'Configurações', icon: Settings2, href: '/dashboard/settings' }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[228px] 2xl:w-[260px] h-[calc(100vh-12px)] 2xl:h-[calc(100vh-20px)] sticky top-1.5 2xl:top-2.5 flex flex-col z-20 shrink-0 transition-all duration-300 self-start">
      <div className="flex-1 bg-white/70 backdrop-blur-xl border border-border rounded-[24px] flex flex-col overflow-hidden shadow-2xl shadow-brand/5">
        {/* Brand */}
        <div className="p-5 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <span className="text-ink font-black text-[17px] tracking-tight">Basileia Pay</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 no-scrollbar space-y-5 text-left">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[9px] font-black text-slate uppercase tracking-widest mb-2 opacity-35">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
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
                        "w-4 h-4 transition-colors shrink-0",
                        isActive ? "text-white" : "text-slate/40 group-hover:text-brand"
                      )} />
                      <span className={cn(
                        "font-bold text-[12.5px]",
                        isActive ? "text-white" : "text-slate"
                      )}>
                        {item.name}
                      </span>
                      
                      {item.hasStudioBadge && (
                        <span className={cn(
                          "ml-auto text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5 border transition-all",
                          isActive 
                            ? "bg-white/20 text-white border-white/20" 
                            : "bg-[#EFE9FF] text-brand border-[#E8DDFD] group-hover:bg-brand group-hover:text-white group-hover:border-transparent"
                        )}>
                          Studio
                        </span>
                      )}

                      {isActive && !item.hasStudioBadge && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
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
          </div>
        )}

        {/* RESUMO widget exactly from screenshot */}
        {!pathname.startsWith('/dashboard/settings') && (
          <div className="mx-2.5 mb-2.5 p-3.5 rounded-[16px] border border-[#E8DDFD] bg-white/60 text-left shadow-sm">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
              Resumo
            </span>
            
            <div className="space-y-1.5">
              {[
                { label: 'Publicados', val: '8', color: 'bg-emerald-500' },
                { label: 'Rascunhos', val: '3', color: 'bg-orange-500' },
                { label: 'Pausados', val: '1', color: 'bg-amber-500' },
                { label: 'Arquivados', val: '2', color: 'bg-slate-400' }
              ].map((res) => (
                <div key={res.label} className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", res.color)} />
                    <span>{res.label}</span>
                  </div>
                  <span className="font-extrabold text-slate-800">{res.val}</span>
                </div>
              ))}
            </div>
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
            <div className="flex items-center justify-between w-full px-1.5 py-0.5">
              <button className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-slate/30 hover:text-brand hover:bg-brand-soft transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                  {/* Mock profile image */}
                  <div className="w-full h-full bg-brand/20 text-brand font-black text-[10px] flex items-center justify-center">VA</div>
                </div>
                <div className="text-left min-w-0 leading-none">
                  <p className="text-[10px] font-black text-slate-800 truncate">Vinícius Admin</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">Admin</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
