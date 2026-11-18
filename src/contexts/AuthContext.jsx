import { createContext, useContext, useEffect, useState } from 'react'
import { login, buscarUsuarioAtual } from '../services/authService'

const AuthContext = createContext(null)
const CHAVE = 'taskflow:sessao'

function lerSessao() {
  try {
    const salva = localStorage.getItem(CHAVE)
    return salva ? JSON.parse(salva) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessao)
  const [verificando, setVerificando] = useState(() => lerSessao() !== null)
  const [aviso, setAviso] = useState('')

  function salvarSessao(nova) {
    setSessao(nova)
    try {
      if (nova) localStorage.setItem(CHAVE, JSON.stringify(nova))
      else localStorage.removeItem(CHAVE)
    } catch {
      // armazenamento bloqueado: a sessão vale só enquanto a aba estiver aberta
    }
  }

  // Ao abrir ou atualizar a página, confere se o token salvo ainda é válido
  useEffect(() => {
    const atual = lerSessao()
    if (!atual) return
    buscarUsuarioAtual(atual.token)
      .catch((erro) => {
        if (erro.status === 401 || erro.status === 403) {
          salvarSessao(null)
          setAviso('Sua sessão expirou. Faça login novamente.')
        }
      })
      .finally(() => setVerificando(false))
  }, [])

  async function entrar(username, password) {
    const dados = await login(username, password)
    salvarSessao({
      token: dados.accessToken,
      usuario: {
        id: dados.id,
        username: dados.username,
        nome: `${dados.firstName} ${dados.lastName}`,
        imagem: dados.image,
      },
    })
    setAviso('')
  }

  function sair() {
    salvarSessao(null)
  }

  function expirarSessao() {
    salvarSessao(null)
    setAviso('Sua sessão expirou. Faça login novamente.')
  }

  return (
    <AuthContext.Provider
      value={{ sessao, usuario: sessao?.usuario, token: sessao?.token, verificando, aviso, entrar, sair, expirarSessao }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}