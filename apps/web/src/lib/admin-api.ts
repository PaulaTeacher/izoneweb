'use client';

const TOKEN_KEY = 'izone_admin_token';
const REFRESH_KEY = 'izone_admin_refresh';
const USER_KEY = 'izone_admin_user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type AdminSessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
};

export function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser(): AdminSessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSessionUser;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function saveAdminSession(data: {
  accessToken: string;
  refreshToken: string;
  user: AdminSessionUser;
}) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

function formatApiError(err: unknown, fallback: string) {
  if (!err || typeof err !== 'object') return fallback;
  const message = (err as { message?: unknown }).message;
  if (Array.isArray(message)) return message.filter(Boolean).join('. ');
  if (typeof message === 'string' && message.trim()) return message;
  return fallback;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(formatApiError(err, 'Credenciales inválidas'));
  }
  const data = await res.json();
  saveAdminSession(data);
  return data;
}

export async function adminFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401) {
    clearAdminSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    throw new Error('Sesión expirada');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(formatApiError(err, `Error ${res.status}`));
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Invalida caché ISR de la tienda tras guardar en Admin (best-effort). */
export async function bustStorefrontCache() {
  try {
    const token = getAdminToken();
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ tag: 'catalog' }),
    });
  } catch {
    // No bloquea el guardado si la revalidación falla
  }
}
