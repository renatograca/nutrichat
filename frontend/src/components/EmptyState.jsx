import React from 'react'

export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center">
      <div className="bg-light rounded-circle p-4 mb-4">
        <i className={`bi bi-${icon} fs-1 text-primary`}></i>
      </div>
      <h2 className="h4 fw-bold mb-2">{title}</h2>
      <p className="text-muted mb-4">{message}</p>
      {action && (
        <button className="btn btn-primary px-4 py-2" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
