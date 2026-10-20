import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useModelsCatalogQuery } from '@/features/models/hooks/useModelQueries.js'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { getModelPhotos } from '@/lib/photos.js'
import { Badge } from '@/shared/ui/Badge.jsx'
import { Card, CardBody, CardMedia } from '@/shared/ui/Card.jsx'
import { CardGridSkeleton } from '@/shared/ui/Skeleton.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'

export function ModelsPage() {
  const { api } = useAuth()
  const query = useModelsCatalogQuery(api, { page: 1, limit: 50 })

  return (
    <div>
      <PageHeader
        kicker="Модельный ряд"
        title="Модели"
        subtitle="Модельный ряд сети: внешний вид, привод, годы производства и отзывы покупателей."
      />
      {query.isLoading ? <CardGridSkeleton count={6} /> : null}
      {query.isError ? (
        <ErrorFallback
          message={parseApiError(query.error).message}
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess && !query.data.models.length ? (
        <EmptyState icon="car" title="Модели пока не добавлены" />
      ) : null}
      {query.isSuccess && query.data.models.length ? (
        <Stack variant="grid3">
          {query.data.models.map((model) => {
            const [cover] = getModelPhotos(model)
            return (
              <Card key={model.id} interactive className="group flex h-full flex-col">
                <CardMedia className="relative aspect-[16/10] overflow-hidden">
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="grid h-full w-full place-items-center text-slate-300"
                      aria-hidden="true"
                    >
                      <Icon name="car" className="h-14 w-14" />
                    </div>
                  )}
                  {model.is_in_production ? (
                    <Badge tone="success" className="absolute top-3 left-3">
                      В производстве
                    </Badge>
                  ) : null}
                </CardMedia>
                <CardBody className="flex flex-1 flex-col gap-3 px-5 py-4">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">
                      <Link
                        to={ROUTES.modelDetail(model.id)}
                        className="text-[var(--color-text)] after:absolute after:inset-0 after:content-[''] hover:text-[var(--color-text)] focus-visible:outline-none"
                      >
                        {model.name}
                      </Link>
                    </h3>
                    <p className="mb-0 text-sm">Привод: {model.drive_type || '—'}</p>
                  </div>
                  <span
                    className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-strong)] transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    Подробнее
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </CardBody>
              </Card>
            )
          })}
        </Stack>
      ) : null}
    </div>
  )
}
