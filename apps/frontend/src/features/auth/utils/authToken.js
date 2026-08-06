/**
 * Temporary token storage — Phase B.
 *
 * The backend currently returns the JWT in the login JSON body rather than
 * an httpOnly cookie, so the frontend has to hold onto it somewhere. This is
 * intentionally isolated in one small module instead of being read/written
 * from inside components, so the storage strategy can be swapped later
 * (httpOnly cookie, auth context, etc.) without touching page code.
 */

const TOKEN_KEY = 'footprint_auth_token';

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}