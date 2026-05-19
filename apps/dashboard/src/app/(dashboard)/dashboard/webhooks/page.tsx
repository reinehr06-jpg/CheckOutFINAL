'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Webhook, 
  CheckCircle, 
  XCircle, 
  RefreshCcw, 
  Loader2, 
  AlertCircle, 
  Code,
  Globe,
  Settings,
  ChevronRight,
  Trash2,
  Copy,
  ExternalLink,
  SlidersHorizontal,
  Search,
  Zap,
  Check,
  Send,
  Sparkles,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useWebhooks, WebhookEndpoint, WebhookDelivery } from '@/hooks/api/useWebhooks';
import { cn } from '@/lib/utils';

export default function WebhooksPage() {
  const { endpoints, deliveries, loading, error, refetch, setEndpoints, setDeliveries } = useWebhooks();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'endpoints' | 'deliveries' | 'simulator'>('endpoints');
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer state
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDelivery | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  
  // Modals state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newSystem, setNewSystem] = useState('Sistema Principal');
  const [newEvents, setNewEvents] = useState<string[]>(['payment.approved']);
  
  // Simulator state
  const [simEvent, setSimEvent] = useState('payment.approved');
  const [simUrl, setSimUrl] = useState('https://api.lojaexemplo.com.br/v1/webhooks');
  const [simPayload, setSimPayload] = useState('{\n  "event": "payment.approved",\n  "data": {\n    "id": "pay_sim_992384",\n    "amount": 29900,\n    "status": "paid",\n    "payment_method": "credit_card"\n  }\n}');
  const [simulating, setSimulating] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerSuccessAlert = (message: string) => {
    setSuccessAlert(message);
    setTimeout(() => setSuccessAlert(null), 4000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Toggle endpoint status
  const handleToggleEndpointStatus = (id: number) => {
    setEndpoints(prev => prev.map(ep => {
      if (ep.id === id) {
        const nextStatus = ep.status === 'active' ? 'inactive' : 'active';
        triggerSuccessAlert(`Endpoint ${ep.url} está agora ${nextStatus === 'active' ? 'Ativo' : 'Inativo'}.`);
        return { ...ep, status: nextStatus };
      }
      return ep;
    }));
  };

  // Delete endpoint
  const handleDeleteEndpoint = (id: number, url: string) => {
    if (confirm(`Tem certeza que deseja remover o endpoint ${url}?`)) {
      setEndpoints(prev => prev.filter(ep => ep.id !== id));
      triggerSuccessAlert(`Endpoint removido com sucesso.`);
    }
  };

  // Add new endpoint
  const handleCreateEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) {
      alert('URL é obrigatória.');
      return;
    }
    const newEp: WebhookEndpoint = {
      id: Math.floor(100 + Math.random() * 900),
      url: newUrl,
      status: 'active',
      events: newEvents,
      connected_system: { name: newSystem }
    };
    setEndpoints(prev => [newEp, ...prev]);
    setShowNewModal(false);
    setNewUrl('');
    triggerSuccessAlert(`Endpoint ${newUrl} criado com sucesso.`);
  };

  // Toggle events selection for new endpoint
  const handleToggleEventSelection = (ev: string) => {
    if (newEvents.includes(ev)) {
      setNewEvents(prev => prev.filter(item => item !== ev));
    } else {
      setNewEvents(prev => [...prev, ev]);
    }
  };

  // Run webhook simulation
  const handleRunSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      const code: number = Math.random() > 0.15 ? 200 : 500;
      const newDlv: WebhookDelivery = {
        id: Math.floor(1000 + Math.random() * 9000),
        event: simEvent,
        url: simUrl,
        status_code: code,
        success: code === 200 || code === 201,
        created_at: new Date().toISOString(),
        request_payload: simPayload,
        response_body: code === 200 ? '{"status":"ok","received":true}' : 'Internal Server Error'
      };
      
      setDeliveries(prev => [newDlv, ...prev]);
      setSimulating(false);
      triggerSuccessAlert(`Simulação concluída! Servidor respondeu com código ${code}.`);
      setActiveTab('deliveries');
      setSelectedDelivery(newDlv);
    }, 1500);
  };

  // Re-send webhook delivery
  const handleResendDelivery = (dlv: WebhookDelivery) => {
    triggerSuccessAlert(`Reenviando webhook #${dlv.id} para ${dlv.url}...`);
    setTimeout(() => {
      const code = dlv.status_code;
      const newDlv: WebhookDelivery = {
        ...dlv,
        id: Math.floor(1000 + Math.random() * 9000),
        created_at: new Date().toISOString()
      };
      setDeliveries(prev => [newDlv, ...prev]);
      triggerSuccessAlert(`Webhook reenviado com sucesso! Resposta: ${code}`);
    }, 1000);
  };

  const filteredEndpoints = endpoints.filter(ep => 
    ep.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ep.connected_system?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeliveries = deliveries.filter(dlv => 
    dlv.url.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dlv.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const successRate = deliveries.length 
    ? Math.round((deliveries.filter(d => d.success).length / deliveries.length) * 100) 
    : 100;

  return (
    <div className="flex flex-col gap-4 w-full select-none text-left pt-2">
      
      {/* Success alert banner */}
      {successAlert && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white p-3.5 rounded-2xl shadow-xl border border-green-400 animate-in slide-in-from-top-4 duration-300 flex items-center justify-between gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white shrink-0" />
            <span className="text-[11.5px] font-bold">{successAlert}</span>
          </div>
          <button onClick={() => setSuccessAlert(null)} className="p-0.5 text-white/70 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal: Novo Endpoint */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateEndpoint} className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-brand">
                <Webhook className="w-5 h-5 shrink-0" />
                <h3 className="text-slate-950 font-black text-sm">Novo Endpoint Webhook</h3>
              </div>
              <button type="button" onClick={() => setShowNewModal(false)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">URL de Destino</label>
                <input
                  type="url"
                  required
                  placeholder="https://suaapi.com/webhooks"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Sistema Conectado</label>
                <select
                  value={newSystem}
                  onChange={(e) => setNewSystem(e.target.value)}
                  className="w-full bg-white border border-[#E8DDFD] rounded-xl px-2 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                >
                  <option value="Sistema Principal">Sistema Principal</option>
                  <option value="Checkout Secundário">Checkout Secundário</option>
                  <option value="Sistema de Notas">Sistema de Notas</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Eventos para Disparar</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['payment.approved', 'payment.failed', 'payment.refunded', 'subscription.created'].map(ev => {
                    const isSelected = newEvents.includes(ev);
                    return (
                      <button
                        key={ev}
                        type="button"
                        onClick={() => handleToggleEventSelection(ev)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10.5px] font-bold text-left transition-all",
                          isSelected 
                            ? 'bg-brand/10 border-brand text-brand' 
                            : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                        )}
                      >
                        <div className={cn("w-3 h-3 rounded border flex items-center justify-center shrink-0", isSelected ? 'bg-brand border-brand text-white' : 'border-slate-350')}>
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                        {ev}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 transition-all rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand text-white hover:bg-brand-deep transition-all rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px]"
              >
                Gravar Endpoint
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDFD]/60 pb-4 shrink-0">
        <div className="space-y-1">
          <h1 className="text-[20px] 2xl:text-[22px] font-black tracking-tight text-slate-950">Webhooks</h1>
          <p className="text-slate-400 font-semibold text-[11.5px] 2xl:text-[12px] tracking-tight">
            Configure receptores de eventos para sincronizar pagamentos e assinaturas com seus servidores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8DDFD] hover:bg-brand-soft rounded-xl text-[10.5px] font-black text-slate-700 shadow-sm transition-all h-[34px]"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-slate-400" />
            Recarregar
          </button>
          
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-brand hover:bg-brand-deep text-white rounded-xl text-[10.5px] font-black shadow-sm transition-all h-[34px] uppercase tracking-tight"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Novo Endpoint
          </button>
        </div>
      </div>

      {/* 4 Cards KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {[
          { label: 'Endpoints ativos', val: `${endpoints.filter(e => e.status === 'active').length} / ${endpoints.length}`, change: 'Operacionais', icon: Globe, bg: 'bg-brand/10', text: 'text-brand', border: 'border-[#E8DDFD]', trend: 'bg-green-50 text-green-700' },
          { label: 'Taxa de sucesso', val: `${successRate}%`, change: 'Média global', icon: CheckCircle, bg: 'bg-green-100/60', text: 'text-green-700', border: 'border-green-150', trend: 'bg-green-50 text-green-700' },
          { label: 'Total de envios', val: deliveries.length.toString(), change: 'Últimos 30d', icon: Send, bg: 'bg-blue-100/60', text: 'text-blue-700', border: 'border-blue-150', trend: 'bg-blue-50 text-blue-750' },
          { label: 'Envios falhos', val: deliveries.filter(d => !d.success).length.toString(), change: 'Requer atenção', icon: AlertCircle, bg: 'bg-red-100/60', text: 'text-red-700', border: 'border-red-150', trend: 'bg-red-50 text-red-650', warning: true }
        ].map((c) => (
          <div key={c.label} className={cn(
            "bg-white border rounded-2xl p-4 shadow-sm relative flex flex-col justify-between h-[100px]",
            c.border
          )}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{c.label}</span>
              <div className={cn("p-1.5 rounded-xl shrink-0", c.bg, c.text)}>
                <c.icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg font-black text-slate-900 leading-none">{c.val}</span>
              <span className={cn("text-[9.5px] font-black px-1.5 py-0.5 rounded leading-none", c.trend)}>
                {c.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Left Column: Endpoints & Histórico */}
        <div className={cn(
          "bg-white rounded-2xl border border-[#E8DDFD] shadow-sm overflow-hidden flex flex-col transition-all duration-300",
          selectedDelivery ? 'lg:col-span-2 xl:col-span-3' : 'lg:col-span-4'
        )}>
          
          {/* Navigation tabs */}
          <div className="border-b border-slate-100 bg-[#FAF8FF]/60 px-4 py-0.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'endpoints', label: 'Endpoints Configurados', icon: Webhook, count: endpoints.length },
              { id: 'deliveries', label: 'Histórico de Entregas', icon: RefreshCcw, count: deliveries.length },
              { id: 'simulator', label: 'Simulador Sandbox', icon: Sparkles }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-3.5 py-3 text-[10.5px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5",
                    isActive ? "border-brand text-brand font-black" : "border-transparent text-slate-500 hover:text-brand"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={cn(
                      "px-1.5 py-0.2 rounded-full text-[8.5px] font-black",
                      isActive ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-500"
                    )}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search bar inside list */}
          {activeTab !== 'simulator' && (
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filtrar por URL, evento ou status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E8DDFD]/80 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 border border-[#E8DDFD] hover:bg-slate-50 rounded-xl text-xs font-black text-slate-600 h-[34px]"
              >
                Limpar
              </button>
            </div>
          )}

          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
                <span className="text-slate-400 font-bold text-xs">Carregando informações...</span>
              </div>
            ) : activeTab === 'endpoints' ? (
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-150 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-4 py-3">URL do Endpoint</th>
                    <th className="px-4 py-3">Sistema Conectado</th>
                    <th className="px-4 py-3">Eventos Inscritos</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-655">
                  {filteredEndpoints.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                        Nenhum endpoint webhook correspondente.
                      </td>
                    </tr>
                  ) : (
                    filteredEndpoints.map(ep => (
                      <tr key={ep.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4">
                          <span className="font-mono text-[11px] text-slate-900 font-bold block">{ep.url}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-slate-700 font-bold block">{ep.connected_system?.name || 'Sistema'}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {ep.events.map((ev, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-brand-soft border border-[#E8DDFD] text-[9.5px] font-black text-brand uppercase">
                                {ev}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleToggleEndpointStatus(ep.id)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border transition-all cursor-pointer",
                              ep.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            )}
                          >
                            <div className={cn("w-1 h-1 rounded-full", ep.status === 'active' ? 'bg-green-500' : 'bg-slate-400')} />
                            {ep.status === 'active' ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSimUrl(ep.url);
                                setSimEvent(ep.events[0] || 'payment.approved');
                                setActiveTab('simulator');
                              }}
                              className="px-2.5 py-1 border border-[#E8DDFD] hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-750"
                            >
                              Simular
                            </button>
                            <button
                              onClick={() => handleDeleteEndpoint(ep.id, ep.url)}
                              className="p-1 hover:bg-red-50 hover:text-red-650 rounded-lg text-slate-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : activeTab === 'deliveries' ? (
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-150 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-4 py-3">Entrega ID</th>
                    <th className="px-4 py-3">Tipo do Evento</th>
                    <th className="px-4 py-3">URL do Destino</th>
                    <th className="px-4 py-3">Código HTTP</th>
                    <th className="px-4 py-3">Vencimento / Horário</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-655">
                  {filteredDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                        Nenhum log de envio correspondente.
                      </td>
                    </tr>
                  ) : (
                    filteredDeliveries.map(dlv => (
                      <tr 
                        key={dlv.id} 
                        onClick={() => setSelectedDelivery(dlv)}
                        className={cn(
                          "hover:bg-slate-50/50 cursor-pointer transition-all",
                          selectedDelivery?.id === dlv.id ? 'bg-brand/5' : ''
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-slate-900 font-black">#{dlv.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-brand/5 border border-[#E8DDFD] text-[9.5px] font-black text-brand uppercase">
                            {dlv.event}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-slate-500 truncate max-w-[220px] block">{dlv.url}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-black border",
                            dlv.success 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-red-50 text-red-650 border-red-200'
                          )}>
                            {dlv.success ? <CheckCircle className="w-3 h-3 shrink-0" /> : <XCircle className="w-3 h-3 shrink-0" />}
                            {dlv.status_code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(dlv.created_at).toLocaleString('pt-BR')}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedDelivery(dlv)}
                              className="px-2.5 py-1 bg-white border border-[#E8DDFD] hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-700"
                            >
                              Ver Payload
                            </button>
                            <button
                              onClick={() => handleResendDelivery(dlv)}
                              className="p-1 hover:bg-brand-soft rounded-lg text-slate-400 hover:text-brand"
                            >
                              <RefreshCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              
              /* Simulator sandboxed panel */
              <div className="p-6 space-y-4 max-w-2xl mx-auto font-semibold text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="w-5 h-5 text-brand" />
                  <div>
                    <span className="text-slate-900 font-black text-sm block">Simulador de Eventos Webhook</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">Envie eventos fictícios para simular a resposta de integração de seu receptor de API.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Selecione o Endpoint Destino</label>
                    <select
                      value={simUrl}
                      onChange={(e) => setSimUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      {endpoints.map(ep => (
                        <option key={ep.id} value={ep.url}>{ep.url}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Tipo de Evento</label>
                    <select
                      value={simEvent}
                      onChange={(e) => {
                        setSimEvent(e.target.value);
                        if (e.target.value === 'payment.approved') {
                          setSimPayload('{\n  "event": "payment.approved",\n  "data": {\n    "id": "pay_sim_992384",\n    "amount": 29900,\n    "status": "paid",\n    "payment_method": "credit_card"\n  }\n}');
                        } else if (e.target.value === 'payment.failed') {
                          setSimPayload('{\n  "event": "payment.failed",\n  "data": {\n    "id": "pay_sim_992384",\n    "amount": 29900,\n    "status": "failed",\n    "failure_reason": "insufficient_funds"\n  }\n}');
                        } else {
                          setSimPayload('{\n  "event": "subscription.created",\n  "data": {\n    "id": "sub_sim_881239",\n    "plan": "PRO Anual",\n    "status": "active"\n  }\n}');
                        }
                      }}
                      className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="payment.approved">payment.approved</option>
                      <option value="payment.failed">payment.failed</option>
                      <option value="subscription.created">subscription.created</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Payload de Requisição (JSON Body)</label>
                  <textarea
                    value={simPayload}
                    onChange={(e) => setSimPayload(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 text-green-400 font-mono text-xs rounded-xl p-3.5 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    onClick={handleRunSimulation}
                    disabled={simulating}
                    className="px-5 py-2 bg-brand hover:bg-brand-deep disabled:bg-slate-200 text-white rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[34px] flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {simulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {simulating ? 'Enviando...' : 'Disparar Webhook de Teste'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Simple footer count info */}
          {activeTab !== 'simulator' && (
            <div className="p-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-450 bg-slate-50/40">
              <span>Listando itens operacionais de webhooks</span>
              <span>Total: {activeTab === 'endpoints' ? filteredEndpoints.length : filteredDeliveries.length} registros</span>
            </div>
          )}

        </div>

        {/* Right Column: Webhook Delivery Inspector Drawer */}
        {selectedDelivery && (
          <div className="lg:col-span-2 xl:col-span-1 bg-white rounded-2xl border border-[#E8DDFD] shadow-lg overflow-hidden flex flex-col sticky top-4 animate-in slide-in-from-right-4 duration-300">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#FAF8FF]">
              <div>
                <h3 className="text-xs font-black text-slate-900">Entrega #{selectedDelivery.id}</h3>
                <span className="text-[10px] text-slate-450 mt-0.5 block">{selectedDelivery.event}</span>
              </div>
              <button 
                onClick={() => setSelectedDelivery(null)}
                className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto no-scrollbar font-semibold text-xs">
              
              <div className="space-y-2.5">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block">Endpoint Destino</span>
                  <span className="text-slate-900 font-mono text-[10.5px] block mt-0.5 truncate">{selectedDelivery.url}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block">Código de Resposta</span>
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded text-[10px] font-black mt-0.5 border",
                    selectedDelivery.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-650'
                  )}>
                    {selectedDelivery.status_code} {selectedDelivery.success ? 'OK' : 'Error'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase block">Timestamp de Envio</span>
                  <span className="text-slate-800 block mt-0.5">{new Date(selectedDelivery.created_at).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase block">JSON Payload (Corpo do POST)</span>
                  <button 
                    onClick={() => handleCopy(selectedDelivery.request_payload || '', 'req')}
                    className="text-[9.5px] font-black text-brand hover:underline"
                  >
                    {copiedField === 'req' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <pre className="bg-slate-950 text-slate-100 text-[10px] font-mono p-3 rounded-xl overflow-x-auto max-h-[140px] no-scrollbar">
                  {selectedDelivery.request_payload}
                </pre>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase block">Corpo da Resposta (Response Body)</span>
                  <button 
                    onClick={() => handleCopy(selectedDelivery.response_body || '', 'resp')}
                    className="text-[9.5px] font-black text-brand hover:underline"
                  >
                    {copiedField === 'resp' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <pre className="bg-slate-50 border border-slate-200 text-slate-800 text-[10px] font-mono p-3 rounded-xl overflow-x-auto max-h-[100px] no-scrollbar">
                  {selectedDelivery.response_body || 'Nenhum corpo retornado'}
                </pre>
              </div>

              <div className="border-t border-slate-100 pt-3.5">
                <button
                  onClick={() => handleResendDelivery(selectedDelivery)}
                  className="w-full flex items-center justify-center gap-1.5 h-9 bg-brand hover:bg-brand-deep text-white rounded-xl text-[10.5px] font-black uppercase tracking-tight transition-all shadow-sm"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Reenviar Webhook Agora
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Recharts Analytics for Delivery Success Rate over past 7 days */}
      {mounted && (
        <div className="bg-white border border-[#E8DDFD] rounded-2xl p-5 shadow-sm space-y-4 shrink-0">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Taxa de Sucesso dos Disparos</span>
            <span className="text-[9.5px] font-black text-slate-400 uppercase">Últimos 7 dias</span>
          </div>

          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: '10 Mai', rate: 92 },
                { name: '11 Mai', rate: 95 },
                { name: '12 Mai', rate: 88 },
                { name: '13 Mai', rate: 94 },
                { name: '14 Mai', rate: 97 },
                { name: '15 Mai', rate: 96 },
                { name: '16 Mai', rate: 75 }
              ]}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D3FF3" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6D3FF3" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9.5} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={9.5} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[60, 100]}
                  tickFormatter={(v) => `${v}%`} 
                />
                <Tooltip 
                  formatter={(v: any) => [`${v}%`, 'Sucesso']} 
                  contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '10.5px' }} 
                />
                <Area type="monotone" dataKey="rate" stroke="#6D3FF3" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
}
