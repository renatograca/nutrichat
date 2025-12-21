import React from 'react'

export default function ChatHeader({ title, onBack, onDelete, onLogout }) {
  return (
    <div className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top">
      <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
        {onBack && (
          <button className="btn btn-link p-0 me-3 text-dark" onClick={onBack}>
            <i className="bi bi-arrow-left fs-4"></i>
          </button>
        )}
        <h1 className="h5 mb-0 fw-bold text-truncate">{title || 'NutriChat'}</h1>
      </div>
      <div className="d-flex align-items-center gap-2">
        {onDelete && (
          <button className="btn btn-outline-danger btn-sm" onClick={onDelete}>
            <i className="bi bi-trash"></i>
          </button>
        )}
        {onLogout && (
          <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        )}
      </div>
    </div>
  )
}
