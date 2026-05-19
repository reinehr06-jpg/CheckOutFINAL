'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, Check, X, ShieldCheck, Laptop, AlertOctagon } from 'lucide-react';

export default function SecuritySettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form parameters
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [minPasswordLength, setMinPasswordLength] = useState('10');
  const [ipWhitelist, setIpWhitelist] = useState('177.12.34.0/24, 189.45.67.23');

  const [activeSessions, setActiveSessions] = useState([
    { id: '1', device: 'Chrome 124.0 / macOS (M1)', ip: '177.12.34.56', location: 'São Paulo, BR', current: true },
    { id: '2', device: 'Safari 17.2 / iOS (iPhone 15)', ip: '177.98.65.43', location: 'São Paulo, BR', current: false },
    { id: '3', device: 'Firefox 122.0 / Windows 11', ip: '189.45.67.23', location: 'Curitiba, BR', current: false }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Parâmetros de segurança atualizados.');
  };

  const handleRevokeSession = (id: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    triggerToast('Sessão revogada com sucesso.');
  };

  return (
    <div className="w-full text-left space-y-6 pt-2 pb-12 select-none">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-brand text-white p-3.5 rounded-2xl shadow-xl border border-brand/50 flex items-center justify-between gap-3 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span className="text-[11.5px] font-bold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-0.5 text-white/70 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-455">
        <Link href="/dashboard/settings" className="hover:text-brand flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Configurações
        </Link>
        <span className="text-slate-350">/</span>
        <span className="text-slate-700 font-bold">Acesso e segurança</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7E5EF] pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-650 border border-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] 2xl:text-[20px] font-black tracking-tight text-slate-950">
              Acesso e Segurança
            </h1>
            <p className="text-slate-455 font-semibold text-[11px] 2xl:text-[11.5px] tracking-tight">
              Gerencie políticas de senha, whitelist de IPs de acesso e controle de sessões operacionais.
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="flex h-9 items-center justify-center gap-1.5 px-4 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-black shadow-lg shadow-violet-600/15 transition-all uppercase tracking-tight"
        >
          <Save className="w-3.5 h-3.5 shrink-0" />
          Salvar alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Col 1 & 2: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sessão e senhas */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Sessões e Senhas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Expiração por Inatividade (minutos)</label>
                <select 
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50 border border-[#E8DDFD] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-brand cursor-pointer"
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="240">4 horas</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Comprimento Mínimo da Senha</label>
                <select 
                  value={minPasswordLength}
                  onChange={(e) => setMinPasswordLength(e.target.value)}
                  className="w-full h-10 px-3.5 bg-slate-50 border border-[#E8DDFD] rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-brand cursor-pointer"
                >
                  <option value="8">8 caracteres</option>
                  <option value="10">10 caracteres</option>
                  <option value="12">12 caracteres</option>
                  <option value="16">16 caracteres</option>
                </select>
              </div>
            </div>
          </div>

          {/* IPs whitelist */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Controle de IP (Whitelist)
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Endereços IP Permitidos</label>
              <textarea 
                rows={2}
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="Ex: 192.168.1.1, 10.0.0.0/24"
                className="w-full p-3.5 bg-slate-50 border border-[#E8DDFD] rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-brand resize-none leading-relaxed"
              />
              <span className="text-[10px] font-semibold text-slate-400 block">
                Insira IPs ou blocos CIDR separados por vírgula. Se vazio, o acesso de qualquer IP será liberado.
              </span>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
              Sessões Ativas Recentes
            </h3>

            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="p-3.5 border border-slate-100 rounded-xl flex items-center justify-between gap-4 bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                      <Laptop className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{session.device}</span>
                        {session.current && (
                          <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded text-[9px] font-black uppercase border border-emerald-200">Atual</span>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">IP: {session.ip} • Localização: {session.location}</p>
                    </div>
                  </div>

                  {!session.current && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(session.id)}
                      className="px-2.5 py-1 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg text-[10px] font-black uppercase transition-colors"
                    >
                      Expirar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Col 3: Details */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E7E5EF] rounded-[22px] p-5 shadow-sm space-y-4">
            <div className="flex gap-2.5 items-start text-amber-700 text-xs font-semibold leading-relaxed">
              <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-slate-900">Políticas Ativas</p>
                <p className="text-slate-500 text-[11px] mt-1 font-semibold">
                  A conta conta com dupla checagem de IP e auditoria forense criptográfica ativada no nível operacional máximo.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
