// =============================================================================
// Navbar.jsx — MENU DE NAVEGAÇÃO (aparece em todas as páginas)
// Mostra os links das rotas e, quando há usuário logado, "Olá, nome" + "Sair".
// O acesso ao login fica pelo botão "Entrar" da página inicial.
// =============================================================================

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  // usuario: dados de quem está logado (undefined se ninguém estiver)
  // sair: função do AuthContext que apaga a sessão (logout)
  const { usuario, sair } = useAuth()

  // useNavigate permite trocar de página pelo código (sem clicar em link)
  const navigate = useNavigate()

  // Executada ao clicar em "Sair": apaga a sessão e volta para a página inicial
  function deslogar() {
    sair()
    navigate('/')
  }

  return (
    <header className="navbar">
      <span className="logo">TaskFlow</span>
      <nav>
        {/* NavLink recebe a classe "active" na rota atual e não recarrega a página */}
        <NavLink to="/">Início</NavLink>
        {/* "end" faz o link só ficar ativo em /tarefas exatamente (e não em /tarefas/nova) */}
        <NavLink to="/tarefas" end>Tarefas</NavLink>
        <NavLink to="/tarefas/nova">Nova tarefa</NavLink>

        {/* Só aparece quando há usuário logado */}
        {usuario && (
          <>
            {/* split(' ')[0] pega só o primeiro nome: "Emily Johnson" -> "Emily" */}
            <span className="usuario">Olá, {usuario.nome.split(' ')[0]}</span>
            <button className="link-sair" onClick={deslogar}>Sair</button>
          </>
        )}
      </nav>
    </header>
  )
}