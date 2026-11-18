import { useState } from 'react'

const vazio = { titulo: '', descricao: '', prioridade: '', prazo: '' }

export default function FormTarefa({ valoresIniciais = vazio, onSalvar, onCancelar, textoBotao = 'Salvar' }) {
  const [valores, setValores] = useState(valoresIniciais)
  const [erros, setErros] = useState({})

  function alterar(e) {
    const { name, value } = e.target
    setValores((v) => ({ ...v, [name]: value }))
  }

  function validar() {
    const novos = {}
    if (valores.titulo.trim().length < 3) novos.titulo = 'Informe um título com pelo menos 3 caracteres.'
    if (!valores.prioridade) novos.prioridade = 'Escolha a prioridade.'
    if (!valores.prazo) novos.prazo = 'Informe o prazo.'
    return novos
  }

  function enviar(e) {
    e.preventDefault()
    const novos = validar()
    setErros(novos)
    if (Object.keys(novos).length === 0) {
      onSalvar({ ...valores, titulo: valores.titulo.trim(), descricao: valores.descricao.trim() })
    }
  }

  return (
    <form className="form" onSubmit={enviar} noValidate>
      <div className={`campo ${erros.titulo ? 'invalido' : ''}`}>
        <label htmlFor="titulo">Título *</label>
        <input id="titulo" name="titulo" value={valores.titulo} onChange={alterar} />
        {erros.titulo && <p className="erro">{erros.titulo}</p>}
      </div>

      <div className="campo">
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" rows="3" value={valores.descricao} onChange={alterar} />
      </div>

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

      <div className={`campo ${erros.prazo ? 'invalido' : ''}`}>
        <label htmlFor="prazo">Prazo *</label>
        <input id="prazo" name="prazo" type="date" value={valores.prazo} onChange={alterar} />
        {erros.prazo && <p className="erro">{erros.prazo}</p>}
      </div>

      <div className="acoes">
        <button type="submit" className="botao">{textoBotao}</button>
        {onCancelar && <button type="button" className="botao secundario" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}