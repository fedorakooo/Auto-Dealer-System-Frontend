import { useQuery } from '@tanstack/react-query'
import { fetchReviewsByModel } from '@/features/reviews/reviewService.js'
import { reviewsResponseSchema } from '@/features/reviews/schemas.js'
import { QK } from '@/constants/queryKeys.js'

export function useReviewsByModelQuery(api, modelId) {
  return useQuery({
    queryKey: QK.reviewsByModel(modelId),
    queryFn: async () => {
      const raw = await fetchReviewsByModel(api, modelId)
      return reviewsResponseSchema.parse(raw)
    },
    enabled: !!modelId,
  })
}
