'use client';

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { 
  MOCK_ROUTING_KPIS, 
  MOCK_ROUTING_RULES, 
  MOCK_SYSTEMS 
} from './__mocks__/routing';
import { RoutingHeader } from '@/components/routing/RoutingHeader';
import { RoutingKpiCards } from '@/components/routing/RoutingKpiCards';
import { RoutingTabs, RoutingTabValue } from '@/components/routing/RoutingTabs';
import { RoutingFilters } from '@/components/routing/RoutingFilters';
import { RoutingConflictBanner } from '@/components/routing/RoutingConflictBanner';
import { RoutingRulesTable } from '@/components/routing/RoutingRulesTable';
import { RoutingSimulatorPanel } from '@/components/routing/RoutingSimulatorPanel';
import { RoutingFallbacksTab } from '@/components/routing/RoutingFallbacksTab';
import { RoutingHistoryTab } from '@/components/routing/RoutingHistoryTab';
import { RoutingRuleForm } from '@/components/routing/RoutingRuleForm';
import { RoutingRule, RoutingSimulatorInput, RoutingSimulatorResult, RoutingDecisionStep } from '@/types/routing';
import { cn } from '@/lib/utils';

export default function RoutingPage() {
  const [activeTab, setActiveTab] = useState<RoutingTabValue>('rules');
  
  // Smart Retries states
  const [retriesActive, setRetriesActive] = useState(true);
  const [selectedErrorCode, setSelectedErrorCode] = useState('91');
  const [simulatedErrorCodeResult, setSimulatedErrorCodeResult] = useState<string | null>(null);
  const [smartRetriesRules, setSmartRetriesRules] = useState([
    { code: '51', name: 'Saldo Insuficiente', action: 'block', desc: 'Não retentar (evita tarifas de transação repetida)', count: 4821 },
    { code: '91', name: 'Banco Emissor Indisponível', action: 'retry_alternative', desc: 'Failover para adquirente secundária', count: 184 },
    { code: 'TO', name: 'Timeout de Conexão', action: 'retry_immediate', desc: 'Retentativa imediata no mesmo gateway', count: 981 },
    { code: '05', name: 'Não Autorizada Geral', action: 'block', desc: 'Não retentar (bloqueio do emissor)', count: 1241 },
    { code: '57', name: 'Cartão Inválido', action: 'block', desc: 'Não retentar (cartão vencido/bloqueado)', count: 681 },
    { code: '19', name: 'Erro de Processamento Geral', action: 'retry_immediate', desc: 'Retentativa imediata (máx. 2x)', count: 342 }
  ]);

  const handleSimulateRetry = () => {
    const r = smartRetriesRules.find(x => x.code === selectedErrorCode);
    if (!r) return;
    if (r.action === 'block') {
      setSimulatedErrorCodeResult(`Transação Bloqueada: código de retorno ${r.code} (${r.name}). Não haverá retentativas para evitar processamento inútil.`);
    } else if (r.action === 'retry_alternative') {
      setSimulatedErrorCodeResult(`Failover Ativo: código de retorno ${r.code} (${r.name}). Middleware roteará transação automaticamente para adquirente de backup Cielo.`);
    } else {
      setSimulatedErrorCodeResult(`Retentativa Rápida: código de retorno ${r.code} (${r.name}). Middleware enviará nova tentativa de cobrança imediata (máximo 2x).`);
    }
    triggerFeedback(`Retentativa simulada para código de erro ${selectedErrorCode}`);
  };

  const [rules, setRules] = useState<RoutingRule[]>(MOCK_ROUTING_RULES);
  const [kpis, setKpis] = useState(MOCK_ROUTING_KPIS);
  const [showSimulator, setShowSimulator] = useState(true);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | undefined>(undefined);
  const [userRole, setUserRole] = useState<'admin' | 'viewer'>('admin');
  
  // Notification Toast state
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [systemFilter, setSystemFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Drag and Drop confirmation dialog state
  const [reorderPending, setReorderPending] = useState<{ from: number; to: number } | null>(null);

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const isAdmin = userRole === 'admin';

  // Filtered Rules list
  const filteredRules = rules.filter((rule) => {
    const matchesSearch = searchQuery
      ? rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rule.gatewayName && rule.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    const matchesStatus = statusFilter === 'all' ? true : rule.status === statusFilter;
    const matchesSystem = systemFilter === 'all' ? true : rule.systems.includes(systemFilter) || rule.systems.includes('all');
    const matchesMethod = methodFilter === 'all' 
      ? true 
      : rule.conditions.some(c => c.field === 'method' && c.value === methodFilter);
    
    const matchesGateway = gatewayFilter === 'all' ? true : rule.gatewayId === gatewayFilter;
    const matchesType = typeFilter === 'all' ? true : rule.type === typeFilter;

    return matchesSearch && matchesStatus && matchesSystem && matchesMethod && matchesGateway && matchesType;
  });

  // Reorder confirmation handler
  const handleReorderTrigger = (from: number, to: number) => {
    setReorderPending({ from, to });
  };

  const confirmReorder = () => {
    if (!reorderPending) return;
    const { from, to } = reorderPending;
    
    const updated = [...rules];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    // Re-calculate priority numbers sequentially
    const sequential = updated.map((r, index) => ({
      ...r,
      priority: index + 1
    }));

    setRules(sequential);
    setReorderPending(null);
    triggerFeedback(`Ordem de prioridade atualizada. Posição #${from + 1} movida para #${to + 1}. Alteração registrada na auditoria.`);
  };

  // Toggle status
  const handleToggleStatus = (ruleId: string) => {
    setRules(rules.map(r => {
      if (r.id === ruleId) {
        const nextStatus = r.status === 'active' ? 'inactive' : 'active';
        triggerFeedback(`Regra "${r.name}" alterada para ${nextStatus === 'active' ? 'Ativa' : 'Inativa'}.`);
        return { ...r, status: nextStatus as any };
      }
      return r;
    }));
  };

  // Create or Update rule
  const handleSaveRule = (formData: any) => {
    if (editingRule) {
      // Update existing
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...formData } : r));
      triggerFeedback(`Regra "${formData.name}" editada com sucesso.`);
    } else {
      // Create new
      const newRule: RoutingRule = {
        id: `rule_00${rules.length + 1}`,
        priority: rules.length + 1,
        coverage7d: 0.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Admin Basileia',
        ...formData
      };
      setRules([...rules, newRule]);
      triggerFeedback(`Nova regra "${formData.name}" criada e adicionada ao pool.`);
    }
    setShowRuleForm(false);
    setEditingRule(undefined);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId).map((r, idx) => ({ ...r, priority: idx + 1 })));
    triggerFeedback('Regra excluída com sucesso do motor de decisão.');
  };

  const handleDuplicateRule = (rule: RoutingRule) => {
    const duplicated: RoutingRule = {
      ...rule,
      id: `rule_dup_${Date.now()}`,
      name: `${rule.name} (Cópia)`,
      priority: rules.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRules([...rules, duplicated]);
    triggerFeedback(`Regra "${rule.name}" duplicada.`);
  };

  // Simulator Decision engine logic simulation
  const simulateRouting = (input: RoutingSimulatorInput): RoutingSimulatorResult => {
    // 1. Check risk score block rule
    const isHighRisk = input.riskScore > 80;
    
    // Build simulated decision chain evaluation
    const decisionChain: RoutingDecisionStep[] = rules.map((r) => {
      let evaluated = true;
      let satisfied = false;

      // Evaluate conditions
      const conditionResults = r.conditions.map((cond) => {
        let condSatisfied = false;
        let actualValue: string | number = '';

        if (cond.field === 'system') {
          actualValue = input.systemId;
          condSatisfied = cond.operator === 'equals' ? input.systemId === cond.value : input.systemId !== cond.value;
        } else if (cond.field === 'method') {
          actualValue = input.method;
          condSatisfied = cond.value === input.method;
        } else if (cond.field === 'amount') {
          actualValue = input.amount;
          if (cond.operator === 'greater_than') condSatisfied = input.amount > Number(cond.value);
          if (cond.operator === 'less_than') condSatisfied = input.amount < Number(cond.value);
        } else if (cond.field === 'risk_score') {
          actualValue = input.riskScore;
          if (cond.operator === 'greater_than') condSatisfied = input.riskScore > Number(cond.value);
          if (cond.operator === 'less_than') condSatisfied = input.riskScore < Number(cond.value);
        }

        return { condition: cond, satisfied: condSatisfied, actualValue };
      });

      satisfied = conditionResults.length > 0 && conditionResults.every(c => c.satisfied);

      return {
        rule: r,
        evaluated,
        satisfied,
        conditionResults
      };
    });

    // 2. Find first applied rule
    const appliedStep = decisionChain.find(step => step.satisfied && step.rule.status === 'active');

    if (isHighRisk) {
      const riskRule = rules.find(r => r.type === 'by_risk') || rules[2];
      return {
        action: 'block_and_review',
        isFallback: false,
        ruleApplied: riskRule,
        decisionChain
      };
    }

    if (appliedStep) {
      const r = appliedStep.rule;
      const isGatewayInstable = r.gatewayHealth !== undefined && r.gatewayHealth < 90;

      return {
        gatewayId: isGatewayInstable ? r.fallbackGatewayId : r.gatewayId,
        gatewayName: isGatewayInstable ? r.fallbackGatewayName : r.gatewayName,
        action: r.action,
        isFallback: isGatewayInstable,
        fallbackReason: isGatewayInstable ? 'Gateway principal instável (saúde < 90%)' : undefined,
        estimatedLatencyMs: isGatewayInstable ? 145 : 98,
        ruleApplied: r,
        decisionChain
      };
    }

    // 3. Contingência Global Fallback
    return {
      gatewayId: 'gw_mercadopago',
      gatewayName: 'Mercado Pago',
      action: 'route_to_gateway',
      isFallback: true,
      fallbackReason: 'Nenhuma regra atendida. Fallback Global corporativo.',
      estimatedLatencyMs: 120,
      decisionChain
    };
  };

  return (
    <PageLayout title="Roteamento Inteligente">
      
      {/* Feedback Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-5 right-5 z-60 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-2 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 bg-violet-500 rounded-full shrink-0 animate-ping" />
          <span className="text-[11px] font-black">{feedbackMsg}</span>
        </div>
      )}



      {/* Outer row split for Desktop simulator stickiness */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        
        {/* Main workflow content area */}
        <div className="flex-1 space-y-6 w-full">
          
          <RoutingHeader 
            onOpenDoc={() => triggerFeedback("Abrindo documentação técnica do motor de roteamento...")}
            onOpenSimulator={() => setShowSimulator(!showSimulator)}
            onNewRule={() => {
              setEditingRule(undefined);
              setShowRuleForm(true);
            }}
            isAdmin={isAdmin}
          />

          <RoutingKpiCards 
            kpis={kpis} 
            onFilterConflict={() => setStatusFilter('conflict')}
            onFilterActive={() => setStatusFilter('active')}
          />

          <div className="border-b border-[#E8DDFD]/60 flex items-center justify-between">
            <RoutingTabs 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
              activeRulesCount={rules.filter(r => r.status === 'active').length}
              fallbacksCount={3}
            />
          </div>

          {activeTab === 'rules' ? (
            <div className="space-y-4">
              <RoutingFilters 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                systemFilter={systemFilter}
                setSystemFilter={setSystemFilter}
                methodFilter={methodFilter}
                setMethodFilter={setMethodFilter}
                gatewayFilter={gatewayFilter}
                setGatewayFilter={setGatewayFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
              />

              <RoutingConflictBanner 
                conflictsCount={rules.filter(r => r.status === 'conflict').length}
                onResolveClick={() => triggerFeedback("Direcionando para painel de resolução rápida de prioridades...")}
              />

              {filteredRules.length === 0 ? (
                <div className="py-12 bg-white border border-[#E8DDFD]/60 rounded-[22px] text-center space-y-3">
                  <span className="text-3xl">🔀</span>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Nenhuma regra encontrada</h4>
                  <p className="text-[11px] font-semibold text-slate-400">Ajuste os filtros ou crie uma nova regra de roteamento.</p>
                </div>
              ) : (
                <RoutingRulesTable 
                  rules={filteredRules}
                  isAdmin={isAdmin}
                  onReorder={handleReorderTrigger}
                  onToggleStatus={handleToggleStatus}
                  onEdit={(rule) => {
                    setEditingRule(rule);
                    setShowRuleForm(true);
                  }}
                  onDelete={handleDeleteRule}
                  onDuplicate={handleDuplicateRule}
                  onShowConflict={(rule) => triggerFeedback(`Avaliando conflito na regra: ${rule.name}`)}
                />
              )}
            </div>
          ) : activeTab === 'fallbacks' ? (
            <RoutingFallbacksTab onActionFeedback={triggerFeedback} isAdmin={isAdmin} />
          ) : activeTab === 'retries' ? (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              {/* Smart Retries Control Header */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Smart Retries (Retentativas Inteligentes)</h3>
                    <p className="text-[10.5px] font-semibold text-slate-400 mt-1">
                      Evite processamento inútil de taxas e recupere até 20% das vendas recusadas por falhas sistêmicas de adquirentes.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Motor Ativo</span>
                    <input 
                      type="checkbox" 
                      checked={retriesActive}
                      onChange={() => {
                        setRetriesActive(!retriesActive);
                        triggerFeedback(`Smart Retries ${!retriesActive ? 'ativado' : 'desativado'}`);
                      }}
                      className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer w-4.5 h-4.5"
                    />
                  </div>
                </div>

                {/* Retries config table */}
                <div className="w-full overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left table-fixed">
                    <thead>
                      <tr className="border-b border-[#E8DDFD]/40 bg-slate-50/50">
                        <th className="py-2.5 px-3.5 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[18%]">Código de Erro</th>
                        <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[26%]">Descrição do Erro</th>
                        <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[36%]">Diretiva Smart Retry</th>
                        <th className="py-2.5 px-2 text-[9px] font-black uppercase text-slate-400 tracking-wider w-[20%] text-right">Requisições (mês)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] font-bold text-slate-700">
                      {smartRetriesRules.map((item) => (
                        <tr key={item.code} className="hover:bg-slate-50/50 h-[48px]">
                          <td className="py-2 px-3.5 font-mono font-black text-brand">{item.code}</td>
                          <td className="py-2 px-2 text-slate-800 font-extrabold">{item.name}</td>
                          <td className="py-2 px-2 text-slate-550 leading-tight">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider mb-1 block w-fit",
                              item.action === 'block' ? "bg-red-50 text-red-700" :
                              item.action === 'retry_alternative' ? "bg-blue-50 text-blue-700" :
                              "bg-purple-50 text-purple-700"
                            )}>
                              {item.action === 'block' ? 'Bloquear Retentativa' :
                               item.action === 'retry_alternative' ? 'Failover Inteligente' :
                               'Retentativa Rápida'}
                            </span>
                            <span className="block text-[9.5px] text-slate-400 font-bold">{item.desc}</span>
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-slate-500">{item.count.toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Simulator Card */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-50 pb-2.5">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Simulador do Motor de Retentativas</h4>
                  <span className="text-[8.5px] font-bold text-slate-400 block mt-1">Escolha um código de retorno e simule a ação do middleware HTTP em tempo real.</span>
                </div>

                <div className="flex flex-col md:flex-row items-end gap-4">
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Código de Retorno ISO 8583</label>
                    <select 
                      value={selectedErrorCode}
                      onChange={(e) => setSelectedErrorCode(e.target.value)}
                      className="w-full bg-slate-50 border border-[#E8DDFD] rounded-xl px-3 py-2 text-xs font-black text-slate-700 focus:outline-none appearance-none cursor-pointer h-9.5"
                    >
                      {smartRetriesRules.map(r => (
                        <option key={r.code} value={r.code}>{r.code} - {r.name}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleSimulateRetry}
                    className="h-9.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
                  >
                    Simular Resposta
                  </button>
                </div>

                {simulatedErrorCodeResult && (
                  <div className="rounded-2xl p-4 bg-[#FAF8FF] border border-[#E8DDFD]/60 text-left animate-in zoom-in-95 duration-200">
                    <span className="text-[9px] font-black text-brand uppercase tracking-wider block">Diretiva Processada pelo Middleware:</span>
                    <p className="text-[11px] font-extrabold text-slate-700 leading-relaxed mt-1">
                      {simulatedErrorCodeResult}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <RoutingHistoryTab />
          )}

        </div>

        {/* Simulator side widget */}
        <RoutingSimulatorPanel 
          isOpen={showSimulator}
          onClose={() => setShowSimulator(false)}
          onSimulate={simulateRouting}
          rules={rules}
        />

      </div>

      {/* Drag & Drop Reordering Confirmation modal */}
      {reorderPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white w-full max-w-sm rounded-[22px] border border-[#E8DDFD] shadow-2xl p-5 space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Confirmar alteração de prioridades?
              </h4>
              <p className="text-[10px] font-semibold text-slate-400 mt-1 leading-snug">
                Você reordenou uma regra de roteamento. Isso irá mudar a ordem na qual o motor avalia os pagamentos.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReorderPending(null)}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-black uppercase tracking-tight rounded-lg cursor-pointer"
              >
                Descartar
              </button>
              <button
                onClick={confirmReorder}
                className="px-3.5 py-1.5 bg-violet-650 hover:bg-violet-750 text-white text-[10px] font-black uppercase tracking-tight rounded-lg cursor-pointer shadow-md shadow-violet-650/15"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New/Edit Rule Creator Modal */}
      {showRuleForm && (
        <RoutingRuleForm 
          onClose={() => {
            setShowRuleForm(false);
            setEditingRule(undefined);
          }}
          onSave={handleSaveRule}
          initialRule={editingRule}
        />
      )}

    </PageLayout>
  );
}
