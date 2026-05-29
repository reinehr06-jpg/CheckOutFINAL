'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  FileText, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Key,
  Monitor,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchWithTimeout, getCsrfToken, setTokens, getAccessToken } from '@/lib/api';

type AuthState = 'credentials' | 'two_factor' | 'recovery' | 'locked_out' | 'session_expired' | 'restricted';

export default function LoginPage() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Detect ?reason=expired from URL to show session expired screen
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('reason') === 'expired') return 'session_expired';
    }
    return 'credentials';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 2FA Code States
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeInputs = useRef<any[]>([]);

  // Recovery email state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Locked out countdown simulation
  const [lockoutTime, setLockoutTime] = useState(899); // 14:59 minutes

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (authState === 'locked_out' && lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authState, lockoutTime]);

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast('Preencha todos os campos obrigatórios.');
      return;
    }
    
    setLoading(true);
    triggerToast('Validando credenciais de acesso...');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Initialize CSRF-protected session
      await fetchWithTimeout(`${API_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const csrfToken = getCsrfToken();
      const res = await fetchWithTimeout(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        triggerToast(data.error?.message || 'Email ou senha inválidos.');
        setLoading(false);
        return;
      }

      // Store tokens in sessionStorage for Bearer auth
      const accessToken = data.access_token || data.data?.access_token || data.token || data.data?.token;
      const refreshToken = data.refresh_token || data.data?.refresh_token;
      const expiresAt = data.expires_at || data.data?.expires_at;
      if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken, expiresAt);
      }

      // Se precisa configurar 2FA, vai para setup
      if (data.data?.needs_2fa_setup) {
        triggerToast('Configure a autenticação de dois fatores para continuar.');
        setTimeout(() => {
          window.location.href = '/2fa/setup';
        }, 500);
        return;
      }

      // Se tem 2FA configurado, vai para verificação
      if (data.data?.user?.two_factor_enabled) {
        triggerToast('Credenciais corretas! Prossiga com o 2FA.');
        setAuthState('two_factor');
      } else {
        triggerToast('Login realizado com sucesso!');
        setTimeout(() => {
          window.location.href = '/dashboard/onboarding';
        }, 500);
      }
    } catch (err) {
      triggerToast('Erro de conexão com o servidor. Verifique se a API está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // 2FA Code Handling
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newCode = [...code];
      pasted.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      // Focus last pasted or next input
      const nextIndex = Math.min(index + pasted.length, 5);
      codeInputs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handle2faVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      triggerToast('Por favor, insira o código completo de 6 dígitos.');
      return;
    }

    setLoading(true);
    triggerToast('Validando código OTP...');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const csrfToken = getCsrfToken();
      const token = getAccessToken();
      const res = await fetchWithTimeout(`${API_URL}/api/v2/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok || data.message) {
        triggerToast(data.message || 'Código inválido ou expirado.');
        setLoading(false);
        return;
      }

      triggerToast('Autenticado! Redirecionando...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err) {
      triggerToast('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      triggerToast('Informe seu e-mail.');
      return;
    }

    setLoading(true);
    triggerToast('Processando solicitação de recuperação...');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const csrfToken = getCsrfToken();
      const res = await fetchWithTimeout(`${API_URL}/api/v1/auth/password/forgot`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify({ email: recoveryEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        triggerToast('Erro ao processar solicitação. Tente novamente.');
        setLoading(false);
        return;
      }

      setRecoverySent(true);
      triggerToast('Se este e-mail estiver cadastrado, enviaremos as instruções.');
    } catch (err) {
      triggerToast('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FAF8FF] via-[#F4EFFF] to-[#FCFAFF] flex items-center justify-center p-4 xl:p-10 select-none overflow-x-hidden font-sans">
      
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-55 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-2.5 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <span className="w-2 h-2 bg-brand rounded-full shrink-0 animate-ping" />
          <span className="text-[11px] font-black text-left">{toastMessage}</span>
        </div>
      )}

      {/* Grid container */}
      <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 items-center">
        
        {/* Lado Esquerdo: Branding & Confiança */}
        <div className="hidden lg:flex flex-col text-left space-y-7 animate-in fade-in slide-in-from-left-6 duration-700">
          
          {/* Logo Basileia */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand via-violet-650 to-brand-dark flex items-center justify-center text-white font-extrabold shadow-lg shadow-brand/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[25px] font-black tracking-tight text-[#1E1538]">Basileia</span>
          </div>

          {/* Frase institucional */}
          <div className="space-y-4">
            <h2 className="text-[28px] xl:text-[34px] font-black tracking-tight text-[#1E1538] leading-tight">
              Plataforma inteligente para<br />gestão, pagamentos e automação.
            </h2>
          </div>

          {/* Pilares de segurança */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
            {[
              { icon: Shield, title: 'Ambiente protegido', desc: 'Seus dados sempre seguros' },
              { icon: Lock, title: 'Infraestrutura segura', desc: 'Padrões globais de segurança' },
              { icon: FileText, title: 'Acesso auditável', desc: 'Logs, trilhas e conformidade' }
            ].map((pilar) => {
              const IconComp = pilar.icon;
              return (
                <div key={pilar.title} className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-violet-100/75 text-brand flex items-center justify-center border border-violet-200/20 shadow-sm">
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 tracking-tight">{pilar.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-normal">{pilar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* High Fidelity Beautiful Corporate Visual Centerpiece representing Basileia Checkout */}
          <div className="relative w-full h-[220px] rounded-[24px] overflow-hidden border border-brand/5 shadow-sm bg-white/40 backdrop-blur-md flex items-center justify-center">
            
            {/* Glowing neon purple circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-10 w-20 h-20 bg-fuchsia-500/5 rounded-full blur-2xl" />

            {/* Isometric Checkout visual artwork */}
            <svg className="w-[340px] h-[190px] z-10 overflow-visible" viewBox="0 0 340 190" fill="none" xmlns="http://www.w3.org/2000/svg">
              <style>{`
                @keyframes floatCheckout {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-4px); }
                  100% { transform: translateY(0px); }
                }
                @keyframes floatCreditCard {
                  0% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-8px) rotate(1.5deg); }
                  100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes floatPixQR {
                  0% { transform: translateY(0px) scale(1); }
                  50% { transform: translateY(-5px) scale(1.03); }
                  100% { transform: translateY(0px) scale(1); }
                }
                @keyframes pulseGlow {
                  0% { opacity: 0.8; }
                  50% { opacity: 1; }
                  100% { opacity: 0.8; }
                }
                .anim-checkout {
                  animation: floatCheckout 5s ease-in-out infinite;
                  transform-origin: center;
                }
                .anim-card-glow {
                  animation: floatCreditCard 4s ease-in-out infinite;
                  transform-origin: center;
                }
                .anim-pix-qr {
                  animation: floatPixQR 4.5s ease-in-out infinite;
                  transform-origin: center;
                }
                .glow-secure {
                  animation: pulseGlow 2s ease-in-out infinite;
                }
              `}</style>

              {/* 1. THE MAIN CHECKOUT WINDOW (Simulating a Premium Payment Form) */}
              <g className="anim-checkout">
                {/* Outer shadow card */}
                <rect x="15" y="15" width="200" height="155" rx="14" fill="#FFFFFF" stroke="#E8DDFD" strokeWidth="1.5" filter="drop-shadow(0 10px 20px rgba(139, 92, 246, 0.05))" />
                
                {/* Top browser/window header with exit/minimize buttons */}
                <path d="M15 29 C15 20.7 21.7 15 30 15 L200 15 C208.3 15 215 20.7 215 29 L215 35 L15 35 Z" fill="#F8FAFC" stroke="#E8DDFD" strokeWidth="1" />
                <circle cx="27" cy="25" r="3" fill="#EF4444" />
                <circle cx="37" cy="25" r="3" fill="#FBBF24" />
                <circle cx="47" cy="25" r="3" fill="#10B981" />
                <text x="60" y="28" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="sans-serif">checkout.basileia.pay</text>
                
                {/* Form header & summary */}
                <text x="30" y="52" fill="#1E1538" fontSize="10" fontWeight="900" fontFamily="sans-serif">Resumo do Pedido</text>
                <text x="145" y="52" fill="#8B5CF6" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="end">R$ 149,90</text>
                
                {/* Tab selectors for payment methods */}
                <rect x="30" y="60" width="75" height="18" rx="4" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1" />
                <text x="67" y="72" fill="#8B5CF6" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">💳 Cartão</text>
                
                <rect x="110" y="60" width="75" height="18" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                <text x="147" y="72" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">⚡ Pix</text>

                {/* Card input field placeholder (Realistic Credit Card Input Form) */}
                <rect x="30" y="85" width="155" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <text x="38" y="97" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">4000 1234 5678 9010</text>
                {/* Mini card indicator */}
                <rect x="168" y="89" width="12" height="10" rx="1.5" fill="#1E293B" />
                <circle cx="172" cy="94" r="2.5" fill="#EF4444" />
                <circle cx="176" cy="94" r="2.5" fill="#F59E0B" opacity="0.8" />

                {/* Expiry and CVV fields */}
                <rect x="30" y="108" width="75" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <text x="38" y="120" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">12 / 29</text>

                <rect x="110" y="108" width="75" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <text x="118" y="120" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">•••</text>

                {/* Big Green/Violet Secure CTA Button */}
                <rect x="30" y="132" width="155" height="22" rx="6" fill="#8B5CF6" />
                <text x="107" y="146" fill="#FFFFFF" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">PAGAR AGORA</text>
                
                {/* PCI Compliance indicator */}
                <text x="30" y="162" fill="#94A3B8" fontSize="7" fontWeight="bold" fontFamily="sans-serif">🔒 SSL Secured • PCI-DSS Compliant</text>
              </g>

              {/* 2. THE FLOATING PREMIUM CREDIT CARD */}
              <g className="anim-card-glow" transform="translate(170, 30)">
                {/* Shiny Card backing */}
                <rect x="0" y="0" width="145" height="90" rx="10" fill="url(#premium-card-gradient)" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 8px 16px rgba(109, 40, 217, 0.15))" />
                
                {/* Gold security chip */}
                <rect x="12" y="14" width="18" height="14" rx="3" fill="url(#chip-gradient)" stroke="#F59E0B" strokeWidth="0.5" />
                <line x1="12" y1="21" x2="30" y2="21" stroke="#F59E0B" strokeWidth="0.5" />
                <line x1="21" y1="14" x2="21" y2="28" stroke="#F59E0B" strokeWidth="0.5" />

                {/* Cardholder name and mockup numbers */}
                <text x="12" y="48" fill="#F3E8FF" fontSize="9" fontFamily="monospace" letterSpacing="1">•••• •••• •••• 4242</text>
                <text x="12" y="66" fill="#D8B4FE" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">PRO MEMBER</text>
                <text x="12" y="74" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">VINICIUS REINEHR</text>

                {/* Holographic brand emblem */}
                <g className="glow-secure">
                  <circle cx="120" cy="70" r="8" fill="#EF4444" opacity="0.9" />
                  <circle cx="128" cy="70" r="8" fill="#F59E0B" opacity="0.75" />
                </g>
              </g>

              {/* 3. FLOATING PIX QR CODE BADGE (Glassmorphic) */}
              <g className="anim-pix-qr" transform="translate(240, 115)">
                {/* Transparent glassmorphic background */}
                <rect x="0" y="0" width="80" height="65" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.03))" />
                
                {/* Pix Header indicator */}
                <rect x="0" y="0" width="80" height="15" rx="12" fill="#E0F2FE" />
                <rect x="0" y="8" width="80" height="7" fill="#E0F2FE" />
                <text x="40" y="11" fill="#0369A1" fontSize="7" fontWeight="black" fontFamily="sans-serif" textAnchor="middle">⚡ PIX CONFIRMADO</text>

                {/* Detailed Mockup QR Code matrix grid */}
                <g transform="translate(10, 22)" fill="#1E293B">
                  {/* Top-left corner finder */}
                  <rect x="0" y="0" width="10" height="10" fill="#0284C7" />
                  <rect x="2" y="2" width="6" height="6" fill="#FFFFFF" />
                  <rect x="3" y="3" width="4" height="4" fill="#0284C7" />

                  {/* Top-right corner finder */}
                  <rect x="50" y="0" width="10" height="10" fill="#0284C7" />
                  <rect x="52" y="2" width="6" height="6" fill="#FFFFFF" />
                  <rect x="53" y="3" width="4" height="4" fill="#0284C7" />

                  {/* Bottom-left corner finder */}
                  <rect x="0" y="26" width="10" height="10" fill="#0284C7" />
                  <rect x="2" y="28" width="6" height="6" fill="#FFFFFF" />
                  <rect x="3" y="29" width="4" height="4" fill="#0284C7" />

                  {/* Random pixels to look like a real QR code */}
                  <rect x="15" y="0" width="3" height="3" />
                  <rect x="22" y="3" width="4" height="3" />
                  <rect x="30" y="1" width="3" height="4" />
                  <rect x="38" y="0" width="5" height="3" />
                  
                  <rect x="15" y="12" width="6" height="3" />
                  <rect x="25" y="15" width="3" height="5" />
                  <rect x="35" y="10" width="12" height="3" />
                  
                  <rect x="15" y="26" width="5" height="3" />
                  <rect x="25" y="30" width="10" height="3" />
                  <rect x="42" y="26" width="6" height="8" fill="#10B981" />
                  
                  {/* Success check inside QR card */}
                  <path d="M44 30 L46 32 L49 28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </g>

              {/* DEF GRADIENTS */}
              <defs>
                <linearGradient id="premium-card-gradient" x1="0" y1="0" x2="145" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="0.5" stopColor="#6D28D9" />
                  <stop offset="1" stopColor="#4C1D95" />
                </linearGradient>
                <linearGradient id="chip-gradient" x1="12" y1="14" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FCD34D" />
                  <stop offset="1" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

        </div>

        {/* Lado Direito: Auth Container Card */}
        <div className="flex flex-col space-y-4 items-center justify-center animate-in fade-in slide-in-from-right-6 duration-700">
          
          <div className="bg-white border border-[#E8DDFD]/90 rounded-[28px] p-6.5 xl:p-9.5 shadow-2xl shadow-purple-950/5 w-full max-w-[480px] text-left space-y-6 relative overflow-hidden">
            
            {/* Step indicator (Only visible for active forms credentials & 2fa) */}
            {(authState === 'credentials' || authState === 'two_factor') && (
              <div className="flex items-center justify-center gap-3 w-full shrink-0 select-none pb-2 border-b border-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                    authState === 'credentials' ? "bg-brand text-white shadow-md shadow-brand/15" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {authState === 'credentials' ? '1' : <Check className="w-3 h-3" />}
                  </span>
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-wider",
                    authState === 'credentials' ? "text-brand" : "text-slate-400"
                  )}>Credenciais</span>
                </div>
                <span className="w-10 h-[1.5px] bg-[#E8DDFD] shrink-0" />
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                    authState === 'two_factor' ? "bg-brand text-white shadow-md shadow-brand/15" : "bg-slate-50 border border-slate-200 text-slate-400"
                  )}>2</span>
                  <span className={cn(
                    "text-[11px] font-black uppercase tracking-wider",
                    authState === 'two_factor' ? "text-brand" : "text-slate-400"
                  )}>Verificação</span>
                </div>
              </div>
            )}

            {/* FLOW STATE 1: CREDENTIALS */}
            {authState === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-[22px] font-black tracking-tight text-[#1E1538]">Entrar na Basileia</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1">Acesse sua central com segurança</p>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                    <div className="relative w-full">
                      <input 
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-[#E8DDFD] rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand placeholder:text-slate-350 shadow-sm"
                      />
                      <User className="w-4 h-4 text-slate-350 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Senha</label>
                    <div className="relative w-full">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 bg-slate-50 border border-[#E8DDFD] rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand placeholder:text-slate-350 shadow-sm"
                      />
                      <Lock className="w-4 h-4 text-slate-350 absolute left-3.5 top-3.5" />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Alternar exibição de senha"
                        className="absolute right-3 top-3.5 text-slate-350 hover:text-slate-655"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember & Forgot row */}
                <div className="flex items-center justify-between text-xs pt-1 select-none">
                  <label className="flex items-center gap-2 font-semibold text-slate-550 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer"
                    />
                    Lembrar de mim
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthState('recovery');
                      triggerToast('Aba de recuperação de acesso aberta.');
                    }}
                    className="text-brand font-black hover:underline tracking-tight"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Entrando...' : 'Continuar'}
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="text-center text-xs text-slate-400 font-semibold mt-2">
                  Não tem uma conta?{' '}
                  <Link href="/register" className="text-brand font-black hover:underline">
                    Criar conta
                  </Link>
                </div>
              </form>
            )}

            {/* FLOW STATE 2: TWO FACTOR AUTH (2FA) */}
            {authState === 'two_factor' && (
              <form onSubmit={handle2faVerifySubmit} className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-[22px] font-black tracking-tight text-[#1E1538]">Verificação em 2 fatores</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1">
                    Insira o código de 6 dígitos gerado pelo seu app autenticador.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* 6 Digit Input boxes */}
                  <div className="flex justify-between gap-2 pt-2">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { codeInputs.current[i] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                        className="w-11 h-13 bg-slate-50 border-2 border-[#E8DDFD] rounded-xl text-center text-lg font-black text-[#1E1538] focus:outline-none focus:border-brand transition-all shadow-sm focus:bg-white"
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 text-left block leading-relaxed">
                    Dica: Copie o código gerado no Autenticador e cole direto no primeiro campo para auto-preenchimento.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || code.join('').length < 6}
                  className="w-full h-12 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? 'Verificando...' : 'Verificar e Acessar'}
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="flex flex-col gap-3 pt-2 text-center text-xs select-none">
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast('Digite "000000" para simular o código de recuperação.');
                      setCode(['0', '0', '0', '0', '0', '0']);
                    }}
                    className="text-brand font-black hover:underline"
                  >
                    Usar código de recuperação
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthState('credentials');
                      triggerToast('Voltando para o primeiro passo.');
                    }}
                    className="text-slate-450 hover:text-slate-700 font-bold flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                  </button>
                </div>
              </form>
            )}

            {/* FLOW STATE 3: PASSWORD RECOVERY (FORGOT) */}
            {authState === 'recovery' && (
              <form onSubmit={handleRecoverySubmit} className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-[22px] font-black tracking-tight text-[#1E1538]">Recuperar Acesso</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1">
                    Insira seu e-mail para receber as instruções de redefinição.
                  </p>
                </div>

                {!recoverySent ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail corporativo</label>
                      <div className="relative w-full">
                        <input 
                          type="email"
                          required
                          placeholder="seu@email.com"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value.toLowerCase())}
                          className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-[#E8DDFD] rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand placeholder:text-slate-350 shadow-sm"
                        />
                        <User className="w-4 h-4 text-slate-350 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all flex items-center justify-center"
                    >
                      {loading ? 'Enviando...' : 'Enviar Instruções'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#FAF8FF] border border-[#E8DDFD]/65 rounded-2xl p-4.5 text-left space-y-3.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider leading-none">Solicitação Enviada</h4>
                      <p className="text-[10px] font-bold text-slate-400 leading-relaxed mt-1">
                        Se este e-mail estiver cadastrado, enviaremos as instruções de recuperação.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthState('credentials');
                      setRecoverySent(false);
                    }}
                    className="text-slate-450 hover:text-slate-700 font-bold flex items-center justify-center gap-1 mx-auto text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                  </button>
                </div>
              </form>
            )}

            {/* FLOW STATE 4: LOCKED OUT */}
            {authState === 'locked_out' && (
              <div className="space-y-5 animate-in fade-in duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 shrink-0" />
                </div>

                <div>
                  <h3 className="text-[20px] font-black tracking-tight text-[#1E1538]">Acesso bloqueado por segurança</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1.5 leading-relaxed">
                    Por segurança, seu acesso foi bloqueado temporariamente devido a sucessivas tentativas falhas. Tente novamente em alguns minutos ou fale com o suporte.
                  </p>
                </div>

                {/* Countdown Alert block */}
                <div className="bg-[#FFF5F5] border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                  <div className="leading-tight">
                    <span className="font-extrabold text-rose-950 text-xs block">Tempo restante para desbloqueio</span>
                    <span className="text-[14px] font-mono font-black text-rose-600 block mt-1">
                      {formatLockoutTime(lockoutTime)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => triggerToast("Redirecionando para o canal seguro de suporte corporativo...")}
                    className="w-full h-11 bg-white hover:bg-slate-50 text-[#1E1538] border border-[#E8DDFD] rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                  >
                    Falar com suporte
                  </button>

                  <button
                    onClick={() => {
                      setAuthState('credentials');
                      setLockoutTime(899);
                      triggerToast('Voltando para credenciais de acesso.');
                    }}
                    className="w-full h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                  </button>
                </div>
              </div>
            )}

            {/* FLOW STATE 5: SESSION EXPIRED */}
            {authState === 'session_expired' && (
              <div className="space-y-5 animate-in fade-in duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-brand border border-violet-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 shrink-0" />
                </div>

                <div>
                  <h3 className="text-[20px] font-black tracking-tight text-[#1E1538]">Sessão expirada</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1.5 leading-relaxed">
                    Sua sessão expirou por segurança. Faça login novamente para continuar.
                  </p>
                </div>

                <div className="bg-[#FAF8FF] border border-[#E8DDFD]/65 rounded-xl p-3.5 text-left text-[10px] font-bold text-slate-400 leading-normal flex items-start gap-2">
                  <Shield className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span>Nenhum dado foi perdido. Suas alterações locais e rascunhos foram salvos localmente e serão revalidados após o login.</span>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      setAuthState('credentials');
                      triggerToast('Acesso revalidado! Digite suas credenciais.');
                    }}
                    className="w-full h-11.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all flex items-center justify-center gap-1.5"
                  >
                    Entrar novamente
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={() => {
                      setAuthState('credentials');
                      triggerToast('Voltando para credenciais de acesso.');
                    }}
                    className="w-full h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                  </button>
                </div>
              </div>
            )}

            {/* FLOW STATE 6: RESTRICTED ACCESS */}
            {authState === 'restricted' && (
              <div className="space-y-5 animate-in fade-in duration-300 text-left">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <Globe className="w-6 h-6 shrink-0" />
                </div>

                <div>
                  <h3 className="text-[20px] font-black tracking-tight text-[#1E1538]">Acesso restrito</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1.5 leading-relaxed">
                    Este IP ou dispositivo não está autorizado a acessar a plataforma sob as políticas de segurança da sua organização.
                  </p>
                </div>

                {/* Connection params box */}
                <div className="bg-[#FAF8FF] border border-[#E8DDFD]/65 rounded-xl p-4.5 text-left space-y-2.5">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none pb-1">Parâmetros detectados</div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <span className="text-[9px] text-slate-400 block leading-tight">IP de origem</span>
                      <span className="text-slate-800 text-[10.5px] block font-mono">198.51.100.42</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 block leading-tight">Localização</span>
                      <span className="text-slate-800 text-[10.5px] block">São Paulo, BR</span>
                    </div>

                    <div className="col-span-2 border-t border-slate-100 pt-2">
                      <span className="text-[9px] text-slate-400 block leading-tight">Dispositivo de acesso</span>
                      <span className="text-slate-800 text-[10.5px] block">macOS Chrome (v124)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => {
                      triggerToast('Solicitação de liberação de IP enviada ao time de segurança corporativo!');
                    }}
                    className="w-full h-11.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-brand/15 transition-all flex items-center justify-center gap-1.5"
                  >
                    Solicitar liberação de IP
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <button
                    onClick={() => {
                      setAuthState('credentials');
                      triggerToast('Voltando para credenciais de acesso.');
                    }}
                    className="w-full h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                  </button>
                </div>
              </div>
            )}

            {/* Shield emblem dividers */}
            <div className="relative w-full h-[1px] bg-slate-50/50 flex items-center justify-center py-2">
              <span className="w-full h-[1px] bg-[#E8DDFD]/65 absolute top-1/2 -translate-y-1/2" />
              <div className="w-7 h-7 bg-white rounded-full border border-[#E8DDFD] shadow-sm flex items-center justify-center z-10 shrink-0">
                <Shield className="w-3.5 h-3.5 text-brand" />
              </div>
            </div>

            {/* Register section footer */}
            <div className="text-center text-xs font-semibold text-slate-500 pb-1">
              Não possui uma conta?{' '}
              <Link 
                href="/register"
                className="text-brand font-black hover:underline"
              >
                Cadastre-se grátis
              </Link>
            </div>

            {/* Support section footer */}
            <div className="text-center text-xs font-semibold text-slate-400 pb-1">
              Precisando de ajuda?{' '}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("Abrindo canal de suporte de segurança Basileia...");
                }}
                className="text-brand font-black hover:underline"
              >
                Fale com nosso suporte
              </a>
            </div>

          </div>

          {/* Footer absolute text */}
          <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 pt-1 justify-center">
            <Shield className="w-3.5 h-3.5 text-brand" />
            <span>Basileia Tecnologia Ltda. • Todos os direitos reservados</span>
          </div>

        </div>

      </div>

    </div>
  );
}
