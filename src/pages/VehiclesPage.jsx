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
import { Input } from '@/shared/ui/Input.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue.js'

export function VehiclesPage() {
  const { api } = useAuth()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') || '1') || 1
  const search = params.get('model_name') || ''
  const deferredSearch = useDebouncedValue(search, 300)
  const filters = {
    page,
    model_name: deferredSearch || undefined,
    body_type: params.get('body_type') || undefined,
    fuel_type: params.get('fuel_type') || undefined,
    transmission_type: params.get('transmission_type') || undefined,
    sort_by: params.get('sort_by') || undefined,
  }

  const q = useVehiclesCatalogQuery(api, filters)
  const setFilter = (name, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    if (name !== 'page') next.set('page', '1')
    setParams(next)
  }

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
      <section className="mb-4 grid gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4 md:grid-cols-2 xl:grid-cols-5" aria-label="Фильтры каталога">
        <Input id="catalog-search" className="mb-0" label="Поиск по модели" value={search} onChange={(e) => setFilter('model_name', e.target.value)} placeholder="Название модели" />
        <Select id="catalog-body" className="mb-0" label="Кузов" value={params.get('body_type') || ''} onChange={(e) => setFilter('body_type', e.target.value)}><option value="">Все</option><option value="sedan">Седан</option><option value="suv">SUV</option><option value="hatchback">Хэтчбек</option></Select>
        <Select id="catalog-fuel" className="mb-0" label="Топливо" value={params.get('fuel_type') || ''} onChange={(e) => setFilter('fuel_type', e.target.value)}><option value="">Все</option><option value="petrol">Бензин</option><option value="diesel">Дизель</option><option value="electric">Электро</option><option value="hybrid">Гибрид</option></Select>
        <Select id="catalog-transmission" className="mb-0" label="Трансмиссия" value={params.get('transmission_type') || ''} onChange={(e) => setFilter('transmission_type', e.target.value)}><option value="">Все</option><option value="automatic">Автомат</option><option value="manual">Механика</option></Select>
        <Select id="catalog-sort" className="mb-0" label="Сортировка" value={params.get('sort_by') || ''} onChange={(e) => setFilter('sort_by', e.target.value)}><option value="">По умолчанию</option><option value="price">Цена</option><option value="production_year">Год выпуска</option></Select>
      </section>
      {[...params.entries()].filter(([key]) => key !== 'page').length ? (
        <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Активные фильтры">
          {[...params.entries()].filter(([key]) => key !== 'page').map(([key, value]) => (
            <button key={key} type="button" className="rounded-full bg-[var(--color-neutral-subtle)] px-3 py-1 text-xs font-medium text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]" onClick={() => setFilter(key, '')} aria-label={`Сбросить фильтр: ${value}`}>
              {value} ×
            </button>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={() => setParams({ page: '1' })}>Сбросить фильтры</Button>
        </div>
      ) : null}
      {!vehicles.length ? (
        <EmptyState title="Нет позиций" description="Измените фильтры или зайдите позже." action={<Button type="button" variant="secondary" onClick={() => setParams({ page: '1' })}>Сбросить фильтры</Button>} />
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
              onClick={() => setFilter('page', String(page - 1))}
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
              onClick={() => setFilter('page', String(page + 1))}
            >
              Вперёд
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
