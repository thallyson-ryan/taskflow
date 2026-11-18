// =============================================================================
// CartaoTarefa.jsx — EXIBE UMA TAREFA NA LISTA
// Componente reutilizável: recebe UMA tarefa por props e só a exibe.
// Não altera dados (componente de apresentação).
// =============================================================================

import { Link } from 'react-router-dom'
import formatarData from '../utils/formatarData' // "2026-11-25" -> "25/11/2026"

// Converte o valor salvo ("alta", "media", "baixa") para o texto exibido na tela
const rotulos = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

// { tarefa } é a desestruturação da prop: o pai usa <CartaoTarefa tarefa={t} />
export default function CartaoTarefa({ tarefa }) {
  return (
    // Se a tarefa estiver concluída, adiciona a classe "concluida" (CSS risca o título)
    <li className={`cartao ${tarefa.concluida ? 'concluida' : ''}`}>
      <div>
        <h3>{tarefa.titulo}</h3>
        <p className="info">
          Prazo: {formatarData(tarefa.prazo)} • {tarefa.concluida ? 'Concluída' : 'Pendente'}
        </p>
      </div>
      <div className="cartao-lado">
        {/* A classe do selo é a própria prioridade (alta/media/baixa) -> cada uma tem uma cor no CSS */}
        <span className={`selo ${tarefa.prioridade}`}>{rotulos[tarefa.prioridade]}</span>
        {/* Link para a página de detalhe: monta a URL com o id da tarefa, ex.: /tarefas/3 */}
        <Link to={`/tarefas/${tarefa.id}`}>Detalhes</Link>
      </div>
    </li>
  )
}
