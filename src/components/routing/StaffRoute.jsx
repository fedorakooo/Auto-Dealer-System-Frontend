import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { canAccessStaff } from '@/constants/roles.js'
export function StaffRoute({ children }) {
  const { user } = useAuth()
  if (!user || !canAccessStaff(user.role)) {
    return <Navigate to={ROUTES.forbidden} replace />
  }
  return children ?? <Outlet />
}
