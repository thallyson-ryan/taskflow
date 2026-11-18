// =============================================================================
// RotaProtegida.jsx — BLOQUEIA PÁGINAS PARA QUEM NÃO ESTÁ LOGADO
// Envolve as páginas de tarefas no App.jsx:
//   <RotaProtegida><ListaTarefas /></RotaProtegida>
// Se não houver sessão, redireciona para /login.
// Obs.: "autenticação não é esconder um botão" — mesmo digitando /tarefas
// na barra de endereço, o usuário deslogado é redirecionado.
// =============================================================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// children = o conteúdo que está "dentro" do componente (a página protegida)
export default function RotaProtegida({ children }) {
  // sessao: dados da sessão (null se deslogado)
  // verificando: true enquanto o app confere se o token salvo ainda é válido
  const { sessao, verificando } = useAuth()

  // useLocation informa a rota atual (ex.: /tarefas/5)
  const location = useLocation()

  // 1) Ainda conferindo o token na API (/auth/me): mostra aviso e espera
  if (verificando) return <p className="aviso">Verificando sessão...</p>

  // 2) Sem sessão: redireciona para o login.
  //    replace -> não deixa a página protegida no histórico (botão Voltar)
  //    state.de -> guarda de onde o usuário veio, para voltar para lá após o login
  if (!sessao) return <Navigate to="/login" replace state={{ de: location.pathname }} />

  // 3) Logado: mostra a página normalmente
  return children
}
