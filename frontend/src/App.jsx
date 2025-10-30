import React, {useState} from 'react'
import Upload from './components/Upload'
import Chat from './components/Chat'

export default function App(){
  const [documentId, setDocumentId] = useState(null)

  return (
    <div className="app">
      <header>
        <h1>NutriChat</h1>
        <p>Seu assistente de plano alimentar</p>
      </header>
      <main>
        {/* <div className="left">
          <Upload onReady={(id) => setDocumentId(id)} />
        </div> */}
        <div className="right">
          <Chat documentId={documentId}/>
        </div>
      </main>
      <footer>NutriChat - Sempre disponivel para te ajudar a tomar uma escolha saúdavel</footer>
    </div>
  )
}
