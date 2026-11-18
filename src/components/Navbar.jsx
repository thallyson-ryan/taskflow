// =============================================================================
// Navbar.jsx — MENU DE NAVEGAÇÃO (aparece em todas as páginas)
// Mostra os links das rotas e, conforme o login, "Olá, nome" + "Sair" ou "Entrar".
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
        {/* NavLink é como um <Link>, mas recebe a classe "active" quando está na rota atual
            (usada no CSS para destacar o item do menu). Ele NÃO recarrega a página. */}
        <NavLink to="/">Início</NavLink>
        {/* "end" faz o link só ficar ativo em /tarefas exatamente (e não em /tarefas/nova) */}
        <NavLink to="/tarefas" end>Tarefas</NavLink>
        <NavLink to="/tarefas/nova">Nova tarefa</NavLink>

        {/* Renderização condicional: se há usuário logado mostra nome + Sair, senão mostra Entrar */}
        {usuario ? (
          <>
            {/* split(' ')[0] pega só o primeiro nome: "Emily Johnson" -> "Emily" */}
            <span className="usuario">Olá, {usuario.nome.split(' ')[0]}</span>
            <button className="link-sair" onClick={deslogar}>Sair</button>
          </>
        ) : (
          <NavLink to="/login">Entrar</NavLink>
        )}
      </nav>
    </header>
  )
}
