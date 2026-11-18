// =============================================================================
// main.jsx — PONTO DE ENTRADA DA APLICAÇÃO
// É o primeiro arquivo executado pelo Vite. Ele "monta" o React dentro da
// <div id="root"> que existe no index.html.
// =============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // habilita as rotas (URLs) do app
import { AuthProvider } from './contexts/AuthContext' // disponibiliza a sessão (login) para todo o app
import App from './App.jsx'
import './styles/global.css' // estilos usados em todas as páginas

// createRoot: liga o React ao elemento HTML com id="root".
// A ordem dos "envelopes" importa:
//   StrictMode   -> modo de desenvolvimento que ajuda a encontrar erros
//                   (em dev, executa alguns efeitos 2 vezes de propósito)
//   BrowserRouter-> precisa ficar por fora, pois o AuthProvider e o App usam rotas
//   AuthProvider -> qualquer componente dentro dele pode usar useAuth()
//   App          -> a aplicação em si
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
