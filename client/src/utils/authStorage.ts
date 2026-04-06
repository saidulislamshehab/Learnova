const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const AUTH_PERSISTENCE_KEY = 'auth_persistence';
const SESSION_ACTIVE_KEY = 'auth_session_active';

type AuthUser = unknown;

/**
 * Stores auth data for either persistent or session-only login.
 * For session-only mode we mirror token/user in localStorage for app compatibility,
 * and guard it with a session marker that disappears when the browser session ends.
 */
export function persistAuthSession(token: string, user: AuthUser | null, rememberMe: boolean): void {
  if (rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (user !== null) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    localStorage.setItem(AUTH_PERSISTENCE_KEY, 'local');

    sessionStorage.removeItem(SESSION_ACTIVE_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    return;
  }

  // Session-only mode: keep marker in sessionStorage so token is invalid after restart.
  sessionStorage.setItem(SESSION_ACTIVE_KEY, '1');
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user !== null) {
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(AUTH_USER_KEY);
  }

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user !== null) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
  localStorage.setItem(AUTH_PERSISTENCE_KEY, 'session');
}

/**
 * Returns an auth token if valid, and clears stale session-only auth on browser restart.
 */
export function getAuthToken(): string | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }

  const persistence = localStorage.getItem(AUTH_PERSISTENCE_KEY);
  if (persistence === 'session' && !sessionStorage.getItem(SESSION_ACTIVE_KEY)) {
    clearAuthSession();
    return null;
  }

  return token;
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_PERSISTENCE_KEY);

  sessionStorage.removeItem(SESSION_ACTIVE_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
}
