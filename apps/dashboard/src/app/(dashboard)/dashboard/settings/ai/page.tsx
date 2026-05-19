'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  BrainCircuit, 
  MessageSquare, 
  FileText, 
  ShieldAlert, 
  Terminal, 
  Wrench, 
  Layers, 
  HelpCircle,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ActiveTab = 
  | 'visao_geral' 
  | 'provedores' 
  | 'modelos' 
  | 'atribui_feature' 
  | 'builder_ia' 
  | 'custos_uso' 
  | 'logs_auditoria' 
  | 'configuracoes';

export default function AiSettingsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('visao_geral');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // IA Connected Providers initial mocks
  const [providers, setProviders] = useState([
    { id: 'openai', name: 'OpenAI', badge: 'Pago', model: 'gpt-4o', modelBadge: 'Ativo', cost: '$0.005 / 1K tokens', costSub: 'Entrada - $0.015 / 1K saída', status: 'Ativo', fallback: 'Anthropic Claude 3.5', endpoint: 'https://api.openai.com/v1', region: 'us-east-1', isPaid: true },
    { id: 'anthropic', name: 'Anthropic', badge: 'Pago', model: 'claude-3-5-sonnet', modelBadge: 'Standby', cost: '$0.003 / 1K tokens', costSub: 'Entrada - $0.015 / 1K saída', status: 'Ativo', fallback: 'Google Gemini 1.5 Pro', endpoint: 'https://api.anthropic.com/v1', region: 'us-east-1', isPaid: true },
    { id: 'google', name: 'Google AI', badge: 'Pago', model: 'gemini-1.5-pro', modelBadge: 'Backup', cost: '$0.00125 / 1K tokens', costSub: 'Entrada - $0.005 / 1K saída', status: 'Ativo', fallback: 'OpenAI GPT-3.5 Turbo', endpoint: 'https://generativelanguage.googleapis.com/v1', region: 'us-central1', isPaid: true },
    { id: 'mistral', name: 'Mistral AI', badge: 'Gratuito', model: 'mistral-7b-instruct', modelBadge: 'Reserva', cost: 'Gratuito', costSub: 'Uso limitado', status: 'Ativo', fallback: '—', endpoint: 'https://api.mistral.ai/v1', region: 'eu-west-1', isPaid: false },
    { id: 'llama', name: 'Llama (Local)', badge: 'Gratuito', model: 'llama-3-8b-instruct', modelBadge: 'Reserva', cost: 'Gratuito', costSub: 'Self-hosted', status: 'Ativo', fallback: 'Mistral 7B Instruct', endpoint: 'http://10.0.0.45:11434/v1', region: 'local', isPaid: false }
  ]);

  // Model assigned to features states (Interactive simulation!)
  const [features, setFeatures] = useState([
    { 
      id: 'bci', 
      name: 'BCI - Análises', 
      desc: 'Gera análises, insights e relatórios inteligentes.', 
      model: 'gpt-4o', 
      modelBadge: 'Ativo', 
      provider: 'OpenAI', 
      cost: '$0.005 / 1K in, $0.015 / 1K out', 
      fallback: 'Claude 3.5 Sonnet',
      icon: BrainCircuit
    },
    { 
      id: 'chat', 
      name: 'Assistente - Chat', 
      desc: 'Responde dúvidas e orienta usuários.', 
      model: 'claude-3-5-sonnet', 
      modelBadge: 'Ativo', 
      provider: 'Anthropic', 
      cost: '$0.003 / 1K in, $0.015 / 1K out', 
      fallback: 'Gemini 1.5 Pro',
      icon: MessageSquare
    },
    { 
      id: 'resumo', 
      name: 'Resumo de Transações', 
      desc: 'Resume movimentações financeiras.', 
      model: 'gemini-1.5-pro', 
      modelBadge: 'Backup', 
      provider: 'Google AI', 
      cost: '$0.00125 / 1K in, $0.005 / 1K out', 
      fallback: 'GPT-4o Mini',
      icon: FileText
    },
    { 
      id: 'fraude', 
      name: 'Detecção de Fraudes', 
      desc: 'Identifica padrões suspeitos e risco.', 
      model: 'mistral-7b-instruct', 
      modelBadge: 'Reserva', 
      provider: 'Mistral AI', 
      cost: 'Gratuito', 
      fallback: 'Llama 3 8B Instruct',
      icon: ShieldAlert
    },
    { 
      id: 'conteudo', 
      name: 'Geração de Conteúdo', 
      desc: 'E-mails, descrições e textos automáticos.', 
      model: 'gpt-3.5-turbo', 
      modelBadge: 'Standby', 
      provider: 'OpenAI', 
      cost: '$0.0005 / 1K in, $0.0015 / 1K out', 
      fallback: 'Mistral 7B Instruct',
      icon: Sparkles
    }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateFeatureModel = (featureId: string, newProviderName: string) => {
    let newModel = '';
    let newCost = '';
    let newFallback = '';

    if (newProviderName === 'OpenAI') {
      newModel = 'gpt-4o';
      newCost = '$0.005 / 1K in, $0.015 / 1K out';
      newFallback = 'Claude 3.5 Sonnet';
    } else if (newProviderName === 'Anthropic') {
      newModel = 'claude-3-5-sonnet';
      newCost = '$0.003 / 1K in, $0.015 / 1K out';
      newFallback = 'Gemini 1.5 Pro';
    } else if (newProviderName === 'Google AI') {
      newModel = 'gemini-1.5-pro';
      newCost = '$0.00125 / 1K in, $0.005 / 1K out';
      newFallback = 'GPT-4o Mini';
    } else if (newProviderName === 'Mistral AI') {
      newModel = 'mistral-7b-instruct';
      newCost = 'Gratuito';
      newFallback = 'Llama 3 8B Instruct';
    } else {
      newModel = 'llama-3-8b-instruct';
      newCost = 'Gratuito (Self-hosted)';
      newFallback = 'Mistral 7B Instruct';
    }

    setFeatures(prev => prev.map(f => f.id === featureId ? {
      ...f,
      provider: newProviderName,
      model: newModel,
      cost: newCost,
      fallback: newFallback
    } : f));

    triggerToast(`Feature atualizada: ${features.find(f => f.id === featureId)?.name} agora utiliza ${newProviderName} (${newModel})!`);
    setActiveDropdown(null);
  };

  return (
    <div className="w-full text-left space-y-5 pt-2 pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4.5 shadow-2xl flex items-center gap-2.5 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 bg-brand rounded-full shrink-0 animate-ping" />
          <span className="text-[11.5px] font-black text-left">{toastMessage}</span>
        </div>
      )}

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-55 flex items-center justify-center">
          <div className="bg-white border border-[#E8DDFD] w-[390px] rounded-[24px] p-5.5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Conectar Provedor de IA</span>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Provedor</label>
                <select className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                  <option>Cohere AI</option>
                  <option>Groq Cloud</option>
                  <option>DeepSeek</option>
                  <option>Amazon Bedrock</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">API Key do Endpoint</label>
                <input type="password" placeholder="sk-..." className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold" />
              </div>
            </div>

            <button 
              onClick={() => {
                setShowAddModal(false);
                triggerToast("Credenciais enviadas e validadas com sucesso pelo gateway de IA!");
              }}
              className="w-full h-10 bg-brand text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-brand-dark transition-all"
            >
              Conectar e Ativar
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
        <span className="text-slate-700 font-bold">Inteligência Artificial</span>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between w-full shrink-0 border-b border-[#E7E5EF] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-brand border border-violet-100/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[20px] 2xl:text-[22px] font-black tracking-tight text-slate-950">
              Inteligência Artificial
            </h1>
            <p className="text-slate-455 font-semibold text-[11.5px] 2xl:text-[12px] tracking-tight">
              Configure provedores de IA, modelos, custos, fallbacks e atribuição por recurso da plataforma.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex h-9 items-center justify-center gap-1.5 px-4 bg-brand hover:bg-brand-dark text-white rounded-xl text-[11px] font-black shadow-lg shadow-brand/15 transition-all uppercase tracking-tight"
        >
          <Plus className="w-4 h-4 shrink-0 text-white" />
          Novo provedor
        </button>
      </header>

      {/* Tab Menu (8 Tabs) */}
      <div className="flex items-center justify-between border-b border-[#E8DDFD]/65 pb-0 w-full shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-5">
          {[
            { id: 'visao_geral', label: 'Visão geral' },
            { id: 'provedores', label: 'Provedores' },
            { id: 'modelos', label: 'Modelos' },
            { id: 'atribui_feature', label: 'Atribuição por feature' },
            { id: 'builder_ia', label: 'Builder de IA' },
            { id: 'custos_uso', label: 'Custos e uso' },
            { id: 'logs_auditoria', label: 'Logs e auditoria' },
            { id: 'configuracoes', label: 'Configurações' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  triggerToast(`Aba carregada: ${tab.label}`);
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

      {/* visao_geral tab rendering */}
      {activeTab === 'visao_geral' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start w-full">
          
          {/* Left Column (col-span-3) */}
          <div className="xl:col-span-3 space-y-4">
            
            {/* Card 1: Provedores de IA Conectados */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Provedores de IA conectados</h3>
                <p className="text-[10.5px] font-bold text-slate-400 mt-1">Gerencie seus provedores de IA, modelos disponíveis e regras de fallback.</p>
              </div>

              {/* Table */}
              <div className="w-full overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                      <th className="py-2.5 px-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[22%]">Provedor</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[22%]">Modelo ativo</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[24%]">Custo por uso</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[10%]">Status</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[24%]">Fallback</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[25%]">Endpoint</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[8%] text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10.5px] font-bold text-slate-700">
                    {providers.map((p) => {
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50 h-[52px]">
                          {/* Provedor */}
                          <td className="py-2 px-3.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="w-5.5 h-5.5 bg-brand-soft/20 text-brand font-black rounded-lg flex items-center justify-center shrink-0 border border-brand/5">
                                {p.name[0]}
                              </div>
                              <div className="leading-tight truncate">
                                <span className="font-extrabold text-slate-900 block truncate">{p.name}</span>
                                <span className={cn(
                                  "text-[8px] font-black uppercase tracking-wider block mt-0.5 px-1 py-0.1 rounded w-fit leading-none",
                                  p.isPaid ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-650"
                                )}>{p.badge}</span>
                              </div>
                            </div>
                          </td>

                          {/* Modelo ativo */}
                          <td className="py-2 px-2 min-w-0">
                            <div className="leading-tight truncate">
                              <span className="font-extrabold text-slate-800 block truncate font-mono text-[10px]">{p.model}</span>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-wider block mt-0.5 px-1 py-0.1 rounded w-fit leading-none",
                                p.modelBadge === 'Ativo' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-500"
                              )}>{p.modelBadge}</span>
                            </div>
                          </td>

                          {/* Custo por uso */}
                          <td className="py-2 px-2 min-w-0">
                            <div className="leading-tight text-left">
                              <span className="font-extrabold text-slate-800 block truncate">{p.cost}</span>
                              <span className="text-[9px] text-slate-400 block truncate mt-0.5">{p.costSub}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-2 px-2">
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-emerald-700 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              {p.status}
                            </span>
                          </td>

                          {/* Fallback */}
                          <td className="py-2 px-2 min-w-0 font-extrabold text-slate-600 truncate">{p.fallback}</td>

                          {/* Endpoint */}
                          <td className="py-2 px-2 min-w-0">
                            <div className="leading-tight text-left">
                              <span className="font-mono text-[9px] text-slate-550 block truncate">{p.endpoint}</span>
                              <span className="text-[8px] font-black text-slate-350 block mt-0.5 uppercase tracking-wider font-mono">{p.region}</span>
                            </div>
                          </td>

                          {/* Ações */}
                          <td className="py-2 px-2 text-center">
                            <button className="text-slate-400 hover:text-brand font-black text-sm shrink-0">•••</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-center border-t border-slate-50">
                <button className="text-brand font-black text-[10.5px] uppercase tracking-wider hover:underline">
                  Ver todos os provedores &gt;
                </button>
              </div>
            </div>

            {/* Card 2: Seleção de Modelo por Feature (Interactive Drawer Integration!) */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Seleção de modelo por feature</h3>
                <p className="text-[10.5px] font-bold text-slate-400 mt-1">Defina qual modelo de IA será usado em cada recurso da plataforma.</p>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-slate-100">
                <table className="w-full text-left table-fixed">
                  <thead>
                    <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                      <th className="py-2.5 px-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[24%]">Feature / Recurso</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[28%]">Descrição</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[18%]">Modelo ativo</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[14%]">Provedor</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[26%]">Custo por uso</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[20%]">Fallback</th>
                      <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[8%] text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[10.5px] font-bold text-slate-700">
                    {features.map((f) => {
                      const isDropdownOpen = activeDropdown === f.id;
                      const IconComp = f.icon;

                      return (
                        <tr key={f.id} className="hover:bg-slate-50/50 h-[52px]">
                          {/* Feature */}
                          <td className="py-2 px-3.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="w-5.5 h-5.5 bg-brand-soft/20 text-brand rounded-lg flex items-center justify-center shrink-0 border border-brand/5">
                                <IconComp className="w-3.5 h-3.5 text-brand" />
                              </div>
                              <span className="font-extrabold text-slate-900 block truncate">{f.name}</span>
                            </div>
                          </td>

                          {/* Descrição */}
                          <td className="py-2 px-2 text-slate-450 min-w-0 truncate">{f.desc}</td>

                          {/* Modelo ativo */}
                          <td className="py-2 px-2 min-w-0 font-mono text-[10px] text-slate-850 truncate">{f.model}</td>

                          {/* Provedor */}
                          <td className="py-2 px-2 min-w-0 text-slate-600 truncate">{f.provider}</td>

                          {/* Custo */}
                          <td className="py-2 px-2 min-w-0 text-slate-600 truncate">{f.cost}</td>

                          {/* Fallback */}
                          <td className="py-2 px-2 min-w-0 text-slate-550 truncate">{f.fallback}</td>

                          {/* Ações dropdown select */}
                          <td className="py-2 px-2 text-center relative">
                            <button 
                              onClick={() => setActiveDropdown(isDropdownOpen ? null : f.id)}
                              className="w-7 h-7 border border-[#E8DDFD] bg-white rounded-lg flex items-center justify-center text-slate-450 hover:border-brand hover:text-brand transition-all cursor-pointer mx-auto"
                            >
                              {isDropdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {/* Dropdown Options Drawer */}
                            {isDropdownOpen && (
                              <div className="absolute right-2 top-10.5 z-40 bg-white border border-[#E8DDFD] rounded-xl shadow-2xl p-2.5 w-[200px] text-left space-y-1.5">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mudar Provedor da Feature</span>
                                {[
                                  { p: 'OpenAI', desc: 'gpt-4o' },
                                  { p: 'Anthropic', desc: 'claude-3-5-sonnet' },
                                  { p: 'Google AI', desc: 'gemini-1.5-pro' },
                                  { p: 'Mistral AI', desc: 'mistral-7b' },
                                  { p: 'Llama (Local)', desc: 'llama-3-8b' }
                                ].map((prov) => (
                                  <button
                                    key={prov.p}
                                    onClick={() => handleUpdateFeatureModel(f.id, prov.p)}
                                    className="w-full text-left px-2 py-1 hover:bg-brand-soft/20 rounded-lg text-[9.5px] font-bold text-slate-700 flex items-center justify-between"
                                  >
                                    <span>{prov.p}</span>
                                    <span className="font-mono text-[8px] text-slate-400">{prov.desc}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-center border-t border-slate-50">
                <button className="text-brand font-black text-[10.5px] uppercase tracking-wider hover:underline">
                  Ver todas as features &gt;
                </button>
              </div>
            </div>

          </div>

          {/* Right Column (col-span-1) */}
          <div className="space-y-4">
            
            {/* Resumo de IA da Plataforma */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left">
              <div>
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block leading-none">Resumo de IA da plataforma</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-1 leading-none">Visão rápida do uso e custos com IA.</p>
              </div>

              <div className="space-y-2.5 text-[11px] font-bold text-slate-500 pt-1.5">
                {[
                  { label: 'Provedores ativos', val: '3', bold: true },
                  { label: 'Modelos configurados', val: '8', bold: true },
                  { label: 'Features com IA', val: '14', bold: true }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-slate-50 pb-1.5">
                    <span>{item.label}</span>
                    <span className={cn(item.bold && "font-black text-slate-900")}>{item.val}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-805">Custo estimado (mês)</span>
                  <div className="text-right">
                    <span className="font-black text-[15px] text-brand block">$126,48</span>
                    <span className="text-[8px] font-black text-emerald-650 bg-emerald-50 px-1 py-0.2 rounded block mt-0.5 leading-none w-fit ml-auto">
                      ▲ 12% vs mês anterior
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legenda Card */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-3.5 text-left">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block border-b border-slate-50 pb-2">
                Legenda
              </h4>

              <div className="space-y-3 text-[10px] font-bold text-slate-500">
                {[
                  { color: 'bg-emerald-500', term: 'Gratuito', def: 'Sem custo direto por uso' },
                  { color: 'bg-purple-500', term: 'Pago', def: 'Cobrança por token ou requisição' },
                  { color: 'bg-blue-500', term: 'Ativo', def: 'Modelo em uso pela plataforma' },
                  { color: 'bg-slate-400', term: 'Standby / Reserva', def: 'Modelo em espera ou backup' }
                ].map((leg) => (
                  <div key={leg.term} className="flex items-start gap-2.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1", leg.color)} />
                    <div className="leading-tight">
                      <span className="font-black text-slate-800 block">{leg.term}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">{leg.def}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Builder de IA Card */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left flex flex-col justify-between h-[155px]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 text-brand flex items-center justify-center shrink-0 border border-violet-100/50">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 leading-none">Builder de IA</h4>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed mt-2.5">
                  Crie prompts, agentes, fluxos e automações com IA.
                </p>
              </div>

              <button 
                onClick={() => triggerToast("Abrindo IA Agent Builder...")}
                className="w-full h-8.5 border border-brand/20 hover:bg-brand-soft/20 text-brand rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1"
              >
                Abrir builder <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Documentação Card */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left flex flex-col justify-between h-[155px]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 text-brand flex items-center justify-center shrink-0 border border-violet-100/50">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 leading-none">Documentação</h4>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed mt-2.5">
                  Guia completo de integração e custos.
                </p>
              </div>

              <button 
                onClick={() => triggerToast("Verificando documentação cognitiva...")}
                className="w-full h-8.5 border border-brand/20 hover:bg-brand-soft/20 text-brand rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1"
              >
                Ver documentação <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* RENDER TAB FALLBACKS */}
      {activeTab !== 'visao_geral' && (
        <div className="bg-white border border-[#E8DDFD]/60 rounded-[24px] p-20 flex flex-col items-center justify-center text-center gap-3.5 shadow-sm h-[400px]">
          <div className="w-12 h-12 rounded-full bg-[#FAF8FF] border border-[#E8DDFD] flex items-center justify-center text-violet-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-slate-900 font-black text-base">Aba em Desenvolvimento</h3>
            <p className="text-slate-550 text-xs mt-1 max-w-sm font-semibold leading-relaxed">
              Esta seção das configurações de Inteligência Artificial está sendo orquestrada pela rede neural. A Visão Geral contém o painel operacional completo em tempo real.
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
