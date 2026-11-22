import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ROUTES } from '@/constants/routes.js'
import { useBrand } from '@/features/brand/brandContext.js'
import { resolveMediaUrl } from '@/lib/mediaUrl.js'
import { localize, t } from '@/shared/i18n/index.js'

export function Brand({ className, showTagline = true, alwaysShowName = false }) {
  const brand = useBrand()
  const logoUrl = resolveMediaUrl(brand.logo_url)
  return (
    <Link
      to={ROUTES.home}
      className={clsx(
        'group flex min-h-11 items-center gap-3 text-white transition-colors hover:text-white',
        className
      )}
      aria-label={t('brand.homeAria', { name: brand.name })}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          className="h-9 w-9 rounded-lg object-contain"
          aria-hidden="true"
        />
      ) : (
        <span
          className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-accent)] text-xs font-bold tracking-tight text-white shadow-[0_6px_16px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition group-hover:bg-[var(--color-accent-strong)]"
          aria-hidden="true"
        >
          {brand.short_name}
        </span>
      )}
      <span className={clsx(!alwaysShowName && 'hidden sm:block')}>
        <span className="block text-sm font-semibold tracking-[0.12em] uppercase">
          {brand.name}
        </span>
        {showTagline && brand.tagline ? (
          <span className="mt-0.5 block text-[0.6rem] tracking-[0.2em] text-white/50 uppercase">
            {localize(brand.tagline)}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
