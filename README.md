# TaskFlow – Organizador de Tarefas

Projeto Evolutivo da disciplina Front-end Frameworks – Ciência da Computação 2026.2
Entrega atual: AV1 (protótipo com dados locais)

## Problema e público
Estudantes e pequenas equipes perdem prazos e tarefas por anotarem em lugares diferentes. O TaskFlow reúne as tarefas em uma lista simples, com prioridade, prazo e status.

## Integrantes e contribuição
| Integrante | Contribuição principal |
|---|---|
| Thallyson Ryan | Estrutura do projeto, rotas (React Router), Navbar, página inicial, estilos globais e dados iniciais |
| Caio Gabriel | Listagem de tarefas, componente de cartão, busca, filtros por status e prioridade, ordenação e mensagens de lista vazia |
| Richardyson Camilo | Formulário controlado com validação, cadastro, detalhe, edição, conclusão, exclusão e persistência no localStorage |

## Funcionalidades
- Página inicial com a finalidade do produto e o total de tarefas
- Listagem das tarefas a partir de arquivo JSON local
- Busca por título, filtros por status e prioridade e ordenação por prazo, prioridade ou título
- Cadastro de tarefa com validação dos campos obrigatórios (título, prioridade e prazo)
- Detalhe da tarefa com edição, marcação como concluída/pendente e exclusão com confirmação
- Mensagens condicionais: lista vazia, nenhum resultado no filtro, erros de validação e resultado das ações
- Persistência das tarefas no localStorage

## Rotas da aplicação
| Rota | Página |
|---|---|
| / | Início |
| /tarefas | Lista de tarefas com busca e filtros |
| /tarefas/nova | Cadastro de tarefa |
| /tarefas/:id | Detalhe, edição, conclusão e exclusão |
| * | Página não encontrada |

## Tecnologias
- React (componentes funcionais e hooks)
- JavaScript
- Vite
- React Router
- CSS tradicional

## Como executar
Pré-requisitos: Node.js LTS e Git.

    git clone https://github.com/thallyson-ryan/taskflow.git
    cd taskflow
    npm install
    npm run dev

Acesse o endereço exibido no terminal (normalmente http://localhost:5173).

## Dados e persistência
- Dados iniciais: src/data/tarefas.json, com 4 tarefas de exemplo
- Dados persistidos: a lista completa de tarefas é salva no localStorage com a chave taskflow:tarefas
- Na primeira execução o app carrega o JSON. Depois disso, passa a usar o que está salvo no localStorage
- Para voltar aos dados iniciais: abra as ferramentas do navegador (F12) > Application > Local Storage e apague a chave taskflow:tarefas

## Estrutura de pastas
    src/
      components/   Navbar, CartaoTarefa, FiltroTarefas, FormTarefa
      pages/        Inicio, ListaTarefas, NovaTarefa, DetalheTarefa, NaoEncontrada
      hooks/        useLocalStorage
      data/         tarefas.json
      styles/       global.css, tarefas.css, form.css

## Limitações e contingência
- Os dados ficam apenas no navegador de quem usa e não são compartilhados entre dispositivos
- Não há autenticação nesta etapa; ela está prevista para a AV2
- Na AV2 o JSON local será mantido como contingência caso a API fique indisponível

## Evolução planejada para a AV2
- Consumir tarefas da API DummyJSON (/todos) com fetch, concentrado em src/services
- Login via DummyJSON (/auth/login), rota protegida, sessão mantida após atualizar a página e logout
- Estados de carregamento, sucesso, vazio e erro, com ação de tentar novamente

## Uso de inteligência artificial
A equipe usou o Claude (Anthropic) como apoio para:
- Planejar a estrutura de pastas, as rotas e a divisão de tarefas entre os integrantes
- Gerar a versão inicial dos componentes, das páginas e do hook useLocalStorage
- Orientar sobre os comandos de Git e o fluxo de commits

Todo o código sugerido foi revisado, testado e ajustado pela equipe. Cada integrante é responsável por explicar a parte que implementou.