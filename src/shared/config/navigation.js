import { ROUTES } from '@/constants/routes.js'

export const PUBLIC_NAV = [
  { to: ROUTES.vehicles, label: 'Автомобили' },
  { to: ROUTES.models, label: 'Модели' },
  { to: ROUTES.dealerships, label: 'Салоны' },
  { to: ROUTES.company, label: 'Компания' },
]

export const ACCOUNT_NAV = [
  { to: ROUTES.account, label: 'Профиль', icon: 'user', end: true },
  { to: ROUTES.orders, label: 'Заказы', icon: 'receipt' },
  { to: ROUTES.favorites, label: 'Избранное', icon: 'heart' },
  { to: ROUTES.testDrives, label: 'Тест-драйвы', icon: 'gauge' },
  { to: ROUTES.customOrders, label: 'Индивидуальный заказ', icon: 'key' },
  { to: ROUTES.service, label: 'Сервисные записи', icon: 'wrench' },
  { to: ROUTES.addresses, label: 'Адреса', icon: 'mapPin' },
]

export const STAFF_NAV = [
  { to: ROUTES.staffDashboard, label: 'Обзор', icon: 'gauge', end: true },
  { to: ROUTES.staffOrders, label: 'Заказы', icon: 'receipt' },
  { to: ROUTES.staffOperations, label: 'Операции и сервис', icon: 'wrench' },
  { to: ROUTES.staffInventory, label: 'Склад', icon: 'box' },
  { to: ROUTES.staffMedia, label: 'Фотографии', icon: 'car' },
  { to: ROUTES.staffUsers, label: 'Пользователи', icon: 'users' },
  { to: ROUTES.logs, label: 'Логи и отчёты', icon: 'clipboard' },
]
