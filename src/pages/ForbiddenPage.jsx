import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'

export function ForbiddenPage() {
  return (
    <div>
      <PageHeader
        kicker="403"
        title="Доступ запрещён"
        subtitle="Недостаточно прав для этого раздела."
      />
      <Link to={ROUTES.home}>На главную</Link>
    </div>
  )
}
