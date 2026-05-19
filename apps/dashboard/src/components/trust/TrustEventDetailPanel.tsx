'use client';

import { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, Check, ShieldCheck, UserCheck, ShieldX, HelpCircle, Monitor, Globe, Clock, Zap, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { TrustEvent, TrustScoreBreakdown, TrustScoreFactor } from '@/types/trust';
import { MOCK_TRUST_SCORE_BREAKDOWNS } from '@/app/(dashboard)/dashboard/trust/__mocks__/trust';
import { cn } from '@/lib/utils';

interface TrustEventDetailPanelProps {
  event: TrustEvent | null;
  onClose: () => void;
  isAdmin: boolean;
  onActionFeedback: (msg: string) => void;
}

export function TrustEventDetailPanel({ event, onClose, isAdmin, onActionFeedback }: TrustEventDetailPanelProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (!event) return null;

  // Retrieve score breakdown details from mock or fallback to dynamic generation
  const breakdown: TrustScoreBreakdown = MOCK_TRUST_SCORE_BREAKDOWNS[event.paymentId] || {
    paymentId: event.paymentId,
    finalScore: event.score,
    action: event.score < 40 ? 'approved' : event.score < 80 ? 'manual_review' : 'blocked',
    threshold: 80,
    reviewThreshold: 60,
    factors: [
      { name: "Dispositivo reconhecido", weight: 20, result: event.score < 60 ? "pass" : "warn", value: "Chrome", contribution: event.score < 60 ? 0 : 15, description: "Dispositivo de acesso" },
      { name: "IP Seguro", weight: 15, result: event.score < 80 ? "pass" : "fail", value: "São Paulo, BR", contribution: event.score < 80 ? 0 : 25, description: "Localização geográfica segura" },
      { name: "Valor fora do padrão", weight: 20, result: event.score > 60 ? "fail" : "pass", value: "3x acima da média", contribution: event.score > 60 ? 30 : 0, description: "Média histórica do portador" }
    ],
    rulesTriggered: [],
    context: {
      ip: "177.12.34.56",
      ipLocation: "São Paulo, SP, BR",
      ipAsn: "TELEFONICA BRASIL",
      deviceFingerprint: "df_8d19a2f7c6e",
      deviceSeenCount: 4,
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      formFillTimeMs: 11200,
      sessionId: "sess_trust_0019",
      checkoutStartedAt: new Date(Date.now() - 5 * 60000).toISOString(),
      submittedAt: new Date().toISOString()
    },
    motorVersion: "v2.4.1",
    evaluatedAt: event.createdAt
  };

  const getRiskLabel = (score: number) => {
    if (score < 40) return { text: 'Baixo Risco', color: 'text-emerald-600', fill: '#10B981' };
    if (score < 70) return { text: 'Risco Moderado', color: 'text-amber-500', fill: '#F59E0B' };
    return { text: 'Alto Risco', color: 'text-red-655', fill: '#EF4444' };
  };

  const riskLabel = getRiskLabel(event.score);

  // SVG semicircular gauge computations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = Math.PI * radius; // Half circle circumference
  const strokeDashoffset = circumference - (event.score / 100) * circumference;

  const handleQuickAction = (actionName: string, message: string) => {
    setLoadingAction(actionName);
    setTimeout(() => {
      setLoadingAction(null);
      onActionFeedback(message);
    }, 600);
  };

  return (
    <div className="w-full lg:w-[320px] bg-white border-t lg:border-t-0 lg:border-l border-[#E8DDFD]/60 p-5 shrink-0 flex flex-col justify-between overflow-y-auto no-scrollbar h-full text-left">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDFD]/40 pb-3">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Detalhes do Score</span>
            <h3 className="text-xs font-black text-slate-900 truncate max-w-[200px] mt-0.5" title={event.paymentId}>
              {event.paymentId}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Bloco 1 - SVG Semicircular Gauge */}
        <div className="flex flex-col items-center justify-center py-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
          <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
            <svg className="w-36 h-36 absolute top-0" viewBox="0 0 120 120">
              {/* Background semi-circle track */}
              <path
                d="M 10,70 A 50,50 0 0,1 110,70"
                fill="none"
                stroke="#E7E5EF"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Colored active semi-circle track */}
              <path
                d="M 10,70 A 50,50 0 0,1 110,70"
                fill="none"
                stroke={riskLabel.fill}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-8 flex flex-col items-center">
              <span className="text-2xl font-black text-slate-800 leading-none">{event.score}</span>
              <span className={cn("text-[9px] font-black uppercase tracking-wider mt-1.5", riskLabel.color)}>
                {riskLabel.text}
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 2 - Fatores de risco */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Breakdown de Fatores</span>
          <div className="space-y-2">
            {breakdown.factors.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                  <div className="flex items-center gap-1 max-w-[70%]">
                    {f.result === 'pass' && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                    {f.result === 'warn' && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
                    {f.result === 'fail' && <ShieldAlert className="w-3 h-3 text-red-655 shrink-0" />}
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-400">Peso: {f.weight}%</span>
                </div>
                {/* Visual Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      f.result === 'pass' ? 'bg-emerald-500' : f.result === 'warn' ? 'bg-amber-400' : 'bg-red-500'
                    )}
                    style={{ width: `${f.weight * 5}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-450 block font-medium mt-0.5 leading-snug">
                  {f.description} (Valor: <span className="font-bold">{f.value}</span>)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 3 - Contexto Técnico */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Contexto da Transação</span>
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-2 text-[10px] font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Device: Chrome / macOS / Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>IP: {breakdown.context.ip} ({breakdown.context.ipLocation})</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Velocidade: formulário preenchido em 11s</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Fingerprint: {breakdown.context.deviceFingerprint}</span>
            </div>
          </div>
        </div>

        {/* Bloco 4 - Decisão Tomada */}
        <div className="space-y-2.5">
          <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Decisão Registrada</span>
          <div className="bg-violet-50/20 border border-violet-100/50 rounded-xl p-3 space-y-1.5 text-[10px] font-semibold text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Ação final:</span>
              <span className="font-black text-slate-800">{event.action === 'approved_auto' ? 'Aprovado auto' : 'Revisão / Bloqueio'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Score calculado:</span>
              <span className="font-black text-slate-800">{event.score} / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Motor Versão:</span>
              <span className="font-black text-slate-850">{breakdown.motorVersion}</span>
            </div>
          </div>
        </div>

        {/* Bloco 5 - Ações Rápidas */}
        <div className="space-y-2.5 pt-2">
          <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Ações do Operador</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickAction('view_payment', `Exibindo pagamento ${event.paymentId} no painel.`)}
              className="flex h-8.5 items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black uppercase tracking-tight transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              Ver pagamento
            </button>
            <button
              onClick={() => handleQuickAction('view_client', `Exibindo cliente associado no painel.`)}
              className="flex h-8.5 items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-[10.5px] font-black uppercase tracking-tight transition-all cursor-pointer"
            >
              Ver cliente
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {isAdmin && (
              <button
                disabled={loadingAction !== null}
                onClick={() => handleQuickAction('block', `Pagamento ${event.paymentId} bloqueado permanentemente por fraude.`)}
                className="w-full h-8.5 bg-red-655 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
              >
                {loadingAction === 'block' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <ShieldX className="w-3.5 h-3.5" />
                    Bloquear manualmente
                  </>
                )}
              </button>
            )}

            <button
              disabled={loadingAction !== null}
              onClick={() => handleQuickAction('review', `Enviando transação ${event.paymentId} para a fila de revisão humana.`)}
              className="w-full h-8.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/30 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              {loadingAction === 'review' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Mover para revisão
                </>
              )}
            </button>

            <button
              onClick={() => handleQuickAction('report', `Feedback registrado. Falso positivo reportado para a versão do motor.`)}
              className="w-full h-8 bg-transparent hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3 h-3" />
              Reportar Falso Positivo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
