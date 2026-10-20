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

const IDEMPOTENCY_SCOPE = 'service-appointment'

const schema = z.object({
  dealership_id: z.coerce.number().positive('Укажите ID дилерского центра'),
  vehicle_id: z.string().uuid('Введите корректный UUID').optional().or(z.literal('')),
  requested_datetime: z.string().min(1, 'Выберите дату и время'),
  notes: z.string().max(1000, 'Не более 1000 символов').optional(),
})

export function ServiceAppointmentsPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()
  const [cancelTarget, setCancelTarget] = useState(null)

  const appointmentsQuery = useQuery({
    queryKey: ['service-appointments'],
    queryFn: () => fetchOperationList(api, '/service/appointments', { limit: 50 }),
  })
  const catalogQuery = useQuery({
    queryKey: ['service-catalog'],
    queryFn: () => fetchOperationList(api, '/service/catalog', { limit: 100 }),
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
        '/service/appointments',
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
      queryClient.invalidateQueries({ queryKey: ['service-appointments'] })
    },
    onError: (error) => applyApiFieldErrors(error, setError),
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => mutateOperation(api, 'delete', `/service/appointments/${id}`),
    onSuccess: () => {
      setCancelTarget(null)
      queryClient.invalidateQueries({ queryKey: ['service-appointments'] })
    },
  })

  const appointments = Array.isArray(appointmentsQuery.data) ? appointmentsQuery.data : []
  const catalogSize = Array.isArray(catalogQuery.data) ? catalogQuery.data.length : null

  return (
    <div>
      <PageHeader
        kicker="После продажи"
        title="Сервисные записи"
        subtitle="Запишитесь на обслуживание; повторная отправка защищена ключом идемпотентности."
      />

      {appointmentsQuery.isLoading ? <Spinner /> : null}
      {appointmentsQuery.isError ? (
        <Alert variant="danger">{parseApiError(appointmentsQuery.error).message}</Alert>
      ) : null}
      {appointmentsQuery.isSuccess && !appointments.length ? (
        <EmptyState
          icon="wrench"
          title="Сервисных записей пока нет"
          description="Оформите первую запись в форме ниже."
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
                    : 'Запись'}
                </strong>
                <StatusBadge status={appointment.status} />
              </div>
              <p className="mt-2 mb-0 text-sm">{appointment.notes || 'Без комментария'}</p>
              {appointment.status === 'requested' ? (
                <Button
                  className="mt-3"
                  variant="secondary"
                  size="sm"
                  onClick={() => setCancelTarget(appointment.id)}
                >
                  Отменить запись
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <Panel title="Новая сервисная запись" className="mt-10 max-w-xl">
        <form onSubmit={handleSubmit((values) => createMutation.mutate(values))} noValidate>
          <Input
            id="service-dealer"
            label="ID дилерского центра"
            inputMode="numeric"
            error={errors.dealership_id?.message}
            {...register('dealership_id')}
          />
          <Input
            id="service-vehicle"
            label="ID автомобиля (необязательно)"
            hint="UUID автомобиля из вашего заказа"
            error={errors.vehicle_id?.message}
            {...register('vehicle_id')}
          />
          <Input
            id="service-time"
            label="Дата и время"
            type="datetime-local"
            error={errors.requested_datetime?.message}
            {...register('requested_datetime')}
          />
          <Textarea
            id="service-notes"
            label="Комментарий"
            error={errors.notes?.message}
            {...register('notes')}
          />
          {catalogSize !== null ? (
            <p className="text-sm">Доступно работ в каталоге: {catalogSize}.</p>
          ) : null}
          {createMutation.isError ? (
            <Alert variant="danger">{parseApiError(createMutation.error).message}</Alert>
          ) : null}
          <Button type="submit" loading={createMutation.isPending}>
            {createMutation.isPending ? 'Отправка…' : 'Создать запись'}
          </Button>
        </form>
      </Panel>

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Отменить сервисную запись?"
        description="Запись будет отменена. Это действие нельзя отменить."
        confirmLabel="Отменить запись"
        cancelLabel="Не отменять"
        destructive
        loading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate(cancelTarget)}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  )
}
