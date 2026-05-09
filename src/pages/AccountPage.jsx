import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { patchCustomer } from '@/features/customers/customerService.js'
import { QK } from '@/constants/queryKeys.js'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { USER_ROLES } from '@/constants/roles.js'
import { parseApiError } from '@/services/api'

const dobSchema = z.object({
  date_of_birth: z.string().optional(),
})

export function AccountPage() {
  const { api, user } = useAuth()
  const { data: customer, isLoading } = useCustomerRecord()
  const qc = useQueryClient()

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(dobSchema),
    values: customer?.date_of_birth
      ? { date_of_birth: String(customer.date_of_birth).slice(0, 10) }
      : { date_of_birth: '' },
  })

  const mut = useMutation({
    mutationFn: async (values) => {
      if (!customer) return
      await patchCustomer(api, customer.id, {
        date_of_birth: values.date_of_birth ? values.date_of_birth : null,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.customerByUser(user?.id) })
    },
  })

  if (!user) return <Spinner />

  return (
    <div>
      <PageHeader kicker="Кабинет" title="Профиль" />
      <dl style={{ fontSize: '0.95rem' }}>
        <dt style={{ color: 'var(--color-text-muted)' }}>Имя</dt>
        <dd style={{ margin: '0 0 0.75rem' }}>
          {user.first_name} {user.second_name}
        </dd>
        <dt style={{ color: 'var(--color-text-muted)' }}>Email</dt>
        <dd style={{ margin: '0 0 0.75rem' }}>{user.email}</dd>
        <dt style={{ color: 'var(--color-text-muted)' }}>Роль</dt>
        <dd style={{ margin: '0 0 0.75rem' }}>{user.role}</dd>
      </dl>

      {user.role === USER_ROLES.customer ? (
        isLoading ? (
          <Spinner />
        ) : customer ? (
          <form
            style={{ maxWidth: 360, marginTop: '1.5rem' }}
            onSubmit={handleSubmit((v) => mut.mutate(v))}
          >
            <Input
              id="dob"
              label="Дата рождения (YYYY-MM-DD)"
              type="date"
              {...register('date_of_birth')}
            />
            {mut.isError ? (
              <p style={{ color: '#fca5a5' }}>{parseApiError(mut.error).message}</p>
            ) : null}
            <Button type="submit" disabled={mut.isPending}>
              Сохранить
            </Button>
          </form>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>Профиль customer не найден.</p>
        )
      ) : null}
    </div>
  )
}
