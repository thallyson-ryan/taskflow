// =============================================================================
// Inicio.jsx — PÁGINA INICIAL (rota "/", pública)
// Deslogado: convite para entrar + botão Entrar.
// Logado: mini resumo com o número de tarefas pendentes e concluídas.
// =============================================================================

import { Link } from 'react-router-dom'

// Prop resumo:
//   { pendentes, concluidas } -> usuário logado
//   null                      -> ninguém logado
export default function Inicio({ resumo }) {
  return (
    <section className="inicio">
      <h1>Organize suas tarefas em um só lugar</h1>
      <p>O TaskFlow ajuda estudantes e pequenas equipes a controlar prazos, prioridades e status das tarefas.</p>

      {resumo ? (
        // Logado: mini resumo
        <div className="resumo">
          <div className="resumo-item">
            <span className="resumo-numero">{resumo.pendentes}</span>
            <span className="resumo-rotulo">Pendentes</span>
          </div>
          <div className="resumo-item">
            <span className="resumo-numero">{resumo.concluidas}</span>
            <span className="resumo-rotulo">Concluídas</span>
          </div>
        </div>
      ) : (
        // Deslogado: convite e botão Entrar
        <>
          <p>Entre com sua conta para ver suas tarefas.</p>
          <div className="acoes">
            <Link to="/login" className="botao">Entrar</Link>
          </div>
        </>
      )}
    </section>
  )
}