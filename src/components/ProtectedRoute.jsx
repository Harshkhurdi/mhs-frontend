import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-platinum flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-surgical-teal/30 border-t-surgical-teal rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/admin/login" replace />
}