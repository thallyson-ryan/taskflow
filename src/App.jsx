import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import useTarefas from './hooks/useTarefas'
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import ListaTarefas from './pages/ListaTarefas'
import NovaTarefa from './pages/NovaTarefa'
import DetalheTarefa from './pages/DetalheTarefa'
import NaoEncontrada from './pages/NaoEncontrada'

export default function App() {
  const { usuario } = useAuth()
  const { tarefas, setTarefas, status, erro, origem, carregarDaApi, usarContingencia } = useTarefas()

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio total={usuario ? tarefas.length : null} />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="/tarefas/nova" element={<RotaProtegida><NovaTarefa setTarefas={setTarefas} /></RotaProtegida>} />
          <Route path="/tarefas/:id" element={<RotaProtegida><DetalheTarefa tarefas={tarefas} setTarefas={setTarefas} status={status} /></RotaProtegida>} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </>
  )
}