import { StatusPage } from '@/shared/ui/StatusPage.jsx'

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Страница не найдена"
      description="Возможно, адрес введён с ошибкой или страница была перемещена."
    />
  )
}
