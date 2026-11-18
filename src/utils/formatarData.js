// =============================================================================
// formatarData.js — FORMATA DATAS PARA O PADRÃO BRASILEIRO
// "2026-11-25" -> "25/11/2026"
// Se a data estiver vazia (tarefas vindas da API não têm prazo) -> "Sem prazo"
// =============================================================================

export default function formatarData(data) {
  if (!data) return 'Sem prazo'
  // split('-') separa o texto: "2026-11-25" -> ["2026", "11", "25"]
  const [ano, mes, dia] = data.split('-')
  // Template string monta o texto no formato dia/mês/ano
  return `${dia}/${mes}/${ano}`
}
