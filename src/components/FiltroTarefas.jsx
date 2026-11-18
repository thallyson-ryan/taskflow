export default function FiltroTarefas({ busca, setBusca, status, setStatus, prioridade, setPrioridade, ordem, setOrdem }) {
  return (
    <div className="filtros">
      <input
        type="text"
        placeholder="Buscar por título..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todas">Todos os status</option>
        <option value="pendentes">Pendentes</option>
        <option value="concluidas">Concluídas</option>
      </select>
      <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
        <option value="todas">Todas as prioridades</option>
        <option value="alta">Alta</option>
        <option value="media">Média</option>
        <option value="baixa">Baixa</option>
      </select>
      <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
        <option value="prazo">Ordenar por prazo</option>
        <option value="prioridade">Ordenar por prioridade</option>
        <option value="titulo">Ordenar por título</option>
      </select>
    </div>
  )
}