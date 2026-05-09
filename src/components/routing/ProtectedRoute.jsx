import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ROUTES } from '@/constants/routes.js'
export function ProtectedRoute({ children }) {
  const { user, booting } = useAuth()
  const location = useLocation()
  if (booting) {
    return <Spinner />
  }
  if (!user) {
    return (
      <Navigate
        to={ROUTES.login}
        state={{
          from: location,
        }}
        replace
      />
    )
  }
  return children ?? <Outlet />
}
