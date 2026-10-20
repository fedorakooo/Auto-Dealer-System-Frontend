import { Button } from '@/shared/ui/Button.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <nav
      className="mt-10 flex items-center justify-center gap-4"
      aria-label="Постраничная навигация"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <Icon name="chevronLeft" className="h-4 w-4" />
        Назад
      </Button>
      <span className="text-sm text-[var(--color-text-muted)]" aria-live="polite">
        Страница <strong className="text-[var(--color-text)]">{page}</strong> из {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Вперёд
        <Icon name="chevronRight" className="h-4 w-4" />
      </Button>
    </nav>
  )
}
