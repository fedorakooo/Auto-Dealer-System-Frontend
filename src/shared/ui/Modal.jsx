import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Button } from '@/shared/ui/Button.jsx'
export function Modal({ open, onClose, title, children, className }) {
  const dialogRef = useRef(null)
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
  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const previous = document.activeElement
    const focusable = () =>
      [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    focusable()[0]?.focus()
    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const elements = focusable()
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('keydown', onKeyDown)
    return () => {
      dialog.removeEventListener('keydown', onKeyDown)
      previous?.focus?.()
    }
  }, [open])
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
        ref={dialogRef}
        role="dialog"
        aria-modal
        aria-labelledby={title ? 'modal-title' : undefined}
        className={clsx(
          'relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl',
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 id="modal-title" className="text-lg font-semibold text-[var(--color-text)]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Закрыть диалог">
            Закрыть
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
