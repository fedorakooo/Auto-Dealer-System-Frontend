import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOperationList, createWithIdempotency, actionIdempotencyKey, clearActionIdempotencyKey, mutateOperation } from '@/features/operations/operationsService.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { TextArea } from '@/shared/ui/Textarea.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'
import { parseApiError } from '@/services/api/errors.js'
import { applyApiFieldErrors } from '@/lib/formErrors.js'

const schema = z.object({ dealership_id: z.coerce.number().positive('Выберите дилерский центр'), vehicle_id: z.string().uuid().optional().or(z.literal('')), requested_datetime: z.string().min(1, 'Выберите дату и время'), notes: z.string().max(1000).optional() })
export function ServiceAppointmentsPage() {
  const { api } = useAuth(); const qc = useQueryClient()
  const appointments = useQuery({ queryKey: ['service-appointments'], queryFn: () => fetchOperationList(api, '/service/appointments', { limit: 50 }) })
  const catalog = useQuery({ queryKey: ['service-catalog'], queryFn: () => fetchOperationList(api, '/service/catalog', { limit: 100 }) })
  const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const create = useMutation({ mutationFn: (v) => createWithIdempotency(api, '/service/appointments', { ...v, vehicle_id: v.vehicle_id || null, requested_datetime: new Date(v.requested_datetime).toISOString(), notes: v.notes || null }, actionIdempotencyKey('service-appointment')), onSuccess: () => { clearActionIdempotencyKey('service-appointment'); qc.invalidateQueries({ queryKey: ['service-appointments'] }) }, onError: (error) => applyApiFieldErrors(error, setError) })
  const cancel = useMutation({ mutationFn: (id) => mutateOperation(api, 'delete', `/service/appointments/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['service-appointments'] }) })
  const items = Array.isArray(appointments.data) ? appointments.data : []
  return <div><PageHeader kicker="После продажи" title="Сервисные записи" subtitle="Запишитесь на обслуживание; повторная отправка защищена ключом идемпотентности." />
    {appointments.isLoading ? <Spinner /> : items.length ? <div className="space-y-3">{items.map((x) => <article key={x.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><strong>{x.requested_datetime ? new Date(x.requested_datetime).toLocaleString('ru-RU') : 'Запись'}</strong><StatusBadge status={x.status} /></div><p className="mt-2 text-sm">{x.notes || 'Без комментария'}</p>{x.status === 'requested' ? <Button variant="danger" size="sm" onClick={() => { if (window.confirm('Отменить сервисную запись?')) cancel.mutate(x.id) }} disabled={cancel.isPending}>Отменить</Button> : null}</article>)}</div> : <EmptyState title="Сервисных записей пока нет" description="Оформите первую запись ниже." />}
    <section className="mt-10 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2>Новая сервисная запись</h2><form onSubmit={handleSubmit((v) => create.mutate(v))} noValidate><Input id="service-dealer" label="ID дилерского центра" inputMode="numeric" error={errors.dealership_id?.message} {...register('dealership_id')} /><Input id="service-vehicle" label="ID автомобиля (необязательно)" hint="UUID автомобиля из вашего заказа" error={errors.vehicle_id?.message} {...register('vehicle_id')} /><Input id="service-time" label="Дата и время" type="datetime-local" error={errors.requested_datetime?.message} {...register('requested_datetime')} /><TextArea id="service-notes" label="Комментарий" error={errors.notes?.message} {...register('notes')} />{catalog.data ? <p className="text-sm">Доступно работ в каталоге: {Array.isArray(catalog.data) ? catalog.data.length : '—'}.</p> : null}{create.isError ? <p role="alert" className="text-sm text-red-700">{parseApiError(create.error).message}</p> : null}<Button type="submit" disabled={create.isPending}>{create.isPending ? 'Отправка…' : 'Создать запись'}</Button></form></section></div>
}
