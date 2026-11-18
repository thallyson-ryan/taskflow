// =============================================================================
// useLocalStorage.js — HOOK DA AV1 (persistência no localStorage)
// Funciona como um useState que também salva o valor no navegador.
// Na AV1 era usado no App.jsx para guardar as tarefas.
// Na AV2 foi substituído pelo useTarefas (que salva por usuário), mas o
// arquivo foi mantido como registro da evolução do projeto.
// =============================================================================

import { useState, useEffect } from 'react'

// chave        -> nome usado no localStorage (ex.: 'taskflow:tarefas')
// valorInicial -> valor usado quando ainda não há nada salvo
export default function useLocalStorage(chave, valorInicial) {
  // Na primeira renderização: tenta ler o que está salvo; se não houver, usa o valor inicial
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo ? JSON.parse(salvo) : valorInicial // texto -> objeto/array
    } catch {
      return valorInicial
    }
  })

  // Sempre que o valor mudar, grava no localStorage (objeto/array -> texto)
  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      // se o navegador bloquear o armazenamento, o app continua funcionando só na memória
    }
  }, [chave, valor])

  // Mesmo formato do useState: [valor, funçãoParaAlterar]
  return [valor, setValor]
}
