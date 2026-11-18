// =============================================================================
// Login.jsx — PÁGINA DE LOGIN (rota "/login", pública)
// Formulário controlado com validação, feedback de erro (credenciais inválidas
// ou falha de rede) e credenciais de demonstração da DummyJSON.
// =============================================================================

import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/form.css'

export default function Login() {
  // sessao: se já existe, o usuário está logado
  // entrar: função que faz o login na API
  // aviso: mensagem como "Sua sessão expirou" (vinda do AuthContext)
  const { sessao, entrar, aviso } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Estado do formulário (controlado)
  const [valores, setValores] = useState({ username: '', password: '' })
  // Erros de validação de cada campo
  const [erros, setErros] = useState({})
  // Erro retornado pela API (senha errada, sem internet...)
  const [erroLogin, setErroLogin] = useState('')
  // true enquanto a requisição de login está em andamento (desabilita o botão)
  const [enviando, setEnviando] = useState(false)

  // Se já está logado, não faz sentido ver o login: vai direto para /tarefas.
  // (Todos os hooks precisam ser chamados ANTES de qualquer return.)
  if (sessao) return <Navigate to="/tarefas" replace />

  // Atualiza o campo alterado, usando o atributo "name" do input
  function alterar(e) {
    const { name, value } = e.target
    setValores((v) => ({ ...v, [name]: value }))
  }

  // Botão "Preencher automaticamente": coloca as credenciais de demonstração
  function preencherDemo() {
    setValores({ username: 'emilys', password: 'emilyspass' })
    setErros({})
  }

  // async: a função espera (await) a resposta da API sem travar a tela
  async function enviar(e) {
    e.preventDefault() // impede o recarregamento da página

    // 1) Validação dos campos obrigatórios
    const novos = {}
    if (!valores.username.trim()) novos.username = 'Informe o usuário.'
    if (!valores.password) novos.password = 'Informe a senha.'
    setErros(novos)
    setErroLogin('')
    if (Object.keys(novos).length > 0) return // tem erro: para aqui

    // 2) Chamada à API
    setEnviando(true)
    try {
      await entrar(valores.username.trim(), valores.password)
      // Volta para a página que o usuário tentou acessar antes (guardada pela RotaProtegida)
      // ou, se não houver, vai para /tarefas
      navigate(location.state?.de || '/tarefas', { replace: true })
    } catch (erro) {
      // 3) Tratamento de erro
      // A DummyJSON responde 400 quando usuário/senha estão errados
      if (erro.status === 400 || erro.status === 401) setErroLogin('Usuário ou senha inválidos.')
      // Outros erros (ex.: sem internet) já vêm com mensagem pronta do api.js
      else setErroLogin(erro.message)
    } finally {
      // finally roda sempre, dando certo ou errado
      setEnviando(false)
    }
  }

  return (
    <section className="login">
      <h1>Entrar</h1>

      {/* Aviso de sessão expirada (401) */}
      {aviso && <p className="aviso">{aviso}</p>}
      {/* Erro do login (credenciais inválidas ou falha de rede) */}
      {erroLogin && <p className="erro-caixa">{erroLogin}</p>}

      <form className="form" onSubmit={enviar} noValidate>
        <div className={`campo ${erros.username ? 'invalido' : ''}`}>
          <label htmlFor="username">Usuário</label>
          <input id="username" name="username" autoComplete="username" value={valores.username} onChange={alterar} />
          {erros.username && <p className="erro">{erros.username}</p>}
        </div>

        <div className={`campo ${erros.password ? 'invalido' : ''}`}>
          <label htmlFor="password">Senha</label>
          {/* type="password" esconde os caracteres digitados */}
          <input id="password" name="password" type="password" autoComplete="current-password" value={valores.password} onChange={alterar} />
          {erros.password && <p className="erro">{erros.password}</p>}
        </div>

        {/* disabled evita cliques repetidos enquanto a requisição está em andamento */}
        <button type="submit" className="botao" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Exigência da Opção A: informar as credenciais de demonstração na interface */}
      <div className="demo">
        <p>Credenciais de demonstração (DummyJSON):</p>
        <p>Usuário: emilys • Senha: emilyspass</p>
        <button type="button" className="botao secundario" onClick={preencherDemo}>Preencher automaticamente</button>
      </div>
    </section>
  )
}
