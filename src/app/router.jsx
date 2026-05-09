import { createBrowserRouter } from 'react-router-dom'
import { RootProviders } from '@/app/RootProviders.jsx'
import { LandingLayout } from '@/layouts/LandingLayout.jsx'
import { MainLayout } from '@/layouts/MainLayout.jsx'
import { ContentLayout } from '@/layouts/ContentLayout.jsx'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute.jsx'
import { StaffRoute } from '@/components/routing/StaffRoute.jsx'
import { FeatureErrorBoundary } from '@/components/routing/FeatureErrorBoundary.jsx'
import { RouteErrorFallback } from '@/app/RouteErrorFallback.jsx'
import { lazyNamed } from '@/app/lazyRoute.js'

const HomePage = lazyNamed(() => import('@/pages/HomePage.jsx'), 'HomePage')
const LoginPage = lazyNamed(() => import('@/pages/LoginPage.jsx'), 'LoginPage')
const RegisterPage = lazyNamed(() => import('@/pages/RegisterPage.jsx'), 'RegisterPage')
const VehiclesPage = lazyNamed(() => import('@/pages/VehiclesPage.jsx'), 'VehiclesPage')
const VehicleDetailPage = lazyNamed(
  () => import('@/pages/VehicleDetailPage.jsx'),
  'VehicleDetailPage'
)
const ModelsPage = lazyNamed(() => import('@/pages/ModelsPage.jsx'), 'ModelsPage')
const ModelDetailPage = lazyNamed(() => import('@/pages/ModelDetailPage.jsx'), 'ModelDetailPage')
const DealershipsPage = lazyNamed(() => import('@/pages/DealershipsPage.jsx'), 'DealershipsPage')
const DealershipDetailPage = lazyNamed(
  () => import('@/pages/DealershipDetailPage.jsx'),
  'DealershipDetailPage'
)
const AccountLayout = lazyNamed(() => import('@/pages/AccountLayout.jsx'), 'AccountLayout')
const AccountPage = lazyNamed(() => import('@/pages/AccountPage.jsx'), 'AccountPage')
const OrdersPage = lazyNamed(() => import('@/pages/OrdersPage.jsx'), 'OrdersPage')
const FavoritesPage = lazyNamed(() => import('@/pages/FavoritesPage.jsx'), 'FavoritesPage')
const TestDrivesPage = lazyNamed(() => import('@/pages/TestDrivesPage.jsx'), 'TestDrivesPage')
const CustomOrdersPage = lazyNamed(() => import('@/pages/CustomOrdersPage.jsx'), 'CustomOrdersPage')
const StaffUsersPage = lazyNamed(() => import('@/pages/StaffUsersPage.jsx'), 'StaffUsersPage')
const StaffOrdersPage = lazyNamed(() => import('@/pages/StaffOrdersPage.jsx'), 'StaffOrdersPage')
const LogsPage = lazyNamed(() => import('@/pages/LogsPage.jsx'), 'LogsPage')
const ForbiddenPage = lazyNamed(() => import('@/pages/ForbiddenPage.jsx'), 'ForbiddenPage')
const NotFoundPage = lazyNamed(() => import('@/pages/NotFoundPage.jsx'), 'NotFoundPage')
const CompanyPage = lazyNamed(() => import('@/pages/CompanyPage.jsx'), 'CompanyPage')

function wrap(page) {
  return <FeatureErrorBoundary>{page}</FeatureErrorBoundary>
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
                ],
              },
            ],
          },

          {
            path: 'staff/users',
            element: (
              <ProtectedRoute>
                <StaffRoute>{wrap(<StaffUsersPage />)}</StaffRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: 'staff/orders',
            element: (
              <ProtectedRoute>
                <StaffRoute>{wrap(<StaffOrdersPage />)}</StaffRoute>
              </ProtectedRoute>
            ),
          },
          {
            path: 'staff/logs',
            element: (
              <ProtectedRoute>
                <StaffRoute>{wrap(<LogsPage />)}</StaffRoute>
              </ProtectedRoute>
            ),
          },

          { path: 'forbidden', element: wrap(<ForbiddenPage />) },
          { path: '*', element: wrap(<NotFoundPage />) },
        ],
      },
    ],
  },
])
