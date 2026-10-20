import { useState } from 'react'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

/** Main image with a thumbnail strip. `photos` is a list of resolved URLs. */
export function Gallery({ photos, alt, className }) {
  const [selected, setSelected] = useState(0)
  const active = Math.min(selected, Math.max(photos.length - 1, 0))

  if (!photos.length) {
    return (
      <div
        className={clsx(
          'grid aspect-[16/10] w-full place-items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-slate-300',
          className
        )}
        role="img"
        aria-label="Фото отсутствует"
      >
        <Icon name="car" className="h-24 w-24" />
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <img src={photos[active]} alt={alt} className="aspect-[16/10] w-full object-cover" />
      </div>
      {photos.length > 1 ? (
        <ul className="m-0 mt-3 grid list-none grid-cols-4 gap-3 p-0 sm:grid-cols-5">
          {photos.map((photo, index) => (
            <li key={photo}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Показать фото ${index + 1} из ${photos.length}`}
                aria-current={index === active}
                className={clsx(
                  'block w-full overflow-hidden rounded-lg border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
                  index === active
                    ? 'border-[var(--color-accent)]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <img
                  src={photo}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
