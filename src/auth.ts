// export function saveToken(token:string) {
//   localStorage.setItem('lt_token', token)
// }
// export function getToken(): string | null {
//   return localStorage.getItem('lt_token')
// }
export function getToken(): string | null {
  const raw = localStorage.getItem('lt_token');
  if (!raw) return null;

  // Убираем лишний Bearer, если он есть
  return raw.replace(/^Bearer\s+/i, '').trim();
}

export function saveToken(token: string) {
  // Всегда сохраняем без Bearer!
  const clean = token.replace(/^Bearer\s+/i, '').trim();
  localStorage.setItem('lt_token', clean);
}


export function clearToken() {
  localStorage.removeItem('lt_token')
}
export function isLoggedIn() {
  return !!getToken()
}
