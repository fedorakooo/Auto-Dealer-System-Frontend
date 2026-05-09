import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AppProviders } from '@/app/providers.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'

export function RootProviders() {
  return (
    <AppProviders>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </AppProviders>
  )
}
