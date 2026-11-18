// =============================================================================
// Inicio.jsx — PÁGINA INICIAL (rota "/", pública)
// Explica a finalidade do produto e mostra o total de tarefas do usuário logado.
// =============================================================================

import { Link } from 'react-router-dom'

// Prop total:
//   número -> usuário logado (mostra quantas tarefas ele tem)
//   null   -> ninguém logado (mostra convite para entrar)
export default function Inicio({ total }) {
  return (
    <section className="inicio">
      <h1>Organize suas tarefas em um só lugar</h1>
      <p>O TaskFlow ajuda estudantes e pequenas equipes a controlar prazos, prioridades e status das tarefas.</p>

      {/* Renderização condicional com operador ternário: condição ? se verdadeiro : se falso */}
      {total !== null
        ? <p>Você tem {total} tarefa(s) cadastrada(s).</p>
        : <p>Entre com sua conta para ver suas tarefas.</p>}

      <div className="acoes">
        {/* <Link> troca de página SEM recarregar o navegador (diferente da tag <a>) */}
        <Link to="/tarefas" className="botao">Ver tarefas</Link>
        <Link to="/tarefas/nova" className="botao secundario">Nova tarefa</Link>
      </div>
    </section>
  )
}
