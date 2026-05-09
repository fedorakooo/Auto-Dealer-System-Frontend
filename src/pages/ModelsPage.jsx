import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useModelsCatalogQuery } from '@/features/models/hooks/useModelQueries.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'
import { Card, CardBody } from '@/shared/ui/Card.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'

export function ModelsPage() {
  const { api } = useAuth()

  const q = useModelsCatalogQuery(api, { page: 1, limit: 50 })

  if (q.isLoading) return <Spinner />
  if (q.isError)
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />

  return (
    <div>
      <PageHeader kicker="Модельный ряд" title="Модели" />
      <Stack variant="grid3">
        {q.data.models.map((m) => (
          <Card key={m.id} interactive>
            <CardBody>
              <h3 style={{ margin: '0 0 0.5rem', color: 'var(--color-text)' }}>{m.name}</h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  margin: '0 0 1rem',
                }}
              >
                {m.drive_type || '—'} · {m.is_in_production ? 'В производстве' : ''}
              </p>
              <Link to={ROUTES.modelDetail(m.id)}>
                <Button type="button" variant="secondary" fullWidth>
                  Подробнее
                </Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </div>
  )
}
