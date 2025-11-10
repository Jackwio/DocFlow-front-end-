/**
 * LocalStorage utility for token persistence
 */

const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Save authentication token
 */
export function saveToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Get authentication token
 */
export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Remove authentication token
 */
export function removeToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
