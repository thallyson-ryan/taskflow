import { Routes, Route } from 'react-router-dom'
import useLocalStorage from './hooks/useLocalStorage'
import Navbar from './components/Navbar'
import RotaProtegida from './components/RotaProtegida'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import ListaTarefas from './pages/ListaTarefas'
import NovaTarefa from './pages/NovaTarefa'
import DetalheTarefa from './pages/DetalheTarefa'
import NaoEncontrada from './pages/NaoEncontrada'
import tarefasIniciais from './data/tarefas.json'

export default function App() {
  const [tarefas, setTarefas] = useLocalStorage('taskflow:tarefas', tarefasIniciais)

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio total={tarefas.length} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tarefas" element={<RotaProtegida><ListaTarefas tarefas={tarefas} setTarefas={setTarefas} /></RotaProtegida>} />
          <Route path="/tarefas/nova" element={<RotaProtegida><NovaTarefa setTarefas={setTarefas} /></RotaProtegida>} />
          <Route path="/tarefas/:id" element={<RotaProtegida><DetalheTarefa tarefas={tarefas} setTarefas={setTarefas} /></RotaProtegida>} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </>
  )
}