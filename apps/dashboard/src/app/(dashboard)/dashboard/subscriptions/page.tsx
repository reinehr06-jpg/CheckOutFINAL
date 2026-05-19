'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Repeat, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Download, 
  Copy, 
  ExternalLink,
  ChevronRight, 
  Trash2, 
  Pause, 
  Play, 
  Search, 
  SlidersHorizontal,
  CreditCard, 
  QrCode,
  Calendar,
  Mail,
  MoreVertical,
  CircleDollarSign,
  Settings,
  RefreshCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { cn } from '@/lib/utils';

// Types and status styling
type Subscription = {
  id: string;
  ref: string;
  criadoEm: string;
  cliente: string;
  email: string;
  cliId: string;
  plano: string;
  status: 'Ativa' | 'Em atraso' | 'Pausada' | 'Falha no pagamento' | 'Cancelada';
  ciclo: string;
  proximaCobranca: string;
  proximaCobrancaMeta: string;
  valor: number;
  inadimplencia: string;
  inadimplenciaPct: number;
  metodo: string;
  metodoDetalhe: string;
  checkout: string;
};

const STATUS_THEME: Record<string, { label: string; text: string; bg: string; border: string; dot: string }> = {
  'Ativa': { label: 'Ativa', text: 'text-green-700', bg: 'bg-green-50/40', border: 'border-green-200/50', dot: 'bg-green-500' },
  'Em atraso': { label: 'Em atraso', text: 'text-red-700', bg: 'bg-red-50/40', border: 'border-red-200/50', dot: 'bg-red-500' },
  'Pausada': { label: 'Pausada', text: 'text-blue-750', bg: 'bg-blue-50/40', border: 'border-blue-200/50', dot: 'bg-blue-550' },
  'Falha no pagamento': { label: 'Falha pagamento', text: 'text-red-800', bg: 'bg-red-50/40', border: 'border-red-200/50', dot: 'bg-red-700' },
  'Cancelada': { label: 'Cancelada', text: 'text-slate-500', bg: 'bg-slate-50/40', border: 'border-slate-200/50', dot: 'bg-slate-400' }
};

