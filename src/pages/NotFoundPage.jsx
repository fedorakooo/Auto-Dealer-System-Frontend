import { StatusPage } from '@/shared/ui/StatusPage.jsx'
import { t } from '@/shared/i18n/index.js'

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title={t('auth.notFound.title')}
      description={t('auth.notFound.description')}
    />
  )
}
