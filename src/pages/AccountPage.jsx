import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { useCustomerRecord } from '@/features/customers/hooks/useCustomerRecord.js'
import { patchCustomer } from '@/features/customers/customerService.js'
import { QK } from '@/constants/queryKeys.js'
import { ROLE_LABELS } from '@/constants/catalog.js'
import { USER_ROLES } from '@/constants/roles.js'
import { parseApiError } from '@/services/api'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { DescriptionList } from '@/shared/ui/DescriptionList.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'

const profileSchema = z.object({
  date_of_birth: z.string().optional(),
})

export function AccountPage() {
  const { api, user } = useAuth()
  const { data: customer, isLoading } = useCustomerRecord()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      date_of_birth: customer?.date_of_birth ? String(customer.date_of_birth).slice(0, 10) : '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!customer) return
      await patchCustomer(api, customer.id, {
        date_of_birth: values.date_of_birth ? values.date_of_birth : null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.customerByUser(user?.id) })
    },
  })

  if (!user) return <Spinner />

  return (
    <div>
      <PageHeader kicker="Кабинет" title="Профиль" />

      <Panel title="Учётные данные" className="mb-6">
        <DescriptionList
          items={[
            { label: 'Имя', value: `${user.first_name} ${user.second_name}` },
            { label: 'Email', value: user.email },
            { label: 'Телефон', value: user.phone_number },
            { label: 'Роль', value: ROLE_LABELS[user.role] ?? user.role },
          ]}
        />
      </Panel>

      {user.role === USER_ROLES.customer ? (
        <Panel
          title="Данные покупателя"
          description="Эти сведения используются при оформлении заказов."
        >
          {isLoading ? <Spinner className="py-4" /> : null}
          {!isLoading && !customer ? (
            <Alert variant="warning">Профиль покупателя не найден. Обратитесь в поддержку.</Alert>
          ) : null}
          {customer ? (
            <form className="max-w-sm" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
              <Input
                id="date_of_birth"
                label="Дата рождения"
                type="date"
                {...register('date_of_birth')}
              />
              {mutation.isError ? (
                <Alert variant="danger">{parseApiError(mutation.error).message}</Alert>
              ) : null}
              {mutation.isSuccess && !isDirty ? (
                <Alert variant="success">Изменения сохранены.</Alert>
              ) : null}
              <Button type="submit" loading={mutation.isPending} disabled={!isDirty}>
                Сохранить
              </Button>
            </form>
          ) : null}
        </Panel>
      ) : null}
    </div>
  )
}
