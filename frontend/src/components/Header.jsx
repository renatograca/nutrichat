import React from 'react'

export default function Header({ onMenuClick, onLogout }) {
  return (
    <header className="bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top shadow-sm" style={{ zIndex: 1030 }}>
      <div className="d-flex align-items-center">
        <button className="btn btn-link p-0 me-3 text-dark" onClick={onMenuClick}>
          <i className="bi bi-list fs-3"></i>
        </button>
        <h1 className="h5 mb-0 fw-bold text-primary">NutriChat</h1>
      </div>
      
      <div className="d-flex align-items-center gap-2">
        {onLogout && (
          <button className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }} onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        )}
      </div>
    </header>
  )
}
