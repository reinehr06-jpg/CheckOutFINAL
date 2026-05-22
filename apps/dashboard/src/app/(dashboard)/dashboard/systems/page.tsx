'use client';

import { useState } from 'react';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';
import { SystemsTable } from '@/components/systems/SystemsTable';
import { apiFetch } from '@/lib/api';

export default function SystemsPage() {
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [key, setKey] = useState(0);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch('/api/v1/dashboard/systems', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          environment: form.get('environment'),
        }),
      });
      setShowNew(false);
      setKey(k => k + 1);
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-0">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] 2xl:text-[34px] font-black tracking-tighter text-ink leading-none">Sistemas</h1>
          </div>
          <p className="text-slate/50 font-bold text-[13px] 2xl:text-[14.5px] tracking-tight mt-1">
            Gerencie os sistemas conectados a Basileia
          </p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 2xl:px-5 py-2 2xl:py-2.5 bg-gradient-to-r from-brand to-brand-accent text-white rounded-xl text-[10.5px] 2xl:text-[11.5px] font-black shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all active:translate-y-0 uppercase tracking-tight h-[40px] 2xl:h-[46px]">
          <Plus className="w-3 2xl:w-3.5 h-3 2xl:h-3.5 text-white/80" /> Novo Sistema
        </button>
      </header>

      <SystemsTable key={key} />

      {/* Modal novo sistema */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowNew(false)}>
          <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black text-ink">Novo Sistema</h2>
            <p className="text-sm font-bold text-slate/50 mt-1">Conecte um novo sistema a Basileia Pay</p>
            <form className="mt-4 space-y-4" onSubmit={handleCreate}>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome</label>
                <input name="name" type="text" required placeholder="Meu Sistema" className="w-full h-11 px-4 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-ink focus:outline-none focus:border-brand placeholder:text-slate-350" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ambiente</label>
                <select name="environment" className="w-full h-11 px-4 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-ink focus:outline-none focus:border-brand">
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Producao</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" disabled={saving} onClick={() => setShowNew(false)} className="flex-1 h-11 bg-slate-50 border border-border rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 h-11 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {saving ? 'Criando...' : 'Criar Sistema'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
