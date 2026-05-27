function getApiUrl(path: string) {
  let base = '';
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('basileia_api_url');
    if (saved) base = saved;
  }
  if (!base) {
    base = 'http://localhost:8000';
  }
  return `${base}/api/v1${path}`;
}

function getAuthHeaders(method: string = 'GET') {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const token = localStorage.getItem('basileia_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const csrfToken = localStorage.getItem('basileia_csrf_token');
  if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }
  return headers;
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
  const res = await fetch(getApiUrl('/checkouts'), {
    headers: getAuthHeaders('GET'),
    credentials: 'include',
  });
  const data = await res.json();
  return data.success ? data.data : [];
}

export async function fetchCheckout(id: string): Promise<CheckoutScene | null> {
  const res = await fetch(getApiUrl(`/checkouts/${id}`), {
    headers: getAuthHeaders('GET'),
    credentials: 'include',
  });
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function saveCheckout(scene: CheckoutScene): Promise<CheckoutScene | null> {
  const method = scene.id ? 'PATCH' : 'POST';
  const url = getApiUrl(scene.id ? `/checkouts/${scene.id}` : `/checkouts`);
  const res = await fetch(url, {
    method,
    headers: getAuthHeaders(method),
    credentials: 'include',
    body: JSON.stringify({ name: scene.name, config: scene.config, system_id: scene.system_id }),
  });
  const data = await res.json();
  return data.success ? data.data : null;
}

export async function publishCheckout(id: string): Promise<boolean> {
  const res = await fetch(getApiUrl(`/checkouts/${id}/publish`), {
    method: 'POST',
    headers: getAuthHeaders('POST'),
    credentials: 'include',
  });
  const data = await res.json();
  return data.success === true;
}

export async function deleteCheckout(id: string): Promise<boolean> {
  const res = await fetch(getApiUrl(`/checkouts/${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders('DELETE'),
    credentials: 'include',
  });
  return res.ok;
}
