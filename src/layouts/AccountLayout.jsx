import { t } from '@/shared/i18n/index.js'
import { SidebarLayout } from '@/layouts/SidebarLayout.jsx'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useBrand } from '@/features/brand/brandContext.js'
import { USER_ROLES } from '@/constants/roles.js'
import { ACCOUNT_NAV } from '@/shared/config/navigation.js'

/** Non-customers (staff) only get the profile entry; the rest are customer-only flows. */
export function AccountLayout() {
  const { user } = useAuth()
  const { features } = useBrand()
  const enabled = ACCOUNT_NAV.filter((item) => !item.feature || features[item.feature])
  const items = user?.role === USER_ROLES.customer ? enabled : enabled.slice(0, 1)
  return <SidebarLayout title={t('layout.sidebar.account')} items={items} />
}
