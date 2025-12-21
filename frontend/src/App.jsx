import React from 'react'
import Chat from './components/Chat'
import Upload from './components/Upload'

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>NutriChat</h1>
        <p className="subtitle">Envie seu plano e converse com o assistente</p>
      </header>
      <main className="app-main">
        <Upload />
        <Chat />
      </main>
      <footer className="app-footer">NutriChat — WebView-friendly</footer>
    </div>
  )
}
