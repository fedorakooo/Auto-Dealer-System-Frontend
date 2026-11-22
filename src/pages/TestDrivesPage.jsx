import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import {
  createTestDrive,
  fetchTestDrivesByCustomer,
} from '@/features/test-drives/testDriveService.js'
import { testDrivesResponseSchema } from '@/features/test-drives/schemas.js'
import { fetchVehicles } from '@/features/vehicles/vehicleService.js'
import { vehiclesResponseSchema } from '@/features/vehicles/schemas.js'
import { fetchDealerships } from '@/features/dealerships/dealershipService.js'
import { dealershipsResponseSchema } from '@/features/dealerships/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { parseApiError } from '@/services/api'
import { formatDateTime } from '@/lib/format.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StatusBadge } from '@/shared/ui/StatusBadge.jsx'
import { Textarea } from '@/shared/ui/Textarea.jsx'

const formSchema = z.object({
  vehicle_id: z.string().uuid('Выберите автомобиль'),
  dealership_id: z.coerce.number().positive('Выберите салон'),
  requested_datetime: z.string().min(1, 'Укажите дату и время'),
  notes: z.string().optional(),
})

export function TestDrivesPage() {
  const { api } = useAuth()
  const { data: customer, isLoading: customerLoading } = useCustomerRecord()
  const queryClient = useQueryClient()

  const testDrivesQuery = useQuery({
    queryKey: ['test-drives', customer?.id],
    queryFn: async () => {
      const raw = await fetchTestDrivesByCustomer(api, customer.id)
      return testDrivesResponseSchema.parse(raw)
    },
    enabled: !!customer?.id,
  })

  const vehiclesQuery = useQuery({
    queryKey: QK.vehicles({ page: 1, list: 'td' }),
    queryFn: async () => {
      const raw = await fetchVehicles(api, { page: 1, limit: 50, is_active: true })
      return vehiclesResponseSchema.parse(raw)
    },
  })

  const dealershipsQuery = useQuery({
    queryKey: QK.dealerships({ page: 1, td: 1 }),
    queryFn: async () => {
      const raw = await fetchDealerships(api, { page: 1, limit: 100 })
      return dealershipsResponseSchema.parse(raw)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) })

  const mutation = useMutation({
    mutationFn: async (values) => {
      await createTestDrive(api, {
        customer_id: customer.id,
        vehicle_id: values.vehicle_id,
        dealership_id: values.dealership_id,
        requested_datetime: new Date(values.requested_datetime).toISOString(),
        notes: values.notes || null,
      })
    },
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['test-drives'] })
    },
  })

  if (customerLoading) return <Spinner />
  if (!customer) {
    return (
      <EmptyState
        icon="gauge"
        title="Нужен профиль покупателя"
        description="Запись на тест-драйв доступна только покупателям."
      />
    )
  }

  if (testDrivesQuery.isLoading) return <Spinner />
  if (testDrivesQuery.isError) {
    return (
      <ErrorFallback
        message={parseApiError(testDrivesQuery.error).message}
        onRetry={() => testDrivesQuery.refetch()}
      />
    )
  }

  const testDrives = testDrivesQuery.data.test_drives
  const activeDealerships =
    dealershipsQuery.data?.dealerships.filter((dealership) => dealership.is_active !== false) ?? []

  return (
    <div>
      <PageHeader kicker="Сервис" title="Тест-драйвы" />

      {testDrives.length ? (
        <ul className="m-0 mb-10 list-none space-y-3 p-0">
          {testDrives.map((testDrive) => (
            <li
              key={testDrive.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-card)]"
            >
              <span className="font-medium text-[var(--color-text)]">
                {formatDateTime(testDrive.requested_datetime)}
              </span>
              <StatusBadge status={testDrive.status} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mb-10"
          icon="gauge"
          title="Заявок на тест-драйв пока нет"
          description="Оставьте первую заявку в форме ниже."
        />
      )}

      <Panel title="Новая заявка" className="max-w-xl">
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
          <Select
            id="vehicle_id"
            label="Автомобиль"
            error={errors.vehicle_id?.message}
            {...register('vehicle_id')}
          >
            <option value="">Выберите автомобиль</option>
            {vehiclesQuery.data?.vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.model_name} · {vehicle.production_year}
              </option>
            ))}
          </Select>
          <Select
            id="dealership_id"
            label="Салон"
            error={errors.dealership_id?.message}
            {...register('dealership_id')}
          >
            <option value="">Выберите салон</option>
            {activeDealerships.map((dealership) => (
              <option key={dealership.id} value={dealership.id}>
                {dealership.name}
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
          <Textarea id="td-notes" label="Комментарий" {...register('notes')} />
          {mutation.isError ? (
            <Alert variant="danger">{parseApiError(mutation.error).message}</Alert>
          ) : null}
          {mutation.isSuccess ? <Alert variant="success">Заявка отправлена.</Alert> : null}
          <Button type="submit" loading={mutation.isPending}>
            Отправить заявку
          </Button>
        </form>
      </Panel>
    </div>
  )
}
