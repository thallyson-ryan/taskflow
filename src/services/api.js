const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

export class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.status = status
  }
}

function mensagemPorStatus(status) {
  if (status === 401) return 'Sessão expirada. Faça login novamente.'
  if (status === 403) return 'Você não tem permissão para esta operação.'
  if (status === 404) return 'Recurso não encontrado.'
  return 'Erro inesperado no servidor.'
}

export async function requisicao(caminho, { metodo = 'GET', corpo, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let resposta
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua internet.', 0)
  }

  const dados = await resposta.json().catch(() => null)

  if (!resposta.ok) {
    throw new ApiError(dados?.message || mensagemPorStatus(resposta.status), resposta.status)
  }

  return dados
}