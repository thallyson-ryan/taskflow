// =============================================================================
// NovaTarefa.jsx — CADASTRO DE TAREFA (rota "/tarefas/nova", protegida)
// Usa o FormTarefa (reutilizável) e, ao salvar, adiciona a tarefa na lista.
// =============================================================================

import { useNavigate } from 'react-router-dom'
import FormTarefa from '../components/FormTarefa'
import '../styles/form.css'

// setTarefas vem do App.jsx (hook useTarefas) e altera a lista de tarefas
export default function NovaTarefa({ setTarefas }) {
  const navigate = useNavigate()

  // Chamada pelo FormTarefa somente quando todos os campos estão válidos
  function salvar(dados) {
    // Monta a nova tarefa:
    //   id: Date.now() gera um número único (milissegundos desde 1970)
    //   concluida: toda tarefa nova começa pendente
    //   origem: 'local' indica que foi criada no navegador (não veio da API)
    const nova = { ...dados, id: Date.now(), concluida: false, origem: 'local' }

    // Adiciona sem alterar o array original: cria um NOVO array com as antigas + a nova
    setTarefas((prev) => [...prev, nova])

    // Vai para o detalhe da tarefa criada, levando uma mensagem de sucesso no "state"
    navigate(`/tarefas/${nova.id}`, { state: { mensagem: 'Tarefa cadastrada com sucesso!' } })
  }

  return (
    <section>
      <h1>Nova tarefa</h1>
      <FormTarefa onSalvar={salvar} onCancelar={() => navigate('/tarefas')} textoBotao="Cadastrar" />
    </section>
  )
}
