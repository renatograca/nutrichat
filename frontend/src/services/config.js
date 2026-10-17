const isDev = import.meta.env.DEV

export const CHAT_BASE_URL = import.meta.env.VITE_CHAT_BASE_URL || (isDev ? 'http://localhost:8080' : '')
export const USER_BASE_URL = import.meta.env.VITE_USER_BASE_URL || (isDev ? 'http://localhost:8081' : '')

export function getToken() {
  try { return localStorage.getItem('auth_token') }
  catch { return null }
}

export function getUserId() {
  try { return localStorage.getItem('user_id') }
  catch { return null }
}