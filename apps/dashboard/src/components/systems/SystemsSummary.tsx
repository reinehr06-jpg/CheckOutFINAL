'use client';

import { 
  Info, 
  ArrowRight, 
  ServerOff, 
  Workflow, 
  ShieldAlert 
} from 'lucide-react';

export function SystemsSummary() {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3 w-full">
      <StatusSummaryCard />
      <TechnicalAlertsFeed />
      <AttentionPointsCard />
    </div>
  );
}

function StatusSummaryCard() {
  const items = [
    { label: "Operacionais", value: 6, percent: "75%", color: "bg-green-500" },
    { label: "Atenção", value: 1, percent: "12,5%", color: "bg-amber-500" },
    { label: "Instáveis", value: 1, percent: "12,5%", color: "bg-red-500" },
    { label: "Desconectados", value: 1, percent: "12,5%", color: "bg-slate-400" },
  ];

  return (
    <div className="rounded-[22px] border border-[#E8DDFD] bg-white/80 p-4 shadow-[0_10px_30px_rgba(76,29,149,0.08)] flex flex-col justify-between h-[195px] xl:h-[200px]">
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-slate-950">
            Resumo de Status
          </h3>
          <Info className="h-4 w-4 text-violet-500" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E8DDFD] bg-[#FAF8FF] p-2 text-center flex flex-col items-center justify-center"
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
        <div className="w-[75%] bg-green-500" />
        <div className="w-[12.5%] bg-amber-500" />
        <div className="w-[12.5%] bg-red-500" />
        <div className="w-[12.5%] bg-slate-400" />
      </div>
    </div>
  );
}

function TechnicalAlertsFeed() {
  const alerts = [
    {
      title: "Latência elevada no Banco do Brasil PIX",
      description: "Aumento de tempo de resposta detectado",
      badge: "Instável",
      time: "há 30 min",
      color: "bg-red-500",
      badgeClass: "bg-red-50 text-red-600 border-red-100",
    },
    {
      title: "Erros intermitentes no Stripe",
      description: "Taxa de erro acima do normal: 0,8%",
      badge: "Atenção",
      time: "há 15 min",
      color: "bg-amber-500",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Webhooks atrasados - Mercado Pago",
      description: "Fila de webhooks com atraso médio de 8 min",
      badge: "Atenção",
      time: "há 12 min",
      color: "bg-amber-500",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="rounded-[22px] border border-[#E8DDFD] bg-white/80 p-4 shadow-[0_10px_30px_rgba(76,29,149,0.08)] flex flex-col justify-between h-[195px] xl:h-[200px]">
      <div>
        <h3 className="mb-2.5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shrink-0">
          Alertas Técnicos Recentes
        </h3>

        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.title} className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2 w-2 shrink-0 rounded-full ${alert.color}`} />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-black text-slate-950 leading-tight">
                    {alert.title}
                  </p>
                  <p className="truncate text-[10px] font-medium text-slate-500 mt-0.5 leading-none">
                    {alert.description}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className={`rounded-lg border px-1.5 py-0.5 text-[8.5px] font-black ${alert.badgeClass}`}>
                  {alert.badge}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {alert.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-2 flex items-center gap-1.5 text-xs font-black text-violet-600 uppercase tracking-wider hover:gap-2 transition-all shrink-0">
        Ver todos os alertas
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AttentionPointsCard() {
  const points = [
    {
      title: "1 sistema sem atividade",
      description: "Adyen Sandbox não possui atividade nas últimas 24h",
      action: "Ver sistemas",
      icon: ServerOff,
    },
    {
      title: "3 webhooks com atenção",
      description: "Filas com atraso superior a 5 minutos",
      action: "Ver webhooks",
      icon: Workflow,
    },
    {
      title: "1 certificado expira em breve",
      description: "Certificado do Cielo expira em 12 dias",
      action: "Ver certificados",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="rounded-[22px] border border-[#E8DDFD] bg-white/80 p-4 shadow-[0_10px_30px_rgba(76,29,149,0.08)] flex flex-col justify-between h-[195px] xl:h-[200px]">
      <div>
        <h3 className="mb-2.5 text-sm font-black uppercase tracking-[0.12em] text-slate-950 shrink-0">
          Pontos de Atenção
        </h3>

        <div className="space-y-2">
          {points.map((point) => {
            const Icon = point.icon;

            return (
              <div key={point.title} className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[12px] font-black text-slate-950 leading-tight">
                      {point.title}
                    </p>
                    <p className="truncate text-[10px] font-medium text-slate-500 mt-0.5 leading-none">
                      {point.description}
                    </p>
                  </div>
                </div>

                <button className="shrink-0 text-[10.5px] font-black text-violet-600 hover:underline">
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
