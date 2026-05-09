import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import {
  fetchCustomOrdersByCustomer,
  createCustomOrder,
} from '@/features/custom-orders/customOrderService.js'
import { customOrdersResponseSchema } from '@/features/custom-orders/schemas.js'
import { fetchModels } from '@/features/models/modelService.js'
import { modelsResponseSchema } from '@/features/models/schemas.js'
import { fetchModel } from '@/features/models/modelService.js'
import { modelResponseSchema } from '@/features/models/schemas.js'
import { fetchDealerships } from '@/features/dealerships/dealershipService.js'
import { dealershipsResponseSchema } from '@/features/dealerships/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { TextArea } from '@/shared/ui/Textarea.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { parseApiError } from '@/services/api'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'

const formSchema = z.object({
  model_id: z.string().uuid(),
  dealership_id: z.coerce.number(),
  exterior_color: z.string().min(1),
  interior_color: z.string().optional(),
  estimated_price: z.string().optional(),
  notes: z.string().optional(),
})

export function CustomOrdersPage() {
  const { api } = useAuth()
  const { data: customer, isLoading: cl } = useCustomerRecord()
  const qc = useQueryClient()

  const cq = useQuery({
    queryKey: ['custom-orders', customer?.id],
    queryFn: async () => {
      const raw = await fetchCustomOrdersByCustomer(api, customer.id)
      return customOrdersResponseSchema.parse(raw)
    },
    enabled: !!customer?.id,
  })

  const mq = useQuery({
    queryKey: QK.models({ page: 1, co: 1 }),
    queryFn: async () => {
      const raw = await fetchModels(api, { page: 1, limit: 100 })
      return modelsResponseSchema.parse(raw)
    },
  })

  const dq = useQuery({
    queryKey: QK.dealerships({ page: 1, co: 1 }),
    queryFn: async () => {
      const raw = await fetchDealerships(api, { page: 1, limit: 100 })
      return dealershipsResponseSchema.parse(raw)
    },
  })

  const { register, handleSubmit, control } = useForm({ resolver: zodResolver(formSchema) })
  const modelId = useWatch({ control, name: 'model_id' })

  const modelQ = useQuery({
    queryKey: QK.model(modelId),
    queryFn: async () => {
      const raw = await fetchModel(api, modelId)
      return modelResponseSchema.parse(raw)
    },
    enabled: !!modelId,
  })

  const mut = useMutation({
    mutationFn: async (values) => {
      const m = modelQ.data
      if (!m || !customer) throw new Error('Выберите модель')
      await createCustomOrder(api, {
        customer_id: customer.id,
        dealership_id: values.dealership_id,
        model_id: values.model_id,
        engine_id: m.engine_id,
        transmission_id: m.transmission_id,
        exterior_color: values.exterior_color,
        interior_color: values.interior_color || null,
        estimated_price: values.estimated_price ? values.estimated_price : null,
        notes: values.notes || null,
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['custom-orders'] }),
  })

  if (cl) return <Spinner />
  if (!customer) return <EmptyState title="Нужен профиль покупателя" />

  if (cq.isLoading) return <Spinner />
  if (cq.isError)
    return <ErrorFallback message={parseApiError(cq.error).message} onRetry={() => cq.refetch()} />

  return (
    <div>
      <PageHeader kicker="Индивидуальный заказ" title="Кастомные заказы" />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cq.data.custom_orders.map((o) => (
          <li
            key={o.id}
            style={{
              padding: '0.75rem',
              marginBottom: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
            }}
          >
            {o.status} · {o.exterior_color}
          </li>
        ))}
      </ul>

      <section style={{ marginTop: '2rem', maxWidth: 440 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Новый заказ</h2>
        <form onSubmit={handleSubmit((v) => mut.mutate(v))}>
          <Select id="model_id" label="Модель" error={undefined} {...register('model_id')}>
            <option value="">—</option>
            {mq.data?.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
          <Select id="dealership_id" label="Салон" {...register('dealership_id')}>
            <option value="">—</option>
            {dq.data?.dealerships
              .filter((d) => d.is_active !== false)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </Select>
          {modelQ.data ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Двигатель / КПП: {modelQ.data.engine_id} / {modelQ.data.transmission_id} (из модели)
            </p>
          ) : null}
          <Input id="exterior_color" label="Цвет кузова" {...register('exterior_color')} />
          <Input id="interior_color" label="Цвет салона" {...register('interior_color')} />
          <Input
            id="estimated_price"
            label="Ориентировочная цена"
            {...register('estimated_price')}
          />
          <TextArea id="co-notes" label="Примечания" {...register('notes')} />
          {mut.isError ? (
            <p style={{ color: '#fca5a5' }}>{parseApiError(mut.error).message}</p>
          ) : null}
          <Button type="submit" disabled={mut.isPending || !modelQ.data}>
            Отправить
          </Button>
        </form>
      </section>
    </div>
  )
}
