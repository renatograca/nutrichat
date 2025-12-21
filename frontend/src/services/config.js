export const CHAT_BASE_URL = import.meta.env.VITE_CHAT_BASE_URL
export const USER_BASE_URL = import.meta.env.VITE_USER_BASE_URL

export function getToken() {
  try { return localStorage.getItem('auth_token') }
  catch { return null }
}
