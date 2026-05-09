import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
export function FeatureErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          title="Ошибка в разделе"
          message={error instanceof Error ? error.message : String(error)}
          onRetry={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
