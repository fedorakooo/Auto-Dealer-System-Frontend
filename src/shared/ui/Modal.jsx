import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({ open, onClose, title, children, className }) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const previouslyFocused = document.activeElement
    const focusable = () => [...dialog.querySelectorAll(FOCUSABLE)]
    focusable()[0]?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
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
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={clsx(
          'relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl',
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? (
            <h2 id={titleId} className="mb-0 text-lg font-semibold text-[var(--color-text)]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть диалог"
            className="-mt-1 -mr-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}
