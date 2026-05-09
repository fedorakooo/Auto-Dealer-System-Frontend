import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { fetchFavorites } from '@/features/favorites/favoriteService.js'
import { favoritesResponseSchema } from '@/features/favorites/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'
import { VehicleCard } from '@/features/vehicles/components/VehicleCard.jsx'
import { parseApiError } from '@/services/api'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'

export function FavoritesPage() {
  const { api } = useAuth()
  const { data: customer, isLoading: cl } = useCustomerRecord()

  const q = useQuery({
    queryKey: QK.favorites(customer?.id),
    queryFn: async () => {
      const raw = await fetchFavorites(api, customer.id)
      return favoritesResponseSchema.parse(raw)
    },
    enabled: !!customer?.id,
  })

  if (cl) return <Spinner />
  if (!customer)
    return (
      <EmptyState
        title="Нет профиля покупателя"
        description="Нужна запись customer для избранного."
      />
    )

  if (q.isLoading) return <Spinner />
  if (q.isError)
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />

  return (
    <div>
      <PageHeader kicker="Избранное" title="Сохранённые автомобили" />
      {!q.data.vehicles.length ? (
        <EmptyState title="Пусто" description="Добавьте авто из карточки." />
      ) : (
        <Stack variant="grid3">
          {q.data.vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </Stack>
      )}
    </div>
  )
}
