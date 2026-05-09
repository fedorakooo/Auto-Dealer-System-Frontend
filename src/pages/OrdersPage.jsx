import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOrders } from '@/features/orders/orderService.js'
import { ordersResponseSchema } from '@/features/orders/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { parseApiError } from '@/services/api'
import { formatPrice } from '@/lib/format.js'
import { ROUTES } from '@/constants/routes.js'

export function OrdersPage() {
  const { api } = useAuth()

  const q = useQuery({
    queryKey: QK.orders({ page: 1 }),
    queryFn: async () => {
      const raw = await fetchOrders(api, { page: 1, limit: 50 })
      return ordersResponseSchema.parse(raw)
    },
  })

  if (q.isLoading) return <Spinner />
  if (q.isError)
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />

  const { orders } = q.data

  return (
    <div>
      <PageHeader kicker="Покупки" title="Заказы автомобилей" />
      {!orders.length ? (
        <EmptyState title="Нет заказов" description="Оформите заказ из карточки автомобиля." />
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {orders.map((o) => (
            <li
              key={o.id}
              style={{
                padding: '1rem',
                marginBottom: '0.75rem',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
              }}
            >
              <strong>{o.status}</strong> · {formatPrice(o.final_price)}
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.35rem',
                }}
              >
                <Link to={ROUTES.vehicleDetail(o.vehicle_id)}>Автомобиль</Link> · салон #
                {o.dealership_id}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
