'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Globe, 
  Users2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Plus, 
  Trash2, 
  Settings, 
  Lock,
  Palette,
  Monitor,
  CreditCard,
  Send,
  Play,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  AlertTriangle
} from 'lucide-react';

// Steps list as defined by documentation
type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

interface AuditLog {
  timestamp: string;
  event: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'security';
}

export default function OnboardingPage() {
  const router = useRouter();
  
  // Simulation accounts states
  const [accountState, setAccountState] = useState<'empty' | 'has_system' | 'has_gateway' | 'has_checkout' | 'completed'>('empty');
  const [step, setStep] = useState<OnboardingStep>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Step 1 State: Welcome context
  const [userName, setUserName] = useState('Vinícius Reinehr');
  const [companyName, setCompanyName] = useState('Basileia Premium Corp');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');

  // Step 2 State: First system
  const [systemName, setSystemName] = useState('Checkout Main Studio');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  // Step 3 State: First gateway
  const [gatewayProvider, setGatewayProvider] = useState('Basileia Pay Direct');
  const [apiKey, setApiKey] = useState('pk_sandbox_5589a091cf76bde');
  const [isGatewayTesting, setIsGatewayTesting] = useState(false);
  const [gatewayTested, setGatewayTested] = useState(false);

  // Step 4 State: First checkout
  const [checkoutName, setCheckoutName] = useState('Checkout Premium Pix e Cartão');
  const [checkoutThemeColor, setCheckoutThemeColor] = useState('#8B5CF6'); // Basileia Purple
  const [allowPix, setAllowPix] = useState(true);
  const [allowCard, setAllowCard] = useState(true);

  // Step 5 State: Publish version
  const [releaseVersion, setReleaseVersion] = useState('v1.0.0-beta');
  const [releaseNotes, setReleaseNotes] = useState('Setup inicial do checkout para recebimentos integrados');
  const [isPublished, setIsPublished] = useState(false);

  // Step 6 State: Simulated test transaction
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('VINICIUS REINEHR');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { timestamp: '15:31:02', event: 'Sessão Iniciada', details: 'Primeiro login corporativo detectado.', type: 'security' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const addAuditLog = (event: string, details: string, type: 'info' | 'success' | 'warning' | 'security' = 'info') => {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    setAuditLogs(prev => [
      { timestamp: time, event, details, type },
      ...prev
    ]);
  };

  // Skip state actions based on state selector simulation (User guidelines)
  useEffect(() => {
    if (accountState === 'empty') {
      setStep(1);
      triggerToast("Estado da conta: Vazia. Todas as etapas visíveis.");
    } else if (accountState === 'has_system') {
      setStep(3); // skip welcome and system creation -> go to gateway
      addAuditLog('Etapas Simplificadas', 'Sistema detectado na conta. Redirecionado para Gateway.', 'warning');
      triggerToast("Conta possui Sistema. Pulando para etapa 3!");
    } else if (accountState === 'has_gateway') {
      setStep(4); // skip to checkout
      setGatewayTested(true);
      addAuditLog('Etapas Simplificadas', 'Sistema e Gateway ativos. Redirecionado para Checkout.', 'warning');
      triggerToast("Conta possui Gateway conectado. Pulando para etapa 4!");
    } else if (accountState === 'has_checkout') {
      setStep(5); // skip to publish
      setGatewayTested(true);
      addAuditLog('Etapas Simplificadas', 'Checkout criado em rascunho. Redirecionado para Publicação.', 'warning');
      triggerToast("Checkout pendente de publicação. Pulando para etapa 5!");
    } else if (accountState === 'completed') {
      setStep(6); // final step validation
      setGatewayTested(true);
      setIsPublished(true);
      addAuditLog('Etapas Simplificadas', 'Onboarding quase completo. Resta venda de teste.', 'success');
      triggerToast("Onboarding quase pronto. Resta simular venda de teste!");
    }
  }, [accountState]);

  // Handle gateway connection test
  const handleTestGateway = () => {
    setIsGatewayTesting(true);
    triggerToast("Iniciando handshake seguro com adquirente...");
    setTimeout(() => {
      setIsGatewayTesting(false);
      setGatewayTested(true);
      addAuditLog('Gateway Conectado', `${gatewayProvider} integrado com sucesso em sandbox.`, 'success');
      triggerToast("✓ Conexão estabelecida com sucesso via TLS 1.3!");
    }, 1500);
  };

  // Handle checkout publishing
  const handlePublishCheckout = () => {
    setIsPublished(true);
    addAuditLog('Checkout Publicado', `Versão ${releaseVersion} de '${checkoutName}' ativa em Produção.`, 'security');
    triggerToast("✓ Versão de checkout publicada com sucesso em ambiente de vendas!");
    setStep(6);
  };

  // Simulate payment processing in Step 6
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      triggerToast("Insira o número completo do cartão de testes.");
      return;
    }
    setIsPaying(true);
    addAuditLog('Transação Iniciada', `Venda de teste iniciada para checkout '${checkoutName}'`, 'info');
    
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      addAuditLog('Transação Aprovada', `Venda de teste aprovada. ID: trx_test_${Math.random().toString(36).substr(2, 9)}`, 'success');
      triggerToast("✓ Venda de teste aprovada! Transação validada.");
    }, 2000);
  };

  const handleNextStep = () => {
    if (step === 1) {
      addAuditLog('Boas-vindas Aceito', `Contexto corporativo verificado para ${companyName}.`, 'info');
      setStep(2);
    } else if (step === 2) {
      if (!systemName) {
        triggerToast("Por favor, nomeie seu primeiro sistema.");
        return;
      }
      addAuditLog('Sistema Criado', `Sistema '${systemName}' registrado com sucesso.`, 'success');
      setStep(3);
    } else if (step === 3) {
      if (!gatewayTested) {
        triggerToast("Por favor, realize o teste de conexão do gateway.");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!checkoutName) {
        triggerToast("Dê um nome ao seu primeiro checkout.");
        return;
      }
      addAuditLog('Rascunho de Checkout', `Layout '${checkoutName}' salvo como rascunho.`, 'info');
      setStep(5);
    }
  };

  return (
    <div className="flex flex-col gap-4 2xl:gap-5 animate-in fade-in slide-in-from-bottom-2 duration-700 w-full text-left">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-2.5 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 bg-brand rounded-full shrink-0 animate-ping" />
          <span className="text-[11px] font-black text-left">{toastMessage}</span>
        </div>
      )}

      {/* Header with quick simulations toggles (UX State Demonstration) */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pt-1 w-full border-b border-slate-100 pb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] 2xl:text-[34px] font-black tracking-tighter text-ink leading-none">Onboarding Ativo</h1>
            <div className="h-6 w-px bg-border/60 mx-1" />
            <Sparkles className="w-5.5 h-5.5 text-brand" />
          </div>
          <p className="text-slate/50 font-bold text-[13px] 2xl:text-[14.5px] tracking-tight">
            Seu primeiro login guiado. Prepare seu sistema, gateway e valide seu primeiro checkout real.
          </p>
        </div>

        {/* State selector widget */}
        <div className="bg-slate-50 border border-slate-200/70 p-1.5 rounded-2xl flex items-center gap-2">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider pl-2">Simular Estado:</span>
          <div className="flex gap-1">
            {(['empty', 'has_system', 'has_gateway', 'has_checkout', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setAccountState(st)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                  accountState === st 
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {st === 'empty' && 'Vazia'}
                {st === 'has_system' && 'C/ Sistema'}
                {st === 'has_gateway' && 'C/ Gateway'}
                {st === 'has_checkout' && 'C/ Rascunho'}
                {st === 'completed' && 'Completa'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Left-right grid split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr_400px] gap-6 items-start w-full">
        
        {/* Left Column: Progress Stepper */}
        <div className="bg-white/60 backdrop-blur border border-border/80 rounded-[24px] p-5 shadow-sm space-y-4 text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pb-1 border-b border-slate-100">
            Progresso Recomendado
          </span>
          
          <nav className="space-y-1">
            {[
              { num: 1, label: 'Boas-vindas', desc: 'Identificar seu perfil' },
              { num: 2, label: 'Criar Sistema', desc: 'Sua base de vendas' },
              { num: 3, label: 'Conectar Gateway', desc: 'Recebimento de valores' },
              { num: 4, label: 'Criar Checkout', desc: 'Aparência & pagamentos' },
              { num: 5, label: 'Publicar Versão', desc: 'Gerar release ativa' },
              { num: 6, label: 'Venda de Teste', desc: 'Validar toda a operação' }
            ].map((s) => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              
              return (
                <button
                  key={s.num}
                  disabled={!isDone && !isActive && step !== 6} // Let them navigate back easily or forward if done
                  onClick={() => setStep(s.num as OnboardingStep)}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl transition-all text-left ${
                    isActive 
                      ? 'bg-brand/5 border border-brand/10 text-brand' 
                      : isDone 
                      ? 'text-emerald-700 bg-emerald-50/20' 
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    isActive 
                      ? 'bg-brand text-white' 
                      : isDone 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black block leading-none tracking-tight">{s.label}</span>
                    <span className="text-[9px] font-bold block text-slate-450 truncate mt-0.5">{s.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Help widget */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Precisa de Ajuda?</span>
            <p className="text-[10px] font-semibold text-slate-500 leading-normal">
              O onboarding é um construtor em tempo real. Cada configuração feita aqui gera recursos ativos utilizáveis no seu painel principal.
            </p>
          </div>
        </div>

        {/* Center Column: Card content wizard action */}
        <div className="bg-white border border-border rounded-[24px] p-6 xl:p-8 shadow-xl shadow-brand/5 flex flex-col justify-between min-h-[460px] w-full">
          
          {/* STEP 1: WELCOME CONTEXT */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <h2 className="text-xl xl:text-2xl font-black text-[#1E1538]">
                  Boas-vindas à Basileia Pay, {userName}!
                </h2>
                <p className="text-brand font-black text-xs">
                  “Vamos preparar seu primeiro ambiente de venda.”
                </p>
                <p className="text-slate/60 text-xs font-bold leading-relaxed">
                  Você está logado na organização corporativa <strong className="text-slate-800">{companyName}</strong> sob o ambiente operacional de <strong className="text-brand">Sandbox (Simulação)</strong>. Vamos juntos configurar a base mínima de transações da sua empresa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-150 text-xs font-bold text-slate-650">
                <div className="space-y-1">
                  <span className="text-[9.5px] text-slate-400 block uppercase tracking-wider">Organização Administrativa</span>
                  <span className="text-slate-800">{companyName}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9.5px] text-slate-400 block uppercase tracking-wider">Ambiente Inicial Protegido</span>
                  <span className="text-brand flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    Sandbox Regulatório
                  </span>
                </div>
              </div>

              <div className="bg-amber-50/75 border border-amber-100 p-4 rounded-xl text-[10.5px] font-bold text-slate-600 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Toda atividade de cadastro, chave de adquirente ou geração de checkouts nesta seção gerará registros de segurança integrados nos logs de auditoria da sua conta corporativa.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: CREATE FIRST SYSTEM */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[9.5px] text-brand font-black uppercase tracking-wider">Etapa 2 de 6 • Base de Venda</span>
                <h2 className="text-xl xl:text-2xl font-black text-[#1E1538]">
                  Crie o sistema que vai operar suas transações
                </h2>
                <p className="text-slate/60 text-xs font-bold leading-relaxed">
                  O sistema atua como o agregador das suas páginas de pagamento e integrações de gateway. Insira o nome do seu primeiro ponto operacional de checkout.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome fantasia do sistema</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pagamentos E-Commerce"
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                    />
                    <Monitor className="w-4.5 h-4.5 text-slate-350 absolute right-3.5 top-1/2 -translate-y-1/2 shrink-0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Modo do Sistema</label>
                    <div className="h-11 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl flex items-center px-4 text-xs font-bold select-none cursor-not-allowed">
                      Multi-Checkout Ativo
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Branding Logo Corporativa</label>
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyLogo('active_logo');
                        triggerToast("Logo corporativa simulada ativada!");
                      }}
                      className={`w-full h-11 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                        companyLogo 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-250'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {companyLogo ? '✓ Logomarca Ativa' : 'Simular Logo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONNECT GATEWAY */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[9.5px] text-brand font-black uppercase tracking-wider">Etapa 3 de 6 • Finanças</span>
                <h2 className="text-xl xl:text-2xl font-black text-[#1E1538]">
                  Conecte o gateway que receberá seus pagamentos
                </h2>
                <p className="text-slate/60 text-xs font-bold leading-relaxed">
                  Vincule a conta de adquirente que processará e liquidará as transações financeiras. Para facilitar, ativamos por padrão as chaves de teste da Basileia Pay.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Provedor Financeiro</label>
                    <select
                      value={gatewayProvider}
                      onChange={(e) => setGatewayProvider(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                    >
                      <option>Basileia Pay Direct</option>
                      <option>Cielo V3 API</option>
                      <option>Stone Pagar.me</option>
                      <option>Rede Adquirência</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Credencial Sandbox (Chave Pública)</label>
                    <input
                      type="text"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-mono font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestGateway}
                    disabled={isGatewayTesting}
                    className="h-11 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2"
                  >
                    {isGatewayTesting ? 'Testando Handshake...' : gatewayTested ? '✓ Conexão Testada' : 'Testar Conexão'}
                    <Play className="w-3.5 h-3.5 text-brand" />
                  </button>

                  <p className="text-[10.5px] font-bold text-slate-450 leading-tight">
                    {gatewayTested ? 'Chave de criptografia e TLS verificados com sucesso!' : 'Clique no botão acima para validar a comunicação segura com o provedor.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CREATE CHECKOUT */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[9.5px] text-brand font-black uppercase tracking-wider">Etapa 4 de 6 • Visual & Conversão</span>
                <h2 className="text-xl xl:text-2xl font-black text-[#1E1538]">
                  Crie a sua primeira experiência de checkout
                </h2>
                <p className="text-slate/60 text-xs font-bold leading-relaxed">
                  Escolha o nome do seu checkout e configure as opções de pagamento básicas que os seus clientes visualizarão no momento da compra.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome da Experiência de Checkout</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Checkout de Vendas Rápidas"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ajustar Cor da Marca no Preview</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={checkoutThemeColor}
                        onChange={(e) => setCheckoutThemeColor(e.target.value)}
                        className="w-12 h-10.5 rounded-xl border border-slate-250 cursor-pointer overflow-hidden p-0 shrink-0"
                      />
                      <input
                        type="text"
                        value={checkoutThemeColor}
                        onChange={(e) => setCheckoutThemeColor(e.target.value)}
                        className="w-full h-10.5 px-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-mono font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Payment switches */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Métodos Disponíveis</label>
                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={allowCard}
                          onChange={(e) => setAllowCard(e.target.checked)}
                          className="rounded border-slate-300 text-brand focus:ring-brand"
                        />
                        Cartão
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={allowPix}
                          onChange={(e) => setAllowPix(e.target.checked)}
                          className="rounded border-slate-300 text-brand focus:ring-brand"
                        />
                        Pix
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PUBLISH VERSIONS */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[9.5px] text-brand font-black uppercase tracking-wider">Etapa 5 de 6 • Deploy</span>
                <h2 className="text-xl xl:text-2xl font-black text-[#1E1538]">
                  Publique sua primeira versão para começar a operar
                </h2>
                <p className="text-slate/60 text-xs font-bold leading-relaxed">
                  Para iniciar vendas reais ou testes operacionais amplificados, crie uma versão (release) assinada da sua configuração. Isso congela o rascunho de forma segura.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Identificador da Versão</label>
                    <input
                      type="text"
                      value={releaseVersion}
                      onChange={(e) => setReleaseVersion(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-mono font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Descrição das Alterações (Notas de Release)</label>
                    <input
                      type="text"
                      value={releaseNotes}
                      onChange={(e) => setReleaseNotes(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none text-xs font-bold text-slate-800 transition-all bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8FF] border border-[#E8DDFD]/60 rounded-2xl flex items-center justify-between gap-3">
                  <div className="text-left space-y-0.5">
                    <span className="text-xs font-black text-slate-850 block">✓ Auditoria de Produção Ativa</span>
                    <span className="text-[10px] font-bold text-slate-450 block leading-relaxed">
                      Esta publicação congela as configurações atuais do gateway e do design do checkout para transações.
                    </span>
                  </div>
                  <button
                    onClick={handlePublishCheckout}
                    className="h-10 px-5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/10 transition-all shrink-0"
                  >
                    Publicar Agora
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: TEST TRANSACTION VALIDATION */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <span className="text-[9.5px] text-emerald-600 font-black uppercase tracking-wider">Etapa Final 6 de 6 • Auditoria Operacional</span>
                <h2 className="text-xl xl:text-2xl font-black text-[#1E1538]">
                  Finalize com uma venda de teste para validar tudo
                </h2>
                <p className="text-slate/60 text-xs font-bold leading-relaxed">
                  Para garantir que o fluxo de ponta a ponta está operando com chaves corretas, execute uma transação de simulação no seu checkout abaixo.
                </p>
              </div>

              {paymentSuccess ? (
                <div className="bg-emerald-50/75 border border-emerald-100 text-emerald-850 p-5 rounded-2xl space-y-3">
                  <div className="font-black text-emerald-800 text-[14.5px] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 animate-ping" />
                    Transação de Teste Aprovada!
                  </div>
                  <p className="text-xs font-bold">
                    O checkout operou com sucesso! O adquirente processou a venda de R$ 10,00, registrou a transação e enviou os webhooks de conciliação.
                  </p>
                  <p className="text-[10.5px] text-slate-450 font-bold leading-normal">
                    Seu onboarding na Basileia Pay está concluído com integridade e conformidade de segurança máxima.
                  </p>
                </div>
              ) : (
                <div className="border border-[#E8DDFD] bg-slate-50/30 p-4.5 rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <span>💳 Terminal de Teste Integrado</span>
                    <span className="text-brand">Valor: R$ 10,00</span>
                  </div>

                  <form onSubmit={handleSimulatePayment} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Número do cartão de teste</label>
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-brand bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Validade</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-brand bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">CVV</label>
                      <input
                        type="text"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full h-9.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-brand bg-white"
                      />
                    </div>
                    <div className="self-end">
                      <button
                        type="submit"
                        disabled={isPaying}
                        className="w-full h-9.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-[10.5px] font-black uppercase tracking-wider shadow transition-all flex items-center justify-center"
                      >
                        {isPaying ? 'Processando...' : 'Pagar R$ 10,00'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Wizard CTA Control buttons inside card */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            {step > 1 && step < 6 ? (
              <button
                onClick={() => setStep((step - 1) as OnboardingStep)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step < 5 && (
                <button
                  onClick={() => setStep((step + 1) as OnboardingStep)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                >
                  Pular por agora
                </button>
              )}

              {step < 5 ? (
                <button
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand/10 transition-all"
                >
                  Continuar <ChevronRight className="w-4 h-4" />
                </button>
              ) : step === 5 ? (
                <button
                  onClick={handlePublishCheckout}
                  className="px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-brand/10 transition-all"
                >
                  Confirmar e Publicar <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    addAuditLog('Onboarding Concluído', 'Finalização total de onboarding guiado.', 'success');
                    triggerToast("Concluindo onboarding! Carregando painel principal...");
                    setTimeout(() => router.push('/dashboard'), 1500);
                  }}
                  disabled={!paymentSuccess}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:-translate-y-0.5 transition-all text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  Concluir e Ir ao Painel <Check className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Live Dynamic Visual preview & audit logs */}
        <div className="space-y-5 select-none w-full">
          
          {/* Dynamic Mockup Visual Preview Panel */}
          <div className="bg-slate-50/50 border border-border rounded-[24px] p-5 shadow-sm space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1 border-b border-slate-200/50">
              Visualização Operacional Ativa
            </span>

            <div className="bg-white border border-[#E8DDFD]/90 rounded-[20px] p-4.5 shadow-md space-y-3.5">
              
              {/* Simulator of a payment checkout */}
              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm bg-white">
                
                {/* Browser top-bar */}
                <div className="bg-slate-50 border-b border-slate-100 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[7.5px] font-mono text-slate-400">basileia.pay/checkout/{systemName.toLowerCase().replace(/\s/g, '-') || 'preview'}</span>
                  <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                </div>

                {/* Form preview */}
                <div className="p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div 
                        style={{ backgroundColor: checkoutThemeColor }}
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-white font-extrabold text-[9px] shadow transition-colors"
                      >
                        {systemName.substring(0, 1).toUpperCase() || 'B'}
                      </div>
                      <span className="text-[9.5px] font-black text-slate-800 tracking-tight">{systemName || 'Nome do Sistema'}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-800">R$ 150,00</span>
                  </div>

                  {/* Payment modes selectors */}
                  <div className="grid grid-cols-2 gap-2 text-[8px] font-black uppercase tracking-wider">
                    {allowCard ? (
                      <div 
                        style={{ borderColor: checkoutThemeColor, color: checkoutThemeColor }}
                        className="p-1.5 border rounded-lg bg-slate-50/50 flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>💳 Cartão</span>
                      </div>
                    ) : (
                      <div className="p-1.5 border border-slate-100 rounded-lg text-slate-300 flex items-center justify-center line-through">
                        <span>💳 Cartão</span>
                      </div>
                    )}

                    {allowPix ? (
                      <div className="p-1.5 border border-slate-200 rounded-lg text-slate-600 flex items-center justify-center gap-1">
                        <span>⚡ Pix</span>
                      </div>
                    ) : (
                      <div className="p-1.5 border border-slate-100 rounded-lg text-slate-300 flex items-center justify-center line-through">
                        <span>⚡ Pix</span>
                      </div>
                    )}
                  </div>

                  {/* Checkout CTA */}
                  <button 
                    style={{ backgroundColor: checkoutThemeColor }}
                    className="w-full h-8 rounded-lg text-white font-black text-[9px] uppercase tracking-wider shadow transition-colors flex items-center justify-center pointer-events-none"
                  >
                    Pagar R$ 150,00
                  </button>
                </div>
              </div>

              {/* Quick stats parameters */}
              <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-500 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 block">Gateway</span>
                  <span className="text-slate-800 font-black block truncate">{gatewayTested ? gatewayProvider : 'Pendente'}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 block">Deploy</span>
                  <span className="text-slate-800 font-black block">{isPublished ? 'Versão Ativa' : 'Rascunho'}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 block">Status Operação</span>
                  <span className={`font-black block ${paymentSuccess ? 'text-emerald-600' : 'text-slate-650'}`}>
                    {paymentSuccess ? 'Trx Aprovada' : 'Aguardando Trx'}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Audit Logs Trail Visual widget */}
          <div className="bg-slate-50/50 border border-border rounded-[24px] p-5 shadow-sm space-y-3 text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block pb-1 border-b border-slate-200/50">
              Trilha de Auditoria (Audit Logs)
            </span>

            <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar pr-1">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2 text-[10.5px] leading-tight items-start bg-white p-2 rounded-xl border border-slate-150">
                  <span className="text-[9px] font-mono text-slate-400 shrink-0 pt-0.5">{log.timestamp}</span>
                  <div className="min-w-0">
                    <span className={`font-black block ${
                      log.type === 'success' ? 'text-emerald-700' : log.type === 'security' ? 'text-violet-700' : 'text-slate-800'
                    }`}>
                      {log.event}
                    </span>
                    <span className="text-[9.5px] text-slate-500 font-semibold block mt-0.5 leading-normal">{log.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
