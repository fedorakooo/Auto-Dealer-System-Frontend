import { Link } from 'react-router-dom'
import { useCompanyDealerships } from '@/features/company/hooks/useCompanyDealerships.js'
import { ROUTES } from '@/constants/routes.js'
import { parseApiError } from '@/services/api'
import { Card, CardBody } from '@/shared/ui/Card.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'

export function DealershipCards() {
  const { data, isPending, isError, error, refetch } = useCompanyDealerships()

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Загрузка">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorFallback
        title="Не удалось загрузить дилерские центры"
        message={parseApiError(error).message}
        onRetry={() => refetch()}
      />
    )
  }

  const dealerships = data.dealerships.filter((dealership) => dealership.is_active !== false)
  if (!dealerships.length) {
    return <EmptyState icon="building" title="Список салонов пуст" />
  }

  return (
    <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
      {dealerships.map((dealership) => (
        <li key={dealership.id}>
          <Card interactive className="group h-full">
            <CardBody className="flex h-full flex-col gap-2 px-5 py-5">
              <h3 className="mb-0 text-base font-semibold">
                <Link
                  to={ROUTES.dealershipDetail(dealership.id)}
                  className="text-[var(--color-text)] after:absolute after:inset-0 after:content-[''] hover:text-[var(--color-text)] focus-visible:outline-none"
                >
                  {dealership.name}
                </Link>
              </h3>
              <p className="mb-0 flex items-start gap-2 text-sm">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4" />
                {dealership.address}
              </p>
            </CardBody>
          </Card>
        </li>
      ))}
    </ul>
  )
}
