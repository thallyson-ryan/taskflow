import { requisicao } from './api'

// Converte o formato da DummyJSON ({ id, todo, completed, userId }) para o formato usado na interface
function adaptarTarefa(todo) {
  return {
    id: todo.id,
    titulo: todo.todo,
    descricao: '',
    prioridade: 'media',
    prazo: '',
    concluida: todo.completed,
    origem: 'api',
  }
}

export async function listarTarefasDoUsuario(userId, token) {
  const dados = await requisicao(`/todos/user/${userId}`, { token })
  return dados.todos.map(adaptarTarefa)
}