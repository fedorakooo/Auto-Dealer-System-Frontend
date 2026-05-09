import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useVehiclesCatalogQuery } from '@/features/vehicles/hooks/useVehicleQueries.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { VehicleCard } from '@/features/vehicles/components/VehicleCard.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { parseApiError } from '@/services/api'

export function VehiclesPage() {
  const { api } = useAuth()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') || '1') || 1

  const q = useVehiclesCatalogQuery(api, page)

  if (q.isLoading) return <Spinner />
  if (q.isError) {
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />
  }

  const { vehicles, total } = q.data
  const totalPages = Math.max(1, Math.ceil(total / 12))

  return (
    <div>
      <PageHeader
        kicker="Каталог"
        title="Автомобили в наличии"
        subtitle="Подбор по каталогу с актуальными ценами и характеристиками."
      />
      {!vehicles.length ? (
        <EmptyState title="Нет позиций" description="Измените фильтры или зайдите позже." />
      ) : (
        <>
          <Stack variant="grid3">
            {vehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </Stack>
          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setParams({ page: String(page - 1) })}
            >
              Назад
            </Button>
            <span
              style={{ alignSelf: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}
            >
              Стр. {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setParams({ page: String(page + 1) })}
            >
              Вперёд
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
