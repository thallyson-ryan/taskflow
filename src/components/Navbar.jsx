import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  function deslogar() {
    sair()
    navigate('/')
  }

  return (
    <header className="navbar">
      <span className="logo">TaskFlow</span>
      <nav>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/tarefas" end>Tarefas</NavLink>
        <NavLink to="/tarefas/nova">Nova tarefa</NavLink>
        {usuario ? (
          <>
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