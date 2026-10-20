import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import {
  VEHICLES_PAGE_SIZE,
  useVehiclesCatalogQuery,
} from '@/features/vehicles/hooks/useVehicleQueries.js'
import { VehicleCard } from '@/features/vehicles/components/VehicleCard.jsx'
import {
  BODY_TYPES,
  FUEL_TYPES,
  SORT_OPTIONS,
  TRANSMISSION_TYPES,
  describeFilter,
} from '@/constants/catalog.js'
import { parseApiError } from '@/services/api'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue.js'
import { Button } from '@/shared/ui/Button.jsx'
import { CardGridSkeleton } from '@/shared/ui/Skeleton.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Pagination } from '@/shared/ui/Pagination.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'

const FILTER_SELECTS = [
  { name: 'body_type', id: 'catalog-body', label: 'Кузов', options: BODY_TYPES, empty: 'Все' },
  { name: 'fuel_type', id: 'catalog-fuel', label: 'Топливо', options: FUEL_TYPES, empty: 'Все' },
  {
    name: 'transmission_type',
    id: 'catalog-transmission',
    label: 'Трансмиссия',
    options: TRANSMISSION_TYPES,
    empty: 'Все',
  },
  {
    name: 'sort_by',
    id: 'catalog-sort',
    label: 'Сортировка',
    options: SORT_OPTIONS,
    empty: 'По умолчанию',
  },
]

export function VehiclesPage() {
  const { api } = useAuth()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page') || '1') || 1
  const search = params.get('model_name') || ''
  const debouncedSearch = useDebouncedValue(search, 300)

  const query = useVehiclesCatalogQuery(api, {
    page,
    model_name: debouncedSearch || undefined,
    body_type: params.get('body_type') || undefined,
    fuel_type: params.get('fuel_type') || undefined,
    transmission_type: params.get('transmission_type') || undefined,
    sort_by: params.get('sort_by') || undefined,
  })

  const activeFilters = [...params.entries()].filter(([key]) => key !== 'page')

  const setFilter = (name, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(name, value)
    else next.delete(name)
    if (name !== 'page') next.set('page', '1')
    setParams(next)
  }

  const resetFilters = () => setParams({ page: '1' })

  const vehicles = query.data?.vehicles ?? []
  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / VEHICLES_PAGE_SIZE))

  return (
    <div>
      <PageHeader
        kicker="Каталог"
        title="Автомобили в наличии"
        subtitle="Подбор по каталогу с актуальными ценами и характеристиками."
        actions={
          query.isSuccess ? (
            <p className="mb-0 text-sm text-[var(--color-text-muted)]" aria-live="polite">
              Найдено: <strong className="text-[var(--color-text)]">{total}</strong>
            </p>
          ) : null
        }
      />

      <section
        className="mb-4 grid gap-x-4 gap-y-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-panel)] md:grid-cols-2 xl:grid-cols-5"
        aria-label="Фильтры каталога"
      >
        <div className="relative">
          <Input
            id="catalog-search"
            label="Поиск по модели"
            type="search"
            value={search}
            onChange={(event) => setFilter('model_name', event.target.value)}
            placeholder="Название модели"
            inputClassName="pl-10"
          />
          <Icon
            name="search"
            className="pointer-events-none absolute bottom-[1.95rem] left-3 h-4 w-4 text-slate-400"
          />
        </div>
        {FILTER_SELECTS.map((filter) => (
          <Select
            key={filter.name}
            id={filter.id}
            label={filter.label}
            value={params.get(filter.name) || ''}
            onChange={(event) => setFilter(filter.name, event.target.value)}
          >
            <option value="">{filter.empty}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ))}
      </section>

      {activeFilters.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Активные фильтры">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
              onClick={() => setFilter(key, '')}
              aria-label={`Сбросить фильтр — ${describeFilter(key, value)}`}
            >
              {describeFilter(key, value)}
              <Icon name="close" className="h-3 w-3" />
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Сбросить все
          </Button>
        </div>
      ) : null}

      {query.isLoading ? <CardGridSkeleton /> : null}
      {query.isError ? (
        <ErrorFallback
          message={parseApiError(query.error).message}
          onRetry={() => query.refetch()}
        />
      ) : null}

      {query.isSuccess && !vehicles.length ? (
        <EmptyState
          icon="search"
          title="Ничего не найдено"
          description="Измените параметры поиска или загляните позже — каталог регулярно обновляется."
          action={
            activeFilters.length ? (
              <Button variant="secondary" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            ) : null
          }
        />
      ) : null}

      {query.isSuccess && vehicles.length ? (
        <div className={query.isPlaceholderData ? 'opacity-60 transition-opacity' : undefined}>
          <Stack variant="grid3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </Stack>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(next) => setFilter('page', String(next))}
          />
        </div>
      ) : null}
    </div>
  )
}
