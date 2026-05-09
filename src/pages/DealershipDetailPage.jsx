import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useDealershipDetailQuery } from '@/features/dealerships/hooks/useDealershipQueries.js'
import { useCitiesQuery } from '@/features/cities/hooks/useCitiesQuery.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'

export function DealershipDetailPage() {
  const { id } = useParams()
  const { api } = useAuth()

  const q = useDealershipDetailQuery(api, id)
  const cq = useCitiesQuery(api)

  if (q.isLoading) return <Spinner />
  if (q.isError || !q.data) {
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />
  }

  const d = q.data
  const city = cq.data?.cities.find((c) => c.id === d.city_id)

  return (
    <div>
      <PageHeader kicker="Салон" title={d.name} />
      <p>{d.address}</p>
      <p style={{ color: 'var(--color-text-muted)' }}>{city?.name || `Город #${d.city_id}`}</p>
      {d.phone_number ? <p>Телефон: {d.phone_number}</p> : null}
      {d.opening_hours ? <p>Часы: {d.opening_hours}</p> : null}
    </div>
  )
}
