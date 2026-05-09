import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { createReview } from '@/features/reviews/reviewService.js'
import { useModelDetailQuery } from '@/features/models/hooks/useModelQueries.js'
import { useReviewsByModelQuery } from '@/features/reviews/hooks/useReviewsByModelQuery.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Stack } from '@/shared/ui/Stack.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { TextArea } from '@/shared/ui/Textarea.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'
import { USER_ROLES } from '@/constants/roles.js'
import { QK } from '@/constants/queryKeys.js'

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
})

export function ModelDetailPage() {
  const { id } = useParams()
  const { api, user } = useAuth()
  const { data: customer } = useCustomerRecord()
  const qc = useQueryClient()

  const mq = useModelDetailQuery(api, id)
  const rq = useReviewsByModelQuery(api, id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5 } })

  const revMut = useMutation({
    mutationFn: async (values) => {
      if (!customer) throw new Error('Нет профиля customer')
      await createReview(api, {
        customer_id: customer.id,
        model_id: id,
        rating: values.rating,
        title: values.title || undefined,
        comment: values.comment || undefined,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.reviewsByModel(id) })
      reset()
    },
  })

  if (mq.isLoading) return <Spinner />
  if (mq.isError || !mq.data) {
    return <ErrorFallback message={parseApiError(mq.error).message} onRetry={() => mq.refetch()} />
  }

  const m = mq.data
  const canReview = user?.role === USER_ROLES.customer && customer

  return (
    <div>
      <PageHeader kicker="Модель" title={m.name} />
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '40rem' }}>
        {m.description || 'Описание появится позже.'}
      </p>
      <dl style={{ display: 'grid', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
        <dt style={{ color: 'var(--color-text-muted)' }}>Привод</dt>
        <dd style={{ margin: 0 }}>{m.drive_type || '—'}</dd>
        <dt style={{ color: 'var(--color-text-muted)' }}>Годы производства</dt>
        <dd style={{ margin: 0 }}>
          {m.production_year_start}
          {m.production_year_end ? ` — ${m.production_year_end}` : ''}
        </dd>
      </dl>

      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Отзывы</h2>
        {rq.isLoading ? <Spinner /> : null}
        {rq.data?.reviews?.length ? (
          <Stack variant="col">
            {rq.data.reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 4,
                }}
              >
                <strong>{'★'.repeat(r.rating)}</strong>
                {r.title ? <p style={{ margin: '0.5rem 0 0' }}>{r.title}</p> : null}
                {r.comment ? <p style={{ color: 'var(--color-text-muted)' }}>{r.comment}</p> : null}
              </div>
            ))}
          </Stack>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>Пока нет отзывов.</p>
        )}

        {canReview ? (
          <form
            style={{ marginTop: '1.5rem', maxWidth: 400 }}
            onSubmit={handleSubmit((v) => revMut.mutate(v))}
          >
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              Оценка 1–5
              <input
                type="number"
                min={1}
                max={5}
                style={{ marginLeft: '0.5rem', width: 60 }}
                {...register('rating')}
              />
            </label>
            {errors.rating ? <p style={{ color: '#fca5a5' }}>{errors.rating.message}</p> : null}
            <TextArea id="rev-title" label="Заголовок" {...register('title')} />
            <TextArea id="rev-comment" label="Комментарий" {...register('comment')} />
            {revMut.isError ? (
              <p style={{ color: '#fca5a5' }}>{parseApiError(revMut.error).message}</p>
            ) : null}
            <Button type="submit" disabled={isSubmitting || revMut.isPending}>
              Отправить отзыв
            </Button>
          </form>
        ) : null}
      </section>
    </div>
  )
}
