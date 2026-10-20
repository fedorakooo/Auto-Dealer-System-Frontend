import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useDealershipDetailQuery } from '@/features/dealerships/hooks/useDealershipQueries.js'
import { useCitiesQuery } from '@/features/cities/hooks/useCitiesQuery.js'
import { parseApiError } from '@/services/api'
import { ROUTES } from '@/constants/routes.js'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs.jsx'
import { DescriptionList } from '@/shared/ui/DescriptionList.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'

export function DealershipDetailPage() {
  const { id } = useParams()
  const { api } = useAuth()

  const query = useDealershipDetailQuery(api, id)
  const citiesQuery = useCitiesQuery(api)

  if (query.isLoading) return <Spinner />
  if (query.isError || !query.data) {
    return (
      <ErrorFallback message={parseApiError(query.error).message} onRetry={() => query.refetch()} />
    )
  }

  const dealership = query.data
  const city = citiesQuery.data?.cities.find((item) => item.id === dealership.city_id)

  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Салоны', to: ROUTES.dealerships }, { label: dealership.name }]}
      />
      <PageHeader kicker="Салон" title={dealership.name} subtitle={dealership.address} />
      <Panel title="Контакты и режим работы">
        <DescriptionList
          items={[
            { label: 'Город', value: city?.name || `Город #${dealership.city_id}` },
            { label: 'Адрес', value: dealership.address },
            {
              label: 'Телефон',
              value: dealership.phone_number ? (
                <a href={`tel:${dealership.phone_number}`} className="link">
                  {dealership.phone_number}
                </a>
              ) : null,
            },
            {
              label: 'Email',
              value: dealership.email ? (
                <a href={`mailto:${dealership.email}`} className="link">
                  {dealership.email}
                </a>
              ) : null,
            },
            { label: 'Часы работы', value: dealership.opening_hours },
          ]}
        />
      </Panel>
    </div>
  )
}
