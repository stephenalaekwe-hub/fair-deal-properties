// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - FRONTEND API CLIENT
// ══════════════════════════════════════════════════════════════════════════════

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    let cleanEndpoint = endpoint;
    if (API_BASE_URL.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
      cleanEndpoint = cleanEndpoint.replace(/^\/api/, '');
    }
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${cleanEndpoint}`;
    
    // Check if token exists in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('fdp_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`Fetch API error (${endpoint}):`, err);
    return { ok: false, error: 'Network request failed. Is the backend server running?' };
  }
}
