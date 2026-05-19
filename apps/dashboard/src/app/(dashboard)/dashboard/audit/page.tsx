'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  Bookmark, 
  Download, 
  Shield, 
  User, 
  ShieldAlert, 
  PenLine, 
  Info, 
  LogIn, 
  Trash2, 
  ChevronRight, 
  AlertTriangle,
  Play,
  Pause,
  ChevronDown
} from 'lucide-react';
import { AuditEvent, AuditLevel, AuditResult, AuditEntityType } from '@/types/audit';
import { MOCK_AUDIT_EVENTS, MOCK_SUMMARY } from './__mocks__/audit';
import { cn } from '@/lib/utils';

export default function AuditPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  
  // Realtime Polling state
  const [realtimeActive, setRealtimeActive] = useState(true);
  
  // Filters State
  const [period, setPeriod] = useState('hoje');
  const [filterUser, setFilterUser] = useState('Todos');
  const [filterSystem, setFilterSystem] = useState('Todos');
  const [filterLevel, setFilterLevel] = useState<string>('Todos');
  
  const [filterEntity, setFilterEntity] = useState<string>('Todos');
  const [filterEntityId, setFilterEntityId] = useState('');
  const [filterAction, setFilterAction] = useState('Todos');
  const [filterIp, setFilterIp] = useState('');
  const [filterResult, setFilterResult] = useState('Todos');

  // Search input
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Tab Filter
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'alteration' | 'access' | 'deletion'>('all');
  
  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Interaction feedbacks
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviewedEvents, setReviewedEvents] = useState<string[]>([]);
  const [incidents, setIncidents] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    
    // Simulate real-time logs ingestion if active and no drawer/panel open
    const timer = setInterval(() => {
      if (!realtimeActive || selectedEvent) return;

      const randomUsers = [
        { name: "Vinícius Admin", role: "Administrador" },
        { name: "Mariana Santos", role: "Operador" },
        { name: "Rafael Oliveira", role: "Dev" },
        { name: "Sistema", role: "Webhook" }
      ];
      const randomSystems = ["Basileia Pay", "Mercado Pago", "Pagar.me"];
      const randomEvents = [
        { name: "Login realizado", cat: "ACESSO", lvl: "informative" as const, desc: "Login realizado via IP corporativo" },
        { name: "Configuração alterada", cat: "CONFIGURAÇÃO", lvl: "alteration" as const, desc: "Antifraude recalibrado para tolerância média" },
        { name: "Filtro de IP adicionado", cat: "SEGURANÇA", lvl: "critical" as const, desc: "Regra crítica de bloqueio de IP ativada" }
      ];

      const rUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const rSys = randomSystems[Math.floor(Math.random() * randomSystems.length)];
      const rEvt = randomEvents[Math.floor(Math.random() * randomEvents.length)];

      const newEvent: AuditEvent = {
        id: `evt_live_${Math.floor(Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        event: rEvt.name,
        category: rEvt.cat,
        level: rEvt.lvl,
        details: `${rEvt.desc} • Operado por ${rUser.name}`,
        user: { name: rUser.name, role: rUser.role },
        system: rSys,
        environment: "production",
        ip: `177.12.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        ipLocation: "São Paulo, BR",
        result: "success",
        entityType: "Configuração",
        entityId: "cfg_antifraud_rules",
        metadata: {
          simulated: true,
          latency: "44ms"
        }
      };

      setEvents(prev => [newEvent, ...prev]);
    }, 8000);

    return () => clearInterval(timer);
  }, [realtimeActive, selectedEvent]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMarkAsReviewed = (id: string) => {
    setReviewedEvents(prev => [...prev, id]);
    triggerToast('Evento marcado como revisado com sucesso.');
  };

  const handleOpenIncident = (id: string) => {
    const incId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;
    setIncidents(prev => ({ ...prev, [id]: incId }));
    triggerToast(`Incidente ${incId} criado e associado ao evento.`);
  };

  // Filter application
  const getFilteredEvents = () => {
    return events.filter(evt => {
      // Search Box
      const matchesSearch = evt.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (evt.entityId && evt.entityId.toLowerCase().includes(searchQuery.toLowerCase()));

      // Tab selector
      let matchesTab = true;
      if (activeTab === 'critical') matchesTab = evt.level === 'critical';
      else if (activeTab === 'alteration') matchesTab = evt.level === 'alteration';
      else if (activeTab === 'access') matchesTab = evt.level === 'access' || evt.category === 'ACESSO';
      else if (activeTab === 'deletion') matchesTab = evt.level === 'deletion' || evt.category === 'EXCLUSÃO';

      // Filters
      const matchesUser = filterUser === 'Todos' ? true : evt.user.name === filterUser;
      const matchesSystem = filterSystem === 'Todos' ? true : evt.system === filterSystem;
      const matchesLevel = filterLevel === 'Todos' ? true : evt.level === filterLevel.toLowerCase();
      const matchesEntity = filterEntity === 'Todos' ? true : evt.entityType === filterEntity;
      const matchesEntityId = filterEntityId === '' ? true : evt.entityId?.toLowerCase().includes(filterEntityId.toLowerCase());
      const matchesIp = filterIp === '' ? true : evt.ip.includes(filterIp);
      const matchesResult = filterResult === 'Todos' ? true : evt.result === filterResult.toLowerCase();

      return matchesSearch && matchesTab && matchesUser && matchesSystem && matchesLevel && matchesEntity && matchesEntityId && matchesIp && matchesResult;
    });
  };

  const filteredEvents = getFilteredEvents();
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getLevelBadge = (level: AuditLevel) => {
    switch (level) {
      case 'critical':
        return { label: 'Crítico', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-650', icon: ShieldAlert };
      case 'alteration':
        return { label: 'Alteração', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: PenLine };
      case 'informative':
        return { label: 'Info', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-600', icon: Info };
      case 'access':
        return { label: 'Acesso', bg: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-600', icon: LogIn };
      case 'deletion':
        return { label: 'Exclusão', bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-600', icon: Trash2 };
    }
  };

  return (
    <div className="w-full text-left pt-1 pb-10 bg-[#F7F7FA] min-h-screen select-none">
      
      {/* Toast message alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-brand text-white p-3.5 rounded-2xl shadow-xl border border-brand/50 animate-in slide-in-from-top-4 duration-300 flex items-center justify-between gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span className="text-[11.5px] font-bold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-0.5 text-white/70 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E5EF] pb-4 mb-4 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand" />
              <h1 className="text-[18px] 2xl:text-[20px] font-black tracking-tight text-slate-950">Auditoria</h1>
              
              {/* Tooltip Imutabilidade */}
              <div className="group relative cursor-pointer">
                <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                <div className="absolute left-0 bottom-6 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2.5 rounded-xl shadow-lg w-[260px] z-50 leading-relaxed font-semibold">
                  🛡️ **Imutabilidade total:** todos os logs de auditoria da Basileia Pay são somente-leitura. Nenhum dado pode ser editado, excluído ou alterado por qualquer usuário ou nível de permissão.
                </div>
              </div>
            </div>
            <p className="text-slate-400 font-semibold text-[10.5px] 2xl:text-[11px] tracking-tight">
              Central forense de eventos do sistema com rastreabilidade completa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => triggerToast('Filtro salvo como busca rápida.')}
              className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white border border-[#E7E5EF] hover:bg-brand-soft rounded-xl text-[10px] font-black text-slate-700 shadow-sm transition-all h-[30px]"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              Salvar busca
            </button>
            <button 
              onClick={() => triggerToast('Exportando logs para CSV...')}
              className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white border border-[#E7E5EF] hover:bg-brand-soft rounded-xl text-[10px] font-black text-slate-700 shadow-sm transition-all h-[30px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              Exportar
            </button>
            <button 
              onClick={() => triggerToast('Modo de investigação criminal iniciado.')}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1 bg-brand hover:bg-brand-deep text-white rounded-xl text-[10px] font-black shadow-sm transition-all h-[30px] uppercase tracking-tight"
            >
              <Shield className="w-4 h-4 shrink-0" />
              Investigação
            </button>
          </div>
        </div>

        {/* Two-row horizontal filters panel */}
        <div className="bg-white border border-[#E7E5EF] rounded-2xl p-3 shadow-sm mb-4 space-y-2.5">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Período</label>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="hoje">Hoje</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Usuário</label>
              <select 
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Todos">Todos</option>
                <option value="Vinícius Admin">Vinícius Admin</option>
                <option value="Mariana Santos">Mariana Santos</option>
                <option value="Rafael Oliveira">Rafael Oliveira</option>
                <option value="Sistema">Sistema</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Sistema</label>
              <select 
                value={filterSystem}
                onChange={(e) => setFilterSystem(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Todos">Todos</option>
                <option value="Basileia Pay">Basileia Pay</option>
                <option value="Mercado Pago">Mercado Pago</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nível</label>
              <select 
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Todos">Todos</option>
                <option value="Critical">Crítico</option>
                <option value="Alteration">Alteração</option>
                <option value="Informative">Informativo</option>
                <option value="Access">Acesso</option>
                <option value="Deletion">Exclusão</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Busca Rápida</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="ID da entidade, usuário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-50">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Entidade</label>
              <select 
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Todos">Todas</option>
                <option value="Pagamento">Pagamento</option>
                <option value="Reembolso">Reembolso</option>
                <option value="Checkout">Checkout</option>
                <option value="Gateway">Gateway</option>
                <option value="Usuário">Usuário</option>
                <option value="Webhook">Webhook</option>
                <option value="Assinatura">Assinatura</option>
                <option value="Configuração">Configuração</option>
              </select>
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">ID Entidade</label>
              <input 
                type="text"
                placeholder="Ex: REE-2024..."
                value={filterEntityId}
                onChange={(e) => setFilterEntityId(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">IP de Origem</label>
              <input 
                type="text"
                placeholder="Ex: 177.12..."
                value={filterIp}
                onChange={(e) => setFilterIp(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Resultado</label>
              <select 
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="w-full bg-slate-50 border border-[#E7E5EF] rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
              >
                <option value="Todos">Todos</option>
                <option value="Success">Sucesso</option>
                <option value="Failed">Falha</option>
                <option value="Blocked">Bloqueado</option>
              </select>
            </div>

            <div className="flex items-end justify-end gap-1.5 pb-0.5">
              {(filterUser !== 'Todos' || filterSystem !== 'Todos' || filterLevel !== 'Todos' || filterEntity !== 'Todos' || filterEntityId !== '' || filterIp !== '' || filterResult !== '' || searchQuery !== '') && (
                <button 
                  onClick={() => {
                    setFilterUser('Todos');
                    setFilterSystem('Todos');
                    setFilterLevel('Todos');
                    setFilterEntity('Todos');
                    setFilterEntityId('');
                    setFilterIp('');
                    setFilterResult('Todos');
                    setSearchQuery('');
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-[10px] font-black w-full transition-all h-[32px] border border-red-150"
                >
                  <X className="w-3.5 h-3.5" />
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Interactive layout: Timeline and table split */}
        <div className="flex flex-col lg:flex-row gap-4 items-start w-full relative">
          
          {/* Main List Section */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            
            <div className="bg-white rounded-2xl border border-[#E7E5EF] shadow-sm overflow-hidden flex flex-col transition-all">
              
              {/* Tab options + Realtime switcher */}
              <div className="border-b border-slate-100 bg-[#FAF9FF]/40 px-3 py-0 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'all', label: 'Todos', count: filteredEvents.length },
                    { id: 'critical', label: 'Críticos', count: filteredEvents.filter(x => x.level === 'critical').length, error: true },
                    { id: 'alteration', label: 'Alterações', count: filteredEvents.filter(x => x.level === 'alteration').length },
                    { id: 'access', label: 'Acessos', count: filteredEvents.filter(x => x.level === 'access' || x.category === 'ACESSO').length },
                    { id: 'deletion', label: 'Exclusões', count: filteredEvents.filter(x => x.level === 'deletion' || x.category === 'EXCLUSÃO').length }
                  ].map((t) => {
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={cn(
                          "px-3 py-2 text-[9.5px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5",
                          isActive ? "border-brand text-brand font-black" : "border-transparent text-slate-500 hover:text-brand"
                        )}
                      >
                        {t.label}
                        {t.count !== undefined && (
                          <span className={cn(
                            "px-1.5 py-0.2 rounded-full text-[8px] font-black leading-none",
                            isActive ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-500",
                            t.error && t.count > 0 ? "bg-red-50 text-red-650" : ""
                          )}>
                            {t.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Real-time green dot switcher */}
                <button 
                  onClick={() => setRealtimeActive(prev => !prev)}
                  className="flex items-center gap-2 px-3 py-2 text-[9.5px] font-black uppercase text-slate-655"
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    realtimeActive ? 'bg-green-500 animate-pulse' : 'bg-slate-350'
                  )} />
                  <span>Tempo Real {realtimeActive ? 'Ativo' : 'Pausado'}</span>
                </button>
              </div>

              {/* hybrid layout structure: vertical timeline + data table */}
              <div className="w-full overflow-x-auto no-scrollbar relative flex">
                
                {/* Timeline column */}
                <div className="w-[18px] shrink-0 relative flex flex-col items-center">
                  <div className="absolute top-4 bottom-4 w-0.5 bg-slate-100" />
                  {paginatedEvents.map((evt, idx) => {
                    const lInfo = getLevelBadge(evt.level);
                    return (
                      <div 
                        key={`tl-${evt.id}`}
                        style={{ height: '54px', top: `${idx * 54 + 20}px` }}
                        className="absolute flex items-center justify-center w-full"
                      >
                        <div className={cn("w-2 h-2 rounded-full ring-4 ring-white z-10", lInfo.dot)} />
                      </div>
                    );
                  })}
                </div>

                {/* Tabela */}
                <table className="w-full min-w-[1000px] text-left text-xs table-fixed flex-1">
                  <colgroup>
                    <col className="w-[15%]"/>  {/* Data/hora */}
                    <col className="w-[20%]"/>  {/* Evento */}
                    <col className="w-[30%]"/>  {/* Detalhes */}
                    <col className="w-[15%]"/>  {/* Usuário */}
                    <col className="w-[10%]"/>  {/* Sistema */}
                    <col className="w-[10%]"/>  {/* IP */}
                  </colgroup>
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/40">
                      <th className="px-3 py-2">Data/Hora</th>
                      <th className="px-3 py-2">Evento</th>
                      <th className="px-3 py-2">Detalhes</th>
                      <th className="px-3 py-2">Usuário</th>
                      <th className="px-3 py-2">Sistema</th>
                      <th className="px-3 py-2 text-right">IP de Origem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-655">
                    {paginatedEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-16 text-center text-slate-400 font-bold">
                          Nenhum evento forense encontrado para os filtros ativos.
                        </td>
                      </tr>
                    ) : (
                      paginatedEvents.map((evt) => {
                        const lInfo = getLevelBadge(evt.level);
                        const isSelected = selectedEvent?.id === evt.id;
                        const isCritical = evt.level === 'critical';
                        const isReviewed = reviewedEvents.includes(evt.id);

                        return (
                          <tr 
                            key={evt.id}
                            onClick={() => setSelectedEvent(evt)}
                            className={cn(
                              "hover:bg-slate-55/20 cursor-pointer h-[54px] transition-all relative border-l-2",
                              isSelected ? "bg-[#FAF9FF] border-l-brand" : "border-l-transparent",
                              isCritical && !isSelected ? "bg-red-50/20" : ""
                            )}
                          >
                            <td className="px-3 py-1.5 align-middle">
                              <span className="text-slate-900 font-black block">
                                {new Date(evt.timestamp).toLocaleTimeString('pt-BR')}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {new Date(evt.timestamp).toLocaleDateString('pt-BR')}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 align-middle">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 truncate block max-w-[130px]">{evt.event}</span>
                                {isReviewed && (
                                  <span className="px-1.5 py-0.2 bg-green-50 text-green-700 border border-green-200 rounded text-[7.5px] font-black uppercase">
                                    Revisado
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] font-black bg-brand/5 border border-brand/20 text-brand px-1.5 py-0.2 rounded mt-0.5 block w-fit leading-none uppercase">
                                {evt.category}
                              </span>
                            </td>
                            <td className="px-3 py-1.5 align-middle truncate max-w-[280px] text-slate-500 font-medium">
                              {evt.details}
                            </td>
                            <td className="px-3 py-1.5 align-middle">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                                  <User className="w-3 h-3" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-slate-800 font-bold block truncate">{evt.user.name}</span>
                                  <span className="text-[10px] text-slate-400 block">{evt.user.role}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-1.5 align-middle">
                              <span className="text-slate-850 font-bold block">{evt.system}</span>
                              <span className="text-[9.5px] text-slate-400 block uppercase font-black">{evt.environment}</span>
                            </td>
                            <td className="px-3 py-1.5 align-middle text-right">
                              <span className="font-mono text-slate-900 block">{evt.ip}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{evt.ipLocation || 'Desconhecido'}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

              </div>

              {/* Paginate selector footer */}
              <div className="p-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-550 bg-[#FAF9FF]/40 h-[38px]">
                <span>Mostrando {Math.min(filteredEvents.length, (currentPage - 1) * rowsPerPage + 1)} a {Math.min(filteredEvents.length, currentPage * rowsPerPage)} de {filteredEvents.length} eventos</span>
                
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">Exibir</span>
                    <select 
                      value={rowsPerPage} 
                      onChange={(e) => { setRowsPerPage(parseInt(e.target.value) || 10); setCurrentPage(1); }}
                      className="bg-white border border-[#E7E5EF] rounded px-1.5 py-0.5 text-[10.5px]"
                    >
                      <option value={10}>10 linhas</option>
                      <option value={25}>25 linhas</option>
                      <option value={50}>50 linhas</option>
                    </select>
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: Math.ceil(filteredEvents.length / rowsPerPage) }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button 
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-5.5 h-5.5 rounded text-[10px] font-bold flex items-center justify-center transition-colors",
                            pageNum === currentPage ? 'bg-brand/10 text-brand font-black border border-brand/20' : 'hover:bg-slate-100 text-slate-655'
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* DETALHE DO EVENTO LATERAL (320px) */}
          <div className="w-full lg:w-[320px] shrink-0 bg-white border border-[#E7E5EF] rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Detalhes do Evento</span>
              {selectedEvent && (
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-slate-55/20 rounded text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>

            {selectedEvent ? (
              <div className="space-y-4 text-xs font-semibold text-slate-655">
                
                {/* Bloco 1: Identificação */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand shrink-0" />
                    <span className="text-slate-900 font-black">{selectedEvent.event}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-brand/5 border border-brand/20 text-[9px] font-black text-brand uppercase block w-fit leading-none">
                    {selectedEvent.category}
                  </span>

                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1">
                    <span className="text-[8.5px] text-slate-400 uppercase block font-black">ID do Evento</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-700 truncate text-[10px] select-all">{selectedEvent.id}</span>
                      <button 
                        onClick={() => handleCopyText(selectedEvent.id, 'id')}
                        className="p-0.5 text-slate-400 hover:text-brand"
                      >
                        {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bloco 2: Usuário */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-400 uppercase block font-black">Usuário Operador</span>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-slate-800 font-bold block">{selectedEvent.user.name}</span>
                      <span className="text-[10px] text-slate-400 block">{selectedEvent.user.role}</span>
                    </div>
                  </div>
                </div>

                {/* Bloco 3: Sistema */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-400 uppercase block font-black">Sistema</span>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl">
                    <span className="text-slate-800 font-bold">{selectedEvent.system}</span>
                    <span className="px-1.5 py-0.2 bg-brand/5 border border-brand/20 text-[9px] rounded font-black text-brand uppercase">
                      {selectedEvent.environment}
                    </span>
                  </div>
                </div>

                {/* Bloco 4: IP */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-400 uppercase block font-black">IP de Origem</span>
                  <div className="bg-slate-50 p-2 rounded-xl flex justify-between items-center">
                    <span className="font-mono text-slate-800">{selectedEvent.ip}</span>
                    <span className="text-slate-400 text-[10px]">{selectedEvent.ipLocation || 'Curitiba, BR'}</span>
                  </div>
                </div>

                {/* Bloco 5: Entidade */}
                {selectedEvent.entityType && (
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-400 uppercase block font-black">Entidade Afetada</span>
                    <div className="bg-slate-50 p-2 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Tipo</span>
                        <span className="text-slate-900 font-bold">{selectedEvent.entityType}</span>
                      </div>
                      {selectedEvent.entityId && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">ID exato</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-slate-900 font-bold">{selectedEvent.entityId}</span>
                            <button 
                              onClick={() => handleCopyText(selectedEvent.entityId || '', 'entityId')}
                              className="text-slate-400 hover:text-brand"
                            >
                              {copiedField === 'entityId' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bloco 6: Detalhes */}
                <div className="space-y-1">
                  <span className="text-[8.5px] text-slate-400 uppercase block font-black">Detalhes da Ação</span>
                  <p className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-[11px] leading-relaxed">
                    {selectedEvent.details}
                  </p>
                </div>

                {/* Bloco 7: Metadados JSON */}
                {selectedEvent.metadata && (
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-400 uppercase block font-black">Metadados Brutos (JSON)</span>
                    <pre className="bg-slate-950 text-green-400 font-mono text-[9.5px] p-3 rounded-xl overflow-x-auto no-scrollbar max-h-[120px]">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Bloco 8: Ações Rápidas */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href={`/dashboard/audit/${selectedEvent.id}`}
                      className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[9.5px] font-black text-center text-slate-700 block transition-all"
                    >
                      Ver Detalhes
                    </Link>
                    <button 
                      onClick={() => triggerToast(`Histórico da entidade ${selectedEvent.entityId} filtrado.`)}
                      className="px-2 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[9.5px] font-black text-slate-700 transition-all"
                    >
                      Histórico
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => handleMarkAsReviewed(selectedEvent.id)}
                      disabled={reviewedEvents.includes(selectedEvent.id)}
                      className="w-full py-1.5 bg-white border border-brand/20 hover:bg-brand-soft text-brand text-[10px] font-black uppercase rounded-xl transition-all disabled:opacity-50"
                    >
                      {reviewedEvents.includes(selectedEvent.id) ? 'Revisado' : 'Marcar como Revisado'}
                    </button>
                    <button 
                      onClick={() => handleOpenIncident(selectedEvent.id)}
                      className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-750 text-[10px] font-black uppercase rounded-xl transition-all"
                    >
                      {incidents[selectedEvent.id] ? `Incidente: ${incidents[selectedEvent.id]}` : 'Abrir Incidente'}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 font-semibold text-xs space-y-2">
                <Terminal className="w-8 h-8 mx-auto text-slate-300" />
                <p>Selecione um evento na timeline para inspecionar os logs de auditoria.</p>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
