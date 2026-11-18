export default function formatarData(data) {
  if (!data) return 'Sem prazo'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}