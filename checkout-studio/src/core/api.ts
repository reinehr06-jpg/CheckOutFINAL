// Basileia Checkout Studio - API Integration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('basileia_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export interface CheckoutScene {
  id?: string;
  name: string;
  system_id?: string;
  status: 'draft' | 'published' | 'archived';
  version?: number;
  config: Record<string, unknown>;
  trust_score?: number;
  conversion_rate?: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchCheckouts(): Promise<CheckoutScene[]> {
  const res = await fetch(`${API_BASE}/checkouts`, { headers: getAuthHeaders() });
  const data = await res.json();
  return data.success ? data.data : [];
}

export async function fetchCheckout(id: string): Promise<CheckoutScene | null> {
  const res = await fetch(`${API_BASE}/checkouts/${id}`, { headers: getAuthHeaders() });
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function saveCheckout(scene: CheckoutScene): Promise<CheckoutScene | null> {
  const method = scene.id ? 'PATCH' : 'POST';
  const url = scene.id ? `${API_BASE}/checkouts/${scene.id}` : `${API_BASE}/checkouts`;
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: scene.name, config: scene.config, system_id: scene.system_id }),
  });
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function publishCheckout(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/checkouts/${id}/publish`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return data.success === true;
}

export async function deleteCheckout(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/checkouts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.ok;
}
