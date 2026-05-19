'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { SecurityHeader } from '@/components/security/SecurityHeader';
import { SecurityKpiCards } from '@/components/security/SecurityKpiCards';
import { SecurityTabs, SecurityTabValue } from '@/components/security/SecurityTabs';
import { SecurityUsersTable } from '@/components/security/SecurityUsersTable';
import { SecurityRolesGrid } from '@/components/security/SecurityRolesGrid';
import { SecuritySessionsTable } from '@/components/security/SecuritySessionsTable';
import { SecurityTwoFactorPanel } from '@/components/security/SecurityTwoFactorPanel';
import { SecurityPasswordPolicyPanel } from '@/components/security/SecurityPasswordPolicyPanel';
import { SecurityIpAllowlistTable } from '@/components/security/SecurityIpAllowlistTable';
import { SecurityActivityFeed } from '@/components/security/SecurityActivityFeed';
import { SecurityAlertsPanel } from '@/components/security/SecurityAlertsPanel';

import { 
  MOCK_SECURITY_USERS, 
  MOCK_SECURITY_SESSIONS, 
  MOCK_SECURITY_IP_RULES, 
  MOCK_SECURITY_ACTIVITY_EVENTS, 
  MOCK_SECURITY_POLICY 
} from '../../security/__mocks__/security';

import { SecurityUser, SecuritySession, SecurityIpRule, SecurityActivityEvent, SecurityPolicy, SecurityRole } from '@/types/security';

