import { useUiStore } from '@/app/store/uiStore.js'
import { Toast } from '@/shared/ui/Toast.jsx'
export function ToastHost() {
  const toast = useUiStore((s) => s.toast)
  const clearToast = useUiStore((s) => s.clearToast)
  return (
    <Toast open={!!toast} onClose={clearToast} variant={toast?.variant ?? 'info'}>
      {toast?.message ?? ''}
    </Toast>
  )
}
