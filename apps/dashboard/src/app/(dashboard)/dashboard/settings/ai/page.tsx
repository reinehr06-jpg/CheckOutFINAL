'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Check, X, Sparkles, Brain, AlertTriangle } from 'lucide-react';

export default function AiSettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [aiFeatures, setAiFeatures] = useState({
    smartRouting: true,
    anomalyDetection: true,
    autoRetry: true,
    conversionOptimizer: false
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Parâmetros de inteligência artificial salvos.');
  };

  return (
    <div className="w-full text-left space-y-6 pt-2 pb-12 select-none">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-brand text-white p-3.5 rounded-2xl shadow-xl border border-brand/50 flex items-center justify-between gap-3 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span className="text-[11.5px] font-bold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-0.5 text-white/70 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-455">
        <Link href="/dashboard/settings" className="hover:text-brand flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Configurações
        </Link>
        <span className="text-slate-350">/</span>
        <span className="text-slate-700 font-bold">IA e Automações</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7E5EF] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-650 border border-violet-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] 2xl:text-[20px] font-black tracking-tight text-slate-950">
              IA e Automações
            </h1>
            <p className="text-slate-455 font-semibold text-[11px] 2xl:text-[11.5px] tracking-tight">
              Gerencie modelos cognitivos de aprendizado de máquina para roteamento inteligente de gateways e prevenção de fraudes.
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="flex h-9 items-center justify-center gap-1.5 px-4 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-black shadow-lg shadow-violet-600/15 transition-all uppercase tracking-tight"
        >
          <Save className="w-3.5 h-3.5 shrink-0" />
          Salvar alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Col 1 & 2: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Features switches */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Recursos de IA Disponíveis
            </h3>

            <div className="space-y-4">
              {[
                { id: 'smartRouting', label: 'Sugestões e Roteamento Inteligente', desc: 'IA determina em milissegundos o gateway de menor latência e maior conversão para o cartão do comprador.' },
                { id: 'anomalyDetection', label: 'Detecção Automática de Anomalias', desc: 'Sinaliza compras suspeitas ou picos abruptos de estorno antes da transação prosseguir.' },
                { id: 'autoRetry', label: 'Retentativas com Otimização de Perfil', desc: 'Calcula o melhor momento e gateway reserva para reprocessar cartões recusados.' },
                { id: 'conversionOptimizer', label: 'Otimizador de Layout Dinâmico (A/B)', desc: 'Reordena dinamicamente os métodos de pagamento com base no perfil histórico do usuário.' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-1">
                  <div className="max-w-[80%] text-left">
                    <p className="text-xs font-black text-slate-900">{item.label}</p>
                    <p className="text-[10.5px] font-semibold text-slate-450 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAiFeatures({ ...aiFeatures, [item.id]: !aiFeatures[item.id as keyof typeof aiFeatures] })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${aiFeatures[item.id as keyof typeof aiFeatures] ? 'bg-brand' : 'bg-slate-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${aiFeatures[item.id as keyof typeof aiFeatures] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Col 3: Details */}
        <div className="space-y-6">
          {/* AI Usage credits */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Uso de Créditos de IA
            </h3>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black text-slate-900">
                <span>Créditos utilizados</span>
                <span>72.480 / 100.000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div className="h-full bg-brand rounded-full" style={{ width: '72.48%' }} />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Consumo mensal renova em 5 dias.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
