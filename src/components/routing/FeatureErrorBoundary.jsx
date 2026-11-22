import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { t } from '@/shared/i18n/index.js'
export function FeatureErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          title={t('common.errors.sectionError')}
          message={error instanceof Error ? error.message : String(error)}
          onRetry={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
