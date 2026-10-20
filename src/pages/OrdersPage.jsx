import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOrders } from '@/features/orders/orderService.js'
import { ordersResponseSchema } from '@/features/orders/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { ROUTES } from '@/constants/routes.js'
import { parseApiError } from '@/services/api'
import { formatPrice } from '@/lib/format.js'
import { LinkButton } from '@/shared/ui/Button.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'

export function OrdersPage() {
  const { api } = useAuth()

  const query = useQuery({
    queryKey: QK.orders({ page: 1 }),
    queryFn: async () => {
      const raw = await fetchOrders(api, { page: 1, limit: 50 })
      return ordersResponseSchema.parse(raw)
    },
  })

  if (query.isLoading) return <Spinner />
  if (query.isError) {
    return (
      <ErrorFallback message={parseApiError(query.error).message} onRetry={() => query.refetch()} />
    )
  }

  const { orders } = query.data

  return (
    <div>
      <PageHeader kicker="Покупки" title="Заказы автомобилей" />
      {!orders.length ? (
        <EmptyState
          icon="receipt"
          title="Заказов пока нет"
          description="Оформите заказ из карточки автомобиля."
          action={<LinkButton to={ROUTES.vehicles}>Перейти в каталог</LinkButton>}
        />
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:px-5"
            >
              <div>
                <p className="mb-1 text-lg font-semibold text-[var(--color-text)] [font-variant-numeric:tabular-nums]">
                  {formatPrice(order.final_price)}
                </p>
                <p className="mb-0 text-sm">
                  <Link to={ROUTES.vehicleDetail(order.vehicle_id)} className="link">
                    Автомобиль
                  </Link>{' '}
                  · салон #{order.dealership_id}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
