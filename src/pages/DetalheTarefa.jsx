import { useParams } from 'react-router-dom'

export default function DetalheTarefa({ tarefas }) {
  const { id } = useParams()
  const tarefa = tarefas.find((t) => t.id === Number(id))
  if (!tarefa) return <p>Tarefa não encontrada.</p>
  return <section><h1>{tarefa.titulo}</h1></section>
}