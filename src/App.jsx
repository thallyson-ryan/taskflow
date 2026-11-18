// =============================================================================
// App.jsx — COMPONENTE PRINCIPAL
// Responsável por:
//   1. Buscar as tarefas (pelo hook useTarefas)
//   2. Definir as ROTAS da aplicação (qual página aparece em cada URL)
//   3. Passar os dados para as páginas através de PROPS
// =============================================================================

import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext' // dados do usuário logado
import useTarefas from './hooks/useTarefas' // lógica de carregar/salvar tarefas
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import ListaTarefas from './pages/ListaTarefas'
import NovaTarefa from './pages/NovaTarefa'
import DetalheTarefa from './pages/DetalheTarefa'
import NaoEncontrada from './pages/NaoEncontrada'

export default function App() {
  // usuario: objeto com os dados de quem está logado (ou undefined se ninguém estiver)
  const { usuario } = useAuth()

  // O hook useTarefas concentra TODA a lógica de dados das tarefas.
  //   tarefas          -> a lista de tarefas
  //   setTarefas       -> função para alterar a lista (cadastrar, editar, excluir)
  //   status           -> 'ocioso' | 'carregando' | 'sucesso' | 'erro'
  //   erro             -> mensagem de erro, quando a API falha
  //   origem           -> 'api' | 'cache' | 'contingencia' (de onde vieram os dados)
  //   carregarDaApi    -> busca novamente na API (usado no "Tentar novamente")
  //   usarContingencia -> carrega os dados locais de demonstração
  const { tarefas, setTarefas, status, erro, origem, carregarDaApi, usarContingencia } = useTarefas()

  return (
    <>
      {/* A Navbar fica fora do <Routes>, por isso aparece em TODAS as páginas */}
      <Navbar />

      <main className="container">
        {/* <Routes> olha a URL atual e mostra apenas a <Route> que combina com ela */}
        <Routes>
          {/* Página inicial (pública). Se não houver usuário logado, envia null para não mostrar total */}
          <Route path="/" element={<Inicio total={usuario ? tarefas.length : null} />} />

          {/* Página de login (pública) */}
          <Route path="/login" element={<Login />} />

          {/* Lista de tarefas (PROTEGIDA: só acessa quem está logado) */}
          <Route
            path="/tarefas"
            element={
              <RotaProtegida>
                <ListaTarefas
                  tarefas={tarefas}
                  status={status}
                  erro={erro}
                  origem={origem}
                  onRecarregar={carregarDaApi}
                  onContingencia={usarContingencia}
                />
              </RotaProtegida>
            }
          />

          {/* Cadastro de nova tarefa (PROTEGIDA) */}
          <Route path="/tarefas/nova" element={<RotaProtegida><NovaTarefa setTarefas={setTarefas} /></RotaProtegida>} />

          {/* Detalhe de uma tarefa (PROTEGIDA).
              ":id" é um PARÂMETRO dinâmico: /tarefas/5 -> id = "5".
              A página lê esse valor com useParams(). */}
          <Route path="/tarefas/:id" element={<RotaProtegida><DetalheTarefa tarefas={tarefas} setTarefas={setTarefas} status={status} /></RotaProtegida>} />

          {/* "*" captura QUALQUER endereço que não combinou com as rotas acima */}
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </>
  )
}
