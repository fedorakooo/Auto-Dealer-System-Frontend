import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'

export function NotFoundPage() {
  return (
    <div>
      <PageHeader kicker="404" title="Страница не найдена" />
      <Link to={ROUTES.home}>На главную</Link>
    </div>
  )
}
