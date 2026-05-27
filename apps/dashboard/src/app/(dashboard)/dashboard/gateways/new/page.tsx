'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Check, Loader2, ShieldCheck, ShieldAlert, ChevronRight, Network, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createGateway, fetchCapabilities } from '@/lib/api/gateways';
import type { Capability } from '@/types/gateway';

type Step = 'provider' | 'configure' | 'test' | 'review';

const PROVIDER_META: Record<string, { name: string; color: string }> = {
  asaas: { name: 'Asaas', color: 'bg-blue-600' },
  pagbank: { name: 'PagBank', color: 'bg-emerald-600' },
};

export default function NewGatewayPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('provider');
  const [capabilities, setCapabilities] = useState<Record<string, Capability>>({});
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [name, setName] = useState('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingCaps, setLoadingCaps] = useState(true);

  useEffect(() => {
    fetchCapabilities()
      .then(setCapabilities)
      .catch(() => {})
      .finally(() => setLoadingCaps(false));
  }, []);

  const handleSelectProvider = (key: string) => {
    setSelectedProvider(key);
    setName(PROVIDER_META[key]?.name || key);
    setStep('configure');
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    setError(null);
    try {
      await createGateway({
        name,
        provider: selectedProvider!,
        environment,
        credentials,
      });
      setTestResult('success');
      setStep('review');
    } catch (e) {
      setTestResult('failed');
      setError(e instanceof Error ? e.message : 'Erro ao conectar gateway');
      setStep('review');
    } finally {
      setTesting(false);
    }
  };

  const handleFinish = () => {
    router.push('/dashboard/gateways');
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => {
            if (step === 'configure') setStep('provider');
            else if (step === 'review') setStep('configure');
            else router.push('/dashboard/gateways');
          }}
          className="w-9 h-9 rounded-xl border border-[#E8DDFD] bg-white flex items-center justify-center text-slate-400 hover:text-brand hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-950 tracking-tight leading-none">Conectar Gateway</h1>
          <p className="text-[11.5px] font-bold text-slate-400 mt-1">
            {step === 'provider' && 'Selecione o provedor de pagamento'}
            {step === 'configure' && 'Configure as credenciais de acesso'}
            {step === 'test' && 'Testando conexão...'}
            {step === 'review' && 'Resultado da conexão'}
          </p>
        </div>
      </header>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 px-6 py-4 bg-white rounded-2xl border border-[#E8DDFD] shadow-sm">
        {(['provider', 'configure', 'test', 'review'] as Step[]).map((s, i) => {
          const currentIdx = ['provider', 'configure', 'test', 'review'].indexOf(step);
          const stepIdx = i;
          const isDone = stepIdx < currentIdx;
          const isCurrent = stepIdx === currentIdx;
          return (
            <div key={s} className="flex items-center gap-2 flex-1 last:flex-initial">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all shrink-0',
                isDone && 'bg-green-500 text-white',
                isCurrent && 'bg-brand text-white',
                !isDone && !isCurrent && 'bg-slate-100 text-slate-400',
              )}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn(
                'text-[10px] font-black uppercase tracking-wider hidden md:inline',
                isCurrent ? 'text-slate-900' : 'text-slate-400'
              )}>
                {s === 'provider' && 'Provedor'}
                {s === 'configure' && 'Ajustes'}
                {s === 'test' && 'Teste'}
                {s === 'review' && 'Finalizar'}
              </span>
              {i < 3 && (
                <div className={cn(
                  'h-[2px] flex-1 rounded-full min-w-[20px]',
                  stepIdx < currentIdx ? 'bg-green-400' : 'bg-slate-100'
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#E8DDFD] p-8 shadow-sm">
        {/* Loading Capabilities */}
        {loadingCaps && step === 'provider' && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-brand w-8 h-8" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Carregando provedores...</p>
          </div>
        )}

        {/* Step 1: Provider Selection */}
        {!loadingCaps && step === 'provider' && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500">Escolha o provedor de pagamento para conectar:</p>
            {Object.keys(capabilities).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Nenhum provedor disponível no momento.</p>
            ) : (
              <div className="grid gap-3">
                {Object.entries(capabilities).map(([key, cap]) => {
                  const meta = PROVIDER_META[key] || { name: key, color: 'bg-slate-600' };
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectProvider(key)}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8DDFD] hover:border-brand/40 hover:bg-brand-soft/10 transition-all text-left group"
                    >
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm shrink-0', meta.color)}>
                        {meta.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 text-[14px]">{meta.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">
                          Métodos: {cap.methods.join(' · ')}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand transition-all" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 'configure' && selectedProvider && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nome do Gateway</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Asaas Produção"
                className="w-full h-12 px-4 bg-slate-50 border border-[#E8DDFD] rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ambiente</label>
              <div className="flex gap-3">
                {(['sandbox', 'production'] as const).map(env => (
                  <button
                    key={env}
                    onClick={() => setEnvironment(env)}
                    className={cn(
                      'flex-1 h-12 rounded-2xl border text-xs font-black uppercase tracking-tight transition-all shadow-sm',
                      environment === env
                        ? 'bg-brand text-white border-brand'
                        : 'bg-slate-50 text-slate-600 border-[#E8DDFD] hover:bg-white',
                    )}
                  >
                    {env === 'sandbox' ? 'Sandbox' : 'Produção'}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8DDFD]/45 pt-4 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Credenciais de API</label>
              <div className="space-y-3">
                <div className="space-y-1">
                  <input
                    type="password"
                    placeholder="API Key / Access Token"
                    value={credentials.api_key || credentials.api_token || ''}
                    onChange={e => {
                      const key = selectedProvider === 'asaas' ? 'api_key' : 'api_token';
                      handleCredentialChange(key, e.target.value);
                    }}
                    className="w-full h-12 px-4 bg-slate-50 border border-[#E8DDFD] rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand focus:bg-white transition-all shadow-sm"
                  />
                  <p className="text-[9px] font-bold text-slate-400 pl-1">API Token fornecido pelo painel do seu gateway.</p>
                </div>

                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Sandbox (0 para produção, 1 para sandbox)"
                    value={credentials.sandbox || ''}
                    onChange={e => handleCredentialChange('sandbox', e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 border border-[#E8DDFD] rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand focus:bg-white transition-all shadow-sm"
                  />
                  <p className="text-[9px] font-bold text-slate-400 pl-1">Digite 1 se estiver usando credenciais de testes (Sandbox).</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-2">
                As credenciais são criptografadas em repouso e nunca armazenadas em texto puro.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep('provider')}
                className="flex-1 h-12 bg-white border border-[#E8DDFD] rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                Voltar
              </button>
              <button
                onClick={handleTest}
                disabled={!name || testing}
                className="flex-1 h-12 bg-brand text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand/15"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
                Testar Conexão
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review / Test Status */}
        {step === 'review' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {testResult === 'success' ? (
              <div className="bg-green-50 border border-green-200/50 p-6 rounded-3xl flex items-start gap-4 text-green-700">
                <ShieldCheck className="w-10 h-10 shrink-0 text-green-600" />
                <div>
                  <p className="text-[14px] font-black leading-tight">Conexão Estabelecida com Sucesso</p>
                  <p className="text-xs font-bold text-green-600/80 mt-1">
                    O gateway respondeu positivamente e está pronto para receber transações.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-55/10 border border-red-200/50 p-6 rounded-3xl flex items-start gap-4 text-red-700">
                <ShieldAlert className="w-10 h-10 shrink-0 text-red-650" />
                <div>
                  <p className="text-[14px] font-black leading-tight">A Conexão Falhou</p>
                  <p className="text-xs font-bold text-red-600/80 mt-1">
                    {error || 'Não foi possível autenticar com as credenciais fornecidas.'}
                  </p>
                </div>
              </div>
            )}

            {selectedProvider && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Provedor</span>
                  <span className="font-black text-slate-900">{PROVIDER_META[selectedProvider]?.name || selectedProvider}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Ambiente</span>
                  <span className="font-black text-slate-900">{environment === 'sandbox' ? 'Sandbox' : 'Produção'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Nome da Conta</span>
                  <span className="font-black text-slate-900">{name}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              {testResult === 'failed' && (
                <button
                  onClick={() => { setStep('configure'); setTestResult(null); }}
                  className="flex-1 h-12 bg-white border border-[#E8DDFD] rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Corrigir Credenciais
                </button>
              )}
              <button
                onClick={handleFinish}
                className="flex-1 h-12 bg-brand text-white hover:bg-brand-dark rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-brand/15 flex items-center justify-center"
              >
                {testResult === 'success' ? 'Salvar e Ativar' : 'Fechar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
