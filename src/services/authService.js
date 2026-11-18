import { requisicao } from './api'

export function login(username, password) {
  return requisicao('/auth/login', {
    metodo: 'POST',
    corpo: { username, password, expiresInMins: 60 },
  })
}

export function buscarUsuarioAtual(token) {
  return requisicao('/auth/me', { token })
}