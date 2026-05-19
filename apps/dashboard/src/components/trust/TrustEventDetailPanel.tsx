'use client';

import { useState } from 'react';
import { X, ShieldAlert, Check, ShieldCheck, ShieldX, HelpCircle, Monitor, Globe, Clock, RefreshCw, Eye, ArrowRight, Activity } from 'lucide-react';
import { TrustEvent, TrustScoreBreakdown } from '@/types/trust';
import { MOCK_TRUST_SCORE_BREAKDOWNS } from '@/app/(dashboard)/dashboard/trust/__mocks__/trust';
import { cn } from '@/lib/utils';

interface TrustEventDetailPanelProps {
  event: TrustEvent | null;
  onClose: () => void;
  isAdmin: boolean;
  onActionFeedback: (msg: string) => void;
  onViewFullAnalysis?: (paymentId: string) => void;
}

export function TrustEventDetailPanel({ event, onClose, isAdmin, onActionFeedback, onViewFullAnalysis }: TrustEventDetailPanelProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  if (!event) return null;

  const breakdown: TrustScoreBreakdown = MOCK_TRUST_SCORE_BREAKDOWNS[event.paymentId] || {
    paymentId: event.paymentId,
    finalScore: event.score,
    action: event.score < 40 ? 'approved' : event.score < 80 ? 'manual_review' : 'blocked',
    threshold: 80,
    reviewThreshold: 60,
    factors: [],
    rulesTriggered: [],
    context: {
      ip: "177.12.34.56",
      ipLocation: "São Paulo, SP, BR",
      ipAsn: "TELEFONICA BRASIL",
      deviceFingerprint: "df_8d19a2f7c6e",
      deviceSeenCount: 4,
      userAgent: "Mozilla/5.0",
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

  const radius = 50;
  const strokeWidth = 8;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (event.score / 100) * circumference;

  const handleQuickAction = (actionName: string, message: string) => {
    setLoadingAction(actionName);
    setTimeout(() => {
      setLoadingAction(null);
      onActionFeedback(message);
    }, 600);
  };

  return (
    <div className="w-full lg:w-[320px] bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shrink-0 flex flex-col justify-between overflow-y-auto no-scrollbar text-left shadow-sm shadow-slate-100/50">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DDFD]/40 pb-3">
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Resumo do Score</span>
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
        <div className="flex flex-col items-center justify-center py-2 bg-slate-50/50 border border-slate-100 rounded-xl p-3">
          <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
            <svg className="w-36 h-36 absolute top-0" viewBox="0 0 120 120">
              <path
                d="M 10,70 A 50,50 0 0,1 110,70"
                fill="none"
                stroke="#E7E5EF"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
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

        {/* Action Forense Link button (Direct full breakdown redirect) */}
        {onViewFullAnalysis && (
          <button
            onClick={() => onViewFullAnalysis(event.paymentId)}
            className="w-full h-9 bg-brand hover:bg-brand-dark text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand/10 transition-all hover:scale-[1.02]"
          >
            <Activity className="w-4 h-4" />
            Análise Forense Completa
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Contexto Simplificado */}
        <div className="space-y-2">
          <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Contexto Rápido</span>
          <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-2 text-[10px] font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Origem: Chrome / macOS</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">IP: {breakdown.context.ip} ({breakdown.context.ipLocation})</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Hora: {new Date(event.createdAt).toLocaleTimeString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Decisão Tomada */}
        <div className="bg-violet-50/20 border border-violet-100/50 rounded-xl p-3 space-y-1.5 text-[10px] font-semibold text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-400">Ação final:</span>
            <span className="font-black text-slate-800">
              {event.action === 'approved_auto' ? 'Aprovado auto' : event.action === 'blocked_auto' ? 'Bloqueado auto' : 'Revisão manual'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Gatilhos:</span>
            <span className="font-bold text-slate-700 max-w-[60%] truncate">{event.factorsSummary.join(', ')}</span>
          </div>
        </div>

        {/* Operações rápidas simplificadas */}
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
        </div>

      </div>
    </div>
  );
}
