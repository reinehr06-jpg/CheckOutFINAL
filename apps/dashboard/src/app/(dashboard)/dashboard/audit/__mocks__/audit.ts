import { AuditEvent, AuditSummary } from '@/types/audit';

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "evt_01JTK8X",
    timestamp: "2026-05-19T10:21:19Z",
    event: "Reembolso aprovado",
    category: "REEMBOLSO",
    level: "critical",
    details: "Reembolso REE-2024-09876 aprovado no valor de R$ 1.259,90 • Pedido: ORD-2024-09876 • Cliente: CLI-005782",
    user: { name: "Vinícius Admin", role: "Administrador", avatar: null },
    system: "Mercado Pago",
    environment: "production",
    ip: "177.12.34.56",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Reembolso",
    entityId: "REE-2024-09876",
    metadata: {
      amount: 1259.90,
      currency: "BRL",
      reason: "Solicitado pelo cliente",
      processed_by: "Vinícius Admin",
      channel: "dashboard",
      version: "1.0.0",
      risk_level: "low"
    }
  },
  {
    id: "evt_01JTK8Y",
    timestamp: "2026-05-19T10:20:47Z",
    event: "Checkout atualizado",
    category: "CHECKOUT",
    level: "alteration",
    details: 'Checkout "Checkout Premium v2" atualizado para v2.4.1 • Alterado por: Vinícius Admin',
    user: { name: "Vinícius Admin", role: "Administrador", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "177.12.34.56",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Checkout",
    entityId: "chk_premium_v2",
    metadata: {
      checkout_name: "Checkout Premium v2",
      previous_version: "2.4.0",
      new_version: "2.4.1",
      commit_hash: "8df3e21"
    }
  },
  {
    id: "evt_01JTK8Z",
    timestamp: "2026-05-19T10:20:12Z",
    event: "Login realizado",
    category: "ACESSO",
    level: "informative",
    details: "Usuário realizou login com sucesso • Autenticação: 2FA • Dispositivo: Chrome / macOS",
    user: { name: "Mariana Santos", role: "Operador", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "177.98.65.43",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Sessão",
    entityId: "usr_mariana",
    metadata: {
      auth_method: "2FA",
      device: "Chrome / macOS",
      session_duration_limit: "8h"
    }
  },
  {
    id: "evt_01JTK90",
    timestamp: "2026-05-19T10:19:58Z",
    event: "Chave de API criada",
    category: "INTEGRAÇÃO",
    level: "alteration",
    details: 'Nova chave de API criada • Nome: Integração ERP • Escopos: payments.read, refunds.write',
    user: { name: "Rafael Oliveira", role: "Dev", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "189.45.67.23",
    ipLocation: "Curitiba, BR",
    result: "success",
    entityType: "API Key",
    entityId: "key_erp_integration",
    metadata: {
      key_name: "Integração ERP",
      scopes: ["payments.read", "refunds.write"],
      expires_at: "2027-05-19T10:19:58Z"
    }
  },
  {
    id: "evt_01JTK91",
    timestamp: "2026-05-19T10:19:31Z",
    event: "Permissão alterada",
    category: "USUÁRIO",
    level: "alteration",
    details: "Permissão de usuário atualizada • Usuário: Mariana Santos • Perfil: Operador",
    user: { name: "Vinícius Admin", role: "Administrador", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "177.12.34.56",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Usuário",
    entityId: "usr_mariana",
    metadata: {
      target_user: "Mariana Santos",
      previous_role: "Suporte",
      new_role: "Operador"
    }
  },
  {
    id: "evt_01JTK92",
    timestamp: "2026-05-19T10:18:44Z",
    event: "Pagamento capturado",
    category: "PAGAMENTO",
    level: "informative",
    details: "Pagamento capturado com sucesso • Transação: pay_8f3a2d7e9b1c • Valor: R$ 359,90",
    user: { name: "Sistema", role: "Webhook", avatar: null },
    system: "Mercado Pago",
    environment: "production",
    ip: "34.210.12.44",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Pagamento",
    entityId: "pay_8f3a2d7e9b1c",
    metadata: {
      gateway: "Mercado Pago",
      amount: 359.90,
      currency: "BRL",
      payment_method: "pix"
    }
  },
  {
    id: "evt_01JTK93",
    timestamp: "2026-05-19T10:18:02Z",
    event: "Tentativa de acesso negada",
    category: "SEGURANÇA",
    level: "critical",
    details: "Tentativa de acesso negada por IP não autorizado • Motivo: IP bloqueado por política de segurança",
    user: { name: "Sistema", role: "Segurança", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "201.33.44.55",
    ipLocation: "Recife, BR",
    result: "blocked",
    entityType: "Sessão",
    entityId: null,
    metadata: {
      blocked_ip: "201.33.44.55",
      policy: "block_foreign_ips",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  },
  {
    id: "evt_01JTK94",
    timestamp: "2026-05-19T10:17:33Z",
    event: "Webhook entregue",
    category: "WEBHOOK",
    level: "informative",
    details: "Evento payment.succeeded entregue com sucesso • Endpoint: Mercado Pago - Produção • Status: 200 OK",
    user: { name: "Sistema", role: "Webhook", avatar: null },
    system: "Mercado Pago",
    environment: "production",
    ip: "54.210.33.21",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Webhook",
    entityId: "wh_dlv_01JTK8",
    metadata: {
      endpoint: "Mercado Pago - Produção",
      status_code: 200,
      payload_type: "payment.succeeded"
    }
  },
  {
    id: "evt_01JTK95",
    timestamp: "2026-05-19T10:17:12Z",
    event: "Assinatura cancelada",
    category: "ASSINATURA",
    level: "alteration",
    details: "Assinatura cancelada pelo usuário • Assinatura: ASS-2024-07345 • Motivo: Solicitado pelo cliente",
    user: { name: "Mariana Santos", role: "Operador", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "177.98.65.43",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Assinatura",
    entityId: "ASS-2024-07345",
    metadata: {
      subscription_id: "ASS-2024-07345",
      reason: "Solicitado pelo cliente",
      churn_type: "voluntary"
    }
  },
  {
    id: "evt_01JTK96",
    timestamp: "2026-05-19T10:16:48Z",
    event: "Configuração alterada",
    category: "CONFIGURAÇÃO",
    level: "alteration",
    details: "Configuração de antifraude atualizada • Regra: Bloqueio por IP • Ação: Rejeitar • Risco: Alto",
    user: { name: "Vinícius Admin", role: "Administrador", avatar: null },
    system: "Basileia Pay",
    environment: "production",
    ip: "177.12.34.56",
    ipLocation: "São Paulo, BR",
    result: "success",
    entityType: "Configuração",
    entityId: "cfg_antifraud_rules",
    metadata: {
      config_key: "antifraud_rules",
      previous_action: "review",
      new_action: "reject"
    }
  }
];

export const MOCK_SUMMARY: AuditSummary = {
  totalEvents: 24812,
  activeUsers: 32,
  impactedEntities: 158,
  systemsInvolved: 8,
  criticalActions: 71,
  lastEventAt: "2026-05-19T10:21:19Z"
};
