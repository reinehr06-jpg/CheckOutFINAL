export type AuditLevel = "critical" | "alteration" | "informative" | "access" | "deletion";
export type AuditResult = "success" | "failed" | "blocked";
export type AuditEntityType =
  | "Pagamento" 
  | "Reembolso" 
  | "Checkout" 
  | "Gateway"
  | "Sistema" 
  | "Usuário" 
  | "Webhook" 
  | "API Key"
  | "Assinatura" 
  | "Configuração" 
  | "Sessão" 
  | "Roteamento";

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  category: string;
  level: AuditLevel;
  details: string;
  user: {
    id?: string;
    name: string;
    role: string;
    avatar?: string | null;
  };
  system: string;
  environment: "production" | "sandbox";
  ip: string;
  ipLocation?: string;
  result: AuditResult;
  entityType: AuditEntityType;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  relatedIds?: {
    orderId?: string;
    paymentId?: string;
    customerId?: string;
    checkoutId?: string;
    gatewayId?: string;
  };
  reviewedAt?: string;
  reviewedBy?: string;
  incidentId?: string;
}

export interface AuditFilters {
  period: { from: string; to: string };
  userId?: string;
  systemId?: string;
  eventTypes?: string[];
  level?: AuditLevel;
  entityType?: AuditEntityType;
  entityId?: string;
  action?: string;
  ip?: string;
  result?: AuditResult;
}

export interface AuditSummary {
  totalEvents: number;
  activeUsers: number;
  impactedEntities: number;
  systemsInvolved: number;
  criticalActions: number;
  lastEventAt: string;
}
