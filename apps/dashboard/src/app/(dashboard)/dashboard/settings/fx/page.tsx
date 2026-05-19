'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Check, X, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';

export default function FxSettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [currencies, setCurrencies] = useState([
    { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', enabled: true, rate: '1.00' },
    { code: 'USD', name: 'Dólar Americano', symbol: '$', enabled: true, rate: '5.12' },
    { code: 'EUR', name: 'Euro', symbol: '€', enabled: true, rate: '5.54' },
    { code: 'GBP', name: 'Libra Esterlina', symbol: '£', enabled: false, rate: '6.45' }
  ]);

  const [rateSource, setRateSource] = useState('auto');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Taxas de câmbio salvas.');
  };

  const handleToggleCurrency = (code: string) => {
    setCurrencies(prev => prev.map(c => c.code === code ? { ...c, enabled: !c.enabled } : c));
    const target = currencies.find(c => c.code === code);
    if (target) {
      triggerToast(`Moeda ${target.name} ${!target.enabled ? 'habilitada' : 'desabilitada'}.`);
    }
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
        <span className="text-slate-700 font-bold">FX / Multi-moeda</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7E5EF] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 border border-teal-100 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] 2xl:text-[20px] font-black tracking-tight text-slate-950">
              FX / Multi-moeda
            </h1>
            <p className="text-slate-455 font-semibold text-[11px] 2xl:text-[11.5px] tracking-tight">
              Gerencie moedas aceitas no checkout, taxas de conversão automáticas e spread de câmbio.
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
          
          {/* Currencies switches */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Moedas Habilitadas
            </h3>

            <div className="space-y-4">
              {currencies.map((curr) => (
                <div key={curr.code} className="flex items-center justify-between p-1">
                  <div>
                    <p className="text-xs font-black text-slate-900">{curr.name} ({curr.code})</p>
                    <p className="text-[10.5px] font-semibold text-slate-450 mt-0.5">Símbolo: {curr.symbol} • Taxa de conversão: 1 BRL = {(1 / parseFloat(curr.rate)).toFixed(4)} {curr.code}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggleCurrency(curr.code)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${curr.enabled ? 'bg-brand' : 'bg-slate-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${curr.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rate source */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Origem da Taxa de Câmbio
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setRateSource('auto')}
                  className={`p-3 border rounded-xl cursor-pointer text-center ${rateSource === 'auto' ? 'border-brand bg-brand-soft/20' : 'border-slate-100 bg-slate-50/50'}`}
                >
                  <span className="text-xs font-black text-slate-900 block">Atualização Automática</span>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Fonte: Banco Central / Forex live API</span>
                </div>
                <div 
                  onClick={() => setRateSource('manual')}
                  className={`p-3 border rounded-xl cursor-pointer text-center ${rateSource === 'manual' ? 'border-brand bg-brand-soft/20' : 'border-slate-100 bg-slate-50/50'}`}
                >
                  <span className="text-xs font-black text-slate-900 block">Fixar Manualmente</span>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Defina taxas customizadas para conversão</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Col 3: Exchange summary */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-650 border border-teal-100 flex items-center justify-center shrink-0 mx-auto">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black text-slate-900 mt-2">Spread e Spread de Câmbio</h3>
            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              Você pode adicionar um spread percentual sobre a taxa de câmbio comercial para cobrir taxas de repatriação.
            </p>
            <div className="flex items-center gap-2 max-w-[120px] mx-auto pt-2">
              <input
                type="text"
                defaultValue="1.5"
                className="w-14 h-8 bg-slate-50 border border-[#E8DDFD] rounded-lg text-xs font-bold text-slate-900 text-center"
              />
              <span className="text-xs font-black text-slate-700">% spread</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
