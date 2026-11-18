import { useState } from 'react'
import { Link } from 'react-router-dom'
import FiltroTarefas from '../components/FiltroTarefas'
import CartaoTarefa from '../components/CartaoTarefa'
import '../styles/tarefas.css'

const pesoPrioridade = { alta: 1, media: 2, baixa: 3 }

export default function ListaTarefas({ tarefas }) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('todas')
  const [prioridade, setPrioridade] = useState('todas')
  const [ordem, setOrdem] = useState('prazo')

  const filtradas = tarefas
    .filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()))
    .filter((t) => status === 'todas' || (status === 'concluidas' ? t.concluida : !t.concluida))
    .filter((t) => prioridade === 'todas' || t.prioridade === prioridade)
    .sort((a, b) => {
      if (ordem === 'prioridade') return pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade]
      if (ordem === 'titulo') return a.titulo.localeCompare(b.titulo)
      return a.prazo.localeCompare(b.prazo)
    })

  function limparFiltros() {
    setBusca('')
    setStatus('todas')
    setPrioridade('todas')
  }

  if (tarefas.length === 0) {
    return (
      <section>
        <h1>Tarefas</h1>
        <p className="aviso">Nenhuma tarefa cadastrada ainda.</p>
        <Link to="/tarefas/nova" className="botao">Cadastrar a primeira tarefa</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Tarefas</h1>
      <FiltroTarefas
        busca={busca} setBusca={setBusca}
        status={status} setStatus={setStatus}
        prioridade={prioridade} setPrioridade={setPrioridade}
        ordem={ordem} setOrdem={setOrdem}
      />
      <p className="contador">{filtradas.length} de {tarefas.length} tarefa(s)</p>
      {filtradas.length === 0 ? (
        <div className="aviso">
          <p>Nenhuma tarefa encontrada com esses filtros.</p>
          <button className="botao secundario" onClick={limparFiltros}>Limpar filtros</button>
        </div>
      ) : (
        <ul className="lista">
          {filtradas.map((t) => <CartaoTarefa key={t.id} tarefa={t} />)}
        </ul>
      )}
    </section>
  )
}