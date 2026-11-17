export default function ListaTarefas({ tarefas }) {
  return (
    <section>
      <h1>Tarefas</h1>
      <ul>
        {tarefas.map((t) => <li key={t.id}>{t.titulo}</li>)}
      </ul>
    </section>
  )
}