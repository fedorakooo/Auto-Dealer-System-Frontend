import { useQuery } from '@tanstack/react-query'
import { fetchCities } from '@/features/cities/cityService.js'
import { citiesResponseSchema } from '@/features/cities/schemas.js'
import { QK } from '@/constants/queryKeys.js'
export function useCitiesQuery(api) {
  return useQuery({
    queryKey: QK.cities,
    queryFn: async () => {
      const raw = await fetchCities(api)
      return citiesResponseSchema.parse(raw)
    },
  })
}
