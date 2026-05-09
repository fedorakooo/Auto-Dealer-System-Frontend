import { useQuery } from '@tanstack/react-query'
import { fetchModel, fetchModels } from '@/features/models/modelService.js'
import { modelResponseSchema, modelsResponseSchema } from '@/features/models/schemas.js'
import { QK } from '@/constants/queryKeys.js'
export function useModelsCatalogQuery(
  api,
  params = {
    page: 1,
    limit: 50,
  }
) {
  return useQuery({
    queryKey: QK.models(params),
    queryFn: async () => {
      const raw = await fetchModels(api, params)
      return modelsResponseSchema.parse(raw)
    },
  })
}
export function useModelDetailQuery(api, id) {
  return useQuery({
    queryKey: QK.model(id),
    queryFn: async () => {
      const raw = await fetchModel(api, id)
      return modelResponseSchema.parse(raw)
    },
    enabled: !!id,
  })
}
