// =============================================================================
// useTarefas.js — HOOK PERSONALIZADO DAS TAREFAS (AV2)
// Um "hook personalizado" é uma função que usa outros hooks (useState,
// useEffect...) e pode ser reutilizada. Este concentra toda a lógica de dados:
//   - buscar as tarefas do usuário na API
//   - controlar os estados: carregando, sucesso, erro
//   - salvar as alterações no navegador (cache por usuário)
//   - carregar os dados de contingência quando a API falha
// =============================================================================

import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listarTarefasDoUsuario } from '../services/tarefasService'
import tarefasContingencia from '../data/tarefas.json' // dados locais com a mesma estrutura

// Lê as tarefas salvas no navegador (ou null se não houver)
function lerCache(chave) {
  try {
    const salvas = localStorage.getItem(chave)
    return salvas ? JSON.parse(salvas) : null
  } catch {
    return null
  }
}

// Salva as tarefas no navegador (localStorage só guarda texto -> JSON.stringify)
function salvarCache(chave, tarefas) {
  try {
    localStorage.setItem(chave, JSON.stringify(tarefas))
  } catch {
    // armazenamento bloqueado: segue só na memória
  }
}

export default function useTarefas() {
  const { usuario, token, expirarSessao } = useAuth()

  // Cada usuário tem sua própria chave: taskflow:tarefas:1, taskflow:tarefas:2...
  // Se ninguém estiver logado, a chave é null.
  const chave = usuario ? `taskflow:tarefas:${usuario.id}` : null

  const [tarefas, setTarefasEstado] = useState([])
  const [status, setStatus] = useState('ocioso') // ocioso | carregando | sucesso | erro
  const [erro, setErro] = useState('') // mensagem de erro para mostrar na tela
  const [origem, setOrigem] = useState('') // api | cache | contingencia

  // BUSCA NA API — usada no carregamento inicial, no "Tentar novamente"
  // e no "Recarregar da API"
  async function carregarDaApi() {
    if (!usuario) return
    setStatus('carregando') // a tela mostra o spinner
    setErro('')
    try {
      const lista = await listarTarefasDoUsuario(usuario.id, token) // GET /todos/user/{id}
      setTarefasEstado(lista)
      salvarCache(chave, lista)
      setOrigem('api')
      setStatus('sucesso') // a tela mostra a lista
    } catch (e) {
      // TRATAMENTO DE 401/403: sessão inválida -> desloga e volta para o login
      if (e.status === 401 || e.status === 403) {
        expirarSessao()
        return
      }
      // Qualquer outro erro (ex.: sem internet): a tela mostra a mensagem + "Tentar novamente"
      setErro(e.message)
      setStatus('erro')
    }
  }

  // CONTINGÊNCIA: usa os dados locais (src/data/tarefas.json) quando a API falha
  function usarContingencia() {
    setTarefasEstado(tarefasContingencia)
    setOrigem('contingencia')
    setErro('')
    setStatus('sucesso')
  }

  // Substitui o setState comum: além de atualizar a tela, salva no navegador.
  // Motivo: a DummyJSON SIMULA criar/editar/excluir, mas NÃO salva nada.
  // "atualizar" pode ser um valor ou uma função (prev) => novo valor.
  function setTarefas(atualizar) {
    setTarefasEstado((prev) => {
      const novas = typeof atualizar === 'function' ? atualizar(prev) : atualizar
      // Em modo de contingência as alterações não são salvas (são dados de demonstração)
      if (chave && origem !== 'contingencia') salvarCache(chave, novas)
      return novas
    })
  }

  // CARREGAMENTO INICIAL
  // useEffect roda quando "chave" muda: ao fazer login, logout ou trocar de usuário.
  useEffect(() => {
    // Ninguém logado: limpa tudo
    if (!chave) {
      setTarefasEstado([])
      setStatus('ocioso')
      setOrigem('')
      return
    }
    // Já existem tarefas salvas no navegador para esse usuário? Usa elas.
    const salvas = lerCache(chave)
    if (salvas) {
      setTarefasEstado(salvas)
      setOrigem('cache')
      setStatus('sucesso')
    } else {
      // Primeira vez desse usuário: busca na API
      carregarDaApi()
    }
    // A linha abaixo desliga um aviso do ESLint: queremos rodar só quando a chave mudar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave])

  // Tudo o que o App.jsx e as páginas precisam
  return { tarefas, setTarefas, status, erro, origem, carregarDaApi, usarContingencia }
}
