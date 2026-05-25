'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Monitor, 
  Smartphone, 
  RotateCcw, 
  RotateCw, 
  Grid, 
  Eye, 
  Search, 
  Filter, 
  Layers, 
  Trash2, 
  Share2, 
  Info,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronLeft,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

type DeviceMode = 'desktop' | 'mobile';
type CheckoutState = 'padrao' | 'carregando' | 'erro' | 'sucesso';
type StudioTab = 'blocos' | 'estilos' | 'camadas';
type PropertyTab = 'conteudo' | 'estilo' | 'avancado';

export default function CheckoutStudioPage() {
  // Device Preview Switcher
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  
  // Interactive Properties linked to Canvas Hero Block
  const [heroTitle, setHeroTitle] = useState('Transforme conhecimento em resultado');
  const [heroSubtitle, setHeroSubtitle] = useState('Aprenda com quem faz e acelere sua carreira com acesso vitalício ao conteúdo completo.');
  const [heroBadge, setHeroBadge] = useState('Pagamento 100% seguro');
  const [ctaText, setCtaText] = useState('Pagar com PIX');
  
  // Checkout State Swapper (Interactive Mock Simulation)
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('padrao');
  
  // Active Panel Tabs
  const [activeLeftTab, setActiveLeftTab] = useState<StudioTab>('blocos');
  const [activePropertyTab, setActivePropertyTab] = useState<PropertyTab>('conteudo');
  
  // Interactive Active Block Selection
  const [selectedBlock, setSelectedBlock] = useState<'hero' | 'checkout' | 'footer'>('hero');
  
  // Zoom Selector State
  const [zoom, setZoom] = useState(100);
  
  // Block visibility toggles
  const [showHeroDesktop, setShowHeroDesktop] = useState(true);
  const [showHeroMobile, setShowHeroMobile] = useState(true);

  // Search component block
  const [searchQuery, setSearchQuery] = useState('');

  // Toast / Alerts simulation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePublish = () => {
    setLoadingAction("Publicando");
    triggerToast("Iniciando publicação do Checkout Pagar.Me Padrão...");
    setTimeout(() => {
      setLoadingAction(null);
      triggerToast("Checkout v3.4.2 publicado com sucesso no ambiente de produção!");
    }, 1800);
  };

  const handleSaveDraft = () => {
    setLoadingAction("Salvando");
    setTimeout(() => {
      setLoadingAction(null);
      triggerToast("Rascunho salvo com sucesso no Hub Basileia!");
    }, 1000);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F8F6FC] overflow-hidden select-none relative text-left">
      
      {/* Toast Alert Indicator */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-60 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-2.5 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
          <span className="w-2.5 h-2.5 bg-brand rounded-full shrink-0 animate-ping" />
          <span className="text-[11.5px] font-black text-left">{toastMessage}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loadingAction && (
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-white border-t-brand rounded-full animate-spin" />
          <span className="text-white text-xs font-black uppercase tracking-wider">{loadingAction} no Checkout Studio...</span>
        </div>
      )}

      {/* Studio Top Control bar */}
      <header className="h-[52px] bg-white border-b border-[#E8DDFD]/65 px-4 flex items-center justify-between shrink-0">
        
        {/* Left Side: Breadcrumb & Title */}
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/checkouts"
            className="w-7 h-7 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand hover:bg-slate-50 transition-colors"
            title="Voltar para a listagem"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span>Checkouts</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-brand">Checkout Studio</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-500">Checkout Pagar.Me Padrão</span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-slate-900">Checkout Studio</span>
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse mt-0.5" />
              </div>
              
              {/* Badges */}
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                  ● Rascunho
                </span>
                <span className="text-[8px] font-black text-slate-450 bg-slate-50 border border-slate-200 px-1 rounded">
                  v3.4.2
                </span>
                <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-650 bg-emerald-50/50 border border-emerald-100/40 px-1 py-0.2 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span>Salvo há 2 min por Vinicius Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSaveDraft}
            className="h-8.5 px-3.5 bg-white border border-[#E8DDFD] hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Salvar rascunho
          </button>
          
          <button 
            onClick={() => triggerToast("Gerando simulador de visualização real do checkout...")}
            className="h-8.5 px-3.5 bg-white border border-[#E8DDFD] hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            Pré-visualizar
          </button>

          <button 
            onClick={() => triggerToast("Link público de preview copiado! Compartilhe com sua equipe.")}
            className="h-8.5 px-3.5 bg-white border border-[#E8DDFD] hover:bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            Compartilhar preview
          </button>

          {/* Publicar solid purple split-dropdown */}
          <div className="flex items-center">
            <button 
              onClick={handlePublish}
              className="h-8.5 px-4 bg-brand hover:bg-brand-dark text-white rounded-l-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand/10 transition-all border-r border-white/20"
            >
              Publicar
            </button>
            <button 
              onClick={() => triggerToast("Opções de publicação: Produção, Sandbox, Agendada.")}
              className="h-8.5 px-2 bg-brand hover:bg-brand-dark text-white rounded-r-xl cursor-pointer flex items-center justify-center transition-all"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </header>

      {/* Main Studio Editor Workspace layout */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Column 1: Left component block selector (232px wide) */}
        <aside className="w-[232px] bg-white border-r border-[#E8DDFD]/65 flex flex-col justify-between shrink-0">
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Panel Tabs selector */}
            <div className="flex border-b border-[#E8DDFD]/45 h-10 shrink-0">
              {[
                { id: 'blocos', label: 'Blocos' },
                { id: 'estilos', label: 'Estilos' },
                { id: 'camadas', label: 'Camadas' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id as StudioTab)}
                  className={cn(
                    "flex-1 h-full text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                    activeLeftTab === tab.id 
                      ? "border-brand text-brand" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Component Search Input */}
            <div className="p-3 border-b border-slate-50 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar componentes..."
                  className="w-full pl-8 pr-7 bg-slate-50 border border-[#E8DDFD]/60 rounded-lg text-[11px] font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all h-8.5"
                />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand cursor-pointer">
                  <Filter className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Scrollable drag & drop block list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              
              {/* Category: Estrutura */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block text-left">Estrutura</span>
                <div className="space-y-1">
                  {[
                    { id: 'hero', name: 'Hero', active: selectedBlock === 'hero' },
                    { id: 'etapas', name: 'Etapas', active: false }
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'hero') setSelectedBlock('hero');
                        triggerToast(`Bloco ${item.name} selecionado no canvas`);
                      }}
                      className={cn(
                        "p-2 bg-slate-50/50 border border-slate-100 hover:border-brand/30 rounded-xl flex items-center justify-between text-slate-700 cursor-pointer transition-all",
                        item.active && "border-brand/40 bg-brand-soft/20 text-brand"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white border border-[#E8DDFD]/60 rounded flex items-center justify-center text-slate-400">
                          <Layers className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-350 cursor-grab px-1">::</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Conteúdo */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block text-left">Conteúdo</span>
                <div className="space-y-1">
                  {[
                    { id: 'resumo', name: 'Resumo do pedido' },
                    { id: 'produtos', name: 'Produtos' },
                    { id: 'beneficios', name: 'Benefícios' },
                    { id: 'depoimentos', name: 'Depoimentos' },
                    { id: 'garantia', name: 'Garantia' },
                    { id: 'faq', name: 'FAQ' }
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => triggerToast(`Visualização rápida do bloco ${item.name}`)}
                      className="p-2 bg-slate-50/50 border border-slate-100 hover:border-brand/30 rounded-xl flex items-center justify-between text-slate-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white border border-[#E8DDFD]/60 rounded flex items-center justify-center text-slate-400">
                          <Layers className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-350 cursor-grab px-1">::</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Conversão */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block text-left">Conversão</span>
                <div className="space-y-1">
                  {[
                    { id: 'formulario', name: 'Formulário', active: selectedBlock === 'checkout' },
                    { id: 'cupom', name: 'Cupom' },
                    { id: 'cta', name: 'CTA / Botão' }
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'formulario') setSelectedBlock('checkout');
                        triggerToast(`Bloco ${item.name} selecionado no canvas`);
                      }}
                      className={cn(
                        "p-2 bg-slate-50/50 border border-slate-100 hover:border-brand/30 rounded-xl flex items-center justify-between text-slate-700 cursor-pointer transition-all",
                        item.active && "border-brand/40 bg-brand-soft/20 text-brand"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white border border-[#E8DDFD]/60 rounded flex items-center justify-center text-slate-400">
                          <Layers className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-350 cursor-grab px-1">::</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Pagamento */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block text-left">Pagamento</span>
                <div className="space-y-1">
                  {['PIX', 'Cartão', 'Boleto'].map((item) => (
                    <div 
                      key={item}
                      onClick={() => triggerToast(`Opções de pagamento: ${item}`)}
                      className="p-2 bg-slate-50/50 border border-slate-100 hover:border-brand/30 rounded-xl flex items-center justify-between text-slate-700 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white border border-[#E8DDFD]/60 rounded flex items-center justify-center text-slate-400">
                          <Layers className="w-3 h-3" />
                        </div>
                        <span className="text-[11px] font-bold">{item}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-350 cursor-grab px-1">::</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category: Rodapé */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block text-left">Rodapé</span>
                <div className="space-y-1">
                  <div 
                    onClick={() => {
                      setSelectedBlock('footer');
                      triggerToast("Bloco Rodapé selecionado");
                    }}
                    className={cn(
                      "p-2 bg-slate-50/50 border border-slate-100 hover:border-brand/30 rounded-xl flex items-center justify-between text-slate-700 cursor-pointer transition-all",
                      selectedBlock === 'footer' && "border-brand/40 bg-brand-soft/20 text-brand"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-white border border-[#E8DDFD]/60 rounded flex items-center justify-center text-slate-400">
                        <Layers className="w-3 h-3" />
                      </div>
                      <span className="text-[11px] font-bold">Rodapé</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-350 cursor-grab px-1">::</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Arraste os blocos info footer */}
          <div className="p-3 border-t border-slate-50 bg-slate-50/20 text-center shrink-0">
            <span className="text-[9.5px] font-black text-slate-400 flex items-center justify-center gap-1">
              <Info className="w-3 h-3 text-slate-300" />
              Arraste os blocos para o canvas
            </span>
          </div>

        </aside>

        {/* Column 2: Center visual simulator canvas workspace */}
        <main className="flex-1 bg-[#F1EEF6] flex flex-col overflow-hidden relative">
          
          {/* Workspace Controls Header */}
          <div className="h-10 border-b border-[#E8DDFD]/65 bg-white px-4 flex items-center justify-between shrink-0 select-none">
            
            {/* Desktop / Mobile Swappers */}
            <div className="flex items-center gap-1 bg-[#FAF8FF] p-0.5 rounded-lg border border-[#E8DDFD]/60">
              <button
                onClick={() => {
                  setDeviceMode('desktop');
                  triggerToast("Simulador ajustado para Desktop");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[9.5px] font-black uppercase tracking-tight flex items-center gap-1 transition-all cursor-pointer",
                  deviceMode === 'desktop' ? "bg-white text-brand shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => {
                  setDeviceMode('mobile');
                  triggerToast("Simulador ajustado para Mobile");
                }}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[9.5px] font-black uppercase tracking-tight flex items-center gap-1 transition-all cursor-pointer",
                  deviceMode === 'mobile' ? "bg-white text-brand shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
              <button 
                onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                className="w-5 h-5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200/50 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-10 text-center">{zoom}%</span>
              <button 
                onClick={() => setZoom(prev => Math.min(150, prev + 10))}
                className="w-5 h-5 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200/50 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Alignment / Options */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border-r border-slate-150 pr-3">
                <button 
                  onClick={() => triggerToast("Desfazer ação do editor")}
                  className="w-6 h-6 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => triggerToast("Refazer ação do editor")}
                  className="w-6 h-6 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded flex items-center justify-center cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => triggerToast("Mostrar/Ocultar linhas de grid do canvas")}
                  className="w-6 h-6 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded flex items-center justify-center cursor-pointer"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => triggerToast("Exibir preview limpo do checkout")}
                  className="w-6 h-6 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded flex items-center justify-center cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Actual Simulator Canvas Area */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start no-scrollbar">
            
            <div 
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className={cn(
                "bg-white shadow-2xl transition-all duration-300 relative rounded-2xl overflow-hidden border border-slate-200/50 flex flex-col justify-between shrink-0",
                deviceMode === 'desktop' ? "w-[780px] min-h-[520px]" : "w-[360px] min-h-[640px]"
              )}
            >
              
              {/* Simulator Outer Wrapper */}
              <div className="flex-1 flex flex-col">
                
                {/* 1. HERO BLOCK PREVIEW - Interactive (Purple hover/selected outline) */}
                {((deviceMode === 'desktop' && showHeroDesktop) || (deviceMode === 'mobile' && showHeroMobile)) && (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBlock('hero');
                    }}
                    className={cn(
                      "p-6 relative transition-all text-left",
                      selectedBlock === 'hero' 
                        ? "ring-2 ring-brand ring-offset-[-2px] bg-brand-soft/5" 
                        : "hover:ring-1 hover:ring-brand/40"
                    )}
                  >
                    {/* Selected corner handles */}
                    {selectedBlock === 'hero' && (
                      <>
                        <span className="absolute -top-1 -left-1 w-2 h-2 bg-brand rounded-full" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full" />
                        <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-brand rounded-full" />
                        <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-brand rounded-full" />
                        
                        {/* Floating Block toolbar at top right */}
                        <div className="absolute right-4 top-[-14px] bg-brand text-white rounded-lg p-0.5 px-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg select-none z-10 animate-in fade-in duration-200">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerToast("Editando propriedades do Hero");
                            }}
                            className="hover:underline flex items-center gap-0.5"
                          >
                            Editar
                          </button>
                          <span>|</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerToast("Bloco duplicado no rodapé do canvas!");
                            }}
                            className="hover:underline"
                          >
                            Duplicar
                          </button>
                          <span>|</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deviceMode === 'desktop') setShowHeroDesktop(false);
                              else setShowHeroMobile(false);
                              triggerToast("Hero block ocultado.");
                            }}
                            className="hover:underline"
                          >
                            Ocultar
                          </button>
                          <span>|</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerToast("Para deletar blocos estruturais, altere a matriz principal.");
                            }}
                            className="text-red-300 hover:text-white"
                          >
                            <Trash2 className="w-2.5 h-2.5 inline-block" />
                          </button>
                        </div>
                      </>
                    )}

                    {/* Content of the Hero block (Desktop vs Mobile layout) */}
                    <div className={cn(
                      "grid gap-6 items-center",
                      deviceMode === 'desktop' ? "grid-cols-5" : "grid-cols-1"
                    )}>
                      
                      {/* Left: Info columns */}
                      <div className="col-span-3 space-y-3.5">
                        <div className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          <span>🛡️</span>
                          <span>{heroBadge}</span>
                        </div>

                        <h2 className="text-xl 2xl:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                          {heroTitle}
                        </h2>

                        <p className="text-slate-500 font-semibold text-xs leading-relaxed">
                          {heroSubtitle}
                        </p>

                        <div className="flex flex-wrap gap-2 text-[8.5px] font-black uppercase tracking-wider">
                          <span className="bg-violet-50 text-brand border border-brand/10 px-2 py-0.5 rounded-lg">
                            ✓ Acesso vitalício
                          </span>
                          <span className="bg-violet-50 text-brand border border-brand/10 px-2 py-0.5 rounded-lg">
                            ✓ Garantia 7 dias
                          </span>
                          <span className="bg-violet-50 text-brand border border-brand/10 px-2 py-0.5 rounded-lg">
                            ✓ Suporte dedicado
                          </span>
                        </div>
                      </div>

                      {/* Right: Course Card (Visual Demonstration) */}
                      <div className="col-span-2">
                        <div className="bg-gradient-to-br from-brand/90 to-brand-accent rounded-2xl p-4 text-white relative shadow-xl overflow-hidden min-h-[148px] flex flex-col justify-between text-left">
                          
                          {/* Inner premium illustration glows */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                          
                          <div className="space-y-1">
                            <span className="text-[8px] font-black bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-wider">Curso</span>
                            <h3 className="text-sm font-black leading-tight tracking-tight">Estrutura Financeira</h3>
                            <p className="text-[10px] text-white/70 font-semibold leading-none">Do básico ao avançado</p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {/* Small mock Avatar */}
                              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white/50 flex items-center justify-center text-[10px] font-black text-slate-800 shrink-0">
                                VA
                              </div>
                              <div className="leading-none text-left">
                                <p className="text-[10px] font-bold text-white/80">+12k alunos</p>
                                <p className="text-[9px] font-black text-amber-300 mt-0.5">★★★★★ 4.9 (2.341)</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* 2. CHECKOUT PAYMENT BLOCK - Split Steps */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlock('checkout');
                  }}
                  className={cn(
                    "p-6 border-t border-slate-100 relative transition-all text-left",
                    selectedBlock === 'checkout' 
                      ? "ring-2 ring-brand ring-offset-[-2px] bg-brand-soft/5" 
                      : "hover:ring-1 hover:ring-brand/40"
                  )}
                >
                  {/* Selected outline corner handles */}
                  {selectedBlock === 'checkout' && (
                    <>
                      <span className="absolute -top-1 -left-1 w-2 h-2 bg-brand rounded-full" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full" />
                      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-brand rounded-full" />
                      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-brand rounded-full" />
                    </>
                  )}

                  {/* Interactive checkout payment grid layout */}
                  <div className={cn(
                    "grid gap-6 items-stretch",
                    deviceMode === 'desktop' ? "grid-cols-2" : "grid-cols-1"
                  )}>
                    
                    {/* Step 1: Seus dados */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center font-black text-[10px] shrink-0">
                          1
                        </span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Seus dados
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Nome completo</label>
                          <input 
                            type="text" 
                            disabled 
                            placeholder="Digite seu nome completo" 
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">E-mail</label>
                          <input 
                            type="email" 
                            disabled 
                            placeholder="seu@email.com" 
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider">WhatsApp</label>
                          <input 
                            type="text" 
                            disabled 
                            placeholder="(11) 99999-9999" 
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-bold" 
                          />
                        </div>
                      </div>
                      
                      <span className="text-[8.5px] font-bold text-slate-400 flex items-center gap-1 mt-2 block">
                        🛡 Seus dados estão protegidos e não serão compartilhados.
                      </span>
                    </div>

                    {/* Step 2: Escolha a forma de pagamento */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-brand text-white rounded-full flex items-center justify-center font-black text-[10px] shrink-0">
                          2
                        </span>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Forma de pagamento
                        </h4>
                      </div>

                      {/* Payment method tabs */}
                      <div className="grid grid-cols-3 gap-1 bg-slate-50 border border-slate-200/70 p-0.5 rounded-xl">
                        <button className="py-1 bg-white text-brand border border-slate-100 shadow-sm rounded-lg text-[9.5px] font-black uppercase tracking-tight flex flex-col items-center">
                          <span>PIX</span>
                          <span className="text-[6.5px] text-emerald-600 font-extrabold lowercase leading-none mt-0.5">5% desc.</span>
                        </button>
                        <button className="py-1 text-slate-500 hover:text-slate-800 text-[9.5px] font-black uppercase tracking-tight flex flex-col items-center">
                          <span>Cartão</span>
                          <span className="text-[6.5px] text-slate-400 font-bold lowercase leading-none mt-0.5">Até 12x</span>
                        </button>
                        <button className="py-1 text-slate-500 hover:text-slate-800 text-[9.5px] font-black uppercase tracking-tight flex flex-col items-center">
                          <span>Boleto</span>
                          <span className="text-[6.5px] text-slate-400 font-bold lowercase leading-none mt-0.5">À vista</span>
                        </button>
                      </div>

                      {/* Payment method content (Simulating States) */}
                      {checkoutState === 'padrao' && (
                        <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-2xl text-center space-y-3">
                          <p className="text-[10px] text-slate-500 font-bold leading-normal">
                            Pague com PIX e confirme na hora.<br/>Aprovação imediata e liberação do acesso em bons segundos.
                          </p>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-left">
                            <div>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Valor com desconto</span>
                              <span className="text-[14.5px] font-black text-emerald-600 leading-tight block mt-0.5">R$ 284,05</span>
                              <span className="text-[7.5px] font-bold text-slate-400 block mt-0.2">Economia de R$ 14,95 (5%)</span>
                            </div>

                            {/* Dummy QR Code */}
                            <div className="w-12 h-12 bg-white border border-slate-200 p-0.5 rounded-lg flex items-center justify-center shrink-0">
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded">
                                <span className="text-white text-[8px] font-black">QR</span>
                              </div>
                            </div>
                          </div>

                          <button 
                            disabled
                            className="w-full h-9 bg-brand text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1"
                          >
                            ⚡ {ctaText}
                          </button>
                          <span className="text-[8px] font-bold text-slate-400 uppercase block">Ou escaneie o QR Code com o app do seu banco</span>
                        </div>
                      )}

                      {checkoutState === 'carregando' && (
                        <div className="p-6 border border-slate-100 bg-slate-50/30 rounded-2xl flex flex-col items-center justify-center gap-3 text-center min-h-[175px]">
                          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] font-black uppercase text-slate-450 tracking-wider animate-pulse">Processando pagamento...</span>
                        </div>
                      )}

                      {checkoutState === 'erro' && (
                        <div className="p-4 border border-red-100 bg-red-50/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-center min-h-[175px]">
                          <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs">⚠️</span>
                          <div>
                            <h4 className="text-[11px] font-black text-red-700 uppercase">Transação recusada</h4>
                            <p className="text-[9.5px] text-red-650 font-bold mt-1 leading-normal">O limite de crédito do seu cartão é insuficiente. Escolha PIX para liberação instantânea com 5% off!</p>
                          </div>
                        </div>
                      )}

                      {checkoutState === 'sucesso' && (
                        <div className="p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-center min-h-[175px]">
                          <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</span>
                          <div>
                            <h4 className="text-[11.5px] font-black text-emerald-700 uppercase">Pagamento aprovado!</h4>
                            <p className="text-[9.5px] text-emerald-650 font-bold mt-1 leading-normal">Sua licença foi ativada. As credenciais de acesso vitalício foram enviadas para seu e-mail!</p>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Absolute base security trust badges inside checkout block */}
                  <div className="grid grid-cols-3 gap-2 mt-5 pt-3 border-t border-slate-100 text-left text-[9px] font-bold text-slate-450 leading-relaxed">
                    <div>
                      <span className="font-extrabold text-slate-800 block">🛡 Garantia incondicional</span>
                      <span>7 dias para pedir reembolso sem perguntas.</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 block">🔒 Pagamento seguro</span>
                      <span>Ambiente 100% seguro com criptografia.</span>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 block">👁 Privacidade protegida</span>
                      <span>Seus dados sempre em boas mãos.</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* 3. SIMULATOR FOOTER BLOCK */}
              <footer 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlock('footer');
                }}
                className={cn(
                  "p-4 border-t border-slate-100 bg-slate-50/30 text-center shrink-0 relative transition-all",
                  selectedBlock === 'footer' 
                    ? "ring-2 ring-brand ring-offset-[-2px] bg-brand-soft/5" 
                    : "hover:ring-1 hover:ring-brand/40"
                )}
              >
                {selectedBlock === 'footer' && (
                  <>
                    <span className="absolute -top-1 -left-1 w-2 h-2 bg-brand rounded-full" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full" />
                    <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-brand rounded-full" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-brand rounded-full" />
                  </>
                )}

                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Ao finalizar a compra, você concorda com nossos Termos de Uso e Política de Privacidade.
                </span>
              </footer>

            </div>

          </div>

        </main>

        {/* Column 3: Right selected component properties editor sidebar (280px wide) */}
        <aside className="w-[280px] bg-white border-l border-[#E8DDFD]/65 flex flex-col overflow-hidden shrink-0 select-none">
          
          {/* Properties Header */}
          <div className="p-4 border-b border-slate-50 flex items-center justify-between shrink-0 text-left">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider leading-none">Propriedades</h3>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                Bloco: {selectedBlock} | ID: #{selectedBlock}-01
              </p>
            </div>
            <button 
              onClick={() => triggerToast("Selecione um bloco no canvas para configurar")}
              className="p-1 text-slate-350 hover:text-slate-650 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Properties Sub-tabs */}
          <div className="flex border-b border-[#E8DDFD]/45 h-9 shrink-0">
            {[
              { id: 'conteudo', label: 'Conteúdo' },
              { id: 'estilo', label: 'Estilo' },
              { id: 'avancado', label: 'Avançado' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePropertyTab(tab.id as PropertyTab)}
                className={cn(
                  "flex-1 h-full text-[10px] font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                  activePropertyTab === tab.id 
                    ? "border-brand text-brand" 
                    : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Properties active content form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left no-scrollbar">
            
            {activePropertyTab === 'conteudo' && (
              <>
                {/* 1. RENDER HERO BLOCK PROPERTIES FORM */}
                {selectedBlock === 'hero' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-1">Conteúdo</span>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Título do Hero</label>
                      <input 
                        type="text" 
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="w-full bg-white border border-[#E8DDFD] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/30 h-9" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Subtítulo do Hero</label>
                      <textarea 
                        value={heroSubtitle}
                        rows={3}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full bg-white border border-[#E8DDFD] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/30 leading-relaxed" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Badge do Hero</label>
                      <input 
                        type="text" 
                        value={heroBadge}
                        onChange={(e) => setHeroBadge(e.target.value)}
                        className="w-full bg-white border border-[#E8DDFD] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/30 h-9" 
                      />
                    </div>

                    {/* Image picker mockup */}
                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Imagem / Ilustração</label>
                      <div className="p-2 border border-[#E8DDFD] rounded-xl flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/50 flex items-center justify-center text-slate-400 shrink-0">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="leading-none text-left truncate min-w-0">
                            <span className="text-[9.5px] font-black text-slate-800 truncate block">curso-estrategia-financeira.png</span>
                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">1200x800px</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerToast("Imagem removida do Hero block.")}
                          className="p-1 text-slate-350 hover:text-red-500 shrink-0 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. RENDER CHECKOUT BLOCK PROPERTIES FORM */}
                {selectedBlock === 'checkout' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-1">Configuração do Checkout</span>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider">Texto do Botão (CTA)</label>
                      <input 
                        type="text" 
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full bg-white border border-[#E8DDFD] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/30 h-9" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Link / Ação</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-[#E8DDFD] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/30 h-9 appearance-none cursor-pointer">
                          <option>Abrir modal PIX</option>
                          <option>Redirecionar para gateway externo</option>
                          <option>Confirmar e-mail</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. RENDER FOOTER BLOCK PROPERTIES FORM */}
                {selectedBlock === 'footer' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-1">Configuração do Rodapé</span>

                    <div className="space-y-1.5">
                      <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Termos e Condições</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-[#E8DDFD] rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand/30 h-9 appearance-none cursor-pointer">
                          <option>Padrão Basileia Pay</option>
                          <option>Personalizado para Minha Loja</option>
                          <option>Sem termos de uso</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* CHECKOUT STATE SWAPPER - Simulation */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Estados do checkout</span>
                  
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'padrao', label: 'Padrão' },
                      { id: 'carregando', label: 'Carregando' },
                      { id: 'erro', label: 'Erro' },
                      { id: 'sucesso', label: 'Sucesso' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setCheckoutState(st.id as CheckoutState);
                          triggerToast(`Estado simulado do checkout: ${st.label}`);
                        }}
                        className={cn(
                          "h-8 px-2 rounded-lg text-[9px] font-black uppercase border transition-all cursor-pointer",
                          checkoutState === st.id 
                            ? "bg-brand text-white border-brand shadow-sm shadow-brand/10" 
                            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600"
                        )}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* VISIBILIDADE */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Visibilidade</span>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600">Mostrar no desktop</span>
                      <button 
                        onClick={() => {
                          setShowHeroDesktop(!showHeroDesktop);
                          triggerToast(`Hero block ${!showHeroDesktop ? 'visível' : 'oculto'} no Desktop.`);
                        }}
                        className={cn(
                          "w-8 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0",
                          showHeroDesktop ? "bg-brand" : "bg-slate-200"
                        )}
                      >
                        <div className={cn("w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200", showHeroDesktop && "translate-x-4")} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600">Mostrar no mobile</span>
                      <button 
                        onClick={() => {
                          setShowHeroMobile(!showHeroMobile);
                          triggerToast(`Hero block ${!showHeroMobile ? 'visível' : 'oculto'} no Mobile.`);
                        }}
                        className={cn(
                          "w-8 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0",
                          showHeroMobile ? "bg-brand" : "bg-slate-200"
                        )}
                      >
                        <div className={cn("w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-200", showHeroMobile && "translate-x-4")} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* PUBLICAÇÃO */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status do bloco</span>
                  <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                    Ativo
                  </span>
                </div>
              </>
            )}

            {activePropertyTab === 'estilo' && (
              <div className="space-y-4 animate-in fade-in duration-200 text-slate-450 font-bold text-xs text-center py-6">
                <p>Configurações de Estilos Visuais:</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="p-2 border border-slate-100 rounded-lg hover:border-brand/20 cursor-pointer">
                    <span className="text-[8px] font-black block uppercase text-slate-400">Cor Primária</span>
                    <div className="w-full h-4 bg-brand rounded mt-1.5" />
                  </div>
                  <div className="p-2 border border-slate-100 rounded-lg hover:border-brand/20 cursor-pointer">
                    <span className="text-[8px] font-black block uppercase text-slate-400">Borda Arred.</span>
                    <span className="text-[10px] font-black text-slate-800 block mt-1.5">22px</span>
                  </div>
                </div>
              </div>
            )}

            {activePropertyTab === 'avancado' && (
              <div className="space-y-4 animate-in fade-in duration-200 text-slate-450 font-bold text-xs text-center py-6">
                <p>Propriedades Avançadas & Código:</p>
                <div className="p-2 border border-slate-100 bg-slate-50/50 rounded-lg text-left mt-2 font-mono text-[9px] text-slate-600">
                  {"class: 'hero-block-main',\nid: '#hero-01',\ntype: 'structural'"}
                </div>
              </div>
            )}

          </div>

        </aside>

      </div>

    </div>
  );
}
