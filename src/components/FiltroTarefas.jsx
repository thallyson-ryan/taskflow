// =============================================================================
// FiltroTarefas.jsx — BUSCA, FILTROS E ORDENAÇÃO
// Componente CONTROLADO: ele não guarda estado próprio.
// Os valores e as funções que os alteram vêm do componente pai (ListaTarefas)
// por props. Assim, quem decide a lista exibida é sempre a ListaTarefas.
// =============================================================================

export default function FiltroTarefas({ busca, setBusca, status, setStatus, prioridade, setPrioridade, ordem, setOrdem }) {
  return (
    <div className="filtros">
      {/* Campo de busca:
          value={busca}            -> o texto exibido vem do estado (input controlado)
          onChange={...setBusca}   -> a cada tecla, atualiza o estado no componente pai
          e.target.value           -> o texto atual digitado no campo */}
      <input
        type="text"
        placeholder="Buscar por título..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* Filtro por status (todas / pendentes / concluídas) */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todas">Todos os status</option>
        <option value="pendentes">Pendentes</option>
        <option value="concluidas">Concluídas</option>
      </select>

      {/* Filtro por prioridade */}
      <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
        <option value="todas">Todas as prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>

      {/* Ordenação da lista */}
      <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
        <option value="prazo">Ordenar por prazo</option>
        <option value="prioridade">Ordenar por prioridade</option>
        <option value="titulo">Ordenar por título</option>
      </select>
    </div>
  )
}
