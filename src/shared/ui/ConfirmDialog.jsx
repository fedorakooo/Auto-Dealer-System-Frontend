import { Button } from '@/shared/ui/Button.jsx'
import { Modal } from '@/shared/ui/Modal.jsx'
import { t } from '@/shared/i18n/index.js'

/** Accessible replacement for `window.confirm`. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = t('common.actions.confirm'),
  cancelLabel = t('common.actions.cancel'),
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      {description ? <p className="text-sm">{description}</p> : null}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={destructive ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
