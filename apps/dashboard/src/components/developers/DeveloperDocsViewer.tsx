'use client';

import { useState } from 'react';
import { Search, Terminal, Clipboard, Check, HelpCircle, ArrowRight, Lock, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeveloperDocsViewer({ onActionFeedback }: { onActionFeedback: (msg: string) => void }) {
  const [activeSection, setActiveSection] = useState('auth');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    onActionFeedback('Bloco de exemplo copiado com sucesso!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const sections = [
    { id: 'auth', label: 'Autenticação', desc: 'Como assinar chamadas HTTP com segurança.' },
    { id: 'create-checkout', label: 'Criar Checkout', desc: 'Criar uma nova experiência de checkout.' },
    { id: 'get-payment', label: 'Consultar Pagamento', desc: 'Obter status atual de uma transação.' },
    { id: 'refunds', label: 'Estornos & Reembolsos', desc: 'Processar devoluções parciais ou totais.' },
    { id: 'webhooks', label: 'Configurar Webhooks', desc: 'Receber retornos assíncronos em tempo real.' },
    { id: 'errors', label: 'Tabela de Erros', desc: 'Códigos de status e tratamento de falhas.' },
    { id: 'rate-limits', label: 'Limites de Requisição', desc: 'Políticas de rate limit por API Key.' }
  ];

  const filteredSections = sections.filter(
    s => s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-left items-stretch h-[600px] overflow-hidden">
      
      {/* Index Navigation Column */}
      <div className="w-full lg:w-[240px] bg-slate-50 border border-slate-200/50 rounded-[22px] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-[10.5px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand shadow-sm shadow-slate-100/50"
              placeholder="Buscar na documentação..."
            />
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[440px] no-scrollbar">
            {filteredSections.map((s) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider block transition-all cursor-pointer",
                    active 
                      ? "bg-brand text-white shadow-sm shadow-brand/10" 
                      : "text-slate-500 hover:bg-slate-150/60 hover:text-slate-800"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-100/50 rounded-xl p-3 border border-slate-200/20 text-[9px] font-bold text-slate-400 leading-snug">
          <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mb-1" />
          API V1 oficial da Basileia Pay. Última alteração há 2 semanas.
        </div>
      </div>

      {/* Primary Markdown Content Column */}
      <div className="flex-1 bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 overflow-y-auto no-scrollbar shadow-sm shadow-slate-100/50 h-full">
        
        {/* Section 1: Auth */}
        {activeSection === 'auth' && (
          <div className="space-y-4">
            <div>
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Conceitos Gerais</span>
              <h2 className="text-sm font-black text-slate-900 mt-0.5">Autenticação de Chamadas HTTP</h2>
            </div>
            
            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              A API da Basileia Pay utiliza autenticação baseada em Bearer Token. Todas as chamadas para endpoints privados devem incluir a chave de API (sk_live_...) no cabeçalho <span className="font-mono bg-slate-50 px-1 border border-slate-100 rounded text-slate-800 font-extrabold text-[10px]">Authorization</span> de cada requisição.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450 border-b border-slate-800 pb-2">
                <span>Cabeçalho de Exemplo</span>
                <button
                  onClick={() => handleCopy("Authorization: Bearer sk_live_bsl_29fa********", "auth-hdr")}
                  className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                >
                  {copiedText === 'auth-hdr' ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre no-scrollbar">
                <code>{`Authorization: Bearer sk_live_bsl_29fa********\nContent-Type: application/json`}</code>
              </pre>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[10.5px] font-semibold text-amber-800 leading-relaxed flex gap-2">
              <Lock className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>
                <strong>Atenção:</strong> Chaves criadas em ambiente **Sandbox** utilizam o prefixo <code className="font-mono font-black text-[9.5px]">sk_test_...</code> e nunca alteram saldos ou transações reais de clientes.
              </span>
            </div>
          </div>
        )}

        {/* Section 2: Create Checkout */}
        {activeSection === 'create-checkout' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase leading-none">POST</span>
                <span className="font-mono text-xs text-slate-800 font-black">/v1/checkouts</span>
              </div>
              <h2 className="text-sm font-black text-slate-900 mt-1.5">Criar Experiência de Checkout</h2>
            </div>

            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              Use este endpoint para criar e inicializar uma experiência de checkout embutida para cartões, PIX ou boletos. Retorna a URL final da Basileia Pay.
            </p>

            <div className="space-y-2">
              <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block">Parâmetros do Payload</span>
              <div className="border border-slate-100 rounded-xl overflow-hidden text-[10.5px] font-semibold text-slate-600">
                <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100 p-2 font-black uppercase text-slate-400 text-[9px]">
                  <span>Campo</span>
                  <span>Tipo</span>
                  <span>Obrigatoriedade</span>
                  <span>Descrição</span>
                </div>
                <div className="grid grid-cols-4 p-2 border-b border-slate-100 font-mono text-[10px]">
                  <span className="text-slate-800 font-black">system_id</span>
                  <span>string</span>
                  <span className="text-brand">Obrigatório</span>
                  <span className="font-sans text-[10px]">Código do sistema de origem.</span>
                </div>
                <div className="grid grid-cols-4 p-2 border-b border-slate-100 font-mono text-[10px]">
                  <span className="text-slate-800 font-black">amount</span>
                  <span>integer</span>
                  <span className="text-brand">Obrigatório</span>
                  <span className="font-sans text-[10px]">Valor em centavos (Ex: 15990 = R$159,90).</span>
                </div>
                <div className="grid grid-cols-4 p-2 font-mono text-[10px]">
                  <span className="text-slate-800 font-black">customer</span>
                  <span>object</span>
                  <span className="text-slate-400">Opcional</span>
                  <span className="font-sans text-[10px]">Objeto com dados de contato do cliente.</span>
                </div>
              </div>
            </div>

            {/* Request example code */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450 border-b border-slate-800 pb-2">
                <span>Payload de Resposta (JSON)</span>
                <button
                  onClick={() => handleCopy(JSON.stringify({ id: "chk_01JTK8X9", status: "created", checkout_url: "https://pay.basileia.com/chk_01JTK8X9" }, null, 2), "chk-res")}
                  className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                >
                  {copiedText === 'chk-res' ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre no-scrollbar">
                <code>{`{\n  "id": "chk_01JTK8X9A214",\n  "status": "created",\n  "amount": 15990,\n  "checkout_url": "https://pay.basileia.com/chk_01JTK8X9A214",\n  "expires_at": "2026-05-19T15:00:00Z"\n}`}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Section 3: Get Payment */}
        {activeSection === 'get-payment' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase leading-none">GET</span>
                <span className="font-mono text-xs text-slate-800 font-black">/v1/payments/:id</span>
              </div>
              <h2 className="text-sm font-black text-slate-900 mt-1.5">Consultar Transação de Pagamento</h2>
            </div>

            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              Obtém a árvore completa de dados e o status operacional atual de uma transação pelo seu ID exclusivo.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-450 border-b border-slate-800 pb-2">
                <span>Response (200 OK)</span>
                <button
                  onClick={() => handleCopy(JSON.stringify({ id: "pay_7c9d8a1e2f3", status: "succeeded" }, null, 2), "get-pay-res")}
                  className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                >
                  {copiedText === 'get-pay-res' ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre no-scrollbar">
                <code>{`{\n  "id": "pay_7c9d8a1e2f3",\n  "amount": 5000,\n  "status": "succeeded",\n  "payment_method": "pix",\n  "customer": {\n    "name": "Júlio César",\n    "email": "julio@igreja.org"\n  }\n}`}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Section 4: Refunds */}
        {activeSection === 'refunds' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase leading-none">POST</span>
                <span className="font-mono text-xs text-slate-800 font-black">/v1/refunds</span>
              </div>
              <h2 className="text-sm font-black text-slate-900 mt-1.5">Estornos e Reembolsos de Valores</h2>
            </div>

            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              Solicita o reembolso parcial ou total de uma compra paga de Pix ou Cartão. Retorna o ID da operação e o status da devolução.
            </p>
          </div>
        )}

        {/* Section 5: Webhooks */}
        {activeSection === 'webhooks' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">Configuração de Webhooks Técnicos</h2>
            </div>

            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              A Basileia Pay dispara requisições HTTPS do tipo <span className="font-extrabold text-slate-700">POST</span> sempre que um pagamento é aprovado, recusado ou estornado, enviando o payload correspondente para sua URL configurada de endpoint em tempo real.
            </p>
          </div>
        )}

        {/* Section 6: Errors */}
        {activeSection === 'errors' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">Tratamento de Falhas e Erros HTTP</h2>
            </div>

            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              A API utiliza respostas JSON descritivas e códigos de status HTTP padrão de mercado (2xx, 4xx, 5xx) para sinalizar o sucesso ou falha das requisições executadas.
            </p>
          </div>
        )}

        {/* Section 7: Rate limits */}
        {activeSection === 'rate-limits' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900">Políticas de Rate Limit</h2>
            </div>

            <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
              O limite padrão de requisições por API Key em produção é de <strong>60 requisições por minuto</strong> (1 req/s). Se o seu sistema exceder este valor, a API responderá com o erro HTTP <span className="font-extrabold text-red-655">429 Too Many Requests</span>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
