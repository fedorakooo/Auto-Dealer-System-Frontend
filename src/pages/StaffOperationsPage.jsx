import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import {
  actionIdempotencyKey,
  clearActionIdempotencyKey,
  createWithIdempotency,
  fetchOperationList,
  mutateOperation,
} from '@/features/operations/operationsService.js'
import { statusLabel } from '@/constants/statuses.js'
import { parseApiError } from '@/services/api/errors.js'
import { formatDateTime } from '@/lib/format.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'
import { Textarea } from '@/shared/ui/Textarea.jsx'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Банковский перевод' },
  { value: 'bank_card', label: 'Банковская карта' },
  { value: 'cash', label: 'Наличные' },
  { value: 'loan', label: 'Кредит' },
  { value: 'lease', label: 'Лизинг' },
]
const PAYMENT_STATUSES = ['paid', 'pending', 'authorized', 'failed', 'refunded']
const VEHICLE_STATUSES = ['in_stock', 'reserved', 'sold', 'service', 'unavailable']
const APPOINTMENT_STATUSES = ['requested', 'confirmed', 'in_progress', 'completed', 'cancelled']

const paymentSchema = z.object({
  order_id: z.string().uuid('Введите UUID заказа'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Введите сумму, например 1500.00'),
  method: z.enum(['cash', 'bank_card', 'bank_transfer', 'loan', 'lease']),
  status: z.enum(['pending', 'authorized', 'paid', 'failed', 'refunded']),
  external_reference: z.string().optional(),
})

const vehicleStatusSchema = z.object({
  vehicle_id: z.string().uuid('Введите UUID автомобиля'),
  status: z.enum(['in_stock', 'reserved', 'sold', 'service', 'unavailable']),
  reason: z.string().max(1000, 'Не более 1000 символов').optional(),
})

export function StaffOperationsPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()
  const [pendingVehicleStatus, setPendingVehicleStatus] = useState(null)
  const [pendingAppointment, setPendingAppointment] = useState(null)

  const appointmentsQuery = useQuery({
    queryKey: ['staff-appointments'],
    queryFn: () => fetchOperationList(api, '/service/appointments', { limit: 50 }),
  })

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: 'bank_transfer', status: 'paid' },
  })
  const vehicleStatusForm = useForm({
    resolver: zodResolver(vehicleStatusSchema),
    defaultValues: { status: 'in_stock' },
  })

  const paymentMutation = useMutation({
    mutationFn: (values) =>
      createWithIdempotency(
        api,
        `/orders/${values.order_id}/payments`,
        {
          amount: values.amount,
          method: values.method,
          status: values.status,
          external_reference: values.external_reference || null,
        },
        actionIdempotencyKey(`payment:${values.order_id}`)
      ),
    onSuccess: (_, values) => {
      clearActionIdempotencyKey(`payment:${values.order_id}`)
      paymentForm.reset()
      queryClient.invalidateQueries({ queryKey: ['order-payments'] })
    },
  })

  const vehicleStatusMutation = useMutation({
    mutationFn: (values) =>
      mutateOperation(api, 'post', `/vehicles/${values.vehicle_id}/status`, {
        status: values.status,
        reason: values.reason || null,
      }),
    onSuccess: () => {
      setPendingVehicleStatus(null)
      vehicleStatusForm.reset()
    },
    onError: () => setPendingVehicleStatus(null),
  })

  const appointmentMutation = useMutation({
    mutationFn: ({ id, status }) =>
      mutateOperation(api, 'patch', `/service/appointments/${id}/status`, { status }),
    onSuccess: () => {
      setPendingAppointment(null)
      queryClient.invalidateQueries({ queryKey: ['staff-appointments'] })
    },
    onError: () => setPendingAppointment(null),
  })

  const appointments = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : []
  const paymentErrors = paymentForm.formState.errors
  const statusErrors = vehicleStatusForm.formState.errors

  return (
    <div>
      <PageHeader
        kicker="Сотрудникам"
        title="Операции, платежи и сервис"
        subtitle="Изменения статусов и финансовые операции требуют подтверждения на сервере."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Зарегистрировать платёж">
          <form
            onSubmit={paymentForm.handleSubmit((values) => paymentMutation.mutate(values))}
            noValidate
          >
            <Input
              id="payment-order"
              label="UUID заказа"
              error={paymentErrors.order_id?.message}
              {...paymentForm.register('order_id')}
            />
            <Input
              id="payment-amount"
              label="Сумма"
              inputMode="decimal"
              error={paymentErrors.amount?.message}
              {...paymentForm.register('amount')}
            />
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Select
                id="payment-method"
                label="Метод"
                error={paymentErrors.method?.message}
                {...paymentForm.register('method')}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </Select>
              <Select
                id="payment-status"
                label="Статус"
                error={paymentErrors.status?.message}
                {...paymentForm.register('status')}
              >
                {PAYMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </Select>
            </div>
            <Input
              id="payment-reference"
              label="Внешняя ссылка"
              {...paymentForm.register('external_reference')}
            />
            {paymentMutation.isError ? (
              <Alert variant="danger">{parseApiError(paymentMutation.error).message}</Alert>
            ) : null}
            {paymentMutation.isSuccess ? (
              <Alert variant="success">Платёж зарегистрирован.</Alert>
            ) : null}
            <Button type="submit" loading={paymentMutation.isPending}>
              {paymentMutation.isPending ? 'Сохранение…' : 'Создать платёж'}
            </Button>
          </form>
        </Panel>

        <Panel title="Статус автомобиля">
          <form
            onSubmit={vehicleStatusForm.handleSubmit((values) => setPendingVehicleStatus(values))}
            noValidate
          >
            <Input
              id="vehicle-status-id"
              label="UUID автомобиля"
              error={statusErrors.vehicle_id?.message}
              {...vehicleStatusForm.register('vehicle_id')}
            />
            <Select
              id="vehicle-status"
              label="Новый статус"
              error={statusErrors.status?.message}
              {...vehicleStatusForm.register('status')}
            >
              {VEHICLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </Select>
            <Textarea
              id="vehicle-status-reason"
              label="Причина"
              error={statusErrors.reason?.message}
              {...vehicleStatusForm.register('reason')}
            />
            {vehicleStatusMutation.isError ? (
              <Alert variant="danger">{parseApiError(vehicleStatusMutation.error).message}</Alert>
            ) : null}
            {vehicleStatusMutation.isSuccess ? (
              <Alert variant="success">Статус автомобиля обновлён.</Alert>
            ) : null}
            <Button type="submit">Изменить статус</Button>
          </form>
        </Panel>
      </div>

      <Panel title="Сервисные заявки" className="mt-6">
        {appointmentsQuery.isLoading ? <Spinner /> : null}
        {appointmentsQuery.isError ? (
          <Alert variant="danger">{parseApiError(appointmentsQuery.error).message}</Alert>
        ) : null}
        {appointmentMutation.isError ? (
          <Alert variant="danger">{parseApiError(appointmentMutation.error).message}</Alert>
        ) : null}
        {appointmentsQuery.isSuccess && !appointments.length ? (
          <EmptyState icon="wrench" title="Заявок нет" />
        ) : null}
        {appointments.length ? (
          <ul className="m-0 list-none divide-y divide-[var(--color-border)] p-0">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="font-medium text-[var(--color-text)]">
                  {appointment.requested_datetime
                    ? formatDateTime(appointment.requested_datetime)
                    : appointment.id}
                </span>
                <StatusBadge status={appointment.status} />
                <Select
                  id={`appointment-status-${appointment.id}`}
                  className="mb-0 w-52"
                  label={<span className="sr-only">Изменить статус заявки</span>}
                  value={appointment.status || 'requested'}
                  onChange={(event) =>
                    setPendingAppointment({ id: appointment.id, status: event.target.value })
                  }
                >
                  {APPOINTMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </Select>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>

      <ConfirmDialog
        open={pendingVehicleStatus !== null}
        title="Изменить статус автомобиля?"
        description={
          pendingVehicleStatus
            ? `Новый статус: «${statusLabel(pendingVehicleStatus.status)}».`
            : undefined
        }
        loading={vehicleStatusMutation.isPending}
        onConfirm={() => vehicleStatusMutation.mutate(pendingVehicleStatus)}
        onCancel={() => setPendingVehicleStatus(null)}
      />
      <ConfirmDialog
        open={pendingAppointment !== null}
        title="Изменить статус заявки?"
        description={
          pendingAppointment
            ? `Новый статус: «${statusLabel(pendingAppointment.status)}».`
            : undefined
        }
        loading={appointmentMutation.isPending}
        onConfirm={() => appointmentMutation.mutate(pendingAppointment)}
        onCancel={() => setPendingAppointment(null)}
      />
    </div>
  )
}
