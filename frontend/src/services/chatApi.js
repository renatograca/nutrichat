import {CHAT_BASE_URL, getToken, getUserId} from './config'

const getHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

export async function getChats() {
  const userId = getUserId()
  const res = await fetch(`${CHAT_BASE_URL}/api/chats?user_id=${userId}`, {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch chats')
  return await res.json()
}

export async function createChat(documentId = null) {
  const res = await fetch(`${CHAT_BASE_URL}/api/chats`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_id: getUserId(), document_id: documentId })
  })
  if (!res.ok) throw new Error('Failed to create chat')
  return await res.json()
}

export async function associateDocument(chatId, documentId) {
  const res = await fetch(`${CHAT_BASE_URL}/api/chats/${chatId}/document`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_id: getUserId(), documentId })
  })
  if (!res.ok) throw new Error('Failed to associate document')
  return await res.json()
}

export async function updateChatTitle(chatId, title) {
  const res = await fetch(`${CHAT_BASE_URL}/api/chats/${chatId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ user_id: getUserId(), title })
  })
  if (!res.ok) throw new Error('Failed to update chat title')
  return await res.json()
}

export async function getMessages(chatId) {
  const res = await fetch(`${CHAT_BASE_URL}/api/chats/${chatId}/messages`, {
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Failed to fetch messages')
  return await res.json()
}

export async function sendMessage(chatId, text) {
  const res = await fetch(`${CHAT_BASE_URL}/api/chats/${chatId}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text })
  })
  if (!res.ok) throw new Error('Failed to send message')
  return await res.json()
}

export async function deleteChat(chatId) {
  const res = await fetch(`${CHAT_BASE_URL}/api/chats/${chatId}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
  if (!res.ok) throw new Error('Failed to delete chat')
  return true
}

export async function uploadFile(file) {
  const fd = new FormData()
  fd.append('file', file)
  
  const token = getToken()
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

  const res = await fetch(`${CHAT_BASE_URL}/api/documents/`, {
    method: 'POST',
    headers,
    body: fd
  })
  if (!res.ok) throw new Error('Upload failed')
  return await res.json()
}
