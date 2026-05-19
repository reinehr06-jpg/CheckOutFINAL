'use client';

import { ShieldCheck } from 'lucide-react';

interface SettingsCardSpecialProps {
  onActionFeedback: (msg: string) => void;
}

export function SettingsCardSpecial({ onActionFeedback }: SettingsCardSpecialProps) {
  return (
    <div className="relative h-[162px] flex flex-col justify-between p-5 bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 border border-violet-200 rounded-[20px] shadow-sm select-none group text-left transition-all hover:scale-[1.01] duration-200">
      
      {/* Big Shield Icon on Top Right */}
      <ShieldCheck className="w-12 h-12 text-violet-600/70 absolute right-4 top-4 shrink-0 group-hover:scale-105 transition-transform" />

      <div className="max-w-[70%]">
        <h3 className="text-sm font-black text-slate-900 leading-tight">
          Status da plataforma
        </h3>
        <p className="mt-1 text-[11.5px] font-semibold text-slate-500 leading-snug">
          Saúde dos serviços e sistemas da Basileia Pay.
        </p>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <button
          onClick={() => onActionFeedback('Direcionando para painel de status em tempo real...')}
          className="flex h-7 items-center justify-center px-4 bg-violet-600 hover:bg-violet-750 text-white rounded-lg text-[10px] font-black shadow-sm transition-all"
        >
          Ver status
        </button>

        {/* Carousel indicators */}
        <div className="flex items-center gap-1.5 pb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </div>
    </div>
  );
}
