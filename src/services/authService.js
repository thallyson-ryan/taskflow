// =============================================================================
// authService.js — CHAMADAS DE AUTENTICAÇÃO (DummyJSON)
// Apenas define QUAIS endpoints chamar; o fetch em si está no api.js.
// =============================================================================

import { requisicao } from './api'

// LOGIN — POST /auth/login
// Envia usuário e senha. A API devolve os dados do usuário + accessToken.
// expiresInMins: 60 -> o token vale por 60 minutos (depois a API responde 401).
export function login(username, password) {
  return requisicao('/auth/login', {
    metodo: 'POST',
    corpo: { username, password, expiresInMins: 60 },
  })
}

// USUÁRIO ATUAL — GET /auth/me
// Envia o token no cabeçalho. Serve para conferir se a sessão ainda é válida:
//   200 -> token válido
//   401 -> token inválido ou expirado
export function buscarUsuarioAtual(token) {
  return requisicao('/auth/me', { token })
}
