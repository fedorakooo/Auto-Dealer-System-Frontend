import { StatusPage } from '@/shared/ui/StatusPage.jsx'

export function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Доступ запрещён"
      description="У вашей учётной записи недостаточно прав для этого раздела."
    />
  )
}
