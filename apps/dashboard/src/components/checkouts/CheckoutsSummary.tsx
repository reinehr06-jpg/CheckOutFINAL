'use client';

import { 
  Info, 
  ArrowRight, 
  Sparkles,
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  UserPlus,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutsSummaryProps {
  onFilterStatus?: (status: string) => void;
  onFilterAttention?: (type: string) => void;
}

export function CheckoutsSummary({ onFilterStatus, onFilterAttention }: CheckoutsSummaryProps) {
  return (
    <div className="mt-2.5 grid grid-cols-1 gap-4 xl:grid-cols-3 w-full">
      <StatusSummaryCard onFilterStatus={onFilterStatus} />
      <RecentActivityFeed />
      <AttentionPointsCard onFilterAttention={onFilterAttention} />
    </div>
  );
}

function StatusSummaryCard({ onFilterStatus }: { onFilterStatus?: (status: string) => void }) {
  const items = [
    { label: "Publicados", value: 8, percent: "66,7%", color: "bg-green-500", key: 'Publicado' },
    { label: "Rascunhos", value: 3, percent: "25,0%", color: "bg-amber-500", key: 'Rascunho' },
    { label: "Pausados", value: 1, percent: "8,3%", color: "bg-yellow-500", key: 'Pausado' },
    { label: "Arquivados", value: 2, percent: "16,7%", color: "bg-slate-400", key: 'Arquivado' },
  ];

  return (
    <div className="rounded-[22px] border border-[#E8DDFD] bg-white/80 p-4 shadow-[0_10px_30px_rgba(76,29,149,0.08)] flex flex-col justify-between h-[195px] xl:h-[200px]">
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-950">
            Resumo de Status
          </h3>
          <Info className="h-4 w-4 text-violet-500" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              onClick={() => onFilterStatus?.(item.key)}
              className="rounded-2xl border border-[#E8DDFD] bg-[#FAF8FF] p-2 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-brand-soft/30 hover:border-brand/30 transition-all"
            >
              <div className={`mb-1.5 h-2 w-2 rounded-full shrink-0 ${item.color}`} />
              <p className="text-lg font-black text-slate-950 leading-none">{item.value}</p>
              <p className="mt-1 text-[9px] font-bold text-slate-600 leading-tight">
                {item.label}
              </p>
              <p className="text-[9px] font-semibold text-slate-400 leading-tight">
                {item.percent}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-slate-100 shrink-0">
        <div className="w-[66.7%] bg-green-500" />
        <div className="w-[25.0%] bg-amber-500" />
        <div className="w-[8.3%] bg-yellow-500" />
        <div className="w-[16.7%] bg-slate-400" />
      </div>
    </div>
  );
}

function RecentActivityFeed() {
  const activities = [
    {
      title: "Checkout Pagar.Me Padrão foi publicado",
      description: "Publicado por Vinícius Admin",
      time: "há 2 dias",
      badge: "Publicado",
      badgeClass: "bg-green-50 text-green-600 border-green-100",
    },
    {
      title: "Checkout Marketplace foi duplicado",
      description: "Duplicado de v1.9.2 por Amanda Silva",
      time: "há 3 horas",
      badge: "Rascunho",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Checkout PIX BB foi editado",
      description: "Alterações em campos e validações",
      time: "há 1 dia",
      badge: "Editado",
      badgeClass: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Falha ao publicar Checkout Evento",
      description: "Validação de integrações obrigatórias",
      time: "há 2 horas",
      badge: "Falha",
      badgeClass: "bg-red-50 text-red-600 border-red-100",
    },
  ];

  return (
    <div className="rounded-[22px] border border-[#E8DDFD] bg-white/80 p-4 shadow-[0_10px_30px_rgba(76,29,149,0.08)] flex flex-col justify-between h-[195px] xl:h-[200px]">
      <div>
        <h3 className="mb-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-950 shrink-0">
          Atividades Recentes
        </h3>

        <div className="space-y-1.5 overflow-hidden">
          {activities.slice(0, 3).map((act) => (
            <div key={act.title} className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  act.badge === 'Publicado' && 'bg-green-500',
                  act.badge === 'Rascunho' && 'bg-amber-500',
                  act.badge === 'Editado' && 'bg-blue-500',
                  act.badge === 'Falha' && 'bg-red-500',
                )} />
                <div className="min-w-0">
                  <p className="truncate text-[11.5px] font-black text-slate-950 leading-tight">
                    {act.title}
                  </p>
                  <p className="truncate text-[9.5px] font-medium text-slate-500 mt-0.5 leading-none">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className={`rounded-lg border px-1.5 py-0.5 text-[8px] font-black leading-none ${act.badgeClass}`}>
                  {act.badge}
                </span>
                <span className="text-[9.5px] font-semibold text-slate-400">
                  {act.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-2 flex items-center gap-1.5 text-[10px] font-black text-violet-600 uppercase tracking-wider hover:gap-2 transition-all shrink-0">
        Ver todas as atividades →
      </button>
    </div>
  );
}

function AttentionPointsCard({ onFilterAttention }: { onFilterAttention?: (type: string) => void }) {
  const points = [
    {
      title: "2 checkouts sem publicação recente",
      description: "Última publicação há mais de 14 dias",
      action: "Ver checkouts",
      icon: RefreshCw,
      key: 'no-publish',
    },
    {
      title: "1 checkout com taxa abaixo da meta",
      description: "Taxa de conversão abaixo de 60%",
      action: "Ver relatório",
      icon: AlertTriangle,
      key: 'low-conversion',
    },
    {
      title: "1 rascunho sem responsável",
      description: "Checkout Marketplace não possui responsável",
      action: "Atribuir",
      icon: UserPlus,
      key: 'no-owner',
    },
  ];

  return (
    <div className="rounded-[22px] border border-[#E8DDFD] bg-white/80 p-4 shadow-[0_10px_30px_rgba(76,29,149,0.08)] flex flex-col justify-between h-[195px] xl:h-[200px]">
      <div>
        <h3 className="mb-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-slate-950 shrink-0">
          Pontos de Atenção
        </h3>

        <div className="space-y-2">
          {points.map((point) => {
            const Icon = point.icon;

            return (
              <div key={point.title} className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11.5px] font-black text-slate-950 leading-tight">
                      {point.title}
                    </p>
                    <p className="truncate text-[9.5px] font-medium text-slate-500 mt-0.5 leading-none">
                      {point.description}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => onFilterAttention?.(point.key)}
                  className="shrink-0 text-[10px] font-black text-violet-600 hover:underline"
                >
                  {point.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
