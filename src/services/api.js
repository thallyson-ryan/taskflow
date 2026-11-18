// =============================================================================
// api.js — FUNÇÃO CENTRAL DE ACESSO À API (fetch)
// TODAS as requisições do app passam pela função requisicao().
// Vantagens: o fetch fica em um só lugar, o token é enviado sempre do mesmo
// jeito e os erros são padronizados.
// =============================================================================

// URL-base lida do arquivo .env (variável VITE_API_URL).
// O Vite só expõe variáveis que começam com VITE_.
// Se o .env não existir, usa a DummyJSON como padrão.
const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

// Erro personalizado que, além da mensagem, guarda o STATUS HTTP (401, 403, 404...).
// Assim quem chama a função sabe exatamente o que aconteceu.
// status 0 = não houve resposta (falha de rede).
export class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.status = status
  }
}

// Mensagem padrão para cada código HTTP, caso a API não envie uma
function mensagemPorStatus(status) {
  if (status === 401) return 'Sessão expirada. Faça login novamente.' // não autenticado
  if (status === 403) return 'Você não tem permissão para esta operação.' // sem permissão
  if (status === 404) return 'Recurso não encontrado.'
  return 'Erro inesperado no servidor.'
}

// caminho -> parte final da URL, ex.: '/auth/login'
// metodo  -> 'GET', 'POST', 'PUT'... (padrão GET)
// corpo   -> objeto a ser enviado (será convertido em JSON)
// token   -> se informado, vai no cabeçalho Authorization
export async function requisicao(caminho, { metodo = 'GET', corpo, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  // Padrão de autenticação por token: "Authorization: Bearer <token>"
  if (token) headers.Authorization = `Bearer ${token}`

  let resposta
  try {
    // fetch faz a requisição HTTP. await espera a resposta chegar.
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    // O fetch só cai no catch quando NÃO há resposta (sem internet, servidor fora do ar)
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua internet.', 0)
  }

  // Converte o corpo da resposta de JSON para objeto.
  // .catch(() => null): se a resposta não for JSON, usa null em vez de quebrar.
  const dados = await resposta.json().catch(() => null)

  // ATENÇÃO: respostas 400, 401, 403, 404, 500 NÃO caem no catch do fetch.
  // Por isso conferimos resposta.ok (true só para status 200 a 299).
  if (!resposta.ok) {
    throw new ApiError(dados?.message || mensagemPorStatus(resposta.status), resposta.status)
  }

  return dados
}
