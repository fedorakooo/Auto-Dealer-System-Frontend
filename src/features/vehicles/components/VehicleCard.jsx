import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Card, CardBody, CardMedia } from '@/shared/ui/Card.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ROUTES } from '@/constants/routes.js'
import { formatPrice } from '@/lib/format.js'
import { resolveMediaUrl } from '@/lib/mediaUrl.js'
export function VehicleCard({ vehicle }) {
  const img = vehicle.images?.[0] ? resolveMediaUrl(vehicle.images[0]) : null
  return (
    <Card interactive>
      {img ? (
        <CardMedia className="relative aspect-[16/10] overflow-hidden">
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
        </CardMedia>
      ) : (
        <div
          className={clsx(
            'aspect-[16/10] bg-gradient-to-br from-zinc-900 to-zinc-800',
            'border-b border-zinc-800 dark:border-zinc-800'
          )}
          aria-hidden
        />
      )}
      <CardBody className="px-4 py-4">
        <h3 className="mb-1 text-base font-semibold text-zinc-100">
          {vehicle.model_name || 'Автомобиль'}
        </h3>
        <p className="mb-2 text-sm text-zinc-500">
          {vehicle.production_year} · {vehicle.exterior_color}
        </p>
        <p className="mb-4 text-lg font-semibold tracking-wide text-zinc-200">
          {formatPrice(vehicle.price)}
        </p>
        <Link to={ROUTES.vehicleDetail(vehicle.id)}>
          <Button variant="secondary" fullWidth>
            Подробнее
          </Button>
        </Link>
      </CardBody>
    </Card>
  )
}
