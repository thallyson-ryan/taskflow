// =============================================================================
// tarefasService.js — CHAMADAS DE TAREFAS (DummyJSON)
// Busca as tarefas na API e converte para o formato usado pela interface.
// =============================================================================

import { requisicao } from './api'

// ADAPTADOR: a DummyJSON devolve { id, todo, completed, userId },
// mas a interface (desde a AV1) usa { titulo, concluida, prioridade, prazo... }.
// Esta função converte um formato no outro, por isso nenhuma tela precisou mudar.
function adaptarTarefa(todo) {
  return {
    id: todo.id,
    titulo: todo.todo, // todo -> titulo
    descricao: '', // a API não tem descrição
    prioridade: 'media', // a API não tem prioridade: valor padrão
    prazo: '', // a API não tem prazo: fica "Sem prazo"
    concluida: todo.completed, // completed -> concluida
    origem: 'api', // marca que veio da API (remoto)
  }
}

// LISTAR TAREFAS DO USUÁRIO — GET /todos/user/{id}
// A resposta vem no formato { todos: [...], total, skip, limit }.
// map aplica o adaptador em cada item da lista.
export async function listarTarefasDoUsuario(userId, token) {
  const dados = await requisicao(`/todos/user/${userId}`, { token })
  return dados.todos.map(adaptarTarefa)
}
