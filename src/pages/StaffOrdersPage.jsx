import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOrders, patchOrderStatus } from '@/features/orders/orderService.js'
import { ordersResponseSchema } from '@/features/orders/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { parseApiError } from '@/services/api'
import { ORDER_STATUSES } from '@/constants/enums.js'
import { formatPrice } from '@/lib/format.js'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'

export function StaffOrdersPage() {
  const { api } = useAuth()
  const qc = useQueryClient()

  const q = useQuery({
    queryKey: QK.orders({ page: 1, staff: true }),
    queryFn: async () => {
      const raw = await fetchOrders(api, { page: 1, limit: 50 })
      return ordersResponseSchema.parse(raw)
    },
  })

  const mut = useMutation({
    mutationFn: async ({ id, status }) => {
      await patchOrderStatus(api, id, { status })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  if (q.isLoading) return <Spinner />
  if (q.isError)
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />

  return (
    <div>
      <PageHeader kicker="Staff" title="Заказы (смена статуса)" />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {q.data.orders.map((o) => (
          <li
            key={o.id}
            style={{
              padding: '1rem',
              marginBottom: '0.75rem',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              display: 'grid',
              gap: '0.75rem',
            }}
          >
            <div>
              <Link to={ROUTES.vehicleDetail(o.vehicle_id)}>{o.vehicle_id}</Link> ·{' '}
              {formatPrice(o.final_price)}
            </div>
            <Select
              id={`st-${o.id}`}
              label="Статус"
              value={o.status}
              onChange={(e) => mut.mutate({ id: o.id, status: e.target.value })}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </li>
        ))}
      </ul>
    </div>
  )
}
