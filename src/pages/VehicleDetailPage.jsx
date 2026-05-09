import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { useVehicleDetailQuery } from '@/features/vehicles/hooks/useVehicleQueries.js'
import { createOrder } from '@/features/orders/orderService.js'
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from '@/features/favorites/favoriteService.js'
import { favoritesResponseSchema } from '@/features/favorites/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'
import { formatPrice } from '@/lib/format.js'
import { resolveMediaUrl } from '@/lib/mediaUrl.js'
import { ROUTES } from '@/constants/routes.js'
import { USER_ROLES } from '@/constants/roles.js'
import { useState } from 'react'

export function VehicleDetailPage() {
  const { id } = useParams()
  const { api, user } = useAuth()
  const { data: customer, isLoading: custLoading } = useCustomerRecord()
  const qc = useQueryClient()
  const [msg, setMsg] = useState('')

  const vq = useVehicleDetailQuery(api, id)

  const favQ = useQuery({
    queryKey: QK.favorites(customer?.id),
    queryFn: async () => {
      const raw = await fetchFavorites(api, customer.id)
      return favoritesResponseSchema.parse(raw)
    },
    enabled: !!customer?.id && !!vq.data?.id,
  })

  const isFavorite = favQ.data?.vehicles?.some((x) => x.id === id)

  const favMut = useMutation({
    mutationFn: async () => {
      if (!customer || !vq.data) return
      const body = { customer_id: customer.id, vehicle_id: vq.data.id }
      if (isFavorite) await removeFavorite(api, body)
      else await addFavorite(api, body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      setMsg('')
    },
    onError: (e) => setMsg(parseApiError(e).message),
  })

  const orderMut = useMutation({
    mutationFn: async () => {
      if (!customer || !vq.data) throw new Error('Нет данных')
      await createOrder(api, {
        customer_id: customer.id,
        vehicle_id: vq.data.id,
        dealership_id: vq.data.dealership_id,
        final_price: String(vq.data.price),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      setMsg('Заказ создан')
    },
    onError: (e) => setMsg(parseApiError(e).message),
  })

  if (vq.isLoading) return <Spinner />
  if (vq.isError || !vq.data) {
    return <ErrorFallback message={parseApiError(vq.error).message} onRetry={() => vq.refetch()} />
  }

  const vehicle = vq.data
  const img = vehicle.images?.[0] ? resolveMediaUrl(vehicle.images[0]) : null

  const canBuy = user?.role === USER_ROLES.customer && customer && !custLoading

  return (
    <div>
      <PageHeader kicker="Автомобиль" title={vehicle.model_name || 'Модель'} />
      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        {img ? (
          <img
            src={img}
            alt=""
            style={{ width: '100%', borderRadius: 4, border: '1px solid var(--color-border)' }}
          />
        ) : (
          <div style={{ aspectRatio: '16/10', background: '#1a1a1a', borderRadius: 4 }} />
        )}
        <div>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{formatPrice(vehicle.price)}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>
            VIN: {vehicle.vin} · {vehicle.production_year} · {vehicle.exterior_color}
          </p>
          <p>
            <Link to={ROUTES.dealershipDetail(vehicle.dealership_id)}>
              Салон #{vehicle.dealership_id}
            </Link>
          </p>
          {msg ? (
            <p
              style={{ color: msg.startsWith('Заказ') ? 'var(--color-accent-strong)' : '#fca5a5' }}
            >
              {msg}
            </p>
          ) : null}
          {canBuy ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="button" onClick={() => orderMut.mutate()} disabled={orderMut.isPending}>
                Оформить заказ
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => favMut.mutate()}
                disabled={favMut.isPending}
              >
                {isFavorite ? 'Убрать из избранного' : 'В избранное'}
              </Button>
            </div>
          ) : user?.role === USER_ROLES.customer && custLoading ? (
            <Spinner />
          ) : null}
        </div>
      </div>
    </div>
  )
}
