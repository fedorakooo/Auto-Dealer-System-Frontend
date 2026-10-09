import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOperationList, mutateOperation } from '@/features/operations/operationsService.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { parseApiError } from '@/services/api/errors.js'
import { applyApiFieldErrors } from '@/lib/formErrors.js'

const schema = z.object({ label: z.string().min(1, 'Укажите название'), country: z.string().min(1, 'Укажите страну'), city: z.string().min(1, 'Укажите город'), address_line_1: z.string().min(1, 'Укажите адрес'), address_line_2: z.string().optional(), postal_code: z.string().optional(), is_default: z.boolean().optional() })
export function AddressesPage() {
  const { api } = useAuth(); const qc = useQueryClient()
  const q = useQuery({ queryKey: ['addresses'], queryFn: () => fetchOperationList(api, '/customers/me/addresses') })
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const save = useMutation({ mutationFn: (body) => mutateOperation(api, 'post', '/customers/me/addresses', body), onSuccess: () => { reset(); qc.invalidateQueries({ queryKey: ['addresses'] }) }, onError: (error) => applyApiFieldErrors(error, setError) })
  const remove = useMutation({ mutationFn: (id) => mutateOperation(api, 'delete', `/customers/me/addresses/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }) })
  const addresses = Array.isArray(q.data) ? q.data : []
  return <div><PageHeader kicker="Кабинет" title="Адреса" subtitle="Адрес доставки и контакта управляется только в вашем профиле." />{q.isLoading ? <Spinner /> : addresses.length ? <div className="grid gap-3 md:grid-cols-2">{addresses.map((a) => <article key={a.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><strong>{a.label}</strong>{a.is_default ? <span className="ml-2 text-xs font-semibold text-emerald-700">Основной</span> : null}<p className="mt-2 text-sm">{[a.address_line_1, a.address_line_2, a.city, a.country, a.postal_code].filter(Boolean).join(', ')}</p><Button size="sm" variant="danger" disabled={remove.isPending} onClick={() => { if (window.confirm('Удалить этот адрес?')) remove.mutate(a.id) }}>Удалить</Button></article>)}</div> : <EmptyState title="Нет сохранённых адресов" description="Добавьте адрес для доставки и связи." />}
  <section className="mt-10 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2>Добавить адрес</h2><form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate><Input id="address-label" label="Название" placeholder="Дом" error={errors.label?.message} {...register('label')} /><Input id="address-country" label="Страна" error={errors.country?.message} {...register('country')} /><Input id="address-city" label="Город" error={errors.city?.message} {...register('city')} /><Input id="address-line-1" label="Адрес" error={errors.address_line_1?.message} {...register('address_line_1')} /><Input id="address-line-2" label="Квартира / офис" {...register('address_line_2')} /><Input id="address-postal" label="Индекс" {...register('postal_code')} /><label className="mb-4 flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" {...register('is_default')} /> Основной адрес</label>{save.isError ? <p role="alert" className="text-sm text-red-700">{parseApiError(save.error).message}</p> : null}<Button type="submit" disabled={save.isPending}>Сохранить адрес</Button></form></section></div>
}
