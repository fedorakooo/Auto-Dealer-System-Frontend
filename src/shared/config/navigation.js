import { ROUTES } from '@/constants/routes.js'

/** Navigation entries keep translation keys (`labelKey`); labels are translated at render time. */
export const PUBLIC_NAV = [
  { to: ROUTES.models, labelKey: 'layout.nav.models' },
  { to: ROUTES.vehicles, labelKey: 'layout.nav.vehicles' },
  { to: ROUTES.dealerships, labelKey: 'layout.nav.dealerships' },
  { to: ROUTES.company, labelKey: 'layout.nav.company' },
]

export const ACCOUNT_NAV = [
  { to: ROUTES.account, labelKey: 'layout.accountNav.profile', icon: 'user', end: true },
  { to: ROUTES.orders, labelKey: 'layout.accountNav.orders', icon: 'receipt' },
  {
    to: ROUTES.favorites,
    labelKey: 'layout.accountNav.favorites',
    icon: 'heart',
    feature: 'favorites',
  },
  {
    to: ROUTES.testDrives,
    labelKey: 'layout.accountNav.testDrives',
    icon: 'gauge',
    feature: 'test_drives',
  },
  {
    to: ROUTES.customOrders,
    labelKey: 'layout.accountNav.customOrders',
    icon: 'key',
    feature: 'custom_orders',
  },
  {
    to: ROUTES.service,
    labelKey: 'layout.accountNav.service',
    icon: 'wrench',
    feature: 'service_appointments',
  },
  { to: ROUTES.addresses, labelKey: 'layout.accountNav.addresses', icon: 'mapPin' },
]

export const STAFF_NAV = [
  { to: ROUTES.staffDashboard, labelKey: 'layout.staffNav.dashboard', icon: 'gauge', end: true },
  { to: ROUTES.staffOrders, labelKey: 'layout.staffNav.orders', icon: 'receipt' },
  { to: ROUTES.staffCatalog, labelKey: 'layout.staffNav.catalog', icon: 'car' },
  { to: ROUTES.staffOperations, labelKey: 'layout.staffNav.operations', icon: 'wrench' },
  { to: ROUTES.staffInventory, labelKey: 'layout.staffNav.inventory', icon: 'box' },
  { to: ROUTES.staffMedia, labelKey: 'layout.staffNav.media', icon: 'car' },
  { to: ROUTES.staffDealerships, labelKey: 'layout.staffNav.dealerships', icon: 'building' },
  { to: ROUTES.staffUsers, labelKey: 'layout.staffNav.users', icon: 'users' },
  { to: ROUTES.logs, labelKey: 'layout.staffNav.logs', icon: 'clipboard' },
]
