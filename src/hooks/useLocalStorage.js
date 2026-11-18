import { useState, useEffect } from 'react'

export default function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo ? JSON.parse(salvo) : valorInicial
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      // se o navegador bloquear o armazenamento, o app continua funcionando só na memória
    }
  }, [chave, valor])

  return [valor, setValor]
}