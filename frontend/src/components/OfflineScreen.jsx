import React from 'react'

export default function OfflineScreen({ onRetry }) {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light text-center">
      <div className="card shadow-sm p-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body">
          <div className="mb-4 text-secondary">
            <i className="bi bi-cloud-slash text-danger" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="text-dark fw-bold mb-3">Ops! Backend Offline</h2>
          <p className="text-muted mb-4">
            Parece que nosso servidor está descansando um pouco ou sua conexão caiu. 
            Não conseguimos conectar ao NutriSmart agora.
          </p>
          <div className="d-grid gap-2">
            <button 
              className="btn btn-primary btn-lg py-3 rounded-pill fw-bold" 
              onClick={onRetry || (() => window.location.reload())}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Tentar Novamente
            </button>
            <button 
              className="btn btn-link text-decoration-none text-muted small mt-2"
              onClick={() => window.location.reload()}
            >
              Recarregar Página
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
