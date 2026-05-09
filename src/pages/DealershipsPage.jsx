import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useDealershipsCatalogQuery } from '@/features/dealerships/hooks/useDealershipQueries.js'
import { useCitiesQuery } from '@/features/cities/hooks/useCitiesQuery.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'
import { Card, CardBody } from '@/shared/ui/Card.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'

export function DealershipsPage() {
  const { api } = useAuth()

  const dq = useDealershipsCatalogQuery(api, { page: 1, limit: 100 })
  const cq = useCitiesQuery(api)

  const cityName = (cityId) =>
    cq.data?.cities.find((c) => c.id === cityId)?.name || `Город #${cityId}`

  if (dq.isLoading || cq.isLoading) return <Spinner />
  if (dq.isError)
    return <ErrorFallback message={parseApiError(dq.error).message} onRetry={() => dq.refetch()} />

  const list = dq.data.dealerships.filter((d) => d.is_active !== false)

  return (
    <div>
      <PageHeader
        kicker="Сеть"
        title="Дилерские центры"
        subtitle="Активные представительства и контакты для записи и консультаций."
      />
      <Stack variant="grid2">
        {list.map((d) => (
          <Card key={d.id} interactive>
            <CardBody>
              <h3 style={{ margin: '0 0 0.5rem' }}>{d.name}</h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-text-muted)',
                  margin: '0 0 0.5rem',
                }}
              >
                {d.address}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {cityName(d.city_id)}
              </p>
              <Link
                to={ROUTES.dealershipDetail(d.id)}
                style={{ display: 'block', marginTop: '1rem' }}
              >
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
