import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useDealershipsCatalogQuery } from '@/features/dealerships/hooks/useDealershipQueries.js'
import { useCitiesQuery } from '@/features/cities/hooks/useCitiesQuery.js'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { Card, CardBody } from '@/shared/ui/Card.jsx'
import { CardGridSkeleton } from '@/shared/ui/Skeleton.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'

export function DealershipsPage() {
  const { api } = useAuth()
  const dealershipsQuery = useDealershipsCatalogQuery(api, { page: 1, limit: 100 })
  const citiesQuery = useCitiesQuery(api)

  const cityName = (cityId) =>
    citiesQuery.data?.cities.find((city) => city.id === cityId)?.name || `Город #${cityId}`

  const dealerships = dealershipsQuery.data?.dealerships.filter((d) => d.is_active !== false) ?? []

  return (
    <div>
      <PageHeader
        kicker="Сеть"
        title="Дилерские центры"
        subtitle="Активные представительства и контакты для записи и консультаций."
      />
      {dealershipsQuery.isLoading ? <CardGridSkeleton count={4} /> : null}
      {dealershipsQuery.isError ? (
        <ErrorFallback
          message={parseApiError(dealershipsQuery.error).message}
          onRetry={() => dealershipsQuery.refetch()}
        />
      ) : null}
      {dealershipsQuery.isSuccess && !dealerships.length ? (
        <EmptyState icon="building" title="Нет активных салонов" />
      ) : null}
      {dealerships.length ? (
        <Stack variant="grid2">
          {dealerships.map((dealership) => (
            <Card key={dealership.id} interactive className="group">
              <CardBody className="flex h-full flex-col gap-4 px-5 py-5">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-primary)]">
                    <Icon name="building" className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="mb-1 text-lg font-semibold">
                      <Link
                        to={ROUTES.dealershipDetail(dealership.id)}
                        className="text-[var(--color-text)] after:absolute after:inset-0 after:content-[''] hover:text-[var(--color-text)] focus-visible:outline-none"
                      >
                        {dealership.name}
                      </Link>
                    </h3>
                    <p className="mb-0 text-sm">{dealership.address}</p>
                    <p className="mt-1 mb-0 text-sm">{cityName(dealership.city_id)}</p>
                  </div>
                </div>
                <span
                  className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-strong)] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  Контакты и часы работы
                  <Icon name="arrowRight" className="h-4 w-4" />
                </span>
              </CardBody>
            </Card>
          ))}
        </Stack>
      ) : null}
    </div>
  )
}
