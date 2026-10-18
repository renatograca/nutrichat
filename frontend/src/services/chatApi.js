import {CHAT_BASE_URL, getToken, getUserId, logFetchError} from './config'

const getHeaders = () => {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

async function handleJson(res, url, errorMessage) {
  if (!res.ok) {
    await logFetchError(res, url)
    throw new Error(errorMessage)
  }
  return await res.json()
}

export async function getChats() {
  const userId = getUserId()
  const url = `${CHAT_BASE_URL}/api/chats?user_id=${userId}`
  const res = await fetch(url, { headers: getHeaders() })
  return handleJson(res, url, 'Failed to fetch chats')
}

export async function getChat(chatId) {
  const userId = getUserId()
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}?user_id=${userId}`
  const res = await fetch(url, { headers: getHeaders() })
  const data = await handleJson(res, url, 'Failed to fetch chat')
  console.log('getChat response:', data)
  return data
}

export async function createChat(documentId = null) {
  const url = `${CHAT_BASE_URL}/api/chats`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ user_id: getUserId(), document_id: documentId })
  })
  return handleJson(res, url, 'Failed to create chat')
}

export async function updateChatTitle(chatId, title) {
  const userId = getUserId()
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ user_id: userId, title })
  })
  return handleJson(res, url, 'Failed to update chat title')
}

export async function getMessages(chatId) {
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}/messages?user_id=${getUserId()}`
  const res = await fetch(url, { headers: getHeaders() })
  return handleJson(res, url, 'Failed to fetch messages')
}

export async function sendMessage(chatId, message) {
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}/messages`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, user_id: getUserId() })
  })
  return handleJson(res, url, 'Failed to send message')
}

export async function deleteChat(chatId) {
  const userId = getUserId()
  const url = `${CHAT_BASE_URL}/api/chats/${chatId}?user_id=${userId}`
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

  const url = `${CHAT_BASE_URL}/api/documents/`
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
