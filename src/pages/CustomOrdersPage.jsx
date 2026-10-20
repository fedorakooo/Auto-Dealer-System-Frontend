import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import {
  createCustomOrder,
  fetchCustomOrdersByCustomer,
} from '@/features/custom-orders/customOrderService.js'
import { customOrdersResponseSchema } from '@/features/custom-orders/schemas.js'
import { fetchModel, fetchModels } from '@/features/models/modelService.js'
import { modelResponseSchema, modelsResponseSchema } from '@/features/models/schemas.js'
import { fetchDealerships } from '@/features/dealerships/dealershipService.js'
import { dealershipsResponseSchema } from '@/features/dealerships/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { parseApiError } from '@/services/api'
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
  model_id: z.string().uuid('Выберите модель'),
  dealership_id: z.coerce.number().positive('Выберите салон'),
  exterior_color: z.string().min(1, 'Укажите цвет кузова'),
  interior_color: z.string().optional(),
  estimated_price: z.string().optional(),
  notes: z.string().optional(),
})

export function CustomOrdersPage() {
  const { api } = useAuth()
  const { data: customer, isLoading: customerLoading } = useCustomerRecord()
  const queryClient = useQueryClient()

  const ordersQuery = useQuery({
    queryKey: ['custom-orders', customer?.id],
    queryFn: async () => {
      const raw = await fetchCustomOrdersByCustomer(api, customer.id)
      return customOrdersResponseSchema.parse(raw)
    },
    enabled: !!customer?.id,
  })

  const modelsQuery = useQuery({
    queryKey: QK.models({ page: 1, co: 1 }),
    queryFn: async () => {
      const raw = await fetchModels(api, { page: 1, limit: 100 })
      return modelsResponseSchema.parse(raw)
    },
  })

  const dealershipsQuery = useQuery({
    queryKey: QK.dealerships({ page: 1, co: 1 }),
    queryFn: async () => {
      const raw = await fetchDealerships(api, { page: 1, limit: 100 })
      return dealershipsResponseSchema.parse(raw)
    },
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) })
  const modelId = useWatch({ control, name: 'model_id' })

  const selectedModelQuery = useQuery({
    queryKey: QK.model(modelId),
    queryFn: async () => {
      const raw = await fetchModel(api, modelId)
      return modelResponseSchema.parse(raw)
    },
    enabled: !!modelId,
  })

  const mutation = useMutation({
    mutationFn: async (values) => {
      const model = selectedModelQuery.data
      if (!model || !customer) throw new Error('Выберите модель')
      await createCustomOrder(api, {
        customer_id: customer.id,
        dealership_id: values.dealership_id,
        model_id: values.model_id,
        engine_id: model.engine_id,
        transmission_id: model.transmission_id,
        exterior_color: values.exterior_color,
        interior_color: values.interior_color || null,
        estimated_price: values.estimated_price ? values.estimated_price : null,
        notes: values.notes || null,
      })
    },
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['custom-orders'] })
    },
  })

  if (customerLoading) return <Spinner />
  if (!customer) {
    return (
      <EmptyState
        icon="key"
        title="Нужен профиль покупателя"
        description="Индивидуальные заказы доступны только покупателям."
      />
    )
  }

  if (ordersQuery.isLoading) return <Spinner />
  if (ordersQuery.isError) {
    return (
      <ErrorFallback
        message={parseApiError(ordersQuery.error).message}
        onRetry={() => ordersQuery.refetch()}
      />
    )
  }

  const orders = ordersQuery.data.custom_orders
  const activeDealerships =
    dealershipsQuery.data?.dealerships.filter((dealership) => dealership.is_active !== false) ?? []

  return (
    <div>
      <PageHeader
        kicker="Индивидуальный заказ"
        title="Заказ по вашей конфигурации"
        subtitle="Выберите модель и цвет — мы передадим заявку на завод."
      />

      {orders.length ? (
        <ul className="m-0 mb-10 list-none space-y-3 p-0">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-card)]"
            >
              <span className="font-medium text-[var(--color-text)]">{order.exterior_color}</span>
              <StatusBadge status={order.status} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mb-10"
          icon="key"
          title="Индивидуальных заказов пока нет"
          description="Оформите первый заказ в форме ниже."
        />
      )}

      <Panel title="Новый заказ" className="max-w-xl">
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
          <Select
            id="model_id"
            label="Модель"
            error={errors.model_id?.message}
            {...register('model_id')}
          >
            <option value="">Выберите модель</option>
            {modelsQuery.data?.models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
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
          {selectedModelQuery.data ? (
            <p className="mb-4 text-sm">
              Двигатель / КПП: {selectedModelQuery.data.engine_id} /{' '}
              {selectedModelQuery.data.transmission_id} (из модели)
            </p>
          ) : null}
          <Input
            id="exterior_color"
            label="Цвет кузова"
            error={errors.exterior_color?.message}
            {...register('exterior_color')}
          />
          <Input id="interior_color" label="Цвет салона" {...register('interior_color')} />
          <Input
            id="estimated_price"
            label="Ориентировочная цена"
            inputMode="decimal"
            {...register('estimated_price')}
          />
          <Textarea id="co-notes" label="Примечания" {...register('notes')} />
          {mutation.isError ? (
            <Alert variant="danger">{parseApiError(mutation.error).message}</Alert>
          ) : null}
          {mutation.isSuccess ? <Alert variant="success">Заказ отправлен.</Alert> : null}
          <Button type="submit" loading={mutation.isPending} disabled={!selectedModelQuery.data}>
            Отправить заказ
          </Button>
        </form>
      </Panel>
    </div>
  )
}
