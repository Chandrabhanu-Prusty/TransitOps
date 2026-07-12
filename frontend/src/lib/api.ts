const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

interface FetchOptions extends RequestInit {
  data?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = localStorage.getItem('transitops_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.data && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  // Handle both relative and absolute endpoints
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    // Global 401 handler
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new ApiError(401, 'Unauthorized');
  }
  
  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, responseData?.message || 'API Error', responseData);
  }
  
  return responseData as T;
}
