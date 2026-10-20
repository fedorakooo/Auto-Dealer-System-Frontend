import { LinkButton } from '@/shared/ui/Button.jsx'
import { ROUTES } from '@/constants/routes.js'

/** Full-width message page for 403 / 404 style states. */
export function StatusPage({ code, title, description }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <p
        className="mb-4 text-7xl font-semibold tracking-tighter text-[var(--color-border-strong)] [font-variant-numeric:tabular-nums] sm:text-8xl"
        aria-hidden="true"
      >
        {code}
      </p>
      <h1 className="mb-3">{title}</h1>
      <p className="mb-8 max-w-md">{description}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <LinkButton to={ROUTES.home} icon="arrowRight">
          На главную
        </LinkButton>
        <LinkButton to={ROUTES.vehicles} variant="secondary">
          Каталог автомобилей
        </LinkButton>
      </div>
    </div>
  )
}
