import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { useVehicleDetailQuery } from '@/features/vehicles/hooks/useVehicleQueries.js'
import { createOrder } from '@/features/orders/orderService.js'
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from '@/features/favorites/favoriteService.js'
import { favoritesResponseSchema } from '@/features/favorites/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { ROUTES } from '@/constants/routes.js'
import { USER_ROLES } from '@/constants/roles.js'
import { parseApiError } from '@/services/api'
import { formatPrice } from '@/lib/format.js'
import { resolveMediaUrl } from '@/lib/mediaUrl.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs.jsx'
import { Button, LinkButton } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { DescriptionList } from '@/shared/ui/DescriptionList.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'

export function VehicleDetailPage() {
  const { id } = useParams()
  const { api, user } = useAuth()
  const { data: customer, isLoading: customerLoading } = useCustomerRecord()
  const queryClient = useQueryClient()
  const [feedback, setFeedback] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const vehicleQuery = useVehicleDetailQuery(api, id)

  const favoritesQuery = useQuery({
    queryKey: QK.favorites(customer?.id),
    queryFn: async () => {
      const raw = await fetchFavorites(api, customer.id)
      return favoritesResponseSchema.parse(raw)
    },
    enabled: !!customer?.id && !!vehicleQuery.data?.id,
  })

  const isFavorite = favoritesQuery.data?.vehicles?.some((item) => item.id === id)

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!customer || !vehicleQuery.data) return
      const body = { customer_id: customer.id, vehicle_id: vehicleQuery.data.id }
      if (isFavorite) await removeFavorite(api, body)
      else await addFavorite(api, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      setFeedback(null)
    },
    onError: (error) => setFeedback({ variant: 'danger', text: parseApiError(error).message }),
  })

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!customer || !vehicleQuery.data) throw new Error('Нет данных для оформления заказа')
      await createOrder(api, {
        customer_id: customer.id,
        vehicle_id: vehicleQuery.data.id,
        dealership_id: vehicleQuery.data.dealership_id,
        final_price: String(vehicleQuery.data.price),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      setConfirmOpen(false)
      setFeedback({
        variant: 'success',
        text: 'Заказ создан. Его статус доступен в личном кабинете.',
      })
    },
    onError: (error) => {
      setConfirmOpen(false)
      setFeedback({ variant: 'danger', text: parseApiError(error).message })
    },
  })

  if (vehicleQuery.isLoading) return <Spinner />
  if (vehicleQuery.isError || !vehicleQuery.data) {
    return (
      <ErrorFallback
        message={parseApiError(vehicleQuery.error).message}
        onRetry={() => vehicleQuery.refetch()}
      />
    )
  }

  const vehicle = vehicleQuery.data
  const image = vehicle.images?.[0] ? resolveMediaUrl(vehicle.images[0]) : null
  const isCustomer = user?.role === USER_ROLES.customer
  const canBuy = isCustomer && customer && !customerLoading
  const title = vehicle.model_name || 'Автомобиль'

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Автомобили', to: ROUTES.vehicles }, { label: title }]} />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
          {image ? (
            <img src={image} alt={title} className="aspect-[16/10] w-full object-cover" />
          ) : (
            <div
              className="grid aspect-[16/10] w-full place-items-center text-slate-300"
              aria-hidden="true"
            >
              <Icon name="car" className="h-24 w-24" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold tracking-[0.16em] text-[var(--color-accent)] uppercase">
                Автомобиль
              </span>
              {vehicle.status ? <StatusBadge status={vehicle.status} /> : null}
            </div>
            <h1 className="mb-2">{title}</h1>
            <p className="mb-0 text-3xl font-semibold tracking-tight text-[var(--color-text)] [font-variant-numeric:tabular-nums]">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          {feedback ? <Alert variant={feedback.variant}>{feedback.text}</Alert> : null}

          {canBuy ? (
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="accent" onClick={() => setConfirmOpen(true)}>
                Оформить заказ
              </Button>
              <Button
                size="lg"
                variant="secondary"
                loading={favoriteMutation.isPending}
                onClick={() => favoriteMutation.mutate()}
              >
                <Icon name="heart" className={isFavorite ? 'fill-red-600 text-red-600' : ''} />
                {isFavorite ? 'Убрать из избранного' : 'В избранное'}
              </Button>
            </div>
          ) : null}
          {isCustomer && customerLoading ? <Spinner className="justify-start py-2" /> : null}
          {!user ? (
            <Alert variant="info">
              <p>
                <Link to={ROUTES.login} className="link">
                  Войдите
                </Link>
                , чтобы оформить заказ или добавить автомобиль в избранное.
              </p>
            </Alert>
          ) : null}

          <LinkButton
            to={ROUTES.dealershipDetail(vehicle.dealership_id)}
            variant="ghost"
            icon="arrowRight"
            className="self-start"
          >
            Контакты салона #{vehicle.dealership_id}
          </LinkButton>
        </div>
      </div>

      <Panel title="Характеристики" className="mt-10">
        <DescriptionList
          items={[
            { label: 'VIN', value: vehicle.vin },
            { label: 'Год выпуска', value: vehicle.production_year },
            { label: 'Цвет кузова', value: vehicle.exterior_color },
            { label: 'Цвет салона', value: vehicle.interior_color },
          ]}
        />
      </Panel>

      <ConfirmDialog
        open={confirmOpen}
        title="Оформить заказ?"
        description={`Будет создан заказ на «${title}» по цене ${formatPrice(vehicle.price)}.`}
        confirmLabel="Оформить"
        loading={orderMutation.isPending}
        onConfirm={() => orderMutation.mutate()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
