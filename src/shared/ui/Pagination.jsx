import { Button } from '@/shared/ui/Button.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { t } from '@/shared/i18n/index.js'

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <nav
      className="mt-10 flex items-center justify-center gap-4"
      aria-label={t('common.pagination.label')}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <Icon name="chevronLeft" className="h-4 w-4" />
        {t('common.pagination.prev')}
      </Button>
      <span className="text-sm text-[var(--color-text-muted)]" aria-live="polite">
        {t('common.pagination.page')} <strong className="text-[var(--color-text)]">{page}</strong>{' '}
        {t('common.pagination.of', { total: totalPages })}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('common.pagination.next')}
        <Icon name="chevronRight" className="h-4 w-4" />
      </Button>
    </nav>
  )
}
