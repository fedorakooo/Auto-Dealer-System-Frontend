import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

const MAX_STARS = 5

/** Read-only rating; the numeric value is exposed to assistive tech via `aria-label`. */
export function StarRating({ value, className }) {
  const rounded = Math.max(0, Math.min(MAX_STARS, Math.round(Number(value) || 0)))
  return (
    <span
      role="img"
      aria-label={`Оценка ${rounded} из ${MAX_STARS}`}
      className={clsx('inline-flex gap-0.5', className)}
    >
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <Icon
          key={index}
          name="star"
          className={clsx(
            'h-4 w-4',
            index < rounded ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
          )}
        />
      ))}
    </span>
  )
}
