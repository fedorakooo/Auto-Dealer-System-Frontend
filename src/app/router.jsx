import { createBrowserRouter } from 'react-router-dom'
import { RootProviders } from '@/app/RootProviders.jsx'
import { LandingLayout } from '@/layouts/LandingLayout.jsx'
import { MainLayout } from '@/layouts/MainLayout.jsx'
import { ContentLayout } from '@/layouts/ContentLayout.jsx'
import { AccountLayout } from '@/layouts/AccountLayout.jsx'
import { StaffLayout } from '@/layouts/StaffLayout.jsx'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute.jsx'
import { StaffRoute } from '@/components/routing/StaffRoute.jsx'
import { FeatureErrorBoundary } from '@/components/routing/FeatureErrorBoundary.jsx'
import { RouteErrorFallback } from '@/app/RouteErrorFallback.jsx'
import { lazyNamed } from '@/app/lazyRoute.js'

const page = (name, loader) => lazyNamed(loader, name)

const HomePage = page('HomePage', () => import('@/pages/HomePage.jsx'))
const LoginPage = page('LoginPage', () => import('@/pages/LoginPage.jsx'))
const RegisterPage = page('RegisterPage', () => import('@/pages/RegisterPage.jsx'))
const VehiclesPage = page('VehiclesPage', () => import('@/pages/VehiclesPage.jsx'))
const VehicleDetailPage = page('VehicleDetailPage', () => import('@/pages/VehicleDetailPage.jsx'))
const ModelsPage = page('ModelsPage', () => import('@/pages/ModelsPage.jsx'))
const ModelDetailPage = page('ModelDetailPage', () => import('@/pages/ModelDetailPage.jsx'))
const DealershipsPage = page('DealershipsPage', () => import('@/pages/DealershipsPage.jsx'))
const DealershipDetailPage = page(
  'DealershipDetailPage',
  () => import('@/pages/DealershipDetailPage.jsx')
)
const CompanyPage = page('CompanyPage', () => import('@/pages/CompanyPage.jsx'))
const AccountPage = page('AccountPage', () => import('@/pages/AccountPage.jsx'))
const OrdersPage = page('OrdersPage', () => import('@/pages/OrdersPage.jsx'))
const FavoritesPage = page('FavoritesPage', () => import('@/pages/FavoritesPage.jsx'))
const TestDrivesPage = page('TestDrivesPage', () => import('@/pages/TestDrivesPage.jsx'))
const CustomOrdersPage = page('CustomOrdersPage', () => import('@/pages/CustomOrdersPage.jsx'))
const ServiceAppointmentsPage = page(
  'ServiceAppointmentsPage',
  () => import('@/pages/ServiceAppointmentsPage.jsx')
)
const AddressesPage = page('AddressesPage', () => import('@/pages/AddressesPage.jsx'))
const StaffDashboardPage = page(
  'StaffDashboardPage',
  () => import('@/pages/StaffDashboardPage.jsx')
)
const StaffUsersPage = page('StaffUsersPage', () => import('@/pages/StaffUsersPage.jsx'))
const StaffOrdersPage = page('StaffOrdersPage', () => import('@/pages/StaffOrdersPage.jsx'))
const StaffOperationsPage = page(
  'StaffOperationsPage',
  () => import('@/pages/StaffOperationsPage.jsx')
)
const StaffInventoryPage = page(
  'StaffInventoryPage',
  () => import('@/pages/StaffInventoryPage.jsx')
)
const StaffMediaPage = page('StaffMediaPage', () => import('@/pages/StaffMediaPage.jsx'))
const LogsPage = page('LogsPage', () => import('@/pages/LogsPage.jsx'))
const ForbiddenPage = page('ForbiddenPage', () => import('@/pages/ForbiddenPage.jsx'))
const NotFoundPage = page('NotFoundPage', () => import('@/pages/NotFoundPage.jsx'))

function wrap(element) {
  return <FeatureErrorBoundary>{element}</FeatureErrorBoundary>
}

export const router = createBrowserRouter([
  {
    element: <RootProviders />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <LandingLayout />,
        children: [{ index: true, element: wrap(<HomePage />) }],
      },
      {
        element: <MainLayout />,
        children: [
          { path: 'login', element: wrap(<LoginPage />) },
          { path: 'register', element: wrap(<RegisterPage />) },
          { path: 'vehicles', element: wrap(<VehiclesPage />) },
          { path: 'vehicles/:id', element: wrap(<VehicleDetailPage />) },
          { path: 'models', element: wrap(<ModelsPage />) },
          { path: 'models/:id', element: wrap(<ModelDetailPage />) },
          { path: 'dealerships', element: wrap(<DealershipsPage />) },
          { path: 'dealerships/:id', element: wrap(<DealershipDetailPage />) },
          {
            path: 'company',
            element: <ContentLayout />,
            children: [{ index: true, element: wrap(<CompanyPage />) }],
          },
          {
            path: 'account',
            element: <ProtectedRoute />,
            children: [
              {
                element: <AccountLayout />,
                children: [
                  { index: true, element: wrap(<AccountPage />) },
                  { path: 'orders', element: wrap(<OrdersPage />) },
                  { path: 'favorites', element: wrap(<FavoritesPage />) },
                  { path: 'test-drives', element: wrap(<TestDrivesPage />) },
                  { path: 'custom-orders', element: wrap(<CustomOrdersPage />) },
                  { path: 'service', element: wrap(<ServiceAppointmentsPage />) },
                  { path: 'addresses', element: wrap(<AddressesPage />) },
                ],
              },
            ],
          },
          {
            path: 'staff',
            element: <ProtectedRoute />,
            children: [
              {
                element: <StaffRoute />,
                children: [
                  {
                    element: <StaffLayout />,
                    children: [
                      { index: true, element: wrap(<StaffDashboardPage />) },
                      { path: 'users', element: wrap(<StaffUsersPage />) },
                      { path: 'orders', element: wrap(<StaffOrdersPage />) },
                      { path: 'operations', element: wrap(<StaffOperationsPage />) },
                      { path: 'inventory', element: wrap(<StaffInventoryPage />) },
                      { path: 'media', element: wrap(<StaffMediaPage />) },
                      { path: 'logs', element: wrap(<LogsPage />) },
                    ],
                  },
                ],
              },
            ],
          },
          { path: 'forbidden', element: wrap(<ForbiddenPage />) },
          { path: '*', element: wrap(<NotFoundPage />) },
        ],
      },
    ],
  },
])
