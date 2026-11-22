import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOrders, patchOrderStatus } from '@/features/orders/orderService.js'
import { ordersResponseSchema } from '@/features/orders/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { ROUTES } from '@/constants/routes.js'
import { ORDER_STATUSES } from '@/constants/enums.js'
import { statusLabel } from '@/constants/statuses.js'
import { parseApiError } from '@/services/api'
import { formatPrice } from '@/lib/format.js'
import { t } from '@/shared/i18n/index.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'
import { DataTable } from '@/shared/ui/Table.jsx'

export function StaffOrdersPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: QK.orders({ page: 1, staff: true }),
    queryFn: async () => {
      const raw = await fetchOrders(api, { page: 1, limit: 50 })
      return ordersResponseSchema.parse(raw)
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await patchOrderStatus(api, id, { status })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK.all.orders }),
  })

  const columns = [
    {
      key: 'vehicle_id',
      header: t('staff.orders.columns.vehicle'),
      render: (order) =>
        order.model_id ? (
          <Link
            to={ROUTES.vehicleDetail(order.model_id, order.vehicle_id)}
            className="link font-mono text-xs"
          >
            {order.vehicle_id}
          </Link>
        ) : (
          <span className="font-mono text-xs">{order.vehicle_id}</span>
        ),
    },
    {
      key: 'final_price',
      header: t('staff.orders.columns.amount'),
      className: '[font-variant-numeric:tabular-nums]',
      render: (order) => formatPrice(order.final_price),
    },
    {
      key: 'status',
      header: t('staff.orders.columns.status'),
      className: 'min-w-56',
      render: (order) => (
        <Select
          id={`order-status-${order.id}`}
          className="mb-0"
          label={<span className="sr-only">{t('staff.orders.statusLabel', { id: order.id })}</span>}
          value={order.status}
          disabled={mutation.isPending}
          onChange={(event) => mutation.mutate({ id: order.id, status: event.target.value })}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </Select>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        kicker={t('staff.orders.kicker')}
        title={t('staff.orders.title')}
        subtitle={t('staff.orders.subtitle')}
      />
      {mutation.isError ? (
        <Alert variant="danger">{parseApiError(mutation.error).message}</Alert>
      ) : null}
      {query.isLoading ? <Skeleton className="h-64" /> : null}
      {query.isError ? (
        <ErrorFallback
          message={parseApiError(query.error).message}
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess ? (
        <DataTable
          caption={t('staff.orders.tableCaption')}
          columns={columns}
          rows={query.data.orders}
          getRowKey={(order) => order.id}
          emptyMessage={t('staff.orders.empty')}
        />
      ) : null}
    </div>
  )
}
