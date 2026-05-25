const DEFAULT_TIMEOUT = 15_000;

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string } }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const method = (options.method || 'GET').toUpperCase();
  const requestId = crypto.randomUUID();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Request-ID': requestId,
    ...(options.headers as Record<string, string> || {}),
  };

  if (MUTATING_METHODS.has(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return fetchWithTimeout(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  }).then(async (res) => {
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return {
        success: false,
        error: json?.error || { code: 'request_failed', message: 'Não foi possível concluir a solicitação.' },
      };
    }

    return json || { success: true, data: null };
  }).catch((err) => {
    const isTimeout = err?.name === 'AbortError';
    return {
      success: false,
      error: {
        code: isTimeout ? 'timeout' : 'network_error',
        message: isTimeout ? 'O servidor demorou muito para responder.' : 'Erro de conexão com o servidor.',
      },
    };
  });
}
