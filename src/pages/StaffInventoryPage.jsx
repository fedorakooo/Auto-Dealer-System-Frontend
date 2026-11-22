import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOperationList, mutateOperation } from '@/features/operations/operationsService.js'
import { parseApiError } from '@/services/api/errors.js'
import { QK } from '@/constants/queryKeys.js'
import { endpoints } from '@/services/api/endpoints.js'
import { t } from '@/shared/i18n/index.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { DataTable } from '@/shared/ui/Table.jsx'

function buildInventoryColumns() {
  return [
    {
      key: 'part',
      header: t('staff.inventory.columns.part'),
      render: (row) => row.part_name || row.part_id,
    },
    {
      key: 'quantity',
      header: t('staff.inventory.columns.quantity'),
      render: (row) => row.quantity ?? row.available_quantity ?? '—',
    },
    {
      key: 'reserved_quantity',
      header: t('staff.inventory.columns.reserved'),
      render: (row) => row.reserved_quantity ?? '—',
    },
  ]
}

export function StaffInventoryPage() {
  const { api } = useAuth()
  const [dealershipInput, setDealershipInput] = useState('')
  const [dealershipId, setDealershipId] = useState('')
  const [partId, setPartId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const partsQuery = useQuery({
    queryKey: QK.parts,
    queryFn: () => fetchOperationList(api, endpoints.parts, { limit: 100 }),
  })

  const inventoryQuery = useQuery({
    queryKey: QK.inventory(dealershipId),
    queryFn: () =>
      fetchOperationList(api, endpoints.dealershipInventory(dealershipId), { limit: 100 }),
    enabled: Boolean(dealershipId),
  })

  const reserveMutation = useMutation({
    mutationFn: () =>
      mutateOperation(api, 'post', endpoints.inventoryReservations(dealershipId, partId), {
        quantity: Number(quantity),
      }),
    onSuccess: () => {
      setConfirmOpen(false)
      inventoryQuery.refetch()
    },
    onError: () => setConfirmOpen(false),
  })

  const rows = Array.isArray(inventoryQuery.data) ? inventoryQuery.data : []
  const quantityValid = Number.isInteger(Number(quantity)) && Number(quantity) >= 1

  return (
    <div>
      <PageHeader
        kicker={t('staff.inventory.kicker')}
        title={t('staff.inventory.title')}
        subtitle={t('staff.inventory.subtitle')}
      />

      <Panel title={t('staff.inventory.stock.title')}>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            setDealershipId(dealershipInput.trim())
          }}
        >
          <Input
            id="inventory-dealer"
            className="mb-0 w-64"
            label={t('staff.inventory.stock.dealershipId')}
            inputMode="numeric"
            value={dealershipInput}
            onChange={(event) => setDealershipInput(event.target.value)}
          />
          <Button type="submit" disabled={!dealershipInput.trim()}>
            {t('staff.inventory.stock.show')}
          </Button>
        </form>

        <div className="mt-5">
          {inventoryQuery.isLoading ? <Spinner /> : null}
          {inventoryQuery.isError ? (
            <Alert variant="danger">{parseApiError(inventoryQuery.error).message}</Alert>
          ) : null}
          {dealershipId && inventoryQuery.isSuccess && !rows.length ? (
            <EmptyState
              icon="box"
              title={t('staff.inventory.stock.emptyTitle')}
              description={t('staff.inventory.stock.emptyDescription')}
            />
          ) : null}
          {rows.length ? (
            <DataTable
              caption={t('staff.inventory.stock.caption')}
              columns={buildInventoryColumns()}
              rows={rows}
              getRowKey={(row, index) => row.id || row.part_id || index}
            />
          ) : null}
        </div>
      </Panel>

      <Panel title={t('staff.inventory.reserve.title')} className="mt-6 max-w-xl">
        <Input
          id="reserve-part"
          label={t('staff.inventory.reserve.partId')}
          value={partId}
          onChange={(event) => setPartId(event.target.value)}
        />
        <Input
          id="reserve-quantity"
          label={t('staff.inventory.reserve.quantity')}
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        {reserveMutation.isError ? (
          <Alert variant="danger">{parseApiError(reserveMutation.error).message}</Alert>
        ) : null}
        {reserveMutation.isSuccess ? (
          <Alert variant="success">{t('staff.inventory.reserve.success')}</Alert>
        ) : null}
        <Button
          disabled={!dealershipId || !partId.trim() || !quantityValid}
          onClick={() => setConfirmOpen(true)}
        >
          {t('staff.inventory.reserve.submit')}
        </Button>
        {Array.isArray(partsQuery.data) ? (
          <p className="mt-4 mb-0 text-sm">
            {t('staff.inventory.reserve.partsCount', { count: partsQuery.data.length })}
          </p>
        ) : null}
      </Panel>

      <ConfirmDialog
        open={confirmOpen}
        title={t('staff.inventory.confirm.title')}
        description={t('staff.inventory.confirm.description', {
          part: partId,
          quantity,
          dealership: dealershipId,
        })}
        confirmLabel={t('staff.inventory.reserve.submit')}
        loading={reserveMutation.isPending}
        onConfirm={() => reserveMutation.mutate()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
