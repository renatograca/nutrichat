import Chat from './components/Chat'

// Mock de configuração. O documentId é mockado para habilitar o chat.
const BASE_URL = 'http://localhost:8080'
const MOCK_DOCUMENT_ID = "mock-plan-123" 
// --- Componente Principal (App) ---
export default function App(){
  // Mock para habilitar o chat
  const documentId = MOCK_DOCUMENT_ID 

  return (
    <>
      {/* Adiciona o script do Tailwind e estilos globais */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          /* Força o layout em tela cheia para simular PWA/Mobile */
          #root, html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden; /* Remove barras de rolagem desnecessárias */
          }
          
          .app-container {
            width: 100%;
            height: 100vh; /* 100% da viewport height */
            max-width: 100%;
            max-height: 100%;
          }

          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #9ca3af; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }

          /* Animação Typing Indicator */
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-3px); }
          }
          .animate-bounce > div {
            animation: bounce 0.9s infinite ease-in-out;
          }
          .animate-bounce > div:nth-child(2) { animation-delay: 0.1s; }
          .animate-bounce > div:nth-child(3) { animation-delay: 0.2s; }
        `}
      </style>
      
      <div className="app-container bg-gray-200 flex items-center justify-center">
        {/* Chat ocupa 100% da área da tela (Mobile/PWA look) */}
        <Chat documentId={documentId} />
      </div>
    </>
  )
}
