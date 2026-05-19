'use client';

import { useState } from 'react';
import { 
  Plus, 
  Download, 
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { SystemsTable } from '@/components/systems/SystemsTable';
import { SystemsSummary } from '@/components/systems/SystemsSummary';

export default function SystemsPage() {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col gap-2.5 2xl:gap-3">
      {/* 1. Page Header */}
      <header className="flex items-center justify-between w-full px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] 2xl:text-[28px] font-black tracking-tighter text-ink leading-none">Sistemas</h1>
            <div className="w-6 h-6 rounded-lg bg-brand/10 flex items-center justify-center">
               <Activity className="w-3.5 h-3.5 text-brand" />
            </div>
          </div>
          <p className="text-slate/50 font-bold text-[11.5px] 2xl:text-[12.5px] tracking-tight">
            Gerencie provedores conectados, gateways e integrações técnicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-xl text-[10px] 2xl:text-[11px] font-black text-ink shadow-sm hover:bg-brand-soft transition-all uppercase tracking-tight h-[34px] 2xl:h-[38px]">
            <Download className="w-3.5 h-3.5 text-slate/40" />
            Exportar
            <ChevronDown className="w-3.5 h-3.5 text-slate/30" />
          </button>
          
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-brand text-white rounded-xl text-[10px] 2xl:text-[11px] font-black shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all active:translate-y-0 uppercase tracking-tight h-[34px] 2xl:h-[38px]">
            <Plus className="w-3.5 h-3.5 text-white/80" />
            Novo sistema
          </button>
        </div>
      </header>

      {/* 2. Systems Management Table (Protagonist) */}
      <section className="w-full min-w-0">
        <SystemsTable />
      </section>

      {/* 3. Operational Footer Intelligence */}
      <section className="w-full mt-0.5">
        <SystemsSummary />
      </section>
    </div>
  );
}
