import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOperationList } from '@/features/operations/operationsService.js'
import { ROUTES } from '@/constants/routes.js'
import { endpoints } from '@/services/api/endpoints.js'
import { QK } from '@/constants/queryKeys.js'
import { t } from '@/shared/i18n/index.js'
import { Icon } from '@/shared/ui/Icon.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'

const SOURCES = [
  { labelKey: 'vehicles', path: endpoints.vehicles, route: ROUTES.staffCatalog, icon: 'car' },
  { labelKey: 'orders', path: endpoints.orders, route: ROUTES.staffOrders, icon: 'receipt' },
  {
    labelKey: 'testDrives',
    path: endpoints.testDrives,
    route: ROUTES.staffOperations,
    icon: 'gauge',
  },
  {
    labelKey: 'appointments',
    path: endpoints.serviceAppointments,
    route: ROUTES.staffOperations,
    icon: 'wrench',
  },
]

const SHORTCUTS = [
  {
    to: ROUTES.staffOperations,
    icon: 'wrench',
    key: 'operations',
  },
  {
    to: ROUTES.staffInventory,
    icon: 'box',
    key: 'inventory',
  },
  {
    to: ROUTES.staffUsers,
    icon: 'users',
    key: 'users',
  },
]

function resolveCount(data) {
  if (Array.isArray(data)) return data.length
  return data?.total ?? data?.count ?? '—'
}

export function StaffDashboardPage() {
  const { api } = useAuth()
  const queries = useQueries({
    queries: SOURCES.map((source) => ({
      queryKey: QK.staffCount(source.path),
      queryFn: () => fetchOperationList(api, source.path, { limit: 1 }),
    })),
  })

  return (
    <div>
      <PageHeader
        kicker={t('staff.dashboard.kicker')}
        title={t('staff.dashboard.title')}
        subtitle={t('staff.dashboard.subtitle')}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SOURCES.map((source, index) => {
          const query = queries[index]
          return (
            <Link
              key={source.path}
              to={source.route}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-reduce:hover:translate-y-0"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  {t(`staff.dashboard.sources.${source.labelKey}`)}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  <Icon name={source.icon} className="h-5 w-5" />
                </span>
              </div>
              {query.isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <strong className="text-3xl font-semibold tracking-tight text-[var(--color-text)] [font-variant-numeric:tabular-nums]">
                  {query.isError ? '—' : resolveCount(query.data)}
                </strong>
              )}
            </Link>
          )
        })}
      </div>

      <Panel title={t('staff.dashboard.shortcutsTitle')} className="mt-8">
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.to}>
              <Link
                to={shortcut.to}
                className="flex h-full gap-3 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
              >
                <Icon name={shortcut.icon} className="mt-0.5 text-[var(--color-accent)]" />
                <span>
                  <span className="block font-semibold text-[var(--color-text)]">
                    {t(`staff.dashboard.shortcuts.${shortcut.key}.title`)}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-text-muted)]">
                    {t(`staff.dashboard.shortcuts.${shortcut.key}.text`)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
