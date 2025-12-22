import React from 'react'

export default function MessageBubble({ message }) {
  const isUser = message.role?.toUpperCase() === 'USER'
  
  const formatTime = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return (
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div 
        className={`p-3 rounded-3 shadow-sm ${isUser ? 'bg-primary text-white' : 'bg-light text-dark'}`}
        style={{ maxWidth: '85%', wordBreak: 'break-word' }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message?.content}</div>
        <div 
          className={`small mt-1 ${isUser ? 'text-white-50' : 'text-muted'}`} 
          style={{ fontSize: '0.75rem' }}
        >
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  )
}
