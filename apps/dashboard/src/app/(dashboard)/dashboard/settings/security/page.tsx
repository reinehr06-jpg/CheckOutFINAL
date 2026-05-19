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
