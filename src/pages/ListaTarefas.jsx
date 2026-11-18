// =============================================================================
// ListaTarefas.jsx — LISTA DE TAREFAS (rota "/tarefas", protegida)
// Mostra a tela certa para cada estado da requisição:
//   carregando -> spinner
//   erro       -> mensagem + "Tentar novamente" + "Usar dados de demonstração"
//   vazio      -> aviso "Nenhuma tarefa"
//   sucesso    -> busca, filtros, ordenação e a lista
// =============================================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import FiltroTarefas from '../components/FiltroTarefas'
import CartaoTarefa from '../components/CartaoTarefa'
import '../styles/tarefas.css'

// Peso de cada prioridade para ordenar (menor número aparece primeiro)
const pesoPrioridade = { alta: 1, media: 2, baixa: 3 }

// Texto exibido conforme a ORIGEM dos dados (deixa claro o que é remoto e o que é local)
const avisosOrigem = {
  api: 'Tarefas carregadas da API DummyJSON. Criações, edições e exclusões ficam salvas apenas neste navegador.',
  cache: 'Exibindo as tarefas salvas neste navegador.',
  contingencia: 'Modo de contingência: a API não respondeu e estes são dados locais de demonstração. Alterações não serão salvas.',
}

// Props recebidas do App.jsx (vêm do hook useTarefas)
export default function ListaTarefas({ tarefas, status, erro, origem, onRecarregar, onContingencia }) {
  // Estados dos filtros (cada mudança faz a lista ser recalculada)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todas')
  const [prioridade, setPrioridade] = useState('todas')
  const [ordem, setOrdem] = useState('prazo')

  // Lista FILTRADA, calculada a cada renderização a partir da lista completa.
  // Nada é apagado de "tarefas": só muda o que aparece na tela.
  const filtradas = tarefas
    // 1) Busca: título contém o texto digitado (ignorando maiúsculas/minúsculas)
    .filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()))
    // 2) Status: todas, só concluídas ou só pendentes
    .filter((t) => filtroStatus === 'todas' || (filtroStatus === 'concluidas' ? t.concluida : !t.concluida))
    // 3) Prioridade: todas ou a escolhida
    .filter((t) => prioridade === 'todas' || t.prioridade === prioridade)
    // 4) Ordenação (sort recebe 2 itens e devolve negativo/zero/positivo)
    .sort((a, b) => {
      if (ordem === 'prioridade') return pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade]
      if (ordem === 'titulo') return a.titulo.localeCompare(b.titulo)
      // Por prazo: tarefas sem prazo usam uma data bem distante para irem para o fim
      return (a.prazo || '9999-12-31').localeCompare(b.prazo || '9999-12-31')
    })

  // Volta os filtros para o padrão (usado quando nenhum resultado é encontrado)
  function limparFiltros() {
    setBusca('')
    setFiltroStatus('todas')
    setPrioridade('todas')
  }

  // ---------- ESTADO: CARREGANDO ----------
  if (status === 'ocioso' || status === 'carregando') {
    return (
      <section>
        <h1>Tarefas</h1>
        <div className="carregando"><span className="spinner" /> Carregando tarefas...</div>
      </section>
    )
  }

  // ---------- ESTADO: ERRO ----------
  if (status === 'erro') {
    return (
      <section>
        <h1>Tarefas</h1>
        <div className="erro-lista">
          <p>Não foi possível carregar as tarefas.</p>
          <p>{erro}</p>
          <div className="acoes">
            {/* Chama carregarDaApi() de novo */}
            <button className="botao" onClick={onRecarregar}>Tentar novamente</button>
            {/* Carrega src/data/tarefas.json (contingência) */}
            <button className="botao secundario" onClick={onContingencia}>Usar dados de demonstração</button>
          </div>
        </div>
      </section>
    )
  }

  // Barra azul que informa a origem dos dados (reutilizada em mais de um lugar abaixo)
  const barraOrigem = (
    <div className="barra-origem">
      <span>{avisosOrigem[origem]}</span>
      <button className="botao secundario" onClick={onRecarregar}>Recarregar da API</button>
    </div>
  )

  // ---------- ESTADO: VAZIO ----------
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

  // ---------- ESTADO: SUCESSO ----------
  return (
    <section>
      <h1>Tarefas</h1>
      {barraOrigem}

      {/* Passa os valores e as funções dos filtros para o componente filho */}
      <FiltroTarefas
        busca={busca} setBusca={setBusca}
        status={filtroStatus} setStatus={setFiltroStatus}
        prioridade={prioridade} setPrioridade={setPrioridade}
        ordem={ordem} setOrdem={setOrdem}
      />

      <p className="contador">{filtradas.length} de {tarefas.length} tarefa(s)</p>

      {/* Se o filtro não encontrou nada, mostra aviso; senão, mostra a lista */}
      {filtradas.length === 0 ? (
        <div className="aviso">
          <p>Nenhuma tarefa encontrada com esses filtros.</p>
          <button className="botao secundario" onClick={limparFiltros}>Limpar filtros</button>
        </div>
      ) : (
        <ul className="lista">
          {/* map gera um CartaoTarefa por tarefa.
              key={t.id}: identificador único e estável que o React usa
              para saber qual item mudou, sem recriar a lista inteira. */}
          {filtradas.map((t) => <CartaoTarefa key={t.id} tarefa={t} />)}
        </ul>
      )}
    </section>
  )
}
