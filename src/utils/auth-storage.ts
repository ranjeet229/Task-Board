const AUTH_KEY = 'task-board:auth';

function safeParse<T>(json: string | null, fallback: T): T {
  if (json == null || json === '') return fallback;
  try {
    const parsed = JSON.parse(json) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export type StoredAuth = { email: string; remembered: boolean };

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  const fromLocal = safeParse<StoredAuth | null>(localStorage.getItem(AUTH_KEY), null);
  const fromSession = safeParse<StoredAuth | null>(sessionStorage.getItem(AUTH_KEY), null);
  return fromLocal ?? fromSession;
}

export function setStoredAuth(email: string, remembered: boolean): void {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({ email, remembered });
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  if (remembered) {
    localStorage.setItem(AUTH_KEY, payload);
  } else {
    sessionStorage.setItem(AUTH_KEY, payload);
  }
}

export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getStoredAuth() != null;
}
