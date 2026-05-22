function removeClientCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
}

export function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string } }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('basileia_token') : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  }).then(async (res) => {
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('basileia_token');
          localStorage.removeItem('basileia_user');
          removeClientCookie('basileia_session');
          window.location.href = '/login';
        }
      }
      return {
        success: false,
        error: json?.error || { code: 'request_failed', message: 'Nao foi possivel concluir a solicitacao.' },
      };
    }

    return json || { success: true, data: null };
  }).catch(() => ({
    success: false,
    error: { code: 'network_error', message: 'Erro de conexao com o servidor.' },
  }));
}
