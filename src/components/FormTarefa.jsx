// =============================================================================
// FormTarefa.jsx — FORMULÁRIO DE TAREFA (CADASTRO E EDIÇÃO)
// Formulário CONTROLADO e REUTILIZÁVEL:
//   - no cadastro (NovaTarefa) começa vazio
//   - na edição (DetalheTarefa) recebe os dados atuais em "valoresIniciais"
// Valida os campos obrigatórios antes de chamar onSalvar.
// =============================================================================

import { useState } from 'react'

// Valores usados quando o formulário começa em branco (cadastro)
const vazio = { titulo: '', descricao: '', prioridade: '', prazo: '' }

// Props:
//   valoresIniciais -> dados para preencher o formulário (padrão: vazio)
//   onSalvar        -> função chamada com os dados quando tudo estiver válido
//   onCancelar      -> função do botão "Cancelar" (opcional)
//   textoBotao      -> texto do botão de enviar (padrão: "Salvar")
export default function FormTarefa({ valoresIniciais = vazio, onSalvar, onCancelar, textoBotao = 'Salvar' }) {
  // UM único estado guarda todos os campos do formulário
  const [valores, setValores] = useState(valoresIniciais)

  // Guarda as mensagens de erro de cada campo. Ex.: { titulo: 'Informe...' }
  const [erros, setErros] = useState({})

  // Chamada a cada alteração em qualquer campo.
  // Usa o atributo "name" do input para saber QUAL campo mudou.
  function alterar(e) {
    const { name, value } = e.target
    // ...v copia todos os campos atuais; [name]: value troca só o campo alterado
    setValores((v) => ({ ...v, [name]: value }))
  }

  // Regras de validação. Retorna um objeto com os erros encontrados.
  // Se o objeto voltar vazio ({}), o formulário está válido.
  function validar() {
    const novos = {}
    if (valores.titulo.trim().length < 3) novos.titulo = 'Informe um título com pelo menos 3 caracteres.'
    if (!valores.prioridade) novos.prioridade = 'Escolha a prioridade.'
    if (!valores.prazo) novos.prazo = 'Informe o prazo.'
    return novos
  }

  // Executada ao enviar o formulário (botão submit ou Enter)
  function enviar(e) {
    e.preventDefault() // impede o comportamento padrão do navegador (recarregar a página)
    const novos = validar()
    setErros(novos) // mostra (ou limpa) as mensagens de erro na tela
    // Object.keys(novos).length === 0 -> não há erros
    if (Object.keys(novos).length === 0) {
      // trim() remove espaços extras do começo e do fim
      onSalvar({ ...valores, titulo: valores.titulo.trim(), descricao: valores.descricao.trim() })
    }
  }

  return (
    // noValidate desliga a validação automática do navegador (usamos a nossa, com mensagens próprias)
    <form className="form" onSubmit={enviar} noValidate>

      {/* Campo TÍTULO — recebe a classe "invalido" (borda vermelha) se houver erro */}
      <div className={`campo ${erros.titulo ? 'invalido' : ''}`}>
        <label htmlFor="titulo">Título *</label>
        <input id="titulo" name="titulo" value={valores.titulo} onChange={alterar} />
        {/* Só mostra o <p> se existir erro para esse campo */}
        {erros.titulo && <p className="erro">{erros.titulo}</p>}
      </div>

      {/* Campo DESCRIÇÃO — opcional, sem validação */}
      <div className="campo">
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" rows="3" value={valores.descricao} onChange={alterar} />
      </div>

      {/* Campo PRIORIDADE */}
      <div className={`campo ${erros.prioridade ? 'invalido' : ''}`}>
        <label htmlFor="prioridade">Prioridade *</label>
        <select id="prioridade" name="prioridade" value={valores.prioridade} onChange={alterar}>
          <option value="">Selecione...</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        {erros.prioridade && <p className="erro">{erros.prioridade}</p>}
      </div>

      {/* Campo PRAZO — type="date" mostra um calendário e salva no formato AAAA-MM-DD */}
      <div className={`campo ${erros.prazo ? 'invalido' : ''}`}>
        <label htmlFor="prazo">Prazo *</label>
        <input id="prazo" name="prazo" type="date" value={valores.prazo} onChange={alterar} />
        {erros.prazo && <p className="erro">{erros.prazo}</p>}
      </div>

      <div className="acoes">
        <button type="submit" className="botao">{textoBotao}</button>
        {/* O botão Cancelar só aparece se a prop onCancelar foi enviada.
            type="button" evita que ele envie o formulário. */}
        {onCancelar && <button type="button" className="botao secundario" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}
