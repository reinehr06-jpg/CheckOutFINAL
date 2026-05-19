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
  ArrowRight,
  Sliders,
  DollarSign,
  LineChart,
  Search,
  Eye,
  EyeOff,
  GitFork,
  Check,
  Play
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
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // IA Connected Providers initial mocks
  const [providers, setProviders] = useState([
    { id: 'openai', name: 'OpenAI', badge: 'Pago', model: 'gpt-4o', modelBadge: 'Ativo', cost: '$0.005 / 1K tokens', costSub: 'Entrada - $0.015 / 1K saída', status: 'Ativo', fallback: 'Anthropic Claude 3.5', endpoint: 'https://api.openai.com/v1', region: 'us-east-1', isPaid: true, key: 'sk-proj-47fa...a891', latency: '210ms' },
    { id: 'anthropic', name: 'Anthropic', badge: 'Pago', model: 'claude-3-5-sonnet', modelBadge: 'Standby', cost: '$0.003 / 1K tokens', costSub: 'Entrada - $0.015 / 1K saída', status: 'Ativo', fallback: 'Google Gemini 1.5 Pro', endpoint: 'https://api.anthropic.com/v1', region: 'us-east-1', isPaid: true, key: 'sk-ant-18ba...c890', latency: '280ms' },
    { id: 'google', name: 'Google AI', badge: 'Pago', model: 'gemini-1.5-pro', modelBadge: 'Backup', cost: '$0.00125 / 1K tokens', costSub: 'Entrada - $0.005 / 1K saída', status: 'Ativo', fallback: 'OpenAI GPT-3.5 Turbo', endpoint: 'https://generativelanguage.googleapis.com/v1', region: 'us-central1', isPaid: true, key: 'sk-gem-82bd...d712', latency: '190ms' },
    { id: 'mistral', name: 'Mistral AI', badge: 'Gratuito', model: 'mistral-7b-instruct', modelBadge: 'Reserva', cost: 'Gratuito', costSub: 'Uso limitado', status: 'Ativo', fallback: '—', endpoint: 'https://api.mistral.ai/v1', region: 'eu-west-1', isPaid: false, key: 'sk-mis-129a...f412', latency: '150ms' },
    { id: 'llama', name: 'Llama (Local)', badge: 'Gratuito', model: 'llama-3-8b-instruct', modelBadge: 'Reserva', cost: 'Gratuito', costSub: 'Self-hosted', status: 'Ativo', fallback: 'Mistral 7B Instruct', endpoint: 'http://10.0.0.45:11434/v1', region: 'local', isPaid: false, key: '—', latency: '45ms' }
  ]);

  // Model assigned to features states
  const [features, setFeatures] = useState([
    { id: 'bci', name: 'BCI - Análises', desc: 'Gera análises, insights e relatórios inteligentes.', model: 'gpt-4o', modelBadge: 'Ativo', provider: 'OpenAI', cost: '$0.005 / 1K in, $0.015 / 1K out', fallback: 'Claude 3.5 Sonnet', icon: BrainCircuit },
    { id: 'chat', name: 'Assistente - Chat', desc: 'Responde dúvidas e orienta usuários.', model: 'claude-3-5-sonnet', modelBadge: 'Ativo', provider: 'Anthropic', cost: '$0.003 / 1K in, $0.015 / 1K out', fallback: 'Gemini 1.5 Pro', icon: MessageSquare },
    { id: 'resumo', name: 'Resumo de Transações', desc: 'Resume movimentações financeiras.', model: 'gemini-1.5-pro', modelBadge: 'Backup', provider: 'Google AI', cost: '$0.00125 / 1K in, $0.005 / 1K out', fallback: 'GPT-4o Mini', icon: FileText },
    { id: 'fraude', name: 'Detecção de Fraudes', desc: 'Identifica padrões suspeitos e risco.', model: 'mistral-7b-instruct', modelBadge: 'Reserva', provider: 'Mistral AI', cost: 'Gratuito', fallback: 'Llama 3 8B Instruct', icon: ShieldAlert },
    { id: 'conteudo', name: 'Geração de Conteúdo', desc: 'E-mails, descrições e textos automáticos.', model: 'gpt-3.5-turbo', modelBadge: 'Standby', provider: 'OpenAI', cost: '$0.0005 / 1K in, $0.0015 / 1K out', fallback: 'Mistral 7B Instruct', icon: Sparkles }
  ]);

  // Prompt Orchestrator Canvas simulated states
  const [canvasNodes, setCanvasNodes] = useState([
    { id: 'input', label: 'Payload da Transação', type: 'Input', desc: 'Dados recebidos do checkout' },
    { id: 'prompt_1', label: 'Análise Antifraude', type: 'System Prompt', desc: 'GPT-4o: Validar anomalias' },
    { id: 'cond', label: 'Score > 80?', type: 'Condicional', desc: 'Se sim, recusa imediata' },
    { id: 'webhook', label: 'Disparar Webhook', type: 'Webhook', desc: 'Notifica painel de compliance' }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>('prompt_1');
  const [nodePromptText, setNodePromptText] = useState('Analise o payload de transação recebido e classifique o risco de 0 a 100 com base em IP, dados cadastrais e histórico de chargeback.');

  // Costs and Usage states
  const [monthlyBudget, setMonthlyBudget] = useState(250);
  const [semanticCaching, setSemanticCaching] = useState(true);

  // Live Audit Logs search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const auditLogs = [
    { id: 'req_87321a', timestamp: '19/05 16:02:11', feature: 'Detecção de Fraudes', model: 'mistral-7b', status: '200 OK', tokens: '1,420 tkn', cost: '$0.0000', latency: '142ms' },
    { id: 'req_87321b', timestamp: '19/05 15:58:45', feature: 'BCI - Análises', model: 'gpt-4o', status: '200 OK', tokens: '3,892 tkn', cost: '$0.0389', latency: '482ms' },
    { id: 'req_87321c', timestamp: '19/05 15:42:10', feature: 'Assistente - Chat', model: 'claude-3-5', status: '200 OK', tokens: '890 tkn', cost: '$0.0134', latency: '310ms' },
    { id: 'req_87321d', timestamp: '19/05 15:11:03', feature: 'Resumo de Transações', model: 'gemini-1.5-pro', status: '200 OK', tokens: '2,110 tkn', cost: '$0.0053', latency: '240ms' }
  ];

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

      {/* visao_geral Tab */}
      {activeTab === 'visao_geral' && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start w-full">
          
          {/* Left Column (col-span-3) */}
          <div className="xl:col-span-3 space-y-4">
            
            {/* Card 1: Connected Providers */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Provedores de IA conectados</h3>
                <p className="text-[10.5px] font-bold text-slate-400 mt-1">Gerencie seus provedores de IA, modelos disponíveis e regras de fallback.</p>
              </div>

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

                          <td className="py-2 px-2 min-w-0">
                            <div className="leading-tight truncate">
                              <span className="font-extrabold text-slate-800 block truncate font-mono text-[10px]">{p.model}</span>
                              <span className={cn(
                                "text-[8px] font-black uppercase tracking-wider block mt-0.5 px-1 py-0.1 rounded w-fit leading-none",
                                p.modelBadge === 'Ativo' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-500"
                              )}>{p.modelBadge}</span>
                            </div>
                          </td>

                          <td className="py-2 px-2 min-w-0">
                            <div className="leading-tight text-left">
                              <span className="font-extrabold text-slate-800 block truncate">{p.cost}</span>
                              <span className="text-[9px] text-slate-400 block truncate mt-0.5">{p.costSub}</span>
                            </div>
                          </td>

                          <td className="py-2 px-2">
                            <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-emerald-700 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              {p.status}
                            </span>
                          </td>

                          <td className="py-2 px-2 min-w-0 font-extrabold text-slate-600 truncate">{p.fallback}</td>

                          <td className="py-2 px-2 min-w-0">
                            <div className="leading-tight text-left">
                              <span className="font-mono text-[9px] text-slate-550 block truncate">{p.endpoint}</span>
                              <span className="text-[8px] font-black text-slate-350 block mt-0.5 uppercase tracking-wider font-mono">{p.region}</span>
                            </div>
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
            </div>

            {/* Card 2: Feature assignment */}
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
                          <td className="py-2 px-3.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="w-5.5 h-5.5 bg-brand-soft/20 text-brand rounded-lg flex items-center justify-center shrink-0 border border-brand/5">
                                <IconComp className="w-3.5 h-3.5 text-brand" />
                              </div>
                              <span className="font-extrabold text-slate-900 block truncate">{f.name}</span>
                            </div>
                          </td>

                          <td className="py-2 px-2 text-slate-450 min-w-0 truncate">{f.desc}</td>
                          <td className="py-2 px-2 min-w-0 font-mono text-[10px] text-slate-850 truncate">{f.model}</td>
                          <td className="py-2 px-2 min-w-0 text-slate-600 truncate">{f.provider}</td>
                          <td className="py-2 px-2 min-w-0 text-slate-600 truncate">{f.cost}</td>
                          <td className="py-2 px-2 min-w-0 text-slate-550 truncate">{f.fallback}</td>

                          <td className="py-2 px-2 text-center relative">
                            <button 
                              onClick={() => setActiveDropdown(isDropdownOpen ? null : f.id)}
                              className="w-7 h-7 border border-[#E8DDFD] bg-white rounded-lg flex items-center justify-center text-slate-455 hover:border-brand hover:text-brand transition-all cursor-pointer mx-auto"
                            >
                              {isDropdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isDropdownOpen && (
                              <div className="absolute right-2 top-10.5 z-40 bg-white border border-[#E8DDFD] rounded-xl shadow-2xl p-2.5 w-[200px] text-left space-y-1.5">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mudar Provedor</span>
                                {[
                                  { p: 'OpenAI', desc: 'gpt-4o' },
                                  { p: 'Anthropic', desc: 'claude-3-5' },
                                  { p: 'Google AI', desc: 'gemini-1.5' },
                                  { p: 'Mistral AI', desc: 'mistral-7b' }
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
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4">
            
            {/* Budget status */}
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

            {/* IA Builder navigation */}
            <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-4.5 shadow-sm space-y-4 text-left flex flex-col justify-between h-[155px]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 text-brand flex items-center justify-center shrink-0 border border-violet-100/50">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 leading-none">Builder de IA</h4>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 leading-relaxed mt-2.5">
                  Crie prompts, agentes, fluxos e automações cognitivas visualmente.
                </p>
              </div>

              <button 
                onClick={() => setActiveTab('builder_ia')}
                className="w-full h-8.5 border border-brand/20 hover:bg-brand-soft/20 text-brand rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1"
              >
                Abrir builder <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* provedores Tab */}
      {activeTab === 'provedores' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-6 text-left animate-in fade-in duration-300">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Gestão de Provedores Cognitivos</h3>
            <p className="text-[10.5px] font-bold text-slate-400 mt-1">Configure endpoints, credenciais e latência dos gateways de IA em produção.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((p) => {
              const isKeyVisible = showApiKeys[p.id] || false;
              return (
                <div key={p.id} className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-4 bg-slate-50/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#E8DDFD] flex items-center justify-center font-black text-brand text-xs">
                        {p.name[0]}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{p.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 block">Região: {p.region}</span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-black text-brand-dark bg-brand-soft/20 px-2 py-0.5 rounded-lg border border-brand/10">
                      ⏱ {p.latency}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Endpoint URI</span>
                      <span className="font-mono text-[9.5px] text-slate-600 block bg-white border border-[#E8DDFD]/60 rounded-lg px-2.5 py-1.5 truncate">{p.endpoint}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">API Key</span>
                      <div className="relative">
                        <span className="font-mono text-[9.5px] text-slate-600 block bg-white border border-[#E8DDFD]/60 rounded-lg px-2.5 py-1.5 truncate pr-8">
                          {isKeyVisible ? p.key : '••••••••••••••••••••••••'}
                        </span>
                        <button 
                          onClick={() => setShowApiKeys(prev => ({ ...prev, [p.id]: !isKeyVisible }))}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
                        >
                          {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* modelos Tab */}
      {activeTab === 'modelos' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left animate-in fade-in duration-300">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Modelos de IA Disponíveis</h3>
            <p className="text-[10.5px] font-bold text-slate-400 mt-1">Habilite/desabilite modelos, acompanhe o tamanho de contexto e custos individuais.</p>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                  <th className="py-2.5 px-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[24%]">Modelo</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[18%]">Provider</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[18%]">Contexto</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[22%]">Custo Entrada (1M)</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[22%]">Custo Saída (1M)</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-bold text-slate-700">
                {[
                  { name: 'gpt-4o', provider: 'OpenAI', context: '128K tokens', costIn: '$5.00', costOut: '$15.00', status: 'Ativo' },
                  { name: 'claude-3-5-sonnet', provider: 'Anthropic', context: '200K tokens', costIn: '$3.00', costOut: '$15.00', status: 'Ativo' },
                  { name: 'gemini-1.5-pro', provider: 'Google AI', context: '1M tokens', costIn: '$1.25', costOut: '$5.00', status: 'Ativo' },
                  { name: 'mistral-7b-instruct', provider: 'Mistral AI', context: '32K tokens', costIn: 'Gratuito', costOut: 'Gratuito', status: 'Ativo' }
                ].map((m) => (
                  <tr key={m.name} className="hover:bg-slate-50/50 h-[48px]">
                    <td className="py-2 px-3.5 font-mono font-extrabold text-slate-900">{m.name}</td>
                    <td className="py-2 px-2 text-slate-600">{m.provider}</td>
                    <td className="py-2 px-2 text-slate-650 font-mono text-[10px]">{m.context}</td>
                    <td className="py-2 px-2 font-mono text-slate-800">{m.costIn}</td>
                    <td className="py-2 px-2 font-mono text-slate-800">{m.costOut}</td>
                    <td className="py-2 px-2 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[8.5px] font-black uppercase tracking-wider">✓ {m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* atribui_feature Tab */}
      {activeTab === 'atribui_feature' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left animate-in fade-in duration-300">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Mapeamento de Rotas Cognitivas</h3>
            <p className="text-[10.5px] font-bold text-slate-400 mt-1">Configure fallbacks de segurança em nível de aplicação para transbordamento de tráfego de IA.</p>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                  <th className="py-2.5 px-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[25%]">Feature</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[20%]">Gateway Primário</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[20%]">Gateway Secundário</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[20%]">Failover Automático</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[15%] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-bold text-slate-700">
                {features.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 h-[50px]">
                    <td className="py-2 px-3.5 font-extrabold text-slate-900">{f.name}</td>
                    <td className="py-2 px-2 text-slate-750 font-mono text-[10px]">{f.provider} ({f.model})</td>
                    <td className="py-2 px-2 text-slate-455 font-mono text-[10px]">{f.fallback}</td>
                    <td className="py-2 px-2 text-slate-500 font-extrabold flex items-center gap-1.5 mt-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Ativo
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wider font-black">Operando</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* builder_ia Tab (Prompt Orchestrator Canvas) */}
      {activeTab === 'builder_ia' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Prompt Orchestrator Canvas</h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-1">Canvas visual low-code para encadeamento lógico de decisões cognitivas.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => triggerToast("Pipeline compilada com sucesso!")}
                className="h-8.5 px-4 bg-slate-900 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-1"
              >
                <GitFork className="w-3.5 h-3.5" />
                Compilar Pipeline
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5 items-start">
            
            {/* Visual Canvas simulator Board (col-span-3) */}
            <div className="xl:col-span-3 border border-[#E8DDFD]/60 rounded-2xl p-4.5 bg-[#FAF8FF]/45 h-[400px] relative overflow-hidden flex flex-col justify-between">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block select-none">Simulador Gráfico de Nós</span>
              
              {/* Nodes row layout */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 my-auto py-5 select-none relative">
                
                {canvasNodes.map((node, index) => {
                  const isSelected = selectedNode === node.id;
                  return (
                    <div key={node.id} className="flex flex-col md:flex-row items-center relative">
                      {/* Connection arrow line */}
                      {index > 0 && (
                        <div className="hidden md:block absolute -left-7 top-1/2 -translate-y-1/2 w-4.5 h-[1.5px] bg-[#E8DDFD]" />
                      )}

                      {/* Node box */}
                      <button 
                        onClick={() => setSelectedNode(node.id)}
                        className={cn(
                          "w-[130px] bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-left space-y-1.5 relative border-[#E8DDFD]",
                          isSelected && "ring-2 ring-brand border-brand"
                        )}
                      >
                        <span className="text-[7.5px] font-black text-brand uppercase tracking-wider block leading-none">{node.type}</span>
                        <span className="text-[10px] font-black text-slate-900 block truncate">{node.label}</span>
                        <span className="text-[8px] font-bold text-slate-400 block leading-tight">{node.desc}</span>
                      </button>
                    </div>
                  );
                })}

              </div>

              {/* Status bar */}
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-450 border-t border-slate-100 pt-2.5">
                <span>Clique em um nó para visualizar parâmetros cognitivos.</span>
                <span className="flex items-center gap-1 text-emerald-650 font-black"><Check className="w-3.5 h-3.5" /> Pipeline Válido</span>
              </div>
            </div>

            {/* Selected Node Editor Sidebar (col-span-1) */}
            <div className="xl:col-span-1 border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-4 bg-slate-50/20">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5">Configuração do Nó</h4>
              
              {selectedNode ? (
                <div className="space-y-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] font-black text-brand block uppercase tracking-wider">
                      {canvasNodes.find(n => n.id === selectedNode)?.type}
                    </span>
                    <span className="text-xs font-black text-slate-900 block leading-none">
                      {canvasNodes.find(n => n.id === selectedNode)?.label}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">System Prompt Context</label>
                    <textarea 
                      value={nodePromptText}
                      onChange={(e) => setNodePromptText(e.target.value)}
                      rows={6}
                      className="w-full bg-white border border-[#E8DDFD] rounded-xl px-2.5 py-2 text-[10px] font-semibold text-slate-700 focus:outline-none leading-relaxed resize-none"
                    />
                  </div>

                  <button 
                    onClick={() => triggerToast(`Nó '${canvasNodes.find(n => n.id === selectedNode)?.label}' salvo com sucesso!`)}
                    className="w-full h-8.5 bg-slate-900 text-white rounded-xl text-[9.5px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-1"
                  >
                    Salvar Parâmetros
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 text-[10px] font-bold text-slate-400">
                  Nenhum nó selecionado no canvas.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* custos_uso Tab */}
      {activeTab === 'custos_uso' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-5 text-left animate-in fade-in duration-300">
          <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Orçamento & Limites de IA</h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-1">Tome controle financeiro sobre as requisições cognitivas definindo orçamentos mensais.</p>
            </div>
            <button 
              onClick={() => triggerToast("Orçamentos de IA atualizados!")}
              className="h-8.5 px-4 bg-brand text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl hover:bg-brand-dark transition-all"
            >
              Salvar Limites
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            
            {/* Monthly Budget input */}
            <div className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-4 bg-slate-50/20">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Orçamento Máximo Mensal</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={monthlyBudget} 
                  onChange={(e) => setMonthlyBudget(parseInt(e.target.value) || 0)}
                  className="bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-extrabold text-slate-800 w-[110px]" 
                />
                <span className="text-xs font-extrabold text-slate-500">USD/mês</span>
              </div>
              <p className="text-[8.5px] font-semibold text-slate-400 leading-relaxed">Alertas automáticos serão enviados para o e-mail cadastrado quando atingir 80% do valor.</p>
            </div>

            {/* Semantic Caching toggle */}
            <div className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-4 bg-slate-50/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Caching Semântico (Save up to 40%)</span>
                <input 
                  type="checkbox" 
                  checked={semanticCaching}
                  onChange={() => {
                    setSemanticCaching(!semanticCaching);
                    triggerToast(`Semantic Caching ${!semanticCaching ? 'ativado' : 'desativado'}`);
                  }}
                  className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer w-4.5 h-4.5"
                />
              </div>
              <p className="text-[8.5px] font-semibold text-slate-400 leading-relaxed">Guarda respostas de requisições similares localmente por 1 hora para economizar tokens.</p>
            </div>

            {/* Progress bar info */}
            <div className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-3.5 bg-slate-50/20 text-left">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Consumo Atual (Mês Corrente)</span>
              <div>
                <span className="text-[20px] font-black text-slate-900 block">$126,48</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">de ${monthlyBudget} orçado</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-[#E8DDFD]/55 h-2 rounded-full overflow-hidden mt-1 shrink-0">
                <div 
                  className="bg-brand h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (126.48 / monthlyBudget) * 100)}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* logs_auditoria Tab */}
      {activeTab === 'logs_auditoria' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4 text-left animate-in fade-in duration-300">
          <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Histórico de Execuções de IA</h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-1">Monitore chamadas, consumo de tokens e latência de cada requisição cognitiva.</p>
            </div>

            {/* Search filter input */}
            <div className="relative w-[240px]">
              <input 
                type="text" 
                placeholder="Buscar por feature..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-none"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                  <th className="py-2.5 px-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[18%]">ID Requisição</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[22%]">Horário</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[24%]">Feature</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[14%] font-mono">Modelo</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%] text-center">Status</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%] text-right">Tokens</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%] text-right">Custo</th>
                  <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[12%] text-right">Latência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[10.5px] font-bold text-slate-700">
                {auditLogs
                  .filter(log => log.feature.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 h-[48px]">
                      <td className="py-2 px-3.5 font-mono text-[9.5px] text-brand">{log.id}</td>
                      <td className="py-2 px-2 text-slate-455 font-semibold">{log.timestamp}</td>
                      <td className="py-2 px-2 text-slate-900 font-extrabold">{log.feature}</td>
                      <td className="py-2 px-2 text-slate-650 font-mono text-[9.5px]">{log.model}</td>
                      <td className="py-2 px-2 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[8.5px] font-black uppercase tracking-wider">{log.status}</span>
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-[9.5px] text-slate-600">{log.tokens}</td>
                      <td className="py-2 px-2 text-right font-mono text-[9.5px] text-slate-600">{log.cost}</td>
                      <td className="py-2 px-2 text-right font-mono text-[9.5px] text-brand-dark">{log.latency}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* configuracoes Tab */}
      {activeTab === 'configuracoes' && (
        <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-5 text-left animate-in fade-in duration-300">
          <div className="border-b border-slate-50 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Parâmetros de Conectividade & Timeout</h3>
              <p className="text-[10.5px] font-bold text-slate-400 mt-1">Configure retentativas do gateway, limites de timeout de requisições e buffers globais.</p>
            </div>
            <button 
              onClick={() => triggerToast("Parâmetros de conectividade salvos!")}
              className="h-8.5 px-4 bg-brand text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl hover:bg-brand-dark transition-all"
            >
              Salvar Alterações
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-3.5 bg-slate-50/20">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Max Retries (Retentativas)</span>
              <div className="relative">
                <select className="w-full bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none h-9 appearance-none">
                  <option>1 Retentativa</option>
                  <option>2 Retentativas (Padrão)</option>
                  <option>3 Retentativas</option>
                  <option>Nenhuma (Fail-fast)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-3.5 bg-slate-50/20">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Timeout de Requisição (Segundos)</span>
              <div className="relative">
                <select className="w-full bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none h-9 appearance-none">
                  <option>5 Segundos (Máxima performance)</option>
                  <option>10 Segundos</option>
                  <option>15 Segundos (Recomendado)</option>
                  <option>30 Segundos</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="border border-[#E8DDFD]/60 rounded-2xl p-4.5 space-y-3.5 bg-slate-50/20">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Logs de payloads completos</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-slate-700">Registrar corpo nos logs</span>
                <input type="checkbox" defaultChecked className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer w-4 h-4" />
              </div>
              <p className="text-[8.5px] font-semibold text-slate-400 leading-relaxed">Grave o conteúdo dos inputs e outputs gerados em banco de dados para auditorias estritas.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
