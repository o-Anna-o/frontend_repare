export function saveToken(token: string) {
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  localStorage.setItem('lt_token', clean);
}

export function getToken(): string | null {
  const raw = localStorage.getItem('lt_token');
  if (!raw) return null;
  return raw.replace(/^Bearer\s+/i, '').trim();
}

export function clearToken() {
  console.log('[auth] Очищаем токен из localStorage');
  localStorage.removeItem('lt_token');
  console.log('[auth] Токен очищен');
}

export function isLoggedIn() {
  return !!getToken();
}
