import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button.jsx'
export function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'modal-title' : undefined}
        className={clsx(
          'relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900',
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 id="modal-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
