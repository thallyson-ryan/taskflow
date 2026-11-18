# TaskFlow – Organizador de Tarefas

Projeto Evolutivo da disciplina Front-end Frameworks – Ciência da Computação 2026.2
Entrega atual: AV2 (integração com API e autenticação)

## Problema e público
Estudantes e pequenas equipes perdem prazos e tarefas por anotarem em lugares diferentes. O TaskFlow reúne as tarefas em uma lista simples, com prioridade, prazo e status.

## Integrantes e contribuição
| Integrante | AV1 | AV2 |
|---|---|---|
| Thallyson Ryan | Estrutura do projeto, rotas, Navbar, página inicial, estilos globais e dados iniciais | Camada de serviços com fetch, URL-base centralizada (.env) e .env.example |
| Caio Gabriel | Listagem, cartão de tarefa, busca, filtros, ordenação e mensagens de lista vazia | Hook useTarefas, carregamento das tarefas da API, estados de carregamento/vazio/erro, tentar novamente e contingência |
| Richardyson Camilo | Formulário com validação, cadastro, detalhe, edição, conclusão, exclusão e localStorage | Login, contexto de autenticação, sessão persistida, rota protegida, logout e tratamento de 401/403 |

## Funcionalidades
- Login com a API DummyJSON, com validação dos campos e feedback de credenciais inválidas ou falha de rede
- Sessão mantida após atualizar a página (o token é validado em /auth/me) e logout
- Rotas de tarefas protegidas, com redirecionamento para o login
- Tarefas do usuário carregadas da API, com estados de carregamento, sucesso, vazio e erro
- Botão "Tentar novamente" após falha e opção de usar dados locais de demonstração
- Busca por título, filtros por status e prioridade e ordenação
- Cadastro, edição, conclusão e exclusão de tarefas, salvos no navegador
- Indicação da origem dos dados (API, salvo no navegador ou contingência)

## Rotas da aplicação
| Rota | Página | Acesso |
|---|---|---|
| / | Início | Pública |
| /login | Login | Pública |
| /tarefas | Lista com busca, filtros e estados de requisição | Protegida |
| /tarefas/nova | Cadastro de tarefa | Protegida |
| /tarefas/:id | Detalhe, edição, conclusão e exclusão | Protegida |
| * | Página não encontrada | Pública |

## Tecnologias
- React (componentes funcionais, hooks e Context API)
- JavaScript
- Vite
- React Router
- fetch (requisições HTTP)
- CSS tradicional

## Como executar
Pré-requisitos: Node.js LTS e Git.

    git clone https://github.com/USUARIO/taskflow.git
    cd taskflow
    npm install

Crie o arquivo .env a partir do modelo:

    Windows (PowerShell): copy .env.example .env
    Linux/macOS: cp .env.example .env

Inicie o projeto:

    npm run dev

Acesse o endereço exibido no terminal (normalmente http://localhost:5173).

Credenciais de demonstração (DummyJSON): usuário emilys, senha emilyspass. Elas também aparecem na tela de login.

## Contrato da API (Opção A – DummyJSON)
URL-base configurada em VITE_API_URL (padrão: https://dummyjson.com)

| Operação | Método | Endpoint | Corpo | Resposta usada |
|---|---|---|---|---|
| Login | POST | /auth/login | { username, password, expiresInMins } | id, username, firstName, lastName, image, accessToken |
| Validar sessão | GET | /auth/me (header Authorization: Bearer token) | – | dados do usuário; 401 se o token for inválido ou expirado |
| Listar tarefas do usuário | GET | /todos/user/{id} | – | { todos: [{ id, todo, completed, userId }] } |

Adaptação dos dados (src/services/tarefasService.js):
- todo → titulo
- completed → concluida
- prioridade, prazo e descricao não existem na API: recebem os valores padrão "media", vazio e vazio, e podem ser editados no app

Tratamento de erros:
- Falha de rede: mensagem "Não foi possível conectar ao servidor"
- 400 no login: "Usuário ou senha inválidos"
- 401/403 em requisições autenticadas: a sessão é encerrada e o usuário volta ao login com o aviso "Sua sessão expirou"

## Dados e persistência
| Dado | Onde fica | Observação |
|---|---|---|
| Sessão (token e dados básicos do usuário) | localStorage, chave taskflow:sessao | A senha nunca é armazenada. É removida no logout |
| Tarefas do usuário | localStorage, chave taskflow:tarefas:{id do usuário} | Carregadas da API na primeira vez. Depois, as alterações ficam salvas no navegador |
| Dados de contingência | src/data/tarefas.json | Mesma estrutura usada pela interface |

A DummyJSON simula criação, edição e exclusão, mas não as persiste. Por isso essas operações são salvas apenas no navegador, e a interface informa isso. O botão "Recarregar da API" busca novamente os dados originais e descarta as alterações locais.

## Estrutura de pastas
    src/
      components/   Navbar, CartaoTarefa, FiltroTarefas, FormTarefa, RotaProtegida
      contexts/     AuthContext
      data/         tarefas.json (dados iniciais da AV1 e contingência da AV2)
      hooks/        useTarefas, useLocalStorage
      pages/        Inicio, Login, ListaTarefas, NovaTarefa, DetalheTarefa, NaoEncontrada
      services/     api, authService, tarefasService
      styles/       global.css, tarefas.css, form.css
      utils/        formatarData

## Evolução da AV1 para a AV2
| Aspecto | Situação na AV1 | Evolução na AV2 | Evidência |
|---|---|---|---|
| Dados | JSON local | Tarefas da API DummyJSON, com JSON local como contingência | src/services/tarefasService.js, src/hooks/useTarefas.js |
| Autenticação | Não implementada | Login, sessão persistida, rota protegida, logout e tratamento de 401 | src/contexts/AuthContext.jsx, src/pages/Login.jsx, src/components/RotaProtegida.jsx |
| Estados da interface | Lista e lista vazia | Carregamento, sucesso, vazio, erro e tentar novamente | src/pages/ListaTarefas.jsx |
| Configuração | Sem variáveis de ambiente | URL-base centralizada em .env, com .env.example | src/services/api.js, .env.example |
| Persistência | Uma lista única no localStorage | Sessão e tarefas separadas por usuário no localStorage | src/hooks/useTarefas.js |
| Organização | Páginas, componentes, dados e estilos | Inclusão de services, contexts, hooks e utils | estrutura de pastas |

## Limitações e contingência
- A DummyJSON não persiste alterações. Criar, editar e excluir valem só no navegador de quem usa
- As tarefas da API não têm prazo nem prioridade, então o app aplica valores padrão
- O token expira em 60 minutos. Depois disso, é preciso fazer login de novo
- Se a API estiver indisponível, a lista exibe a mensagem de erro com "Tentar novamente" e a opção "Usar dados de demonstração", que carrega src/data/tarefas.json. Nesse modo, as alterações não são salvas

## Uso de inteligência artificial
A equipe usou o Claude (Anthropic) como apoio para:
- Planejar a estrutura de pastas, as rotas e a divisão de tarefas entre os integrantes
- Gerar a versão inicial dos componentes, das páginas, dos hooks, do contexto de autenticação e dos serviços
- Definir a estratégia de integração com a DummyJSON e o tratamento de erros (401, falha de rede)
- Orientar sobre os comandos de Git, commits e coautoria

Todo o código sugerido foi revisado, testado e ajustado pela equipe. Cada integrante é responsável por explicar a parte que implementou.