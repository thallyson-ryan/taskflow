import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <span className="logo">TaskFlow</span>
      <nav>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/tarefas">Tarefas</NavLink>
        <NavLink to="/tarefas/nova">Nova tarefa</NavLink>
      </nav>
    </header>
  )
}