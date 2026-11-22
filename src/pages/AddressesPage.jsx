import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOperationList, mutateOperation } from '@/features/operations/operationsService.js'
import { parseApiError } from '@/services/api/errors.js'
import { QK } from '@/constants/queryKeys.js'
import { endpoints } from '@/services/api/endpoints.js'
import { applyApiFieldErrors } from '@/lib/formErrors.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Badge } from '@/shared/ui/Badge.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { t } from '@/shared/i18n/index.js'

const schema = z.object({
  label: z.string().min(1, { error: () => t('account.addresses.labelRequired') }),
  country: z.string().min(1, { error: () => t('account.addresses.countryRequired') }),
  city: z.string().min(1, { error: () => t('account.addresses.cityRequired') }),
  address_line_1: z.string().min(1, { error: () => t('account.addresses.addressLine1Required') }),
  address_line_2: z.string().optional(),
  postal_code: z.string().optional(),
  is_default: z.boolean().optional(),
})

export function AddressesPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const addressesQuery = useQuery({
    queryKey: QK.addresses,
    queryFn: () => fetchOperationList(api, endpoints.myAddresses),
  })

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const saveMutation = useMutation({
    mutationFn: (body) => mutateOperation(api, 'post', endpoints.myAddresses, body),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: QK.addresses })
    },
    onError: (error) => applyApiFieldErrors(error, setError),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => mutateOperation(api, 'delete', endpoints.myAddress(id)),
    onSuccess: () => {
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: QK.addresses })
    },
  })

  const addresses = Array.isArray(addressesQuery.data) ? addressesQuery.data : []

  return (
    <div>
      <PageHeader
        kicker={t('account.common.kicker')}
        title={t('account.addresses.title')}
        subtitle={t('account.addresses.subtitle')}
      />

      {addressesQuery.isLoading ? <Spinner /> : null}
      {addressesQuery.isError ? (
        <Alert variant="danger">{parseApiError(addressesQuery.error).message}</Alert>
      ) : null}
      {addressesQuery.isSuccess && !addresses.length ? (
        <EmptyState
          icon="mapPin"
          title={t('account.addresses.emptyTitle')}
          description={t('account.addresses.emptyDescription')}
        />
      ) : null}
      {addresses.length ? (
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <strong className="flex items-center gap-2 text-[var(--color-text)]">
                  <Icon name="mapPin" className="h-4 w-4 text-[var(--color-text-muted)]" />
                  {address.label}
                </strong>
                {address.is_default ? (
                  <Badge tone="success">{t('account.addresses.default')}</Badge>
                ) : null}
              </div>
              <p className="mb-0 text-sm">
                {[
                  address.address_line_1,
                  address.address_line_2,
                  address.city,
                  address.country,
                  address.postal_code,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <Button
                className="self-start"
                size="sm"
                variant="secondary"
                onClick={() => setDeleteTarget(address.id)}
              >
                {t('account.addresses.delete')}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <Panel title={t('account.addresses.add')} className="mt-10 max-w-xl">
        <form onSubmit={handleSubmit((values) => saveMutation.mutate(values))} noValidate>
          <Input
            id="address-label"
            label={t('account.addresses.label')}
            placeholder={t('account.addresses.labelPlaceholder')}
            error={errors.label?.message}
            {...register('label')}
          />
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Input
              id="address-country"
              label={t('account.addresses.country')}
              error={errors.country?.message}
              {...register('country')}
            />
            <Input
              id="address-city"
              label={t('account.addresses.city')}
              error={errors.city?.message}
              {...register('city')}
            />
          </div>
          <Input
            id="address-line-1"
            label={t('account.addresses.addressLine1')}
            error={errors.address_line_1?.message}
            {...register('address_line_1')}
          />
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Input
              id="address-line-2"
              label={t('account.addresses.addressLine2')}
              {...register('address_line_2')}
            />
            <Input
              id="address-postal"
              label={t('account.addresses.postalCode')}
              {...register('postal_code')}
            />
          </div>
          <label className="mb-4 flex min-h-11 items-center gap-2 text-sm text-[var(--color-text)]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[var(--color-border-strong)] accent-[var(--color-primary)]"
              {...register('is_default')}
            />
            {t('account.addresses.isDefault')}
          </label>
          {saveMutation.isError ? (
            <Alert variant="danger">{parseApiError(saveMutation.error).message}</Alert>
          ) : null}
          <Button type="submit" loading={saveMutation.isPending}>
            {t('account.addresses.save')}
          </Button>
        </form>
      </Panel>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={t('account.addresses.deleteDialog.title')}
        description={t('account.addresses.deleteDialog.description')}
        confirmLabel={t('account.addresses.deleteDialog.confirm')}
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
