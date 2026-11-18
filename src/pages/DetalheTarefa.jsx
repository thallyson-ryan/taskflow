// =============================================================================
// DetalheTarefa.jsx — DETALHE DA TAREFA (rota "/tarefas/:id", protegida)
// Mostra os dados de uma tarefa e permite:
//   - marcar como concluída / pendente
//   - editar (reutilizando o FormTarefa)
//   - excluir (com confirmação)
// =============================================================================

import { useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import FormTarefa from '../components/FormTarefa'
import formatarData from '../utils/formatarData'
import '../styles/form.css'

const rotulos = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

export default function DetalheTarefa({ tarefas, setTarefas, status }) {
  // useParams lê o parâmetro :id da URL. Ex.: /tarefas/5 -> id = "5" (TEXTO)
  const { id } = useParams()
  const navigate = useNavigate()
  // useLocation permite ler o "state" enviado na navegação (mensagem de sucesso do cadastro)
  const location = useLocation()

  const [editando, setEditando] = useState(false) // true = mostra o formulário de edição
  const [confirmando, setConfirmando] = useState(false) // true = mostra a confirmação de exclusão
  // Mensagem verde de resultado. Começa com a mensagem do cadastro, se houver.
  // O "?." (optional chaining) evita erro quando state não existe.
  const [mensagem, setMensagem] = useState(location.state?.mensagem || '')

  // Procura a tarefa pelo id. Number(id) converte o texto da URL em número.
  const tarefa = tarefas.find((t) => t.id === Number(id))

  // Enquanto as tarefas carregam (ex.: acesso direto pela URL), mostra aviso
  if (status === 'ocioso' || status === 'carregando') {
    return <p className="aviso">Carregando tarefa...</p>
  }

  // id inexistente (ex.: /tarefas/99999 ou tarefa já excluída)
  if (!tarefa) {
    return (
      <section>
        <h1>Tarefa não encontrada</h1>
        <Link to="/tarefas" className="botao">Voltar para a lista</Link>
      </section>
    )
  }

  // AÇÃO 1: alterna entre concluída e pendente.
  // map cria um NOVO array: troca só a tarefa com o mesmo id, as outras ficam iguais.
  function alternarConclusao() {
    setTarefas((prev) => prev.map((t) => (t.id === tarefa.id ? { ...t, concluida: !t.concluida } : t)))
    setMensagem(tarefa.concluida ? 'Tarefa marcada como pendente.' : 'Tarefa concluída!')
  }

  // AÇÃO 2: salva a edição. { ...t, ...dados } mantém os campos antigos e sobrescreve os editados.
  function salvarEdicao(dados) {
    setTarefas((prev) => prev.map((t) => (t.id === tarefa.id ? { ...t, ...dados } : t)))
    setEditando(false)
    setMensagem('Alterações salvas.')
  }

  // AÇÃO 3: exclui. filter cria um NOVO array sem a tarefa com esse id.
  function excluir() {
    setTarefas((prev) => prev.filter((t) => t.id !== tarefa.id))
    navigate('/tarefas') // volta para a lista
  }

  // Modo edição: mostra o FormTarefa preenchido com os dados atuais
  if (editando) {
    return (
      <section>
        <h1>Editar tarefa</h1>
        <FormTarefa valoresIniciais={tarefa} onSalvar={salvarEdicao} onCancelar={() => setEditando(false)} />
      </section>
    )
  }

  // Modo visualização
  return (
    <section>
      {/* Mensagem de resultado da ação (sucesso) */}
      {mensagem && <p className="sucesso">{mensagem}</p>}

      <div className="detalhe">
        <h1>{tarefa.titulo}</h1>
        <p>{tarefa.descricao || 'Sem descrição.'}</p>
        <p>Prioridade: {rotulos[tarefa.prioridade]}</p>
        <p>Prazo: {formatarData(tarefa.prazo)}</p>
        <p>Status: {tarefa.concluida ? 'Concluída' : 'Pendente'}</p>
        {/* Deixa claro se a tarefa veio da API (remota) ou foi criada no navegador (local) */}
        <p>Origem: {tarefa.origem === 'api' ? 'API DummyJSON' : 'Criada neste navegador'}</p>

        <div className="acoes">
          <button className="botao" onClick={alternarConclusao}>
            {tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
          </button>
          <button className="botao secundario" onClick={() => setEditando(true)}>Editar</button>
          {/* Excluir não apaga direto: primeiro pede confirmação */}
          <button className="botao perigo" onClick={() => setConfirmando(true)}>Excluir</button>
        </div>

        {/* Caixa de confirmação, só aparece depois de clicar em Excluir */}
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
