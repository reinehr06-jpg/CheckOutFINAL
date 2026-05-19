'use client';

import Link from 'next/link';
import { Shield, GitBranch, Code2, Server, ArrowRight } from 'lucide-react';
import { SettingsSummary } from '@/types/settings';
import { SettingsApiUsageBar } from './SettingsApiUsageBar';
import { SettingsTabValue } from './SettingsTabs';

interface SettingsSummaryGridProps {
  summary: SettingsSummary;
  onTabChange: (tab: SettingsTabValue) => void;
  onActionFeedback: (msg: string) => void;
}

export function SettingsSummaryGrid({ summary, onTabChange, onActionFeedback }: SettingsSummaryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#E7E5EF]">
      
      {/* Card 1 - Segurança */}
      <div className="bg-white border border-[#E7E5EF] rounded-[20px] p-5 flex flex-col justify-between shadow-sm min-h-[140px] text-left">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-250/50">
              Protegido
            </span>
          </div>
          <p className="mt-3.5 text-[11.5px] font-semibold text-slate-500 leading-snug">
            Todas as políticas de segurança estão ativas e atualizadas.
          </p>
        </div>
      </div>

      {/* Card 2 - Integrações */}
      <div className="bg-white border border-[#E7E5EF] rounded-[20px] p-5 flex flex-col justify-between shadow-sm min-h-[140px] text-left">
        <div>
          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-650 border border-violet-100 flex items-center justify-center shrink-0">
            <GitBranch className="w-4.5 h-4.5" />
          </div>
          <p className="mt-3.5 text-[11.5px] font-semibold text-slate-500 leading-snug">
            {summary.integrations.gatewaysCount} gateways conectados · {summary.integrations.webhooksCount} webhooks ativos
          </p>
        </div>
        <button
          onClick={() => onTabChange('integrations')}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-brand hover:underline cursor-pointer w-fit"
        >
          Ver integrações
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card 3 - Uso da API */}
      <div className="bg-white border border-[#E7E5EF] rounded-[20px] p-5 flex flex-col justify-between shadow-sm min-h-[140px] text-left">
        <div>
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <Link 
              href="/dashboard/developers"
              className="inline-flex items-center gap-0.5 text-[11px] font-black text-brand hover:underline"
            >
              Ver métricas
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="mt-3.5 text-[11.5px] font-semibold text-slate-500 leading-snug">
            {summary.apiUsage.callsThisMonth.toLocaleString('pt-BR')} chamadas este mês · {summary.apiUsage.percentUsed}% utilizado
          </p>
        </div>
        <SettingsApiUsageBar percentUsed={summary.apiUsage.percentUsed} />
      </div>

      {/* Card 4 - Ambiente */}
      <div className="bg-white border border-[#E7E5EF] rounded-[20px] p-5 flex flex-col justify-between shadow-sm min-h-[140px] text-left">
        <div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center shrink-0">
            <Server className="w-4.5 h-4.5" />
          </div>
          <p className="mt-3.5 text-[11.5px] font-semibold text-slate-500 leading-snug capitalize">
            {summary.environment} ativo · Região: {summary.company.region}
          </p>
        </div>
        <Link 
          href="/dashboard/settings/environments"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-brand hover:underline cursor-pointer w-fit"
        >
          Gerenciar ambientes
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
