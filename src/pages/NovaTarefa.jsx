import { useNavigate } from 'react-router-dom'
import FormTarefa from '../components/FormTarefa'
import '../styles/form.css'

export default function NovaTarefa({ setTarefas }) {
  const navigate = useNavigate()

  function salvar(dados) {
    const nova = { ...dados, id: Date.now(), concluida: false, origem: 'local' }
    setTarefas((prev) => [...prev, nova])
    navigate(`/tarefas/${nova.id}`, { state: { mensagem: 'Tarefa cadastrada com sucesso!' } })
  }

  return (
    <section>
      <h1>Nova tarefa</h1>
      <FormTarefa onSalvar={salvar} onCancelar={() => navigate('/tarefas')} textoBotao="Cadastrar" />
    </section>
  )
}