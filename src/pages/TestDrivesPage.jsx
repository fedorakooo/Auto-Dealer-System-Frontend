import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import {
  fetchTestDrivesByCustomer,
  createTestDrive,
} from '@/features/test-drives/testDriveService.js'
import { testDrivesResponseSchema } from '@/features/test-drives/schemas.js'
import { fetchVehicles } from '@/features/vehicles/vehicleService.js'
import { vehiclesResponseSchema } from '@/features/vehicles/schemas.js'
import { fetchDealerships } from '@/features/dealerships/dealershipService.js'
import { dealershipsResponseSchema } from '@/features/dealerships/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { TextArea } from '@/shared/ui/Textarea.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { parseApiError } from '@/services/api'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'

const formSchema = z.object({
  vehicle_id: z.string().uuid(),
  dealership_id: z.coerce.number(),
  requested_datetime: z.string().min(1),
  notes: z.string().optional(),
})

export function TestDrivesPage() {
  const { api } = useAuth()
  const { data: customer, isLoading: cl } = useCustomerRecord()
  const qc = useQueryClient()

  const tq = useQuery({
    queryKey: ['test-drives', customer?.id],
    queryFn: async () => {
      const raw = await fetchTestDrivesByCustomer(api, customer.id)
      return testDrivesResponseSchema.parse(raw)
    },
    enabled: !!customer?.id,
  })

  const vq = useQuery({
    queryKey: QK.vehicles({ page: 1, list: 'td' }),
    queryFn: async () => {
      const raw = await fetchVehicles(api, { page: 1, limit: 50, is_active: true })
      return vehiclesResponseSchema.parse(raw)
    },
  })

  const dq = useQuery({
    queryKey: QK.dealerships({ page: 1, td: 1 }),
    queryFn: async () => {
      const raw = await fetchDealerships(api, { page: 1, limit: 100 })
      return dealershipsResponseSchema.parse(raw)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) })

  const mut = useMutation({
    mutationFn: async (values) => {
      await createTestDrive(api, {
        customer_id: customer.id,
        vehicle_id: values.vehicle_id,
        dealership_id: values.dealership_id,
        requested_datetime: new Date(values.requested_datetime).toISOString(),
        notes: values.notes || null,
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['test-drives'] }),
  })

  if (cl) return <Spinner />
  if (!customer) return <EmptyState title="Нужен профиль покупателя" />

  if (tq.isLoading) return <Spinner />
  if (tq.isError)
    return <ErrorFallback message={parseApiError(tq.error).message} onRetry={() => tq.refetch()} />

  return (
    <div>
      <PageHeader kicker="Сервис" title="Тест-драйвы" />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tq.data.test_drives.map((td) => (
          <li
            key={td.id}
            style={{
              padding: '0.75rem',
              marginBottom: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
            }}
          >
            {td.status} · {new Date(td.requested_datetime).toLocaleString()}
          </li>
        ))}
      </ul>

      <section style={{ marginTop: '2rem', maxWidth: 440 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Новая заявка</h2>
        <form onSubmit={handleSubmit((v) => mut.mutate(v))}>
          <Select
            id="vehicle_id"
            label="Автомобиль"
            error={errors.vehicle_id?.message}
            {...register('vehicle_id')}
          >
            <option value="">—</option>
            {vq.data?.vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.model_name} · {v.production_year}
              </option>
            ))}
          </Select>
          <Select
            id="dealership_id"
            label="Салон"
            error={errors.dealership_id?.message}
            {...register('dealership_id')}
          >
            <option value="">—</option>
            {dq.data?.dealerships
              .filter((d) => d.is_active !== false)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </Select>
          <Input
            id="requested_datetime"
            label="Дата и время"
            type="datetime-local"
            error={errors.requested_datetime?.message}
            {...register('requested_datetime')}
          />
          <TextArea id="td-notes" label="Комментарий" {...register('notes')} />
          {mut.isError ? (
            <p style={{ color: '#fca5a5' }}>{parseApiError(mut.error).message}</p>
          ) : null}
          <Button type="submit" disabled={mut.isPending}>
            Отправить
          </Button>
        </form>
      </section>
    </div>
  )
}
