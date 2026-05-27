import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export type WebhookEndpoint = {
  id: number;
  url: string;
  status: string;
  events: string[];
  connected_system?: { name: string };
};

export type WebhookDelivery = {
  id: number;
  event: string;
  url: string;
  status_code: number;
  success: boolean;
  created_at: string;
  response_body?: string;
  request_payload?: string;
};

const mockEndpoints: WebhookEndpoint[] = [
  {
    id: 1,
    url: 'https://api.lojaexemplo.com.br/v1/webhooks',
    status: 'active',
    events: ['payment.approved', 'payment.failed', 'subscription.created'],
    connected_system: { name: 'Sistema Principal' }
  },
  {
    id: 2,
    url: 'https://meuapp.com/webhooks/basileia',
    status: 'active',
    events: ['payment.approved', 'payment.refunded'],
    connected_system: { name: 'Checkout Secundário' }
  },
  {
    id: 3,
    url: 'https://integrador.notasfiscais.com/api',
    status: 'inactive',
    events: ['payment.approved'],
    connected_system: { name: 'Sistema de Notas' }
  }
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: 101,
    event: 'payment.approved',
    url: 'https://api.lojaexemplo.com.br/v1/webhooks',
    status_code: 200,
    success: true,
    created_at: '2026-05-19T10:13:00Z',
    request_payload: '{\n  "event": "payment.approved",\n  "data": {\n    "id": "pay_982349823",\n    "amount": 12900,\n    "status": "paid"\n  }\n}',
    response_body: '{"status": "ok", "received": true}'
  },
  {
    id: 102,
    event: 'payment.approved',
    url: 'https://meuapp.com/webhooks/basileia',
    status_code: 200,
    success: true,
    created_at: '2026-05-19T10:12:45Z',
    request_payload: '{\n  "event": "payment.approved",\n  "data": {\n    "id": "pay_982349823",\n    "amount": 12900,\n    "status": "paid"\n  }\n}',
    response_body: '{"message": "Webhook processed successfully"}'
  },
  {
    id: 103,
    event: 'payment.failed',
    url: 'https://api.lojaexemplo.com.br/v1/webhooks',
    status_code: 500,
    success: false,
    created_at: '2026-05-19T10:12:00Z',
    request_payload: '{\n  "event": "payment.failed",\n  "data": {\n    "id": "pay_982349822",\n    "amount": 4990,\n    "status": "failed",\n    "failure_reason": "insufficient_funds"\n  }\n}',
    response_body: 'Internal Server Error - connection timed out'
  },
  {
    id: 104,
    event: 'subscription.created',
    url: 'https://api.lojaexemplo.com.br/v1/webhooks',
    status_code: 201,
    success: true,
    created_at: '2026-05-19T10:10:00Z',
    request_payload: '{\n  "event": "subscription.created",\n  "data": {\n    "id": "sub_892347",\n    "plan": "PRO Anual",\n    "status": "active"\n  }\n}',
    response_body: '{"status":"created"}'
  }
];

export function useWebhooks() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [endpointsRes, deliveriesRes] = await Promise.all([
        apiClient<WebhookEndpoint[]>('/api/v1/dashboard/webhooks/endpoints'),
        apiClient<WebhookDelivery[]>('/api/v1/dashboard/webhooks/deliveries')
      ]);
      
      if (endpointsRes.success && deliveriesRes.success) {
        setEndpoints(endpointsRes.data || []);
        setDeliveries(deliveriesRes.data || []);
        setError(null);
      } else {
        setEndpoints([]);
        setDeliveries([]);
        const errMsg = !(endpointsRes.success)
          ? (endpointsRes as any).error?.message
          : (deliveriesRes as any).error?.message;
        setError(errMsg || 'Erro ao carregar dados de webhooks');
      }
    } catch (e) {
      setEndpoints([]);
      setDeliveries([]);
      setError('Erro de conexão ao carregar dados de webhooks');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { 
    endpoints, 
    deliveries, 
    loading, 
    error, 
    refetch: fetchData,
    setEndpoints,
    setDeliveries
  };
}
