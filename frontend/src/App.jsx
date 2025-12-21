import React from 'react'
import Chat from './components/Chat'
import Upload from './components/Upload'

export default function App() {
  return (
    <div className="container-lg py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-5">
            <h1 className="display-5 mb-2 text-primary">NutriChat</h1>
            <p className="lead text-muted">Envie seu plano de nutrição e converse com o assistente</p>
          </div>
          
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">📄 Enviar Documento</h5>
              <Upload />
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">💬 Chat</h5>
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
