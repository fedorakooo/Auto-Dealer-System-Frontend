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
import { parseApiError } from '@/services/api/errors.js'
import { QK } from '@/constants/queryKeys.js'
import { endpoints } from '@/services/api/endpoints.js'
import { applyApiFieldErrors } from '@/lib/formErrors.js'
import { formatDateTime } from '@/lib/format.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'
import { Textarea } from '@/shared/ui/Textarea.jsx'
import { t } from '@/shared/i18n/index.js'

const IDEMPOTENCY_SCOPE = 'service-appointment'

const schema = z.object({
  dealership_id: z.coerce
    .number()
    .positive({ error: () => t('account.service.dealershipIdRequired') }),
  vehicle_id: z
    .string()
    .uuid({ error: () => t('account.service.vehicleIdInvalid') })
    .optional()
    .or(z.literal('')),
  requested_datetime: z.string().min(1, { error: () => t('account.service.dateTimeRequired') }),
  notes: z
    .string()
    .max(1000, { error: () => t('account.service.notesTooLong') })
    .optional(),
})

export function ServiceAppointmentsPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()
  const [cancelTarget, setCancelTarget] = useState(null)

  const appointmentsQuery = useQuery({
    queryKey: QK.serviceAppointments,
    queryFn: () => fetchOperationList(api, endpoints.serviceAppointments, { limit: 50 }),
  })
  const catalogQuery = useQuery({
    queryKey: QK.serviceCatalog,
    queryFn: () => fetchOperationList(api, endpoints.serviceCatalog, { limit: 100 }),
  })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const createMutation = useMutation({
    mutationFn: (values) =>
      createWithIdempotency(
        api,
        endpoints.serviceAppointments,
        {
          ...values,
          vehicle_id: values.vehicle_id || null,
          requested_datetime: new Date(values.requested_datetime).toISOString(),
          notes: values.notes || null,
        },
        actionIdempotencyKey(IDEMPOTENCY_SCOPE)
      ),
    onSuccess: () => {
      clearActionIdempotencyKey(IDEMPOTENCY_SCOPE)
      reset()
      queryClient.invalidateQueries({ queryKey: QK.serviceAppointments })
    },
    onError: (error) => applyApiFieldErrors(error, setError),
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => mutateOperation(api, 'delete', endpoints.serviceAppointment(id)),
    onSuccess: () => {
      setCancelTarget(null)
      queryClient.invalidateQueries({ queryKey: QK.serviceAppointments })
    },
  })

  const appointments = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : []
  const catalogSize = Array.isArray(catalogQuery.data) ? catalogQuery.data.length : null

  return (
    <div>
      <PageHeader
        kicker={t('account.service.kicker')}
        title={t('account.service.title')}
        subtitle={t('account.service.subtitle')}
      />

      {appointmentsQuery.isLoading ? <Spinner /> : null}
      {appointmentsQuery.isError ? (
        <Alert variant="danger">{parseApiError(appointmentsQuery.error).message}</Alert>
      ) : null}
      {appointmentsQuery.isSuccess && !appointments.length ? (
        <EmptyState
          icon="wrench"
          title={t('account.service.emptyTitle')}
          description={t('account.service.emptyDescription')}
        />
      ) : null}
      {appointments.length ? (
        <ul className="m-0 list-none space-y-3 p-0">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:px-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <strong className="text-[var(--color-text)]">
                  {appointment.requested_datetime
                    ? formatDateTime(appointment.requested_datetime)
                    : t('account.service.appointment')}
                </strong>
                <StatusBadge status={appointment.status} />
              </div>
              <p className="mt-2 mb-0 text-sm">
                {appointment.notes || t('account.service.noComment')}
              </p>
              {appointment.status === 'requested' ? (
                <Button
                  className="mt-3"
                  variant="secondary"
                  size="sm"
                  onClick={() => setCancelTarget(appointment.id)}
                >
                  {t('account.service.cancel')}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <Panel title={t('account.service.newAppointment')} className="mt-10 max-w-xl">
        <form onSubmit={handleSubmit((values) => createMutation.mutate(values))} noValidate>
          <Input
            id="service-dealer"
            label={t('account.service.dealershipId')}
            inputMode="numeric"
            error={errors.dealership_id?.message}
            {...register('dealership_id')}
          />
          <Input
            id="service-vehicle"
            label={t('account.service.vehicleId')}
            hint={t('account.service.vehicleIdHint')}
            error={errors.vehicle_id?.message}
            {...register('vehicle_id')}
          />
          <Input
            id="service-time"
            label={t('account.common.dateTime')}
            type="datetime-local"
            error={errors.requested_datetime?.message}
            {...register('requested_datetime')}
          />
          <Textarea
            id="service-notes"
            label={t('account.common.comment')}
            error={errors.notes?.message}
            {...register('notes')}
          />
          {catalogSize !== null ? (
            <p className="text-sm">{t('account.service.catalogSize', { count: catalogSize })}</p>
          ) : null}
          {createMutation.isError ? (
            <Alert variant="danger">{parseApiError(createMutation.error).message}</Alert>
          ) : null}
          <Button type="submit" loading={createMutation.isPending}>
            {createMutation.isPending
              ? t('account.service.submitting')
              : t('account.service.submit')}
          </Button>
        </form>
      </Panel>

      <ConfirmDialog
        open={cancelTarget !== null}
        title={t('account.service.cancelDialog.title')}
        description={t('account.service.cancelDialog.description')}
        confirmLabel={t('account.service.cancelDialog.confirm')}
        cancelLabel={t('account.service.cancelDialog.dismiss')}
        destructive
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate(cancelTarget)}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  )
}
