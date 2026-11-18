import { useState } from 'react'
import { Link } from 'react-router-dom'
import FiltroTarefas from '../components/FiltroTarefas'
import CartaoTarefa from '../components/CartaoTarefa'
import '../styles/tarefas.css'

const pesoPrioridade = { alta: 1, media: 2, baixa: 3 }

const avisosOrigem = {
  api: 'Tarefas carregadas da API DummyJSON. Criações, edições e exclusões ficam salvas apenas neste navegador.',
  cache: 'Exibindo as tarefas salvas neste navegador.',
  contingencia: 'Modo de contingência: a API não respondeu e estes são dados locais de demonstração. Alterações não serão salvas.',
}

export default function ListaTarefas({ tarefas, status, erro, origem, onRecarregar, onContingencia }) {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todas')
  const [prioridade, setPrioridade] = useState('todas')
  const [ordem, setOrdem] = useState('prazo')

  const filtradas = tarefas
    .filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()))
    .filter((t) => filtroStatus === 'todas' || (filtroStatus === 'concluidas' ? t.concluida : !t.concluida))
    .filter((t) => prioridade === 'todas' || t.prioridade === prioridade)
    .sort((a, b) => {
      if (ordem === 'prioridade') return pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade]
      if (ordem === 'titulo') return a.titulo.localeCompare(b.titulo)
      return (a.prazo || '9999-12-31').localeCompare(b.prazo || '9999-12-31')
    })

  function limparFiltros() {
    setBusca('')
    setFiltroStatus('todas')
    setPrioridade('todas')
  }

  if (status === 'ocioso' || status === 'carregando') {
    return (
      <section>
        <h1>Tarefas</h1>
        <div className="carregando"><span className="spinner" /> Carregando tarefas...</div>
      </section>
    )
  }

  if (status === 'erro') {
    return (
      <section>
        <h1>Tarefas</h1>
        <div className="erro-lista">
          <p>Não foi possível carregar as tarefas.</p>
          <p>{erro}</p>
          <div className="acoes">
            <button className="botao" onClick={onRecarregar}>Tentar novamente</button>
            <button className="botao secundario" onClick={onContingencia}>Usar dados de demonstração</button>
          </div>
        </div>
      </section>
    )
  }

  const barraOrigem = (
    <div className="barra-origem">
      <span>{avisosOrigem[origem]}</span>
      <button className="botao secundario" onClick={onRecarregar}>Recarregar da API</button>
    </div>
  )

  if (tarefas.length === 0) {
    return (
      <section>
        <h1>Tarefas</h1>
        {barraOrigem}
        <p className="aviso">Nenhuma tarefa encontrada para este usuário.</p>
        <Link to="/tarefas/nova" className="botao">Cadastrar a primeira tarefa</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>Tarefas</h1>
      {barraOrigem}
      <FiltroTarefas
        busca={busca} setBusca={setBusca}
        status={filtroStatus} setStatus={setFiltroStatus}
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