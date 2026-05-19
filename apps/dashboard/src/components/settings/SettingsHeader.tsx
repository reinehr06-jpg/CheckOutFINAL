'use client';

import { Settings2, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

interface SettingsHeaderProps {
  environment: 'production' | 'sandbox';
  lastUpdatedAt: string;
  onToggleEnvironment: () => void;
}

export function SettingsHeader({ environment, lastUpdatedAt, onToggleEnvironment }: SettingsHeaderProps) {
  const formattedDate = new Date(lastUpdatedAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E5EF] pb-5">
      <div className="flex items-center gap-4">
        {/* Avatar roxo degradê */}
        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md shadow-violet-600/10 shrink-0">
          <Settings2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-950">
            Configurações
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Centralize e gerencie todas as configurações da plataforma Basileia Pay.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Mini-card Ambiente */}
        <button
          onClick={onToggleEnvironment}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E8DDFD] hover:bg-slate-50 rounded-xl shadow-sm text-left transition-all cursor-pointer"
        >
          {environment === 'production' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
          )}
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block leading-none">
              Ambiente atual
            </span>
            <span className={`text-[11px] font-black block mt-0.5 ${environment === 'production' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {environment === 'production' ? '• Produção' : '• Sandbox'}
            </span>
          </div>
        </button>

        {/* Mini-card Atualização */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E8DDFD] rounded-xl shadow-sm text-left">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block leading-none">
              Última atualização
            </span>
            <span className="text-[11px] font-black text-slate-700 block mt-0.5">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
