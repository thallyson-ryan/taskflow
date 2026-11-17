import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import ListaTarefas from './pages/ListaTarefas'
import NovaTarefa from './pages/NovaTarefa'
import DetalheTarefa from './pages/DetalheTarefa'
import NaoEncontrada from './pages/NaoEncontrada'
import tarefasIniciais from './data/tarefas.json'

export default function App() {
  const [tarefas, setTarefas] = useState(tarefasIniciais)

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio total={tarefas.length} />} />
          <Route path="/tarefas" element={<ListaTarefas tarefas={tarefas} setTarefas={setTarefas} />} />
          <Route path="/tarefas/nova" element={<NovaTarefa setTarefas={setTarefas} />} />
          <Route path="/tarefas/:id" element={<DetalheTarefa tarefas={tarefas} setTarefas={setTarefas} />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </>
  )
}