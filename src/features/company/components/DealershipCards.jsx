import { Link } from 'react-router-dom'
import { Loader } from '@/shared/ui/Loader.jsx'
import { useCompanyDealerships } from '@/features/company/hooks/useCompanyDealerships.js'
import { ROUTES } from '@/constants/routes.js'
import { useCompanyUiStore } from '@/features/company/store/companyUiStore.js'
import clsx from 'clsx'

export function DealershipCards() {
  const { data, isPending, isError, error } = useCompanyDealerships()
  const expandedId = useCompanyUiStore((s) => s.expandedId)
  const setExpandedId = useCompanyUiStore((s) => s.setExpandedId)

  const list = data?.dealerships ?? []

  if (isPending) return <Loader />

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Не удалось загрузить дилерские центры: {String(error?.message ?? error)}
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((d) => {
        const open = expandedId === d.id
        return (
          <article
            key={d.id}
            className={clsx(
              'overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
              open && 'ring-2 ring-[var(--color-focus)]'
            )}
          >
            <div className="p-4">
              <h3 className="font-semibold text-[var(--color-text)]">{d.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{d.address}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-sm font-medium text-[var(--color-text)] underline"
                  onClick={() => setExpandedId(open ? null : d.id)}
                >
                  {open ? 'Свернуть' : 'Подробнее'}
                </button>
                <Link
                  to={ROUTES.dealershipDetail(d.id)}
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  Страница салона
                </Link>
              </div>
              {open ? (
                <p className="mt-3 text-xs text-zinc-500">
                  is_active: {String(d.is_active)} · city_id: {d.city_id}
                </p>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
