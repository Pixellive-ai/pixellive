import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuth'
import type { ReactNode } from 'react'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { authenticated } = useAdminAuth()
  if (!authenticated) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
