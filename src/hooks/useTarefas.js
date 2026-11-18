import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarTarefasDoUsuario } from '../services/tarefasService'
import tarefasContingencia from '../data/tarefas.json'

function lerCache(chave) {
  try {
    const salvas = localStorage.getItem(chave)
    return salvas ? JSON.parse(salvas) : null
  } catch {
    return null
  }
}

function salvarCache(chave, tarefas) {
  try {
    localStorage.setItem(chave, JSON.stringify(tarefas))
  } catch {
    // armazenamento bloqueado: segue só na memória
  }
}

export default function useTarefas() {
  const { usuario, token, expirarSessao } = useAuth()
  const chave = usuario ? `taskflow:tarefas:${usuario.id}` : null

  const [tarefas, setTarefasEstado] = useState([])
  const [status, setStatus] = useState('ocioso') // ocioso | carregando | sucesso | erro
  const [erro, setErro] = useState('')
  const [origem, setOrigem] = useState('') // api | cache | contingencia

  async function carregarDaApi() {
    if (!usuario) return
    setStatus('carregando')
    setErro('')
    try {
      const lista = await listarTarefasDoUsuario(usuario.id, token)
      setTarefasEstado(lista)
      salvarCache(chave, lista)
      setOrigem('api')
      setStatus('sucesso')
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        expirarSessao()
        return
      }
      setErro(e.message)
      setStatus('erro')
    }
  }

  function usarContingencia() {
    setTarefasEstado(tarefasContingencia)
    setOrigem('contingencia')
    setErro('')
    setStatus('sucesso')
  }

  // Criar, editar e excluir ficam salvos no navegador (a DummyJSON não persiste alterações)
  function setTarefas(atualizar) {
    setTarefasEstado((prev) => {
      const novas = typeof atualizar === 'function' ? atualizar(prev) : atualizar
      if (chave && origem !== 'contingencia') salvarCache(chave, novas)
      return novas
    })
  }

  // Ao entrar com um usuário: usa o que está salvo no navegador ou busca na API
  useEffect(() => {
    if (!chave) {
      setTarefasEstado([])
      setStatus('ocioso')
      setOrigem('')
      return
    }
    const salvas = lerCache(chave)
    if (salvas) {
      setTarefasEstado(salvas)
      setOrigem('cache')
      setStatus('sucesso')
    } else {
      carregarDaApi()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])

  return { tarefas, setTarefas, status, erro, origem, carregarDaApi, usarContingencia }
}