import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/form.css'

export default function Login() {
  const { sessao, entrar, aviso } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [valores, setValores] = useState({ username: '', password: '' })
  const [erros, setErros] = useState({})
  const [erroLogin, setErroLogin] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (sessao) return <Navigate to="/tarefas" replace />

  function alterar(e) {
    const { name, value } = e.target
    setValores((v) => ({ ...v, [name]: value }))
  }

  function preencherDemo() {
    setValores({ username: 'emilys', password: 'emilyspass' })
    setErros({})
  }

  async function enviar(e) {
    e.preventDefault()
    const novos = {}
    if (!valores.username.trim()) novos.username = 'Informe o usuário.'
    if (!valores.password) novos.password = 'Informe a senha.'
    setErros(novos)
    setErroLogin('')
    if (Object.keys(novos).length > 0) return

    setEnviando(true)
    try {
      await entrar(valores.username.trim(), valores.password)
      navigate(location.state?.de || '/tarefas', { replace: true })
    } catch (erro) {
      if (erro.status === 400 || erro.status === 401) setErroLogin('Usuário ou senha inválidos.')
      else setErroLogin(erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="login">
      <h1>Entrar</h1>
      {aviso && <p className="aviso">{aviso}</p>}
      {erroLogin && <p className="erro-caixa">{erroLogin}</p>}

      <form className="form" onSubmit={enviar} noValidate>
        <div className={`campo ${erros.username ? 'invalido' : ''}`}>
          <label htmlFor="username">Usuário</label>
          <input id="username" name="username" autoComplete="username" value={valores.username} onChange={alterar} />
          {erros.username && <p className="erro">{erros.username}</p>}
        </div>

        <div className={`campo ${erros.password ? 'invalido' : ''}`}>
          <label htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" autoComplete="current-password" value={valores.password} onChange={alterar} />
          {erros.password && <p className="erro">{erros.password}</p>}
        </div>

        <button type="submit" className="botao" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="demo">
        <p>Credenciais de demonstração (DummyJSON):</p>
        <p>Usuário: emilys • Senha: emilyspass</p>
        <button type="button" className="botao secundario" onClick={preencherDemo}>Preencher automaticamente</button>
      </div>
    </section>
  )
}