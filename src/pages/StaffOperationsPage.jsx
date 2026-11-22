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
import { ROUTES } from '@/constants/routes.js'
import { endpoints } from '@/services/api/endpoints.js'
import { APPOINTMENT_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '@/constants/enums.js'
import { QK } from '@/constants/queryKeys.js'
import { statusLabel } from '@/constants/statuses.js'
import { parseApiError } from '@/services/api/errors.js'
import { formatDateTime } from '@/lib/format.js'
import { t } from '@/shared/i18n/index.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button, LinkButton } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'

const paymentSchema = z.object({
  order_id: z.string().uuid({ error: () => t('staff.operations.errors.orderId') }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { error: () => t('staff.operations.errors.amount') }),
  method: z.enum(PAYMENT_METHODS),
  status: z.enum(PAYMENT_STATUSES),
  external_reference: z.string().optional(),
})

export function StaffOperationsPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()
  const [pendingAppointment, setPendingAppointment] = useState(null)

  const appointmentsQuery = useQuery({
    queryKey: QK.staffAppointments,
    queryFn: () => fetchOperationList(api, endpoints.serviceAppointments, { limit: 50 }),
  })

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: 'bank_transfer', status: 'paid' },
  })
  const paymentMutation = useMutation({
    mutationFn: (values) =>
      createWithIdempotency(
        api,
        endpoints.orderPayments(values.order_id),
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
      queryClient.invalidateQueries({ queryKey: QK.orderPayments })
    },
  })

  const appointmentMutation = useMutation({
    mutationFn: ({ id, status }) =>
      mutateOperation(api, 'patch', endpoints.serviceAppointmentStatus(id), { status }),
    onSuccess: () => {
      setPendingAppointment(null)
      queryClient.invalidateQueries({ queryKey: QK.staffAppointments })
    },
    onError: () => setPendingAppointment(null),
  })

  const appointments = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : []
  const paymentErrors = paymentForm.formState.errors

  return (
    <div>
      <PageHeader
        kicker={t('staff.operations.kicker')}
        title={t('staff.operations.title')}
        subtitle={t('staff.operations.subtitle')}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={t('staff.operations.payment.title')}>
          <form
            onSubmit={paymentForm.handleSubmit((values) => paymentMutation.mutate(values))}
            noValidate
          >
            <Input
              id="payment-order"
              label={t('staff.operations.payment.orderId')}
              error={paymentErrors.order_id?.message}
              {...paymentForm.register('order_id')}
            />
            <Input
              id="payment-amount"
              label={t('staff.operations.payment.amount')}
              inputMode="decimal"
              error={paymentErrors.amount?.message}
              {...paymentForm.register('amount')}
            />
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Select
                id="payment-method"
                label={t('staff.operations.payment.method')}
                error={paymentErrors.method?.message}
                {...paymentForm.register('method')}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {t(`staff.operations.paymentMethods.${method}`)}
                  </option>
                ))}
              </Select>
              <Select
                id="payment-status"
                label={t('staff.operations.payment.status')}
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
              label={t('staff.operations.payment.reference')}
              {...paymentForm.register('external_reference')}
            />
            {paymentMutation.isError ? (
              <Alert variant="danger">{parseApiError(paymentMutation.error).message}</Alert>
            ) : null}
            {paymentMutation.isSuccess ? (
              <Alert variant="success">{t('staff.operations.payment.success')}</Alert>
            ) : null}
            <Button type="submit" loading={paymentMutation.isPending}>
              {paymentMutation.isPending
                ? t('staff.operations.payment.saving')
                : t('staff.operations.payment.submit')}
            </Button>
          </form>
        </Panel>

        <Panel title={t('staff.operations.vehicleStatus.title')}>
          <p className="text-sm">{t('staff.operations.vehicleStatus.text')}</p>
          <LinkButton to={ROUTES.staffCatalog} variant="secondary" icon="arrowRight">
            {t('staff.operations.vehicleStatus.link')}
          </LinkButton>
        </Panel>
      </div>

      <Panel title={t('staff.operations.appointments.title')} className="mt-6">
        {appointmentsQuery.isLoading ? <Spinner /> : null}
        {appointmentsQuery.isError ? (
          <Alert variant="danger">{parseApiError(appointmentsQuery.error).message}</Alert>
        ) : null}
        {appointmentMutation.isError ? (
          <Alert variant="danger">{parseApiError(appointmentMutation.error).message}</Alert>
        ) : null}
        {appointmentsQuery.isSuccess && !appointments.length ? (
          <EmptyState icon="wrench" title={t('staff.operations.appointments.empty')} />
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
                  label={
                    <span className="sr-only">
                      {t('staff.operations.appointments.changeStatus')}
                    </span>
                  }
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
        open={pendingAppointment !== null}
        title={t('staff.operations.appointments.confirmTitle')}
        description={
          pendingAppointment
            ? t('staff.operations.appointments.confirmDescription', {
                status: statusLabel(pendingAppointment.status),
              })
            : undefined
        }
        loading={appointmentMutation.isPending}
        onConfirm={() => appointmentMutation.mutate(pendingAppointment)}
        onCancel={() => setPendingAppointment(null)}
      />
    </div>
  )
}
