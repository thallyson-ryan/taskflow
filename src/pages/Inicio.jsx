import { Link } from 'react-router-dom'

export default function Inicio({ total }) {
  return (
    <section className="inicio">
      <h1>Organize suas tarefas em um só lugar</h1>
      <p>O TaskFlow ajuda estudantes e pequenas equipes a controlar prazos, prioridades e status das tarefas.</p>
      <p>Você tem {total} tarefa(s) cadastrada(s).</p>
      <div className="acoes">
        <Link to="/tarefas" className="botao">Ver tarefas</Link>
        <Link to="/tarefas/nova" className="botao secundario">Nova tarefa</Link>
      </div>
    </section>
  )
}