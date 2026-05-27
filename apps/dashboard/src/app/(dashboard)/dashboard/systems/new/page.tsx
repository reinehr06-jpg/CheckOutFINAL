'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Network, ShieldCheck } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function NewSystemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await apiFetch('/api/v1/dashboard/systems', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          environment: form.get('environment'),
        }),
      }) as any;
      if (res && res.success) {
        router.push('/dashboard/systems');
      } else {
        setError(res?.error?.message || 'Erro ao conectar sistema');
      }
    } catch (err) {
      setError('Erro de comunicação com o servidor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <header className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/systems')}
          className="w-9 h-9 rounded-xl border border-[#E8DDFD] bg-white flex items-center justify-center text-slate-400 hover:text-brand hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-950 tracking-tight leading-none">Novo Sistema</h1>
          <p className="text-[11.5px] font-bold text-slate-400 mt-1">Conecte um novo sistema a Basileia Pay</p>
        </div>
      </header>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-[#E8DDFD] p-8 shadow-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-55/10 border border-red-200/50 rounded-2xl flex items-center gap-3 text-red-700">
              <span className="text-lg">⚠️</span>
              <p className="text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nome do Sistema</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ex: E-commerce Central, Plataforma EAD"
              className="w-full h-12 px-4 bg-slate-50 border border-[#E8DDFD] rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand focus:bg-white placeholder:text-slate-350 transition-all shadow-sm"
            />
            <p className="text-[10px] font-bold text-slate-400">Insira o nome para identificar a plataforma de origem das vendas.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ambiente</label>
            <div className="relative">
              <select
                name="environment"
                className="w-full h-12 px-4 bg-slate-50 border border-[#E8DDFD] rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="sandbox">Sandbox (Ambiente de Testes)</option>
                <option value="production">Produção (Operações Reais)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400">Em Sandbox as transações serão fictícias para fins de homologação.</p>
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={saving}
              onClick={() => router.push('/dashboard/systems')}
              className="flex-1 h-12 bg-white border border-[#E8DDFD] rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-12 bg-brand hover:bg-brand-dark text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin text-white" />}
              {saving ? 'Criando...' : 'Criar Sistema'}
            </button>
          </div>
        </form>
      </div>

      {/* Trust banner */}
      <div className="bg-[#FAF8FF] border border-[#E8DDFD] p-4 rounded-2xl flex items-center gap-3 text-brand">
        <ShieldCheck className="w-5 h-5 shrink-0 text-brand-accent" />
        <p className="text-[10px] font-bold text-slate-600/90 leading-tight">
          Todos os sistemas criados recebem credenciais exclusivas de API para autenticação e isolamento de dados.
        </p>
      </div>
    </div>
  );
}
