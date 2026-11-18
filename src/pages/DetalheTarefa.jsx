import { useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import FormTarefa from '../components/FormTarefa'
import '../styles/form.css'

const rotulos = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export default function DetalheTarefa({ tarefas, setTarefas }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [editando, setEditando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [mensagem, setMensagem] = useState(location.state?.mensagem || '')

  const tarefa = tarefas.find((t) => t.id === Number(id))

  if (!tarefa) {
    return (
      <section>
        <h1>Tarefa não encontrada</h1>
        <Link to="/tarefas" className="botao">Voltar para a lista</Link>
      </section>
    )
  }

  function alternarConclusao() {
    setTarefas((prev) => prev.map((t) => (t.id === tarefa.id ? { ...t, concluida: !t.concluida } : t)))
    setMensagem(tarefa.concluida ? 'Tarefa marcada como pendente.' : 'Tarefa concluída!')
  }

  function salvarEdicao(dados) {
    setTarefas((prev) => prev.map((t) => (t.id === tarefa.id ? { ...t, ...dados } : t)))
    setEditando(false)
    setMensagem('Alterações salvas.')
  }

  function excluir() {
    setTarefas((prev) => prev.filter((t) => t.id !== tarefa.id))
    navigate('/tarefas')
  }

  if (editando) {
    return (
      <section>
        <h1>Editar tarefa</h1>
        <FormTarefa valoresIniciais={tarefa} onSalvar={salvarEdicao} onCancelar={() => setEditando(false)} />
      </section>
    )
  }

  return (
    <section>
      {mensagem && <p className="sucesso">{mensagem}</p>}
      <div className="detalhe">
        <h1>{tarefa.titulo}</h1>
        <p>{tarefa.descricao || 'Sem descrição.'}</p>
        <p>Prioridade: {rotulos[tarefa.prioridade]}</p>
        <p>Prazo: {formatarData(tarefa.prazo)}</p>
        <p>Status: {tarefa.concluida ? 'Concluída' : 'Pendente'}</p>

        <div className="acoes">
          <button className="botao" onClick={alternarConclusao}>
            {tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
          </button>
          <button className="botao secundario" onClick={() => setEditando(true)}>Editar</button>
          <button className="botao perigo" onClick={() => setConfirmando(true)}>Excluir</button>
        </div>

        {confirmando && (
          <div className="confirmacao">
            <p>Tem certeza que deseja excluir esta tarefa?</p>
            <div className="acoes">
              <button className="botao perigo" onClick={excluir}>Sim, excluir</button>
              <button className="botao secundario" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
      <p><Link to="/tarefas">← Voltar para a lista</Link></p>
    </section>
  )
}