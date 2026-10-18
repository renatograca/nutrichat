import {CHAT_BASE_URL, getToken, getUserId, getPhoneUser, logFetchError} from './config'

const getHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

let onUnauthenticated = () => {}
export function setOnUnauthenticated(handler) {
  onUnauthenticated = handler
}

async function handleJson(res, url, errorMessage) {
  if (res.status === 401) {
    await logFetchError(res, url)
    onUnauthenticated()
    throw new Error('Sessão expirada')
  }
  if (!res.ok) {
    await logFetchError(res, url)
    throw new Error(errorMessage)
  }
  return await res.json()
}

export async function getChats() {
  const phone = getPhoneUser()
  const url = `${CHAT_BASE_URL}/api/chats?${paramAccessByPhone(phone)}`
  const res = await fetch(url, { headers: getHeaders() })
  return handleJson(res, url, 'Failed to fetch chats')
}

export async function getChat(chatId) {
  const phone = getPhoneUser()
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}?${paramAccessByPhone(phone)}`
  const res = await fetch(url, { headers: getHeaders() })
  const data = await handleJson(res, url, 'Failed to fetch chat')
  return data
}

export async function createChat(documentId = null) {
  const url = `${CHAT_BASE_URL}/api/chats?${paramAccessByPhone(getPhoneUser())}`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ phone: getPhoneUser(), document_id: documentId })
  })
  return handleJson(res, url, 'Failed to create chat')
}

export async function updateChatTitle(chatId, title) {
  const phone = getPhoneUser()
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ phone, title })
  })
  return handleJson(res, url, 'Failed to update chat title')
}

export async function getMessages(chatId) {
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}/messages?${paramAccessByPhone(getPhoneUser())}`
  const res = await fetch(url, { headers: getHeaders() })
  return handleJson(res, url, 'Failed to fetch messages')
}

export async function sendMessage(chatId, message) {
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}/messages?${paramAccessByPhone(getPhoneUser())}`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, phone: getPhoneUser() })
  })
  return handleJson(res, url, 'Failed to send message')
}

export async function deleteChat(chatId) {
  const phone = getPhoneUser()
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}?${paramAccessByPhone(phone)}`
  const res = await fetch(url, { method: 'DELETE', headers: getHeaders() })
  if (!res.ok) {
    await logFetchError(res, url)
    throw new Error('Failed to delete chat')
  }
  return true
}

export async function uploadFile(file, chatId) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('user_id', getUserId())
  if(chatId) fd.append('chat_id', chatId)

  const token = getToken()
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

  const url = `${CHAT_BASE_URL}/api/documents?${paramAccessByPhone(getPhoneUser())}`
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: fd
  })
  if (!res.ok) {
    await logFetchError(res, url)
    throw new Error('Upload failed')
  }
  return await res.json()
}

const paramAccessByPhone = (phone) => 'auth_by_phone=true&phone=' + phone;