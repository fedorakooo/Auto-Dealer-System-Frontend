import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchUsers } from '@/features/users/userService.js'
import { usersResponseSchema } from '@/features/users/schemas.js'
import { ROLE_LABELS } from '@/constants/catalog.js'
import { QK } from '@/constants/queryKeys.js'
import { parseApiError } from '@/services/api'
import { formatDate } from '@/lib/format.js'
import { Badge } from '@/shared/ui/Badge.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'
import { DataTable } from '@/shared/ui/Table.jsx'

const COLUMNS = [
  {
    key: 'name',
    header: 'Имя',
    render: (user) => `${user.first_name} ${user.second_name}`,
  },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Роль', render: (user) => ROLE_LABELS[user.role] ?? user.role },
  {
    key: 'is_active',
    header: 'Статус',
    render: (user) => (
      <Badge tone={user.is_active ? 'success' : 'neutral'}>
        {user.is_active ? 'Активен' : 'Отключён'}
      </Badge>
    ),
  },
  { key: 'created_at', header: 'Создан', render: (user) => formatDate(user.created_at) },
]

export function StaffUsersPage() {
  const { api } = useAuth()

  const query = useQuery({
    queryKey: QK.users({ page: 1 }),
    queryFn: async () => {
      const raw = await fetchUsers(api, { page: 1, limit: 50 })
      return usersResponseSchema.parse(raw)
    },
  })

  return (
    <div>
      <PageHeader
        kicker="Администрирование"
        title="Пользователи"
        subtitle={query.isSuccess ? `Всего учётных записей: ${query.data.total}` : undefined}
      />
      {query.isLoading ? <Skeleton className="h-64" /> : null}
      {query.isError ? (
        <ErrorFallback
          message={parseApiError(query.error).message}
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess ? (
        <DataTable
          caption="Пользователи системы"
          columns={COLUMNS}
          rows={query.data.users}
          getRowKey={(user) => user.id}
          emptyMessage="Пользователей пока нет"
        />
      ) : null}
    </div>
  )
}
