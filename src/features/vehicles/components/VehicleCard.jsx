import { Link } from 'react-router-dom'
import { Card, CardBody, CardMedia } from '@/shared/ui/Card.jsx'
import { Badge } from '@/shared/ui/Badge.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { ROUTES } from '@/constants/routes.js'
import { formatPrice } from '@/lib/format.js'
import { getVehiclePhotos } from '@/lib/photos.js'

export function VehicleCard({ vehicle }) {
  const { cover, coverIsModelPhoto } = getVehiclePhotos(vehicle)
  const title = vehicle.model_name || 'Автомобиль'

  return (
    <Card interactive className="group flex h-full flex-col">
      <CardMedia className="relative aspect-[16/10] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-300" aria-hidden="true">
            <Icon name="car" className="h-14 w-14" />
          </div>
        )}
        {coverIsModelPhoto ? (
          <Badge tone="neutral" className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm">
            Фото модели
          </Badge>
        ) : null}
      </CardMedia>
      <CardBody className="flex flex-1 flex-col px-5 py-4">
        <h3 className="mb-1 text-base font-semibold text-[var(--color-text)]">
          <Link
            to={ROUTES.vehicleDetail(vehicle.id)}
            className="text-[var(--color-text)] after:absolute after:inset-0 after:content-[''] hover:text-[var(--color-text)] focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          {vehicle.production_year} · {vehicle.exterior_color}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="mb-0 text-lg font-semibold tracking-tight text-[var(--color-text)] [font-variant-numeric:tabular-nums]">
            {formatPrice(vehicle.price)}
          </p>
          <span
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-strong)] transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            Подробнее
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
        </div>
      </CardBody>
    </Card>
  )
}
