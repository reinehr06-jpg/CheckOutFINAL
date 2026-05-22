'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, Copy, Check, ArrowRight, Clock, Terminal } from 'lucide-react';

export default function MasterAccessPage() {
  const [code, setCode] = useState<string>('------');
  const [expiresIn, setExpiresIn] = useState(20);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const fetchCode = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/v1/auth/master/code`, {
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setCode(data.data.code);
        setExpiresIn(data.data.expires_in);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchCode();
    const interval = setInterval(fetchCode, 5000);
    return () => clearInterval(interval);
  }, [fetchCode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0A0A0F] via-[#0D0D1A] to-[#1A0A2E] flex items-center justify-center p-4 select-none overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/3 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/3 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-[480px] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center shadow-2xl shadow-brand/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Acesso Master</h1>
          <p className="text-sm text-slate-400 font-semibold">
            Portal de acesso administrativo da plataforma
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Código de acesso temporário
            </p>

            {error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm font-bold">
                  Erro ao conectar com o servidor. Verifique se a API está rodando.
                </p>
              </div>
            ) : (
              <>
                <div className="relative inline-block">
                  <span className="text-5xl font-mono font-black tracking-[0.25em] text-brand bg-brand/5 px-6 py-4 rounded-xl border border-brand/10">
                    {code}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-bold">Expira em <span className="text-slate-200">{expiresIn}s</span></span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-brand hover:text-brand-light font-bold transition-colors"
                  >
                    {copied ? (
                      <><Check className="w-3.5 h-3.5" /> Copiado</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copiar código</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3 h-3" /> Instruções
            </p>
            <ol className="text-xs text-slate-400 font-semibold space-y-1.5 list-decimal list-inside">
              <li>Copie o código de acesso acima</li>
              <li>Vá para a página de login da plataforma</li>
              <li>Use o email: <code className="text-brand font-mono text-[10px] bg-brand/5 px-1.5 py-0.5 rounded">CheckBasiPay@adm.basileia.global</code></li>
              <li>Cole o código como senha (válido por 20 segundos)</li>
            </ol>
          </div>

          <a
            href="/login"
            className="w-full h-12 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2"
          >
            Ir para o login <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <p className="text-center text-[10px] font-bold text-slate-600">
          Basileia Tecnologia Ltda. • Acesso restrito • Todos os acessos são auditados
        </p>
      </div>
    </div>
  );
}
