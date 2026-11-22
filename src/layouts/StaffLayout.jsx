import { t } from '@/shared/i18n/index.js'
import { SidebarLayout } from '@/layouts/SidebarLayout.jsx'
import { STAFF_NAV } from '@/shared/config/navigation.js'

export function StaffLayout() {
  return <SidebarLayout title={t('layout.sidebar.staff')} items={STAFF_NAV} />
}
