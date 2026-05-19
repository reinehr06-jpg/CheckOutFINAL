'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronDown,
  Plus, 
  DollarSign, 
  TrendingUp, 
  RefreshCw, 
  Settings2, 
  ChevronRight, 
  ShieldAlert, 
  Activity, 
  Globe,
  Coins,
  Shield,
  Percent,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ActiveTab = 
  | 'visao_geral' 
  | 'taxas_ao_vivo' 
  | 'moedas' 
  | 'markup_spread' 
  | 'trava_cambio' 
  | 'liquidacao' 
  | 'por_checkout' 
  | 'regras_conversao' 
  | 'historico';

export default function FxSettingsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('visao_geral');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Interactive Live Currency rates state
  const [exchangeRates, setExchangeRates] = useState([
    { code: 'USD', name: 'Dólar Americano', pair: 'USD/BRL', interbank: 5.1275, ourRate: 5.2520, markup: '2,43%', var24h: 0.42, lock: 'Sim', status: 'Ativa', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', pair: 'EUR/BRL', interbank: 5.5842, ourRate: 5.7200, markup: '2,43%', var24h: 0.31, lock: 'Não', status: 'Ativa', flag: '🇪🇺' },
    { code: 'GBP', name: 'Libra Esterlina', pair: 'GBP/BRL', interbank: 6.5341, ourRate: 6.6950, markup: '2,46%', var24h: -0.12, lock: 'Sim', status: 'Ativa', flag: '🇬🇧' },
    { code: 'CAD', name: 'Dólar Canadense', pair: 'CAD/BRL', interbank: 3.7221, ourRate: 3.8150, markup: '2,50%', var24h: 0.28, lock: 'Não', status: 'Ativa', flag: '🇨🇦' },
    { code: 'AUD', name: 'Dólar Australiano', pair: 'AUD/BRL', interbank: 3.3684, ourRate: 3.4520, markup: '2,48%', var24h: 0.18, lock: 'Não', status: 'Ativa', flag: '🇦🇺' },
    { code: 'JPY', name: 'Iene Japonês', pair: 'JPY/BRL', interbank: 0.03321, ourRate: 0.03400, markup: '2,38%', var24h: -0.09, lock: 'Não', status: 'Ativa', flag: '🇯🇵' },
    { code: 'CHF', name: 'Franco Suíço', pair: 'CHF/BRL', interbank: 5.8223, ourRate: 5.9650, markup: '2,45%', var24h: 0.22, lock: 'Sim', status: 'Ativa', flag: '🇨🇭' },
    { code: 'MXN', name: 'Peso Mexicano', pair: 'MXN/BRL', interbank: 0.2648, ourRate: 0.2710, markup: '2,34%', var24h: 0.35, lock: 'Não', status: 'Ativa', flag: '🇲🇽' },
  ]);

  // Quick Converter Input State
  const [convertAmount, setConvertAmount] = useState<number>(1000);
  const [selectedConvertCurrency, setSelectedConvertCurrency] = useState<string>('USD');

  // Modal to add currency
  const [showAddModal, setShowAddModal] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateRates = () => {
    setIsUpdating(true);
    triggerToast("Buscando últimas taxas interbancárias em tempo real...");
    setTimeout(() => {
      setIsUpdating(false);
      // Simulate slight rate updates
      setExchangeRates(prev => prev.map(rate => {
        const factor = 1 + (Math.random() * 0.004 - 0.002);
        const newInter = parseFloat((rate.interbank * factor).toFixed(4));
        const newOur = parseFloat((newInter * 1.0243).toFixed(4));
        return {
          ...rate,
          interbank: newInter,
          ourRate: newOur,
          var24h: parseFloat((rate.var24h + (Math.random() * 0.1 - 0.05)).toFixed(2))
        };
      }));
      triggerToast("Taxas de câmbio ao vivo atualizadas com sucesso!");
    }, 1200);
  };

  // Convert amount based on ourRate of selected currency
  const convertedAmount = (() => {
    const rate = exchangeRates.find(c => c.code === selectedConvertCurrency);
    if (!rate) return 0;
    return convertAmount * rate.ourRate;
  })();

  return (
    <div className="w-full text-left space-y-5 pt-2 pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4.5 shadow-2xl flex items-center gap-2.5 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 bg-brand rounded-full shrink-0 animate-ping" />
          <span className="text-[11.5px] font-black text-left">{toastMessage}</span>
        </div>
      )}

      {/* Add Currency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white border border-[#E8DDFD] w-[380px] rounded-[24px] p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Habilitar Nova Moeda</span>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Código da Moeda (ex: GBP)</label>
                <input type="text" placeholder="GBP" className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Markup Inicial (%)</label>
                <input type="text" defaultValue="2.45" className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold" />
              </div>
            </div>

            <button 
              onClick={() => {
                setShowAddModal(false);
                triggerToast("Moeda adicionada para aprovação do Compliance.");
              }}
              className="w-full h-10 bg-brand text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-brand-dark transition-all"
            >
              Confirmar Adição
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-455">
        <Link href="/dashboard/settings" className="hover:text-brand flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Configurações
        </Link>
        <span className="text-slate-350">/</span>
        <span className="text-slate-700 font-bold">FX & Multimoeda</span>
      </div>

      {/* Page Header */}
      <header className="flex items-center justify-between w-full shrink-0 border-b border-[#E7E5EF] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-brand border border-violet-100/40 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[20px] 2xl:text-[22px] font-black tracking-tight text-slate-950">
              FX & Multimoeda
            </h1>
            <p className="text-slate-455 font-semibold text-[11.5px] 2xl:text-[12px] tracking-tight">
              Gerencie moedas, taxas de câmbio, markup, regras de liquidação e configurações por checkout.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex h-9 items-center justify-center gap-1.5 px-4 bg-brand hover:bg-brand-dark text-white rounded-xl text-[11px] font-black shadow-lg shadow-brand/15 transition-all uppercase tracking-tight"
        >
          <Plus className="w-4 h-4 shrink-0 text-white" />
          Nova moeda
        </button>
      </header>

      {/* Tab Navigation (9 Abas) */}
      <div className="flex items-center justify-between border-b border-[#E8DDFD]/65 pb-0 w-full shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-5">
          {[
            { id: 'visao_geral', label: 'Visão geral' },
            { id: 'taxas_ao_vivo', label: 'Taxas ao vivo' },
            { id: 'moedas', label: 'Moedas' },
            { id: 'markup_spread', label: 'Markup & Spread' },
            { id: 'trava_cambio', label: 'Trava de câmbio' },
            { id: 'liquidacao', label: 'Liquidação' },
            { id: 'por_checkout', label: 'Por checkout' },
            { id: 'regras_conversao', label: 'Regras & Conversão' },
            { id: 'historico', label: 'Histórico' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  triggerToast(`Navegando para: ${tab.label}`);
                }}
                className={cn(
                  "pb-2.5 text-[12px] font-black relative transition-all tracking-tight whitespace-nowrap cursor-pointer",
                  isActive ? "text-brand" : "text-slate-400 hover:text-slate-650"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-brand rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* visao_geral Tab Content */}
      {activeTab === 'visao_geral' && (
        <div className="space-y-5">
          
          {/* KPI Cards Row (5 compact cards inline) */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 w-full">
            
            {/* Card 1: Taxas ao vivo */}
            <div className="bg-white border border-[#E8DDFD]/60 rounded-2xl p-4 shadow-sm text-left relative flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Taxas ao vivo</span>
                <span className="text-[20px] font-black text-slate-900 leading-none block mt-2.5">8</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-1.5">moedas ativas</span>
                <span className="text-[8px] font-black text-slate-350 block mt-0.5 uppercase tracking-wider">Atualizado há 12s</span>
              </div>
              {/* Sparkline mini line chart SVG */}
              <div className="w-14 h-8 text-emerald-500 shrink-0">
                <svg viewBox="0 0 50 20" className="w-full h-full stroke-current fill-none stroke-[2.5] stroke-linecap-round">
                  <path d="M 0,15 L 10,13 L 20,16 L 30,10 L 40,12 L 50,5" />
                </svg>
              </div>
            </div>

            {/* Card 2: Markup médio */}
            <div className="bg-white border border-[#E8DDFD]/60 rounded-2xl p-4 shadow-sm text-left relative flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Markup médio</span>
                <span className="text-[20px] font-black text-slate-900 leading-none block mt-2.5">2,45%</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-1.5">Sobre taxa interbancária</span>
              </div>
              {/* Sparkline mini chart in purple */}
              <div className="w-14 h-8 text-brand shrink-0">
                <svg viewBox="0 0 50 20" className="w-full h-full stroke-current fill-none stroke-[2.5] stroke-linecap-round">
                  <path d="M 0,18 L 10,14 L 20,10 L 30,12 L 40,8 L 50,2" />
                </svg>
              </div>
            </div>

            {/* Card 3: Travas ativas */}
            <div className="bg-white border border-[#E8DDFD]/60 rounded-2xl p-4 shadow-sm text-left relative flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Travas ativas</span>
                <span className="text-[20px] font-black text-slate-900 leading-none block mt-2.5">3</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-1.5">Protegendo transações</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-brand flex items-center justify-center shrink-0 border border-violet-100/50">
                <Shield className="w-4 h-4" />
              </div>
            </div>

            {/* Card 4: Volume convertido (mês) */}
            <div className="bg-white border border-[#E8DDFD]/60 rounded-2xl p-4 shadow-sm text-left relative flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Volume convertido (mês)</span>
                <span className="text-[17px] font-black text-slate-900 leading-none block mt-2.5 truncate" title="US$ 1.842.569">US$ 1.842.569</span>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-[9px] font-black text-emerald-650 bg-emerald-50 px-1 py-0.2 rounded">+ 18,6%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">vs mês anterior</span>
                </div>
              </div>
            </div>

            {/* Card 5: Economia (best FX) */}
            <div className="bg-white border border-[#E8DDFD]/60 rounded-2xl p-4 shadow-sm text-left relative flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none">Economia (best FX)</span>
                <span className="text-[20px] font-black text-emerald-600 leading-none block mt-2.5">US$ 24.781</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-1.5">Versus taxa cartão</span>
              </div>
            </div>

          </div>

          {/* Primary Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start w-full">
            
            {/* Left Main Section (col-span-3) */}
            <div className="xl:col-span-3 space-y-4">
              
              {/* Live FX Rates Card */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Taxas de câmbio ao vivo</h3>
                    <p className="text-[9px] font-black text-emerald-650 flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Atualizado em 24/05/2025 14:32:12
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleUpdateRates}
                      className={cn(
                        "h-8 px-3 border border-[#E8DDFD] bg-white hover:bg-slate-50 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all",
                        isUpdating && "opacity-55"
                      )}
                    >
                      <RefreshCw className={cn("w-3.5 h-3.5 text-slate-400", isUpdating && "animate-spin")} />
                      Atualizar
                    </button>
                    
                    <button className="w-8 h-8 border border-[#E8DDFD] bg-white hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <Settings2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rates Table */}
                <div className="w-full overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left table-fixed">
                    <thead>
                      <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                        <th className="py-2 px-3 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[24%]">Moeda</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%]">Par</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[16%]">Taxa interbank</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[16%]">Nossa taxa</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[10%]">Markup</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%]">Variação 24h</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[10%]">Trava ativa</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%]">Status</th>
                        <th className="py-2 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[8%] text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] font-bold text-slate-700">
                      {exchangeRates.map((rate) => {
                        const isPositive = rate.var24h >= 0;
                        return (
                          <tr key={rate.code} className="hover:bg-slate-50/50 h-[50px]">
                            <td className="py-2 px-3 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-base leading-none shrink-0">{rate.flag}</span>
                                <div className="leading-tight truncate">
                                  <span className="font-extrabold text-slate-900 block truncate">{rate.code}</span>
                                  <span className="text-[9.5px] font-semibold text-slate-400 block truncate">{rate.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 px-2 font-mono text-[10px] text-slate-500">{rate.pair}</td>
                            <td className="py-2 px-2 font-mono text-[10.5px] text-slate-600">{rate.interbank.toFixed(4)}</td>
                            <td className="py-2 px-2 font-mono text-[11px] font-extrabold text-slate-900">{rate.ourRate.toFixed(4)}</td>
                            <td className="py-2 px-2 text-slate-500 font-extrabold">{rate.markup}</td>
                            <td className="py-2 px-2">
                              <span className={cn(
                                "inline-flex items-center text-[9.5px] font-extrabold leading-none",
                                isPositive ? "text-green-600" : "text-red-500"
                              )}>
                                {isPositive ? '▲' : '▼'} {Math.abs(rate.var24h).toFixed(2)}%
                              </span>
                            </td>
                            <td className="py-2 px-2 text-slate-500">{rate.lock}</td>
                            <td className="py-2 px-2">
                              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                {rate.status}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button className="text-slate-400 hover:text-brand font-black text-sm shrink-0">•••</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 text-center select-none">
                  <button className="text-brand font-black text-[10.5px] uppercase tracking-wider hover:underline">
                    Ver todas as moedas e taxas &gt;
                  </button>
                </div>
              </div>

              {/* Bottom 3 sub-cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                
                {/* 1. Configurações por checkout */}
                <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                      Configurações por checkout
                    </h4>
                    
                    <div className="divide-y divide-slate-100 text-[10px] font-semibold text-slate-500 mt-2.5">
                      {[
                        { chk: 'Checkout Padrão', active: 8, mk: '2,45%', lock: 'Ativa', liq: 'D+2' },
                        { chk: 'Checkout Internacional', active: 6, mk: '2,20%', lock: 'Ativa', liq: 'D+1' },
                        { chk: 'Marketplace', active: 5, mk: '2,60%', lock: 'Ativa', liq: 'D+3' },
                        { chk: 'Checkout Corporativo', active: 8, mk: '1,90%', lock: 'Ativa', liq: 'D+1' }
                      ].map((c) => (
                        <div key={c.chk} className="py-2 flex items-center justify-between gap-1.5">
                          <span className="font-extrabold text-slate-800 truncate flex-1 leading-tight">{c.chk}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="bg-slate-50 text-slate-600 px-1 py-0.2 rounded border border-slate-200/50 leading-none">{c.active} moedas</span>
                            <span className="font-black text-slate-800 leading-none">{c.mk}</span>
                            <span className="bg-violet-50 text-brand px-1 py-0.2 rounded border border-brand/10 leading-none">{c.liq}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <button className="text-brand font-black text-[9.5px] uppercase tracking-wider hover:underline">
                      Ver todas as configurações &gt;
                    </button>
                  </div>
                </div>

                {/* 2. Travas de câmbio ativas */}
                <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                      Travas de câmbio ativas
                    </h4>
                    
                    <div className="divide-y divide-slate-100 text-[10px] font-semibold text-slate-500 mt-2.5">
                      {[
                        { id: 'LCK-8732', ref: 'Pedido #93221', pair: 'USD/BRL', rate: '5,2450', exp: '2h 15m' },
                        { id: 'LCK-8721', ref: 'Pedido #93011', pair: 'EUR/BRL', rate: '5,7150', exp: '4h 42m' },
                        { id: 'LCK-8710', ref: 'Assinatura #7212', pair: 'GBP/BRL', rate: '6,6850', exp: '6h 08m' }
                      ].map((l) => (
                        <div key={l.id} className="py-2 flex items-center justify-between gap-1.5">
                          <div>
                            <span className="font-extrabold text-slate-850 block leading-tight">{l.id}</span>
                            <span className="text-[9px] text-slate-400 block leading-tight mt-0.5">{l.ref} • {l.pair}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-slate-900 block leading-tight">{l.rate}</span>
                            <span className="text-[9px] text-emerald-650 font-black uppercase tracking-wider block mt-0.5">Expira em: {l.exp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <button className="text-brand font-black text-[9.5px] uppercase tracking-wider hover:underline">
                      Ver todas as travas &gt;
                    </button>
                  </div>
                </div>

                {/* 3. Liquidação */}
                <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 flex flex-col justify-between text-left">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                      Liquidação
                    </h4>
                    
                    <div className="space-y-3.5 mt-3.5 text-[10px] font-bold text-slate-500">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-50 border border-slate-200/50 rounded flex items-center justify-center shrink-0">🕒</span>
                        <div className="leading-tight">
                          <span className="text-slate-400 block">Prazo padrão</span>
                          <span className="font-black text-slate-800 block mt-0.5">D+2 dias úteis</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-50 border border-slate-200/50 rounded flex items-center justify-center shrink-0">🌐</span>
                        <div className="leading-tight">
                          <span className="text-slate-400 block">Moeda base de liquidação</span>
                          <span className="font-black text-slate-800 block mt-0.5">BRL - Real Brasileiro</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-50 border border-slate-200/50 rounded flex items-center justify-center shrink-0">🏦</span>
                        <div className="leading-tight text-left min-w-0">
                          <span className="text-slate-400 block">Conta de liquidação</span>
                          <span className="font-black text-slate-800 block mt-0.5 truncate">Basileia Corp - Principal</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 bg-slate-50 border border-slate-200/50 rounded flex items-center justify-center shrink-0">📅</span>
                        <div className="leading-tight">
                          <span className="text-slate-400 block">Janelas de liquidação</span>
                          <span className="font-black text-slate-800 block mt-0.5">02:00, 08:00, 14:00 e 20:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <button className="text-brand font-black text-[9.5px] uppercase tracking-wider hover:underline">
                      Configurar liquidação &gt;
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Sidebar Section (col-span-1) */}
            <div className="space-y-4">
              
              {/* Resumo de FX */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Resumo de FX
                </h4>

                <div className="space-y-3 text-[11px] font-bold text-slate-500">
                  {[
                    { label: 'Moedas ativas', val: '8', bold: true },
                    { label: 'Travas ativas', val: '3', bold: true },
                    { label: 'Markup médio', val: '2,45%', bold: true },
                    { label: 'Melhor taxa vs cartão', val: '-3,12%', green: true },
                    { label: 'Cobertura cambial (mês)', val: '68%', bold: true }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between border-b border-slate-50 pb-2">
                      <span>{item.label}</span>
                      <span className={cn(
                        item.bold && "font-black text-slate-855",
                        item.green && "font-black text-emerald-650"
                      )}>{item.val}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => triggerToast("Relatório analítico completo do FX carregado.")}
                  className="w-full h-9 border border-[#E8DDFD] bg-white hover:bg-slate-50 text-brand rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  Ver relatório completo
                </button>
              </div>

              {/* Distribuição por moeda (mês) - CSS/SVG Donut Chart */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Distribuição por moeda (mês)
                </h4>

                <div className="flex items-center gap-4 py-1.5">
                  {/* SVG Donut Chart with precision paths */}
                  <div className="w-18 h-18 shrink-0 relative flex items-center justify-center select-none">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {/* Segment 1: USD 48% (color brand) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6C1D9F" strokeWidth="4" strokeDasharray="48 52" strokeDashoffset="0" />
                      {/* Segment 2: EUR 22% (color blue) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="22 78" strokeDashoffset="-48" />
                      {/* Segment 3: GBP 12% (color teal) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0D9488" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-70" />
                      {/* Segment 4: CAD 8% (color red) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-82" />
                      {/* Segment 5: Outros 10% (color gray) */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-90" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-black text-slate-800">FX</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex-1 space-y-1 text-[9.5px] font-bold text-slate-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#6C1D9F] rounded-full shrink-0" />
                        <span>USD</span>
                      </div>
                      <span className="font-extrabold text-slate-800">48%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full shrink-0" />
                        <span>EUR</span>
                      </div>
                      <span className="font-extrabold text-slate-800">22%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#0D9488] rounded-full shrink-0" />
                        <span>GBP</span>
                      </div>
                      <span className="font-extrabold text-slate-800">12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full shrink-0" />
                        <span>CAD</span>
                      </div>
                      <span className="font-extrabold text-slate-800">8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#E2E8F0] rounded-full shrink-0" />
                        <span>Outras</span>
                      </div>
                      <span className="font-extrabold text-slate-800">10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alertas & Monitoramento */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Alertas & Monitoramento
                </h4>

                <div className="space-y-3 text-[10.5px] font-bold text-slate-650 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Todas as moedas operando normalmente.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Alta volatilidade detectada no par GBP/BRL.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>Trava expira em 2h para o Pedido #93221.</span>
                  </div>
                </div>

                <div className="pt-2 text-center border-t border-slate-50">
                  <button className="text-brand font-black text-[9.5px] uppercase tracking-wider hover:underline">
                    Ver todos os alertas &gt;
                  </button>
                </div>
              </div>

              {/* Conversor rápido */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left">
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Conversor rápido
                </h4>

                <div className="space-y-3">
                  {/* De selector */}
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">De</label>
                    <div className="relative">
                      <select 
                        value={selectedConvertCurrency}
                        onChange={(e) => setSelectedConvertCurrency(e.target.value)}
                        className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none appearance-none cursor-pointer h-9.5"
                      >
                        {exchangeRates.map(c => (
                          <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Icon Switcher */}
                  <div className="flex justify-center -my-1 shrink-0">
                    <div className="w-7 h-7 rounded-full bg-brand-soft/20 text-brand border border-brand/10 flex items-center justify-center">
                      <ArrowRightLeft className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>

                  {/* Para selector */}
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">Para</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none appearance-none cursor-pointer h-9.5" disabled>
                        <option>BRL - Real Brasileiro</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Value input and equals */}
                  <div className="grid grid-cols-2 gap-2 pt-2 items-center">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Quantidade</span>
                      <input 
                        type="number" 
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-extrabold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/35 h-9.5" 
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block text-right">Equivale em BRL</span>
                      <div className="w-full bg-[#FAF8FF] border border-[#E8DDFD]/60 rounded-xl px-3 py-2 text-xs font-black text-right text-brand h-9.5 flex items-center justify-end">
                        R$ {convertedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Details subtext */}
                  <div className="pt-2 border-t border-slate-50 text-[9px] font-bold text-slate-450 leading-relaxed space-y-0.5">
                    <p>Taxa aplicada: 1 {selectedConvertCurrency} = {exchangeRates.find(c => c.code === selectedConvertCurrency)?.ourRate.toFixed(4)} BRL</p>
                    <p>Markup: {exchangeRates.find(c => c.code === selectedConvertCurrency)?.markup}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* RENDER FALLBACK TABS */}
      {activeTab !== 'visao_geral' && (
        <div className="bg-white border border-[#E8DDFD]/60 rounded-[24px] p-20 flex flex-col items-center justify-center text-center gap-3.5 shadow-sm h-[400px]">
          <div className="w-12 h-12 rounded-full bg-[#FAF8FF] border border-[#E8DDFD] flex items-center justify-center text-violet-400">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-slate-900 font-black text-base">Aba em Desenvolvimento</h3>
            <p className="text-slate-550 text-xs mt-1 max-w-sm font-semibold leading-relaxed">
              Esta seção das configurações de FX está sendo compilada pela inteligência de moedas. A Visão Geral contém o centro operacional completo em tempo real.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('visao_geral')}
            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all shadow-md"
          >
            Voltar para Visão geral
          </button>
        </div>
      )}

    </div>
  );
}
