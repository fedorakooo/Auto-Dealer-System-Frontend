import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchUsers } from '@/features/users/userService.js'
import { usersResponseSchema } from '@/features/users/schemas.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'

export function StaffUsersPage() {
  const { api } = useAuth()

  const q = useQuery({
    queryKey: ['users', { page: 1 }],
    queryFn: async () => {
      const raw = await fetchUsers(api, { page: 1, limit: 50 })
      return usersResponseSchema.parse(raw)
    },
  })

  if (q.isLoading) return <Spinner />
  if (q.isError)
    return <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />

  return (
    <div>
      <PageHeader kicker="Администрирование" title="Пользователи" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Email</th>
              <th style={{ padding: '0.5rem' }}>Роль</th>
              <th style={{ padding: '0.5rem' }}>Активен</th>
            </tr>
          </thead>
          <tbody>
            {q.data.users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                <td style={{ padding: '0.5rem' }}>{u.role}</td>
                <td style={{ padding: '0.5rem' }}>{u.is_active ? 'да' : 'нет'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
