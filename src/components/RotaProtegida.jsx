import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RotaProtegida({ children }) {
  const { sessao, verificando } = useAuth()
  const location = useLocation()

  if (verificando) return <p className="aviso">Verificando sessão...</p>
  if (!sessao) return <Navigate to="/login" replace state={{ de: location.pathname }} />
  return children
}