const initialSubscriptions: Subscription[] = [
  {
    id: '#ASS-892347',
    ref: 'sub_hN9x72h3c9d456ef',
    criadoEm: '15/04/2024',
    cliente: 'Mariana Souza',
    email: 'mariana@email.com',
    cliId: 'CLI-57829',
    plano: 'PRO Anual',
    status: 'Ativa',
    ciclo: 'Anual 12/12',
    proximaCobranca: '15/05/2024',
    proximaCobrancaMeta: 'Em 3 dias',
    valor: 1299.00,
    inadimplencia: '0% — Em dia',
    inadimplenciaPct: 0,
    metodo: 'Cartão',
    metodoDetalhe: 'VISA •••• 4242',
    checkout: 'Pagar.me Checkout Padrão'
  },
  {
    id: '#ASS-892344',
    ref: 'sub_j2k9s2k8s9f212a',
    criadoEm: '20/05/2023',
    cliente: 'Carlos Lima',
    email: 'carlos@email.com',
    cliId: 'CLI-89301',
    plano: 'PRO Mensal',
    status: 'Ativa',
    ciclo: 'Mensal 1/12',
    proximaCobranca: '20/05/2024',
    proximaCobrancaMeta: 'Em 8 dias',
    valor: 129.90,
    inadimplencia: '0% — Em dia',
    inadimplenciaPct: 0,
    metodo: 'Cartão',
    metodoDetalhe: 'Mastercard •••• 8888',
    checkout: 'Checkout Principal API'
  },
  {
    id: '#ASS-892349',
    ref: 'sub_f8s2j9sk10s29f8',
    criadoEm: '10/11/2023',
    cliente: 'Juliana Martins',
    email: 'juliana@email.com',
    cliId: 'CLI-48201',
    plano: 'BASIC Mensal',
    status: 'Em atraso',
    ciclo: 'Mensal 7/12',
    proximaCobranca: '10/05/2024',
    proximaCobrancaMeta: 'Há 6 dias em atraso',
    valor: 49.90,
    inadimplencia: '12% — 6 dias',
    inadimplenciaPct: 12,
    metodo: 'Cartão',
    metodoDetalhe: 'VISA •••• 1111',
    checkout: 'Checkout Integrado'
  },
  {
    id: '#ASS-892350',
    ref: 'sub_k9w2j8s9d201la8',
    criadoEm: '12/05/2024',
    cliente: 'Pedro Alves',
    email: 'pedro@email.com',
    cliId: 'CLI-10294',
    plano: 'PRO Anual',
    status: 'Ativa',
    ciclo: 'Anual 2/12',
    proximaCobranca: '12/07/2024',
    proximaCobrancaMeta: 'Em 57 dias',
    valor: 1299.00,
    inadimplencia: '0% — Em dia',
    inadimplenciaPct: 0,
    metodo: 'PIX',
    metodoDetalhe: 'Chave Aleatória',
    checkout: 'Checkout Principal API'
  },
  {
    id: '#ASS-892350.1',
    ref: 'sub_f2j8sk92j1d029f',
    criadoEm: '01/01/2024',
    cliente: 'Fernanda Rocha',
    email: 'fernanda@email.com',
    cliId: 'CLI-89302',
    plano: 'BASIC Mensal',
    status: 'Pausada',
    ciclo: 'Mensal',
    proximaCobranca: 'Pausada',
    proximaCobrancaMeta: 'Sem previsão',
    valor: 49.90,
    inadimplencia: '0% — Em dia',
    inadimplenciaPct: 0,
    metodo: 'Cartão',
    metodoDetalhe: 'Mastercard •••• 2222',
    checkout: 'Checkout Integrado'
  },
  {
    id: '#ASS-892352',
    ref: 'sub_d8s2jk9s2a192aa',
    criadoEm: '18/03/2024',
    cliente: 'Rafael Mendes',
    email: 'rafael@email.com',
    cliId: 'CLI-48202',
    plano: 'PRO Mensal',
    status: 'Falha no pagamento',
    ciclo: 'Mensal 2/12',
    proximaCobranca: '18/05/2024',
    proximaCobrancaMeta: 'Falha na cobrança',
    valor: 129.90,
    inadimplencia: 'Falha',
    inadimplenciaPct: 100,
    metodo: 'Cartão',
    metodoDetalhe: 'VISA •••• 5555',
    checkout: 'Checkout Principal API'
  },
  {
    id: '#ASS-892353',
    ref: 'sub_k9w2j8s9d201la9',
    criadoEm: '05/05/2024',
    cliente: 'Beatriz Carvalho',
    email: 'beatriz@email.com',
    cliId: 'CLI-10295',
    plano: 'PREMIUM Anual',
    status: 'Ativa',
    ciclo: 'Anual 1/12',
    proximaCobranca: '05/06/2024',
    proximaCobrancaMeta: 'Em 20 dias',
    valor: 2499.00,
    inadimplencia: '0% — Em dia',
    inadimplenciaPct: 0,
    metodo: 'Cartão',
    metodoDetalhe: 'Amex •••• 9999',
    checkout: 'Pagar.me Checkout Padrão'
  },
  {
    id: '#ASS-892354',
    ref: 'sub_f2j8sk92j1d029g',
    criadoEm: '15/02/2024',
    cliente: 'Lucas Ferreira',
    email: 'lucas@email.com',
    cliId: 'CLI-89303',
    plano: 'BASIC Mensal',
    status: 'Cancelada',
    ciclo: 'Mensal',
    proximaCobranca: 'Cancelada',
    proximaCobrancaMeta: 'Cobranças encerradas',
    valor: 49.90,
    inadimplencia: '0% — Em dia',
    inadimplenciaPct: 0,
    metodo: 'PIX',
    metodoDetalhe: 'Chave Aleatória',
    checkout: 'Checkout Integrado'
  }
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(initialSubscriptions[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'Todas' | 'Ativas' | 'Pausadas' | 'Canceladas' | 'Em dia' | 'Em atraso' | 'Falha no pagamento'>('Todas');
  const [filterPlan, setFilterPlan] = useState('Todos');
  const [filterMethod, setFilterMethod] = useState('Todos');

  // Modal States
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNewSubModal, setShowNewSubModal] = useState(false);

  // New Subscription Form
  const [newSubName, setNewSubName] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubPlan, setNewSubPlan] = useState('PRO Mensal');
  const [newSubMethod, setNewSubMethod] = useState('Cartão');
  const [newSubValue, setNewSubValue] = useState('129,90');

  // Change Plan State
  const [selectedPlanOption, setSelectedPlanOption] = useState('PREMIUM Anual');

  // Drawer Tabs
  const [drawerTab, setDrawerTab] = useState<'geral' | 'historico' | 'cobrancas' | 'timeline' | 'notas'>('geral');

  // Active Context Menu Dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  // Modals Actions
  const handleConfirmPause = () => {
    if (!selectedSub) return;
    setSubscriptions(prev => prev.map(s => {
      if (s.id === selectedSub.id) {
        const updated = { ...s, status: 'Pausada' as const, proximaCobranca: 'Pausada', proximaCobrancaMeta: 'Sem previsão' };
        setSelectedSub(updated);
        return updated;
      }
      return s;
    }));
    setShowPauseModal(false);
    triggerSuccessAlert(`Assinatura ${selectedSub.id} pausada com sucesso.`);
  };

  const handleConfirmCancel = () => {
    if (!selectedSub) return;
    setSubscriptions(prev => prev.map(s => {
      if (s.id === selectedSub.id) {
        const updated = { ...s, status: 'Cancelada' as const, proximaCobranca: 'Cancelada', proximaCobrancaMeta: 'Cobranças encerradas' };
        setSelectedSub(updated);
        return updated;
      }
      return s;
    }));
    setShowCancelModal(false);
    triggerSuccessAlert(`Assinatura ${selectedSub.id} cancelada com sucesso.`);
  };

  const handleConfirmChangePlan = () => {
    if (!selectedSub) return;
    const value = selectedPlanOption === 'PREMIUM Anual' ? 2499.00 : selectedPlanOption === 'PRO Anual' ? 1299.00 : 129.90;
    setSubscriptions(prev => prev.map(s => {
      if (s.id === selectedSub.id) {
        const updated = { ...s, plano: selectedPlanOption, valor: value };
        setSelectedSub(updated);
        return updated;
      }
      return s;
    }));
    setShowPlanModal(false);
    triggerSuccessAlert(`Plano da assinatura ${selectedSub.id} alterado para ${selectedPlanOption}.`);
  };

  const handleConfirmUpdatePayment = () => {
    if (!selectedSub) return;
    setSubscriptions(prev => prev.map(s => {
      if (s.id === selectedSub.id) {
        const updated = { ...s, metodoDetalhe: 'VISA •••• 9911 (Atualizado)' };
        setSelectedSub(updated);
        return updated;
      }
      return s;
    }));
    setShowPaymentModal(false);
    triggerSuccessAlert(`Método de pagamento atualizado para a assinatura ${selectedSub.id}.`);
  };

  const handleCreateNewSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubEmail) {
      alert('Preencha os campos obrigatórios.');
      return;
    }
    const val = parseFloat(newSubValue.replace(',', '.'));
    const newSubscription: Subscription = {
      id: `#ASS-${Math.floor(100000 + Math.random() * 900005)}`,
      ref: `sub_${Math.random().toString(36).substring(2, 17)}`,
      criadoEm: '19/05/2026',
      cliente: newSubName,
      email: newSubEmail,
      cliId: `CLI-${Math.floor(10000 + Math.random() * 90000)}`,
      plano: newSubPlan,
      status: 'Ativa',
      ciclo: newSubPlan.includes('Anual') ? 'Anual 1/12' : 'Mensal 1/12',
      proximaCobranca: '19/06/2026',
      proximaCobrancaMeta: 'Em 30 dias',
      valor: isNaN(val) ? 129.90 : val,
      inadimplencia: '0% — Em dia',
      inadimplenciaPct: 0,
      metodo: newSubMethod,
      metodoDetalhe: newSubMethod === 'Cartão' ? 'VISA •••• 5521' : 'Chave Aleatória',
      checkout: 'Criado via Painel Administrador'
    };

    setSubscriptions(prev => [newSubscription, ...prev]);
    setShowNewSubModal(false);
    triggerSuccessAlert(`Assinatura para ${newSubName} criada com sucesso.`);
    
    // Clear forms
    setNewSubName('');
    setNewSubEmail('');
  };

  // Filter calculations
  const filteredSubscriptions = subscriptions.filter(sub => {
    // Search filter
    const matchesSearch = 
      sub.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plano.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status Tab filter
    let matchesTab = true;
    if (filterTab === 'Ativas') matchesTab = sub.status === 'Ativa';
    else if (filterTab === 'Pausadas') matchesTab = sub.status === 'Pausada';
    else if (filterTab === 'Canceladas') matchesTab = sub.status === 'Cancelada';
    else if (filterTab === 'Em dia') matchesTab = sub.status === 'Ativa' && sub.inadimplenciaPct === 0;
    else if (filterTab === 'Em atraso') matchesTab = sub.status === 'Em atraso';
    else if (filterTab === 'Falha no pagamento') matchesTab = sub.status === 'Falha no pagamento';

    // Advanced filters
    let matchesPlan = filterPlan === 'Todos' ? true : sub.plano.toLowerCase().includes(filterPlan.toLowerCase());
    let matchesMethod = filterMethod === 'Todos' ? true : sub.metodo === filterMethod;

    return matchesSearch && matchesTab && matchesPlan && matchesMethod;
  });

  // Limit to exactly 5 lines for first fold dashboard fit
  const displayedSubscriptions = filteredSubscriptions.slice(0, 5);

  return (
    <div className="w-full pt-1 select-none text-left pb-10">

      {/* Success alert banner */}
      {successAlert && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white p-3.5 rounded-2xl shadow-xl border border-green-400 animate-in slide-in-from-top-4 duration-300 flex items-center justify-between gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="text-[11.5px] font-bold">{successAlert}</span>
          </div>
          <button onClick={() => setSuccessAlert(null)} className="p-0.5 text-white/70 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal: New Subscription */}
      {showNewSubModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewSub} className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-brand">
                <Plus className="w-5 h-5 shrink-0" />
                <h3 className="text-slate-950 font-black text-sm">Nova Assinatura Recorrente</h3>
              </div>
              <button type="button" onClick={() => setShowNewSubModal(false)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Souza"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">E-mail do Comprador</label>
                <input
                  type="email"
                  required
                  placeholder="comprador@email.com"
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  className="w-full bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Plano Base</label>
                  <select
                    value={newSubPlan}
                    onChange={(e) => setNewSubPlan(e.target.value)}
                    className="w-full bg-white border border-[#E8DDFD] rounded-xl px-2 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                  >
                    <option value="PRO Mensal">PRO Mensal</option>
                    <option value="PRO Anual">PRO Anual</option>
                    <option value="BASIC Mensal">BASIC Mensal</option>
                    <option value="PREMIUM Anual">PREMIUM Anual</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Método Inicial</label>
                  <select
                    value={newSubMethod}
                    onChange={(e) => setNewSubMethod(e.target.value)}
                    className="w-full bg-white border border-[#E8DDFD] rounded-xl px-2 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                  >
                    <option value="Cartão">Cartão de Crédito</option>
                    <option value="PIX">PIX Automático</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Valor do Ciclo (R$)</label>
                <input
                  type="text"
                  placeholder="129,90"
                  value={newSubValue}
                  onChange={(e) => setNewSubValue(e.target.value)}
                  className="w-full bg-white border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewSubModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 transition-all rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand text-white hover:bg-brand-deep transition-all rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px]"
              >
                Gerar Assinatura
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Confirm Pause */}
      {showPauseModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-500 border-b border-slate-100 pb-3 mb-4">
              <Pause className="w-5 h-5 shrink-0" />
              <h3 className="text-slate-950 font-black text-sm">Pausar Recorrência</h3>
            </div>
            
            <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-4">
              Você está prestes a pausar a assinatura do cliente <span className="font-bold text-slate-800">{selectedSub.cliente}</span>. 
              Isso interromperá as cobranças automáticas no próximo ciclo ({selectedSub.proximaCobranca}).
            </p>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10.5px] font-bold text-slate-600 mb-4">
              ℹ️ A assinatura poderá ser reativada a qualquer momento, retomando a mesma grade de ciclos.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px]"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmPause}
                className="px-4 py-1.5 bg-brand text-white hover:bg-brand-deep rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px]"
              >
                Confirmar Pausa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Cancel */}
      {showCancelModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 border-b border-slate-100 pb-3 mb-4">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h3 className="text-slate-950 font-black text-sm">Cancelar Assinatura Definitivamente</h3>
            </div>
            
            <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-4">
              Confirma o cancelamento da assinatura de <span className="font-bold text-slate-800">{selectedSub.cliente}</span> ({selectedSub.id})? 
              Esta ação é <span className="font-black text-red-600">irreversível</span> e o cliente perderá o acesso aos produtos recorrentes.
            </p>

            <div className="bg-red-50 border border-red-100 p-3 rounded-2xl text-[10.5px] font-bold text-red-750 mb-4">
              ⚠️ Cancelamentos imediatos interrompem a transação no adquirente instantaneamente.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px]"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px]"
              >
                Cancelar Assinatura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Change Plan */}
      {showPlanModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-brand border-b border-slate-100 pb-3 mb-4">
              <Repeat className="w-5 h-5 shrink-0" />
              <h3 className="text-slate-950 font-black text-sm">Alterar Plano de Cobrança</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Assinatura Selecionada</span>
                <span className="text-xs font-black text-slate-805 block mt-0.5">{selectedSub.id} ({selectedSub.cliente})</span>
                <span className="text-[11px] text-slate-500 font-semibold block">Plano atual: {selectedSub.plano} (R$ {selectedSub.valor.toLocaleString('pt-BR')})</span>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Selecione o Novo Plano</label>
                <select
                  value={selectedPlanOption}
                  onChange={(e) => setSelectedPlanOption(e.target.value)}
                  className="w-full bg-white border border-[#E8DDFD] rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand"
                >
                  <option value="BASIC Mensal">BASIC Mensal — R$ 49,90/mês</option>
                  <option value="PRO Mensal">PRO Mensal — R$ 129,90/mês</option>
                  <option value="PRO Anual">PRO Anual — R$ 1.299,00/ano</option>
                  <option value="PREMIUM Anual">PREMIUM Anual — R$ 2.499,00/ano</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px]"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmChangePlan}
                className="px-4 py-1.5 bg-brand text-white hover:bg-brand-deep rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px]"
              >
                Atualizar Plano
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Payment */}
      {showPaymentModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8DDFD] shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-brand border-b border-slate-100 pb-3 mb-4">
              <CreditCard className="w-5 h-5 shrink-0" />
              <h3 className="text-slate-950 font-black text-sm">Atualizar Dados de Pagamento</h3>
            </div>

            <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-4">
              Isso atualizará o token de cartão de crédito active para a assinatura de <span className="font-bold text-slate-850">{selectedSub.cliente}</span>. 
              As próximas tentativas de cobrança usarão a nova bandeira vinculada.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Bandeira / Mascaramento do Cartão</label>
                <input
                  type="text"
                  placeholder="Ex: VISA •••• 9911"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-1.5 border border-[#E8DDFD] hover:bg-slate-50 rounded-xl text-[10.5px] font-black text-slate-700 uppercase tracking-tight h-[32px]"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmUpdatePayment}
                className="px-4 py-1.5 bg-brand text-white hover:bg-brand-deep rounded-xl text-[10.5px] font-black uppercase tracking-tight h-[32px]"
              >
                Gravar Método
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE TWO-PANEL WORKSPACE */}
      <div className="flex gap-4 w-full items-start relative">
        
        {/* CENTER workspace area */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DDFD]/60 pb-2 shrink-0">
            <div className="space-y-0.5">
              <h1 className="text-[18px] 2xl:text-[20px] font-black tracking-tight text-slate-950">Assinaturas</h1>
              <p className="text-slate-400 font-semibold text-[10.5px] 2xl:text-[11px] tracking-tight">
                Gestão completa de assinaturas recorrentes e recorrência financeira.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => triggerSuccessAlert('Exportando relatório geral de assinaturas...')}
                className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white border border-[#E8DDFD] hover:bg-brand-soft rounded-xl text-[10px] font-black text-slate-700 shadow-sm transition-all h-[30px]"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                Exportar
              </button>
              
              <button
                onClick={() => setShowNewSubModal(true)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1 bg-brand hover:bg-brand-deep text-white rounded-xl text-[10px] font-black shadow-sm transition-all h-[30px] uppercase tracking-tight"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Nova assinatura
              </button>
            </div>
          </div>

          {/* 4 Premium Extremely Lightweight Horizontal KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 shrink-0">
            {[
              { label: 'MRR (Receita recorrente)', val: 'R$ 1.342.870,50', change: '+12,45%', icon: CircleDollarSign, bg: 'bg-[#F4EEFF] text-[#6D3FF3]', border: 'border-[#E9DDFE]' },
              { label: 'Assinaturas ativas', val: '12.784', change: '+8,21%', icon: Users, bg: 'bg-green-55/10 text-green-700', border: 'border-[#E9DDFE]' },
              { label: 'Taxa de sucesso', val: '96,42%', change: '+1,32%', icon: CheckCircle2, bg: 'bg-blue-55/10 text-blue-750', border: 'border-[#E9DDFE]' },
              { label: 'Inadimplência', val: '5,64%', change: '+0,73%', icon: AlertCircle, bg: 'bg-red-55/10 text-red-800', border: 'border-[#E9DDFE]', warning: true }
            ].map((c) => (
              <div key={c.label} className={cn(
                "bg-white/85 backdrop-blur-md border rounded-[14px] px-3 py-2 shadow-sm flex items-center justify-between h-[64px] transition-all",
                c.border
              )}>
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 text-left">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none block">{c.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-1 leading-none">
                    <span className="text-[13.5px] font-black text-slate-900 leading-none">{c.val}</span>
                    <span className={cn(
                      "font-black px-1 py-0.2 rounded text-[7px] leading-none shrink-0",
                      c.warning 
                        ? 'bg-red-50 text-red-650' 
                        : c.change.startsWith('+') ? 'bg-green-55/10 text-green-700' : 'bg-slate-100 text-slate-500'
                    )}>
                      {c.change}
                    </span>
                  </div>
                </div>
                <div className={cn("p-1.5 rounded-lg shrink-0 flex items-center justify-center ml-2 bg-slate-50", c.bg)}>
                  <c.icon className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Table Container Ledger Card */}
          <div className="bg-white rounded-2xl border border-[#E7E4F3] shadow-sm overflow-hidden flex flex-col transition-all">
            
            {/* Status Tabs */}
            <div className="border-b border-slate-100 bg-[#FAF9FF]/40 px-3 py-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(['Todas', 'Ativas', 'Pausadas', 'Canceladas', 'Em dia', 'Em atraso', 'Falha no pagamento'] as const).map((tab) => {
                const isActive = filterTab === tab;
                const count = tab === 'Todas' ? subscriptions.length : subscriptions.filter(s => {
                  if (tab === 'Ativas') return s.status === 'Ativa';
                  if (tab === 'Pausadas') return s.status === 'Pausada';
                  if (tab === 'Canceladas') return s.status === 'Cancelada';
                  if (tab === 'Em dia') return s.status === 'Ativa' && s.inadimplenciaPct === 0;
                  if (tab === 'Em atraso') return s.status === 'Em atraso';
                  if (tab === 'Falha no pagamento') return s.status === 'Falha no pagamento';
                  return false;
                }).length;

                return (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={cn(
                      "px-2.5 py-2 text-[9px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5",
                      isActive 
                        ? "border-brand text-brand font-black" 
                        : "border-transparent text-slate-500 hover:text-brand"
                    )}
                  >
                    {tab}
                    <span className={cn(
                      "px-1.5 py-0.2 rounded-full text-[7.5px] font-black leading-none",
                      isActive ? "bg-brand/10 text-brand" : "bg-slate-100 text-slate-455"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compact Filters Bar */}
            <div className="px-3 py-1.5 border-b border-slate-100 flex flex-wrap items-center gap-2 bg-white">
              
              {/* Period Picker */}
              <button className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-[#E8DDFD]/60 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-all h-[30px] shrink-0">
                <Calendar className="w-3 h-3 text-slate-450" />
                <span>01/05/2024 - 16/05/2024</span>
              </button>

              {/* Dropdowns */}
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="bg-slate-50 border border-[#E8DDFD]/60 rounded-lg px-2 py-0.5 text-[11px] font-bold text-slate-750 focus:outline-none focus:border-brand h-[30px]"
              >
                <option value="Todos">Plano: Todos</option>
                <option value="PRO">Plano PRO</option>
                <option value="BASIC">Plano BASIC</option>
                <option value="PREMIUM">Plano PREMIUM</option>
              </select>

              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="bg-slate-50 border border-[#E8DDFD]/60 rounded-lg px-2 py-0.5 text-[11px] font-bold text-slate-750 focus:outline-none focus:border-brand h-[30px]"
              >
                <option value="Todos">Método: Todos</option>
                <option value="Cartão">Cartão</option>
                <option value="PIX">PIX</option>
              </select>

              {/* Search query input */}
              <div className="relative flex-1 min-w-[140px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente, e-mail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E8DDFD]/60 rounded-lg pl-7.5 pr-3 py-1 h-[30px] text-[11px] font-semibold text-slate-900 focus:outline-none focus:border-brand"
                />
              </div>

              {/* Reset Filters & Config */}
              <div className="flex gap-1.5 shrink-0">
                {(searchQuery !== '' || filterPlan !== 'Todos' || filterMethod !== 'Todos' || filterTab !== 'Todas') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setFilterPlan('Todos'); setFilterMethod('Todos'); setFilterTab('Todas'); }}
                    className="flex items-center justify-center gap-1 px-2.5 h-[30px] border border-red-200 hover:bg-red-50 rounded-lg text-[11px] font-black text-red-650 transition-colors"
                  >
                    Limpar
                  </button>
                )}
                <button className="h-[30px] w-[30px] flex items-center justify-center border border-[#E8DDFD] hover:bg-slate-50 rounded-lg text-slate-455 transition-colors">
                  <SlidersHorizontal className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Table Ledger: Responsive table with internal horizontal scroll */}
            <div className="w-full min-w-0 overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[1100px] text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[45px]"/> {/* Selection */}
                  <col className="w-[12%]"/>  {/* Assinatura */}
                  <col className="w-[20%]"/>  {/* Cliente */}
                  <col className="w-[11%]"/>  {/* Plano */}
                  <col className="w-[11%]"/>  {/* Status */}
                  <col className="w-[8%]"/>   {/* Ciclo */}
                  <col className="w-[11%]"/>  {/* Próx Cobrança */}
                  <col className="w-[9%]"/>   {/* Valor */}
                  <col className="w-[10%]"/>  {/* Inadimplência */}
                  <col className="w-[11%]"/>  {/* Método */}
                  <col className="w-[130px]"/> {/* Ações */}
                </colgroup>
                <thead>
                  <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/40">
                    <th className="px-3 py-2">
                      <input type="checkbox" className="rounded border-slate-300 text-brand focus:ring-brand w-3.5 h-3.5" readOnly checked={false} />
                    </th>
                    <th className="px-3 py-2">Assinatura</th>
                    <th className="px-3 py-2">Cliente</th>
                    <th className="px-3 py-2">Plano</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Ciclo</th>
                    <th className="px-3 py-2">Próx. Cobrança</th>
                    <th className="px-3 py-2">Valor</th>
                    <th className="px-3 py-2">Inadimplência</th>
                    <th className="px-3 py-2">Método</th>
                    <th className="px-3 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 font-semibold text-slate-650">
                  {displayedSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="w-7 h-7 text-slate-300" />
                          <span className="text-slate-455 font-bold text-xs">Nenhuma assinatura corresponde aos filtros.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedSubscriptions.map((sub) => {
                      const isSelected = selectedSub?.id === sub.id;
                      const meta = STATUS_THEME[sub.status] || STATUS_THEME['Cancelada'];

                      return (
                        <tr 
                          key={sub.id} 
                          onClick={() => setSelectedSub(sub)}
                          className={cn(
                            "hover:bg-slate-50/40 cursor-pointer transition-all duration-150 h-[50px] 2xl:h-[54px]",
                            isSelected ? "bg-[#FAF9FF] border-l-2 border-brand" : ""
                          )}
                        >
                          <td className="px-3 py-1.5 align-middle" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded border-slate-300 text-brand focus:ring-brand w-3.5 h-3.5" readOnly checked={isSelected} />
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className="font-bold text-slate-900 block leading-tight text-[13px]">{sub.id}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5">Criada {sub.criadoEm}</span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7.5 h-7.5 rounded-full bg-brand-soft flex items-center justify-center text-brand font-black text-[10px] shrink-0">
                                {sub.cliente.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block leading-tight truncate text-[13px]">{sub.cliente}</span>
                                <span className="text-[11px] text-slate-400 block mt-0.5 truncate">{sub.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className="text-slate-900 font-bold block text-[13px]">{sub.plano}</span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase border shrink-0",
                              meta.text, meta.bg, meta.border
                            )}>
                              <div className={cn("w-1 h-1 rounded-full shrink-0", meta.dot)} />
                              {meta.label}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className="text-slate-500 font-bold block text-[12px]">{sub.ciclo}</span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className="text-slate-800 font-bold block text-[13px]">{sub.proximaCobranca}</span>
                            <span className={cn(
                              "text-[11px] font-semibold block mt-0.5",
                              sub.proximaCobrancaMeta.includes('atraso') ? 'text-red-500 font-bold' : 'text-slate-455'
                            )}>{sub.proximaCobrancaMeta}</span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className="text-slate-900 font-black block text-[13px]">
                              R$ {sub.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold inline-block leading-none",
                              sub.inadimplenciaPct > 0 ? 'bg-red-50 text-red-650' : 'bg-slate-50 text-slate-500'
                            )}>
                              {sub.inadimplencia}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 align-middle">
                            <div className="flex items-center gap-1.5 text-slate-750 min-w-0">
                              {sub.metodo === 'Cartão' ? <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <QrCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span className="text-[11px] font-mono">{sub.metodoDetalhe}</span>
                            </div>
                          </td>
                          
                          {/* Premium actions button with Gerenciar and Context Dots */}
                          <td className="px-3 py-1.5 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap relative">
                              <button 
                                onClick={() => { setSelectedSub(sub); setDrawerTab('geral'); }}
                                className="h-[28px] rounded-lg border border-[#E8DDFD] hover:bg-slate-50 transition-colors bg-white px-2.5 text-[10.5px] font-black text-slate-700 shadow-sm"
                              >
                                Gerenciar
                              </button>

                              <button 
                                onClick={() => setActiveDropdown(activeDropdown === sub.id ? null : sub.id)}
                                className="flex h-[28px] w-[28px] items-center justify-center rounded-lg border border-[#E8DDFD] hover:bg-slate-50 transition-colors bg-white shadow-sm"
                              >
                                <MoreVertical className="h-3.5 w-3.5 text-slate-500" />
                              </button>

                              {activeDropdown === sub.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                  <div className="absolute right-0 top-8.5 w-48 bg-white border border-[#E8DDFD] rounded-2xl shadow-xl py-1.5 z-50 text-left font-semibold text-slate-700 animate-in fade-in duration-100">
                                    <button 
                                      onClick={() => { setSelectedSub(sub); setDrawerTab('geral'); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                                      Ver detalhes
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedSub(sub); setShowPaymentModal(true); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                      Atualizar pagamento
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedSub(sub); setShowPauseModal(true); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Pause className="w-3.5 h-3.5 text-slate-400" />
                                      Pausar assinatura
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedSub(sub); setShowCancelModal(true); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2 text-red-650"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                      Cancelar assinatura
                                    </button>
                                    <button 
                                      onClick={() => { triggerSuccessAlert('Link de pagamento recorrente enviado para ' + sub.email); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                                      Enviar link
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedSub(sub); setDrawerTab('cobrancas'); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <CircleDollarSign className="w-3.5 h-3.5 text-slate-400" />
                                      Ver cobranças
                                    </button>
                                    <button 
                                      onClick={() => { setSelectedSub(sub); setDrawerTab('timeline'); setActiveDropdown(null); }}
                                      className="w-full text-left px-3 py-2 text-[10.5px] hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <RefreshCcw className="w-3.5 h-3.5 text-slate-400" />
                                      Ver timeline
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50/40 h-[38px]">
              <span>1-5 de 12.784 assinaturas</span>
              
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold">5 por página</span>
                <div className="flex items-center gap-0.5">
                  {['1', '2', '3', '...', '2557'].map((p, idx) => (
                    <button
                      key={idx}
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center font-bold text-[10px]",
                        p === '1' ? 'bg-brand/10 text-brand font-black' : 'hover:bg-slate-100 text-slate-655'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Analytics Row (210px height cards, perfect first-fold sizing, highly detailed widgets) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            
            {/* Chart 1: MRR (Line Chart) */}
            <div className="bg-white border border-[#E7E4F3] rounded-2xl p-3 shadow-sm flex flex-col justify-between h-[210px] transition-all">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <div className="flex flex-col text-left">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">MRR (Receita Recorrente)</span>
                  <span className="text-[14px] font-black text-slate-900 mt-1 leading-none">R$ 1.342.870,50</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[7.5px] font-black px-1 py-0.2 rounded bg-green-50 text-green-700 leading-none">+12,4%</span>
                  <span className="text-[8.5px] font-black text-slate-400 uppercase border border-[#E8DDFD] px-1.5 py-0.5 rounded-lg bg-slate-50">7 dias</span>
                </div>
              </div>

              <div className="h-[120px] w-full min-w-0 mt-1">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: '10 Mai', mrr: 1290000 },
                      { name: '11 Mai', mrr: 1305000 },
                      { name: '12 Mai', mrr: 1312000 },
                      { name: '13 Mai', mrr: 1324000 },
                      { name: '14 Mai', mrr: 1332000 },
                      { name: '15 Mai', mrr: 1338000 },
                      { name: '16 Mai', mrr: 1342870 }
                    ]}>
                      <defs>
                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} axisLine={false} />
                      <YAxis 
                        stroke="#94A3B8" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} 
                      />
                      <Tooltip 
                        formatter={(v: any) => [`R$ ${v.toLocaleString('pt-BR')}`, 'MRR']} 
                        contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} 
                      />
                      <Area type="monotone" dataKey="mrr" stroke="#7C3AED" strokeWidth={1.5} fillOpacity={1} fill="url(#colorMrr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl" />
                )}
              </div>
            </div>

            {/* Chart 2: Status (Donut with side Legend details) */}
            <div className="bg-white border border-[#E7E4F3] rounded-2xl p-3 shadow-sm flex flex-col justify-between h-[210px] transition-all">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <div className="flex flex-col text-left">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Assinaturas por Status</span>
                  <span className="text-[14px] font-black text-slate-900 mt-1 leading-none">16.784 Total</span>
                </div>
                <span className="text-[8.5px] font-black text-slate-400 uppercase border border-[#E8DDFD] px-1.5 py-0.5 rounded-lg bg-slate-50">Proporção</span>
              </div>

              <div className="flex items-center gap-2 mt-1 h-[130px] min-w-0">
                <div className="w-[45%] h-full relative flex items-center justify-center shrink-0">
                  {mounted ? (
                    <>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Ativas', value: 12784, color: '#16A34A' },
                              { name: 'Em atraso', value: 102, color: '#DC2626' },
                              { name: 'Falha pag.', value: 856, color: '#B91C1C' },
                              { name: 'Pausadas', value: 632, color: '#2563EB' },
                              { name: 'Canceladas', value: 1410, color: '#94A3B8' }
                            ]}
                            innerRadius={28}
                            outerRadius={44}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {[
                              { color: '#16A34A' },
                              { color: '#DC2626' },
                              { color: '#B91C1C' },
                              { color: '#2563EB' },
                              { color: '#94A3B8' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="absolute text-center flex flex-col items-center justify-center leading-none">
                        <span className="text-slate-900 font-black text-[11px]">16.7k</span>
                        <span className="text-[7px] font-black text-slate-400 uppercase mt-0.5">Total</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl" />
                  )}
                </div>

                {/* Explicit side legend with colors, quantities and percentages */}
                <div className="flex-1 space-y-1 text-[9.2px] font-bold text-slate-500 overflow-hidden leading-snug text-left py-0.5">
                  {[
                    { label: 'Ativas', count: '12.784', pct: '78,3%', color: 'bg-green-600' },
                    { label: 'Em atraso', count: '102', pct: '0,7%', color: 'bg-red-650' },
                    { label: 'Falha pag.', count: '856', pct: '5,2%', color: 'bg-red-700' },
                    { label: 'Pausadas', count: '632', pct: '3,9%', color: 'bg-blue-600' },
                    { label: 'Canceladas', count: '1.410', pct: '8,6%', color: 'bg-slate-400' }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", item.color)} />
                        <span className="truncate text-slate-500">{item.label}</span>
                      </div>
                      <span className="font-black text-slate-800 shrink-0">{item.count} ({item.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 3: Delinquency (Red Line Chart) */}
            <div className="bg-white border border-[#E7E4F3] rounded-2xl p-3 shadow-sm flex flex-col justify-between h-[210px] transition-all">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <div className="flex flex-col text-left">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Taxa de Inadimplência</span>
                  <span className="text-[14px] font-black text-red-600 mt-1 leading-none">5,64% Atual</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[7.5px] font-black px-1 py-0.2 rounded bg-red-50 text-red-650 leading-none">Evolução 7D</span>
                  <span className="text-[8.5px] font-black text-slate-400 uppercase border border-[#E8DDFD] px-1.5 py-0.5 rounded-lg bg-slate-50">Mensal</span>
                </div>
              </div>

              <div className="h-[120px] w-full min-w-0 mt-1">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: '10 Mai', rate: 5.12 },
                      { name: '11 Mai', rate: 5.24 },
                      { name: '12 Mai', rate: 5.30 },
                      { name: '13 Mai', rate: 5.48 },
                      { name: '14 Mai', rate: 5.51 },
                      { name: '15 Mai', rate: 5.58 },
                      { name: '16 Mai', rate: 5.64 }
                    ]}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} axisLine={false} />
                      <YAxis 
                        stroke="#94A3B8" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(v) => `${v}%`} 
                      />
                      <Tooltip 
                        formatter={(v: any) => [`${v}%`, 'Taxa de Inadimplência']} 
                        contentStyle={{ background: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '9px', border: 'none' }} 
                      />
                      <Area type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorRate)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl" />
                )}
              </div>
            </div>

          </div>

        </div>

        {/* REGION 3: SELECTED SUBSCRIPTION DETAILS PANEL */}
        {selectedSub && (
          <>
            {/* Backdrop overlay for smaller screens (hidden on >=2xl) */}
            <div 
              onClick={() => setSelectedSub(null)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-30 2xl:hidden"
            />
            
            {/* Context Box container (floating drawer on smaller screens, inline sidebar on >=2xl) */}
            <div className="fixed inset-y-0 right-0 z-40 w-[335px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 2xl:relative 2xl:inset-auto 2xl:z-0 2xl:w-[335px] 2xl:bg-white 2xl:border 2xl:border-[#E7E4F3] 2xl:shadow-lg 2xl:rounded-2xl 2xl:sticky 2xl:top-1.5 2xl:h-fit shrink-0">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#FAF9FF]/80">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-slate-900 truncate">Assinatura {selectedSub.id}</h3>
                    <span className={cn(
                      "px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase border shrink-0",
                      STATUS_THEME[selectedSub.status].text, STATUS_THEME[selectedSub.status].bg, STATUS_THEME[selectedSub.status].border
                    )}>
                      {selectedSub.status}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-400 mt-0.5 block truncate">{selectedSub.ref}</span>
                </div>
                <button 
                  onClick={() => setSelectedSub(null)}
                  className="p-1 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-slate-100 flex items-center gap-0.5 px-3 overflow-x-auto no-scrollbar bg-slate-50/50">
                {(['geral', 'historico', 'cobrancas', 'timeline', 'notas'] as const).map(tab => {
                  const isActive = drawerTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setDrawerTab(tab)}
                      className={cn(
                        "px-2.5 py-2.5 text-[9px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap",
                        isActive ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-brand"
                      )}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Context Box */}
              <div className="p-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto no-scrollbar">
                
                {/* Customer card header */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                  <div className="w-8.5 h-8.5 rounded-full bg-brand/10 border border-[#E8DDFD] flex items-center justify-center text-brand font-black text-xs shrink-0">
                    {selectedSub.cliente.charAt(0)}
                  </div>
                  <div className="text-xs min-w-0 flex-1">
                    <span className="font-black text-slate-900 block leading-tight truncate">{selectedSub.cliente}</span>
                    <span className="text-slate-400 block mt-0.5 truncate text-[10.5px]">{selectedSub.email}</span>
                    <span className="text-[9px] font-mono text-slate-455 font-bold block mt-1 leading-none">CLI ID: {selectedSub.cliId}</span>
                  </div>
                </div>

                {drawerTab === 'geral' && (
                  <div className="space-y-4 text-xs font-semibold">
                    
                    {/* Subscription Data List Card */}
                    <div className="bg-[#FAF9FF] border border-[#E7E4F3] p-3 rounded-2xl space-y-2.5">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Plano Contratado</span>
                        <span className="text-slate-900 font-bold block mt-1">{selectedSub.plano}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Ciclo de Cobrança</span>
                        <span className="text-slate-955 font-bold block mt-1">{selectedSub.ciclo}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Valor do Ciclo</span>
                        <span className="text-brand font-black block mt-1">R$ {selectedSub.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / período</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Próxima Cobrança</span>
                        <span className="text-slate-900 font-bold block mt-1">{selectedSub.proximaCobranca} — {selectedSub.proximaCobrancaMeta}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Início da Assinatura</span>
                        <span className="text-slate-900 font-bold block mt-1">{selectedSub.criadoEm}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Inadimplência</span>
                        <span className={cn(
                          "font-bold block mt-1",
                          selectedSub.inadimplenciaPct > 0 ? 'text-red-500' : 'text-slate-800'
                        )}>{selectedSub.inadimplencia}</span>
                      </div>
                      
                      <div className="border-t border-slate-200/50 pt-2.5 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">ID da Assinatura</span>
                          <span className="text-slate-600 font-mono text-[9.5px] block mt-1 truncate max-w-[130px]">{selectedSub.ref}</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(selectedSub.ref, 'drawerRef')}
                          className="p-1 hover:bg-slate-200 rounded-lg text-slate-400"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Checkout</span>
                          <span className="text-slate-600 block mt-1 text-[11px] truncate max-w-[160px]">{selectedSub.checkout}</span>
                        </div>
                        <Link href="/dashboard/checkouts" className="p-1 hover:bg-slate-200 rounded-lg text-slate-455 shrink-0">
                          <ExternalLink className="w-3.5 h-3.5 text-brand" />
                        </Link>
                      </div>

                      <div className="border-t border-slate-200/50 pt-2.5 flex justify-between items-center">
                        <div className="min-w-0">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none">Método de Pagamento</span>
                          <span className="text-slate-700 font-bold block mt-1 truncate text-[11px]">{selectedSub.metodoDetalhe}</span>
                        </div>
                        <button 
                          onClick={() => setShowPaymentModal(true)}
                          className="text-[9.5px] font-black text-brand hover:underline shrink-0 ml-2"
                        >
                          Atualizar
                        </button>
                      </div>
                    </div>

                    {/* Ações Rápidas section */}
                    <div className="space-y-2">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-1">Ações Rápidas</span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setShowPlanModal(true)}
                          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl text-[9px] font-black text-slate-700 shadow-sm transition-all"
                        >
                          <SlidersHorizontal className="w-4 h-4 text-brand" />
                          <span>Alterar Plano</span>
                        </button>
                        {selectedSub.status === 'Pausada' ? (
                          <button 
                            onClick={() => {
                              setSubscriptions(prev => prev.map(s => s.id === selectedSub.id ? { ...s, status: 'Ativa' as const, proximaCobranca: '15/06/2026', proximaCobrancaMeta: 'Em 27 dias' } : s));
                              setSelectedSub(prev => prev ? { ...prev, status: 'Ativa' as const, proximaCobranca: '15/06/2026', proximaCobrancaMeta: 'Em 27 dias' } : null);
                              triggerSuccessAlert('Assinatura reativada com sucesso.');
                            }}
                            className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-green-200 bg-green-50/50 hover:bg-green-50 rounded-xl text-[9px] font-black text-green-700 shadow-sm transition-all"
                          >
                            <Play className="w-4 h-4 text-green-600" />
                            <span>Reativar</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => setShowPauseModal(true)}
                            className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl text-[9px] font-black text-slate-700 shadow-sm transition-all"
                          >
                            <Pause className="w-4 h-4 text-amber-500" />
                            <span>Pausar</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setShowCancelModal(true)}
                          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-red-100 bg-red-50/20 hover:bg-red-50 rounded-xl text-[9px] font-black text-red-750 shadow-sm transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                          <span>Cancelar</span>
                        </button>
                        <button 
                          onClick={() => setShowPaymentModal(true)}
                          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl text-[9px] font-black text-slate-700 shadow-sm transition-all"
                        >
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          <span>Alt. Cartão</span>
                        </button>
                        <button 
                          onClick={() => triggerSuccessAlert('Link de pagamento recorrente enviado para ' + selectedSub.email)}
                          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl text-[9px] font-black text-slate-700 shadow-sm transition-all"
                        >
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span>Enviar Link</span>
                        </button>
                        <button 
                          onClick={() => triggerSuccessAlert('Abrindo configurações adicionais...')}
                          className="flex flex-col items-center justify-center gap-1.5 py-2 px-1 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl text-[9px] font-black text-slate-700 shadow-sm transition-all"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Mais opções</span>
                        </button>
                      </div>
                    </div>

                    {/* Timeline section */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-1">Timeline da Assinatura</span>
                      
                      <div className="relative border-l border-slate-150 ml-2 pl-4 space-y-3 py-1">
                        <div className="relative">
                          <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-brand border-2 border-white ring-2 ring-brand/10" />
                          <span className="text-[9px] text-slate-400 block font-mono">15/04/2024 10:12</span>
                          <span className="text-slate-800 font-bold block text-[10.5px]">Assinatura criada</span>
                          <span className="text-slate-450 text-[9.5px] block font-medium">Plano PRO Anual — R$ 1.299,00</span>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-100" />
                          <span className="text-[9px] text-slate-400 block font-mono">15/04/2024 10:13</span>
                          <span className="text-slate-800 font-bold block text-[10.5px]">Primeira cobrança realizada</span>
                          <span className="text-green-700 text-[9.5px] block font-medium">Pagamento aprovado — R$ 1.299,00</span>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100" />
                          <span className="text-[9px] text-slate-400 block font-mono">15/05/2024 10:12</span>
                          <span className="text-slate-800 font-bold block text-[10.5px]">Próxima cobrança agendada</span>
                          <span className="text-slate-455 text-[9.5px] block font-medium">R$ 1.299,00 via Cartão de Crédito</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setDrawerTab('timeline')}
                        className="w-full text-center text-[10px] font-black text-brand hover:underline pt-2 flex items-center justify-center gap-1"
                      >
                        Ver timeline completa <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                )}

                {drawerTab === 'timeline' && (
                  <div className="space-y-4 text-xs font-semibold">
                    <div className="relative border-l border-slate-150 ml-2 pl-4 space-y-4 py-1">
                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-brand border-2 border-white ring-2 ring-brand/10" />
                        <span className="text-[9px] text-slate-400 block font-mono">15/04/2024 10:12</span>
                        <span className="text-slate-900 font-bold block text-[11px]">Assinatura criada</span>
                        <span className="text-slate-500 text-[10px] block font-medium">Plano PRO Anual — R$ 1.299,00</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-green-500 border-2 border-white ring-2 ring-green-100" />
                        <span className="text-[9px] text-slate-400 block font-mono">15/04/2024 10:13</span>
                        <span className="text-slate-900 font-bold block text-[11px]">Primeira cobrança realizada</span>
                        <span className="text-green-700 text-[10px] block font-medium">Pagamento aprovado — R$ 1.299,00</span>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-100" />
                        <span className="text-[9px] text-slate-400 block font-mono">15/05/2024 10:12</span>
                        <span className="text-slate-900 font-bold block text-[11px]">Próxima cobrança agendada</span>
                        <span className="text-slate-500 text-[10px] block font-medium">R$ 1.299,00 via Cartão de Crédito</span>
                      </div>
                    </div>
                  </div>
                )}

                {drawerTab === 'historico' && (
                  <div className="space-y-2 text-xs">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Histórico de Alterações</span>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-semibold space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Alteração de Plano</span>
                        <span className="font-mono text-[10px]">19/05/2026</span>
                      </div>
                      <p className="text-slate-500 text-[10px] leading-relaxed">Operador Vinícius Admin atualizou a assinatura do plano BASIC para PRO.</p>
                    </div>
                  </div>
                )}

                {drawerTab === 'cobrancas' && (
                  <div className="space-y-2 text-xs font-semibold">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Faturas Anteriores</span>
                    <div className="space-y-1.5">
                      {[
                        { ref: 'FAT-22910', date: '15/04/2024', val: 1299.00, status: 'Paga' },
                        { ref: 'FAT-22810', date: '15/04/2023', val: 1299.00, status: 'Paga' }
                      ].map(fat => (
                        <div key={fat.ref} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                          <div>
                            <span className="text-slate-800 font-bold block">{fat.ref}</span>
                            <span className="text-[9.5px] text-slate-400 block">{fat.date}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-850 font-black block">R$ {fat.val.toLocaleString('pt-BR')}</span>
                            <span className="text-[8.5px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.2 rounded font-black uppercase">
                              {fat.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {drawerTab === 'notas' && (
                  <div className="space-y-3 text-xs">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Notas e Observações Internas</span>
                    <textarea
                      placeholder="Adicionar nota interna para equipe de atendimento..."
                      className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand min-h-[85px]"
                    />
                    <button className="px-3.5 py-1.5 bg-brand text-white text-[10px] font-black rounded-lg uppercase tracking-tight ml-auto block">Gravar Nota</button>
                  </div>
                )}

              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}
