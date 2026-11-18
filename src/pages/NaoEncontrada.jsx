// =============================================================================
// NaoEncontrada.jsx — PÁGINA 404
// Aparece quando a URL não combina com nenhuma rota (rota path="*" no App.jsx).
// Ex.: /abc, /tarefa, /tarefas/nova/teste
// =============================================================================

import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section>
      <h1>Página não encontrada</h1>
      {/* Oferece um caminho de volta, sem o usuário precisar digitar endereço */}
      <Link to="/" className="botao">Voltar ao início</Link>
    </section>
  )
}
