import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { fetchFavorites } from '@/features/favorites/favoriteService.js'
import { favoritesResponseSchema } from '@/features/favorites/schemas.js'
import { VehicleCard } from '@/features/vehicles/components/VehicleCard.jsx'
import { QK } from '@/constants/queryKeys.js'
import { ROUTES } from '@/constants/routes.js'
import { parseApiError } from '@/services/api'
import { LinkButton } from '@/shared/ui/Button.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'

export function FavoritesPage() {
  const { api } = useAuth()
  const { data: customer, isLoading: customerLoading } = useCustomerRecord()

  const query = useQuery({
    queryKey: QK.favorites(customer?.id),
    queryFn: async () => {
      const raw = await fetchFavorites(api, customer.id)
      return favoritesResponseSchema.parse(raw)
    },
    enabled: !!customer?.id,
  })

  if (customerLoading) return <Spinner />
  if (!customer) {
    return (
      <EmptyState
        icon="heart"
        title="Нет профиля покупателя"
        description="Для списка избранного нужна запись покупателя."
      />
    )
  }

  if (query.isLoading) return <Spinner />
  if (query.isError) {
    return (
      <ErrorFallback message={parseApiError(query.error).message} onRetry={() => query.refetch()} />
    )
  }

  return (
    <div>
      <PageHeader kicker="Избранное" title="Сохранённые автомобили" />
      {!query.data.vehicles.length ? (
        <EmptyState
          icon="heart"
          title="Список пуст"
          description="Добавляйте автомобили в избранное из их карточек."
          action={<LinkButton to={ROUTES.vehicles}>Перейти в каталог</LinkButton>}
        />
      ) : (
        <Stack variant="grid3">
          {query.data.vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </Stack>
      )}
    </div>
  )
}
