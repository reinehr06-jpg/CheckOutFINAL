'use client';

import { useState, useEffect } from 'react';
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
  ChevronDown,
  Terminal,
  Settings2,
  GitBranch,
  Code2,
  Bell,
  Users,
  BarChart3,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';

const menuGroups = [
  {
    title: 'HUB EXECUTIVO',
    items: [
      { name: 'Visao Geral', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Sistemas', icon: Monitor, href: '/dashboard/systems' },
      { name: 'Gateways', icon: Globe, href: '/dashboard/gateways' },
      { name: 'Checkouts', icon: CreditCard, href: '/dashboard/checkouts', hasStudioBadge: true },
      { name: 'Clientes', icon: Users, href: '/dashboard/payments' },
      { name: 'Assinaturas', icon: Repeat, href: '/dashboard/subscriptions' },
      { name: 'Relatorios', icon: BarChart3, href: '/dashboard/bci' },
      { name: 'Alertas', icon: Bell, href: '/dashboard/trust' }
    ]
  },
  {
    title: 'OPERACOES',
    items: [
      { name: 'Operacoes', icon: ShoppingCart, href: '/dashboard/orders' },
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
      { name: 'Configuracoes', icon: Settings2, href: '/dashboard/settings' }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isMaster, logout, activeCompanyId } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [checkoutStats, setCheckoutStats] = useState({ published: 0, draft: 0, paused: 0, archived: 0 });

  useEffect(() => {
    if (!user) return;
    apiFetch<any[]>('/api/v1/checkouts')
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const stats = { published: 0, draft: 0, paused: 0, archived: 0 };
          res.data.forEach((c: any) => {
            const status = c.status?.toLowerCase();
            if (status === 'published' || status === 'publicado') stats.published++;
            else if (status === 'draft' || status === 'rascunho') stats.draft++;
            else if (status === 'paused' || status === 'pausado') stats.paused++;
            else if (status === 'archived' || status === 'arquivado') stats.archived++;
          });
          setCheckoutStats(stats);
        }
      })
      .catch(() => {});
  }, [user, activeCompanyId]);

  const roleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'owner': return 'Owner';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'VA';

  return (
    <aside className="w-[228px] 2xl:w-[260px] h-screen fixed left-1.5 2xl:left-2.5 top-1.5 2xl:top-2.5 bottom-1.5 2xl:bottom-2.5 flex flex-col z-20 transition-all duration-300">
      <div className="flex-1 bg-surface/70 backdrop-blur-xl border border-border rounded-[24px] flex flex-col overflow-hidden shadow-2xl shadow-brand/5">
        {/* Brand */}
        <div className="p-5 pb-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
            <span className="text-white font-black text-lg">B</span>
          </div>
          <span className="text-ink font-black text-[17px] tracking-tight">Basileia Pay</span>
        </div>

        {/* Nav */}
        <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-2 py-4 no-scrollbar space-y-5 text-left">
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

          {/* Super Admin link (only for super_admin) */}
          {isMaster && (
            <div className="space-y-1 pt-2 border-t border-border/30">
              <p className="px-3 text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2 opacity-60">
                ADMINISTRACAO
              </p>
              <Link
                href="/dashboard/super-admin"
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 2xl:py-2.5 rounded-xl transition-all duration-300 relative h-[40px] 2xl:h-[44px]",
                  pathname === '/dashboard/super-admin'
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                    : "text-slate hover:bg-amber-50 hover:text-amber-600"
                )}
              >
                <Shield className={cn("w-4 h-4 shrink-0", pathname === '/dashboard/super-admin' ? "text-white" : "text-slate/40 group-hover:text-amber-500")} />
                <span className="font-bold text-[12.5px]">Super Admin</span>
                {pathname === '/dashboard/super-admin' && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70 shrink-0" />}
              </Link>
            </div>
          )}
        </nav>

        {/* RESUMO widget */}
        {!pathname.startsWith('/dashboard/settings') && (
          <div className="mx-2.5 mb-2.5 p-3.5 rounded-[16px] border border-border bg-surface/65 text-left shadow-sm">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
              Resumo
            </span>
            <div className="space-y-1.5">
              {[
                { label: 'Publicados', val: checkoutStats.published.toString(), color: 'bg-emerald-500' },
                { label: 'Rascunhos', val: checkoutStats.draft.toString(), color: 'bg-orange-500' },
                { label: 'Pausados', val: checkoutStats.paused.toString(), color: 'bg-amber-500' },
                { label: 'Arquivados', val: checkoutStats.archived.toString(), color: 'bg-slate-400' }
              ].map((res) => (
                <div key={res.label} className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", res.color)} />
                    <span>{res.label}</span>
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-ink">{res.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom User Block */}
        <div className="p-3 border-t border-border/50 relative">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between w-full cursor-pointer px-1"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-accent text-white flex items-center justify-center font-black text-xs shadow-md">
                {initials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-black text-slate-900 leading-tight truncate">{user?.name || 'Usuario'}</p>
                <p className="text-[10px] font-semibold text-slate-400 leading-none truncate">{roleLabel(user?.role || '')}</p>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </div>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl border border-border shadow-xl z-50 py-2">
                {user && (
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-sm font-black text-ink">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate/50 truncate">{user.email}</p>
                  </div>
                )}
                <Link href="/dashboard/settings" className="w-full px-3 py-2 text-left text-[12px] font-bold text-ink hover:bg-brand-soft flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> Configuracoes
                </Link>
                {isMaster && (
                  <Link href="/dashboard/super-admin" className="w-full px-3 py-2 text-left text-[12px] font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Super Admin
                  </Link>
                )}
                <button onClick={logout} className="w-full px-3 py-2 text-left text-[12px] font-bold text-danger hover:bg-danger/5 flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
