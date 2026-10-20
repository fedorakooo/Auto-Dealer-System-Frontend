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
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { USER_ROLES } from '@/constants/roles.js'
import { QK } from '@/constants/queryKeys.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { DescriptionList } from '@/shared/ui/DescriptionList.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { StarRating } from '@/shared/ui/StarRating.jsx'
import { Textarea } from '@/shared/ui/Textarea.jsx'

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Выберите оценку').max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
})

export function ModelDetailPage() {
  const { id } = useParams()
  const { api, user } = useAuth()
  const { data: customer } = useCustomerRecord()
  const queryClient = useQueryClient()

  const modelQuery = useModelDetailQuery(api, id)
  const reviewsQuery = useReviewsByModelQuery(api, id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 5 } })

  const reviewMutation = useMutation({
    mutationFn: async (values) => {
      if (!customer) throw new Error('Профиль покупателя не найден')
      await createReview(api, {
        customer_id: customer.id,
        model_id: id,
        rating: values.rating,
        title: values.title || undefined,
        comment: values.comment || undefined,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.reviewsByModel(id) })
      reset()
    },
  })

  if (modelQuery.isLoading) return <Spinner />
  if (modelQuery.isError || !modelQuery.data) {
    return (
      <ErrorFallback
        message={parseApiError(modelQuery.error).message}
        onRetry={() => modelQuery.refetch()}
      />
    )
  }

  const model = modelQuery.data
  const canReview = user?.role === USER_ROLES.customer && customer
  const reviews = reviewsQuery.data?.reviews ?? []
  const years = model.production_year_end
    ? `${model.production_year_start} — ${model.production_year_end}`
    : model.production_year_start
      ? `с ${model.production_year_start}`
      : null

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Модели', to: ROUTES.models }, { label: model.name }]} />
      <PageHeader kicker="Модель" title={model.name} subtitle={model.description || undefined} />

      <Panel title="Характеристики" className="mb-8">
        <DescriptionList
          items={[
            { label: 'Код модели', value: model.model_code },
            { label: 'Привод', value: model.drive_type },
            { label: 'Годы производства', value: years },
            {
              label: 'Статус',
              value: model.is_in_production ? 'В производстве' : 'Снята с производства',
            },
          ]}
        />
      </Panel>

      <Panel title={`Отзывы${reviews.length ? ` (${reviews.length})` : ''}`}>
        {reviewsQuery.isLoading ? <Skeleton className="h-24" /> : null}
        {reviewsQuery.isSuccess && !reviews.length ? (
          <EmptyState
            icon="star"
            title="Пока нет отзывов"
            description="Станьте первым, кто оценит модель."
          />
        ) : null}
        {reviews.length ? (
          <ul className="m-0 list-none space-y-4 p-0">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4"
              >
                <StarRating value={review.rating} />
                {review.title ? (
                  <p className="mt-2 mb-0 font-semibold text-[var(--color-text)]">{review.title}</p>
                ) : null}
                {review.comment ? <p className="mt-1 mb-0 text-sm">{review.comment}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}

        {canReview ? (
          <form
            className="mt-8 max-w-md border-t border-[var(--color-border)] pt-6"
            onSubmit={handleSubmit((values) => reviewMutation.mutate(values))}
            noValidate
          >
            <h3 className="mb-4 text-base">Оставить отзыв</h3>
            <Select
              id="review-rating"
              label="Оценка"
              error={errors.rating?.message}
              {...register('rating')}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} из 5
                </option>
              ))}
            </Select>
            <Textarea id="review-title" label="Заголовок" rows={2} {...register('title')} />
            <Textarea id="review-comment" label="Комментарий" {...register('comment')} />
            {reviewMutation.isError ? (
              <Alert variant="danger">{parseApiError(reviewMutation.error).message}</Alert>
            ) : null}
            <Button type="submit" loading={reviewMutation.isPending}>
              Отправить отзыв
            </Button>
          </form>
        ) : null}
      </Panel>
    </div>
  )
}
