// =============================================================================
// AuthContext.jsx — AUTENTICAÇÃO (LOGIN, SESSÃO, LOGOUT E 401/403)
// Usa a Context API do React: deixa a sessão disponível para QUALQUER
// componente sem precisar passar props por todos os níveis.
//   - AuthProvider envolve o App (ver main.jsx)
//   - qualquer componente usa: const { usuario, entrar, sair } = useAuth()
// =============================================================================

import { createContext, useContext, useEffect, useState } from 'react'
import { login, buscarUsuarioAtual } from '../services/authService'

// Cria o "canal" por onde os dados de autenticação serão compartilhados
const AuthContext = createContext(null)

// Nome da chave usada no localStorage para guardar a sessão
const CHAVE = 'taskflow:sessao'

// Lê a sessão salva no navegador. Se não houver ou estiver corrompida, devolve null.
// try/catch: JSON.parse dá erro se o texto salvo não for um JSON válido.
function lerSessao() {
  try {
    const salva = localStorage.getItem(CHAVE)
    return salva ? JSON.parse(salva) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // sessao = { token, usuario: { id, username, nome, imagem } } ou null (deslogado)
  // useState(lerSessao): passa a FUNÇÃO, que só roda na primeira renderização
  const [sessao, setSessao] = useState(lerSessao)

  // true enquanto o app confere na API se o token salvo ainda é válido.
  // Só começa como true se existir sessão salva.
  const [verificando, setVerificando] = useState(() => lerSessao() !== null)

  // Mensagem exibida na tela de login (ex.: "Sua sessão expirou")
  const [aviso, setAviso] = useState('')

  // Atualiza a sessão no ESTADO (tela) e no LOCALSTORAGE (sobrevive ao F5).
  // Se "nova" for null, remove a sessão (logout).
  function salvarSessao(nova) {
    setSessao(nova)
    try {
      if (nova) localStorage.setItem(CHAVE, JSON.stringify(nova))
      else localStorage.removeItem(CHAVE)
    } catch {
      // armazenamento bloqueado: a sessão vale só enquanto a aba estiver aberta
    }
  }

  // RESTAURAÇÃO DA SESSÃO
  // useEffect com [] roda UMA vez, quando o app abre (ou após F5).
  // Confere o token salvo chamando GET /auth/me.
  useEffect(() => {
    const atual = lerSessao()
    if (!atual) return // ninguém logado: nada a conferir

    buscarUsuarioAtual(atual.token)
      .catch((erro) => {
        // TRATAMENTO DE 401/403: token inválido ou expirado -> encerra a sessão
        if (erro.status === 401 || erro.status === 403) {
          salvarSessao(null)
          setAviso('Sua sessão expirou. Faça login novamente.')
        }
        // Outros erros (ex.: sem internet) mantêm a sessão para o app seguir funcionando
      })
      .finally(() => setVerificando(false)) // terminou a verificação, dando certo ou não
  }, [])

  // LOGIN: chama a API e, se der certo, salva a sessão.
  // Se der errado, o erro "sobe" para quem chamou (a página Login trata a mensagem).
  async function entrar(username, password) {
    const dados = await login(username, password) // POST /auth/login
    salvarSessao({
      token: dados.accessToken, // token usado nas próximas requisições
      usuario: {
        id: dados.id,
        username: dados.username,
        nome: `${dados.firstName} ${dados.lastName}`,
        imagem: dados.image,
      },
      // IMPORTANTE: a senha NUNCA é salva
    })
    setAviso('')
  }

  // LOGOUT: remove a sessão do estado e do localStorage
  function sair() {
    salvarSessao(null)
  }

  // Usado por outras partes do app (ex.: useTarefas) quando a API responde 401/403
  function expirarSessao() {
    salvarSessao(null)
    setAviso('Sua sessão expirou. Faça login novamente.')
  }

  // Tudo o que estiver em "value" fica disponível para os componentes via useAuth()
  // sessao?.usuario -> o "?." evita erro quando sessao é null
  return (
    <AuthContext.Provider
      value={{ sessao, usuario: sessao?.usuario, token: sessao?.token, verificando, aviso, entrar, sair, expirarSessao }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Atalho para os componentes acessarem o contexto: const { usuario } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
