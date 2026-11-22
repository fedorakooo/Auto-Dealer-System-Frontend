import { QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { queryClient } from '@/app/queryClient.js'
import { AuthProvider } from '@/features/auth/AuthContext.jsx'
import { BrandProvider } from '@/features/brand/BrandProvider.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { ToastHost } from '@/app/ToastHost.jsx'
export function AppProviders({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback message={error?.message} onRetry={resetErrorBoundary} />
      )}
    >
      <QueryClientProvider client={queryClient}>
        <BrandProvider>
          <AuthProvider>
            {children}
            <ToastHost />
          </AuthProvider>
        </BrandProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