export default function SecuritySettingsPage() {
  const [activeTab, setActiveTab] = useState<SecurityTabValue>('users');
  
  // Data States
  const [users, setUsers] = useState<SecurityUser[]>(MOCK_SECURITY_USERS);
  const [sessions, setSessions] = useState<SecuritySession[]>(MOCK_SECURITY_SESSIONS);
  const [ipRules, setIpRules] = useState<SecurityIpRule[]>(MOCK_SECURITY_IP_RULES);
  const [events, setEvents] = useState<SecurityActivityEvent[]>(MOCK_SECURITY_ACTIVITY_EVENTS);
  const [policy, setPolicy] = useState<SecurityPolicy>(MOCK_SECURITY_POLICY);

  // Toast Notifications
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Simulated access roles
  const [userRole, setUserRole] = useState<'Owner' | 'Auditor'>('Owner');
  const isAdmin = userRole === 'Owner';

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // User Administration Handlers
  const handleInviteUser = (newUser: Partial<SecurityUser>) => {
    const freshUser: SecurityUser = {
      id: `user_${Math.floor(Math.random() * 1000)}`,
      name: newUser.name || 'Convidado Novo',
      email: newUser.email || 'convidado@basileia.com',
      avatar: newUser.name?.substring(0, 2).toUpperCase() || 'CV',
      role: newUser.role || 'Desenvolvedor',
      status: 'invited',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString()
    };

    setUsers([...users, freshUser]);

    // Create technical audit event in logs
    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "Usuário convidado",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "success",
      details: `Novo convite gerado para cargo ${freshUser.role}: ${freshUser.email}`
    };
    setEvents([newEvt, ...events]);
  };

  const handleUpdateUserRole = (id: string, newRole: SecurityRole) => {
    setUsers(users.map((u) => u.id === id ? { ...u, role: newRole } : u));
    
    const targetUser = users.find(u => u.id === id);
    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "Cargo atualizado",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "success",
      details: `Cargo de ${targetUser?.name || 'usuário'} alterado para ${newRole}`
    };
    setEvents([newEvt, ...events]);
  };

  const handleSuspendUser = (id: string) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: 'suspended' } : u));
    // Suspend terminates all user active sessions
    setSessions(sessions.filter((s) => s.userId !== id));

    const targetUser = users.find(u => u.id === id);
    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "Usuário suspenso",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "warning",
      details: `Acesso suspenso e sessões ativas encerradas para ${targetUser?.name || 'usuário'}`
    };
    setEvents([newEvt, ...events]);
  };

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    setSessions(sessions.filter((s) => s.userId !== id));

    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "Usuário excluído",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "error",
      details: `Integrante da conta removido permanentemente.`
    };
    setEvents([newEvt, ...events]);
  };

  // Sessions management
  const handleRevokeSession = (id: string) => {
    setSessions(sessions.map((s) => s.id === id ? { ...s, status: 'revoked' as const } : s));
    
    const targetSession = sessions.find(s => s.id === id);
    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "Sessão revogada",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "warning",
      details: `Encerrado acesso de dispositivo ${targetSession?.device || 'desconhecido'} para ${targetSession?.userName}`
    };
    setEvents([newEvt, ...events]);
  };

  const handleRevokeAllSessions = () => {
    // Keep only Carlos (Owner) active session
    setSessions(sessions.filter((s) => s.userId === 'user_01'));

    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "Logout geral forçado",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "error",
      details: "Disparado logout de emergência para todas as sessões da organização."
    };
    setEvents([newEvt, ...events]);
  };

  // IP Allowlist handlers
  const handleAddIpRule = (newRule: Partial<SecurityIpRule>) => {
    const freshRule: SecurityIpRule = {
      id: `rule_${Math.floor(Math.random() * 1000)}`,
      cidr: newRule.cidr || '0.0.0.0/0',
      description: newRule.description || 'Regra de IP',
      environment: newRule.environment || 'both',
      createdBy: newRule.createdBy || 'Carlos Oliveira',
      createdAt: new Date().toISOString()
    };

    setIpRules([...ipRules, freshRule]);

    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "IP adicionado à allowlist",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "success",
      details: `Rede autorizada CIDR cadastrada: ${freshRule.cidr}`
    };
    setEvents([newEvt, ...events]);
  };

  const handleRemoveIpRule = (id: string) => {
    const targetRule = ipRules.find(r => r.id === id);
    setIpRules(ipRules.filter((r) => r.id !== id));

    const newEvt: SecurityActivityEvent = {
      id: `evt_sec_${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      event: "IP removido da allowlist",
      userName: "Carlos Oliveira (Owner)",
      ip: "186.204.12.98",
      result: "warning",
      details: `Removido privilégio de rede CIDR: ${targetRule?.cidr}`
    };
    setEvents([newEvt, ...events]);
  };

  return (
    <PageLayout title="Segurança">
      
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="fixed bottom-5 right-5 z-60 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-2 max-w-sm animate-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 bg-violet-500 rounded-full shrink-0 animate-ping" />
          <span className="text-[11px] font-black text-left">{feedbackMsg}</span>
        </div>
      )}

      {/* Breadcrumbs back to Settings */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-455 pb-1">
        <Link href="/dashboard/settings" className="hover:text-brand flex items-center gap-0.5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Configurações
        </Link>
        <span className="text-slate-350">/</span>
        <span className="text-slate-700 font-bold">Segurança & Governança</span>
      </div>

      {/* Header */}
      <SecurityHeader 
        onOpenPolicy={() => triggerFeedback("Direcionando para as boas práticas e políticas técnicas da empresa...")}
        onOpen2FA={() => setActiveTab('2fa')}
        onInviteUser={() => {
          setActiveTab('users');
          triggerFeedback("Abra a aba Usuários e clique em 'Convidar' para adicionar integrantes.");
        }}
        isAdmin={isAdmin}
      />

      {/* KPI Cards Grid with massive top score */}
      <SecurityKpiCards 
        activeUsers={users.filter(u => u.status !== 'suspended').length}
        activeSessions={sessions.filter(s => s.status === 'active').length}
        twoFactorCount={users.filter(u => u.twoFactorEnabled).length}
        allowlistCount={ipRules.length}
        criticalEvents={events.length * 14} // simulated load
        onFilterTab={setActiveTab}
      />

      {/* Navigation tabs bar */}
      <div className="border-b border-[#E8DDFD]/60 flex items-center justify-between">
        <SecurityTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          usersCount={users.length}
          sessionsCount={sessions.filter(s => s.status === 'active').length}
          allowlistCount={ipRules.length}
          criticalEventsCount={events.length}
        />
      </div>

      {/* Responsive layout containers */}
      <div className="w-full space-y-3.5">
        
        {/* Main Tab Content - Full Width */}
        <div className="w-full min-w-0">
          {activeTab === 'users' && (
            <SecurityUsersTable 
              users={users}
              onActionFeedback={triggerFeedback}
              isAdmin={isAdmin}
              onInviteUser={handleInviteUser}
              onUpdateUserRole={handleUpdateUserRole}
              onSuspendUser={handleSuspendUser}
              onRemoveUser={handleRemoveUser}
            />
          )}

          {activeTab === 'roles' && (
            <SecurityRolesGrid 
              onActionFeedback={triggerFeedback}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'sessions' && (
            <SecuritySessionsTable 
              sessions={sessions}
              onActionFeedback={triggerFeedback}
              isAdmin={isAdmin}
              onRevokeSession={handleRevokeSession}
              onRevokeAllSessions={handleRevokeAllSessions}
            />
          )}

          {activeTab === '2fa' && (
            <SecurityTwoFactorPanel 
              onActionFeedback={triggerFeedback}
              isAdmin={isAdmin}
              twoFactorCount={users.filter(u => u.twoFactorEnabled).length}
              totalUsers={users.filter(u => u.status === 'active').length}
            />
          )}

          {activeTab === 'password' && (
            <SecurityPasswordPolicyPanel 
              policy={policy}
              onActionFeedback={triggerFeedback}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'ips' && (
            <SecurityIpAllowlistTable 
              rules={ipRules}
              onActionFeedback={triggerFeedback}
              isAdmin={isAdmin}
              onAddRule={handleAddIpRule}
              onRemoveRule={handleRemoveIpRule}
            />
          )}

          {activeTab === 'activity' && (
            <SecurityActivityFeed 
              events={events}
              onActionFeedback={triggerFeedback}
              onNavigateToAudit={() => triggerFeedback("Direcionando para o módulo completo de Auditoria...")}
            />
          )}

          {activeTab === 'lgpd' && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              
              {/* LGPD Header and Switches */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Controles de Privacidade LGPD (Strict Mode)</h3>
                    <p className="text-[10.5px] font-semibold text-slate-400 mt-1">
                      Monitore a conformidade regulatória de dados de titulares. Criptografe e sanitize PII de payloads automaticamente.
                    </p>
                  </div>
                  
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-100/50 shrink-0">
                    Strict Mode Ativo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* 1. Mascaramento CPF */}
                  <div className="border border-[#E8DDFD]/60 rounded-2xl p-4 bg-slate-50/15 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Mascarar CPF do Comprador</span>
                      <input 
                        type="checkbox" 
                        defaultChecked
                        onChange={(e) => triggerFeedback(`Mascaramento de CPF ${e.target.checked ? 'ativado' : 'desativado'}`)}
                        className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer w-4.5 h-4.5"
                      />
                    </div>
                    <p className="text-[9.5px] font-semibold text-slate-400 leading-relaxed">Substitui dígitos centrais do CPF (`***.123.***-**`) em grids de vendas para operadores de Suporte.</p>
                  </div>

                  {/* 2. Criptografia Dinâmica */}
                  <div className="border border-[#E8DDFD]/60 rounded-2xl p-4 bg-slate-50/15 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Criptografia a Nível de Campo (PII)</span>
                      <input 
                        type="checkbox" 
                        defaultChecked
                        onChange={(e) => triggerFeedback(`Criptografia de PII ${e.target.checked ? 'ativada' : 'desativada'}`)}
                        className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer w-4.5 h-4.5"
                      />
                    </div>
                    <p className="text-[9.5px] font-semibold text-slate-400 leading-relaxed">Aplica hashing criptográfico (AES-256-GCM) nos campos sensíveis em repouso no banco de dados.</p>
                  </div>

                  {/* 3. Sanitização Logs */}
                  <div className="border border-[#E8DDFD]/60 rounded-2xl p-4 bg-slate-50/15 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Sanitizar Payloads nos Logs</span>
                      <input 
                        type="checkbox" 
                        defaultChecked
                        onChange={(e) => triggerFeedback(`Sanitização de logs ${e.target.checked ? 'ativada' : 'desativada'}`)}
                        className="rounded border-[#E8DDFD] text-brand focus:ring-brand cursor-pointer w-4.5 h-4.5"
                      />
                    </div>
                    <p className="text-[9.5px] font-semibold text-slate-400 leading-relaxed">Limpa chaves privadas, senhas e tokens de acesso de qualquer stacktrace ou log de erro.</p>
                  </div>
                </div>
              </div>

              {/* Data masking simulator preview */}
              <div className="bg-white border border-[#E8DDFD]/65 rounded-[22px] p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-50 pb-2.5">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Painel Simulador de Mascaramento PII</h4>
                  <span className="text-[8.5px] font-bold text-slate-400 block mt-1">Veja como as informações de titulares são exibidas nos logs conforme o papel RBAC do operador.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Vista Admin */}
                  <div className="border border-slate-100 rounded-xl p-4 bg-[#FAF8FF]/45 text-left space-y-2">
                    <span className="text-[9px] font-black text-brand uppercase tracking-wider block">Exibição para Carlos Oliveira (Owner/Admin)</span>
                    <div className="font-mono text-[10px] bg-white border border-[#E8DDFD]/60 rounded-lg p-3 space-y-1.5 leading-normal text-slate-700">
                      <div><span className="text-slate-400">Nome:</span> João da Silva Medeiros</div>
                      <div><span className="text-slate-400">E-mail:</span> joao.silva@gmail.com</div>
                      <div><span className="text-slate-400">CPF:</span> 098.241.872-91</div>
                      <div><span className="text-slate-400">Celular:</span> (11) 98765-4321</div>
                    </div>
                  </div>

                  {/* Vista Suporte */}
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 text-left space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Exibição para Operador de Suporte/Auditor</span>
                    <div className="font-mono text-[10px] bg-white border border-[#E8DDFD]/60 rounded-lg p-3 space-y-1.5 leading-normal text-slate-700">
                      <div><span className="text-slate-400">Nome:</span> João da S*** M***</div>
                      <div><span className="text-slate-400">E-mail:</span> j***.s***@gmail.com</div>
                      <div><span className="text-slate-400">CPF:</span> ***.241.***-**</div>
                      <div><span className="text-slate-400">Celular:</span> (11) 9****-**21</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>

        {/* Bottom Horizontal Tarja Banner */}
        <SecurityAlertsPanel 
          onActionFeedback={triggerFeedback}
          onForceLogoutAll={handleRevokeAllSessions}
          onNavigateToAudit={() => triggerFeedback("Redirecionando para as trilhas completas de Auditoria...")}
          is2faActive={true}
          isIpAllowlistActive={ipRules.length > 0}
        />

      </div>

    </PageLayout>
  );
}
