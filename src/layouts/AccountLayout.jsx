import { SidebarLayout } from '@/layouts/SidebarLayout.jsx'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { USER_ROLES } from '@/constants/roles.js'
import { ACCOUNT_NAV } from '@/shared/config/navigation.js'

/** Non-customers (staff) only get the profile entry; the rest are customer-only flows. */
export function AccountLayout() {
  const { user } = useAuth()
  const items = user?.role === USER_ROLES.customer ? ACCOUNT_NAV : ACCOUNT_NAV.slice(0, 1)
  return <SidebarLayout title="Личный кабинет" items={items} />
}
