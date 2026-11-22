import { StatusPage } from '@/shared/ui/StatusPage.jsx'
import { t } from '@/shared/i18n/index.js'

export function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title={t('auth.forbidden.title')}
      description={t('auth.forbidden.description')}
    />
  )
}
