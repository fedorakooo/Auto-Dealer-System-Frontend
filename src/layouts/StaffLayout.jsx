import { SidebarLayout } from '@/layouts/SidebarLayout.jsx'
import { STAFF_NAV } from '@/shared/config/navigation.js'

export function StaffLayout() {
  return <SidebarLayout title="Операционный центр" items={STAFF_NAV} />
}
