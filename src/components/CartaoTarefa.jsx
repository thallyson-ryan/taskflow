import { Link } from 'react-router-dom'

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const rotulos = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

export default function CartaoTarefa({ tarefa }) {
  return (
    <li className={`cartao ${tarefa.concluida ? 'concluida' : ''}`}>
      <div>
        <h3>{tarefa.titulo}</h3>
        <p className="info">
          Prazo: {formatarData(tarefa.prazo)} • {tarefa.concluida ? 'Concluída' : 'Pendente'}
        </p>
      </div>
      <div className="cartao-lado">
        <span className={`selo ${tarefa.prioridade}`}>{rotulos[tarefa.prioridade]}</span>
        <Link to={`/tarefas/${tarefa.id}`}>Detalhes</Link>
      </div>
    </li>
  )
}