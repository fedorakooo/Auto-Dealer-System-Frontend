import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchOperationList, mutateOperation } from '@/features/operations/operationsService.js'
import { parseApiError } from '@/services/api/errors.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { DataTable } from '@/shared/ui/Table.jsx'

const INVENTORY_COLUMNS = [
  { key: 'part', header: 'Запчасть', render: (row) => row.part_name || row.part_id },
  {
    key: 'quantity',
    header: 'В наличии',
    render: (row) => row.quantity ?? row.available_quantity ?? '—',
  },
  { key: 'reserved_quantity', header: 'Резерв', render: (row) => row.reserved_quantity ?? '—' },
]

export function StaffInventoryPage() {
  const { api } = useAuth()
  const [dealershipInput, setDealershipInput] = useState('')
  const [dealershipId, setDealershipId] = useState('')
  const [partId, setPartId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const partsQuery = useQuery({
    queryKey: ['parts'],
    queryFn: () => fetchOperationList(api, '/parts', { limit: 100 }),
  })

  const inventoryQuery = useQuery({
    queryKey: ['inventory', dealershipId],
    queryFn: () =>
      fetchOperationList(api, `/dealerships/${dealershipId}/inventory`, { limit: 100 }),
    enabled: Boolean(dealershipId),
  })

  const reserveMutation = useMutation({
    mutationFn: () =>
      mutateOperation(
        api,
        'post',
        `/dealerships/${dealershipId}/inventory/${partId}/reservations`,
        {
          quantity: Number(quantity),
        }
      ),
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
        kicker="Склад"
        title="Запчасти, остатки и резервирование"
        subtitle="Резервирование требует явного подтверждения и проверяется backend-ом."
      />

      <Panel title="Остатки по салону">
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
            label="ID дилерского центра"
            inputMode="numeric"
            value={dealershipInput}
            onChange={(event) => setDealershipInput(event.target.value)}
          />
          <Button type="submit" disabled={!dealershipInput.trim()}>
            Показать остатки
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
              title="Остатков нет"
              description="Проверьте ID салона или добавьте складскую позицию через backend."
            />
          ) : null}
          {rows.length ? (
            <DataTable
              caption="Остатки запчастей"
              columns={INVENTORY_COLUMNS}
              rows={rows}
              getRowKey={(row, index) => row.id || row.part_id || index}
            />
          ) : null}
        </div>
      </Panel>

      <Panel title="Резервировать запчасть" className="mt-6 max-w-xl">
        <Input
          id="reserve-part"
          label="ID запчасти"
          value={partId}
          onChange={(event) => setPartId(event.target.value)}
        />
        <Input
          id="reserve-quantity"
          label="Количество"
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
        {reserveMutation.isError ? (
          <Alert variant="danger">{parseApiError(reserveMutation.error).message}</Alert>
        ) : null}
        {reserveMutation.isSuccess ? <Alert variant="success">Резерв оформлен.</Alert> : null}
        <Button
          disabled={!dealershipId || !partId.trim() || !quantityValid}
          onClick={() => setConfirmOpen(true)}
        >
          Зарезервировать
        </Button>
        {Array.isArray(partsQuery.data) ? (
          <p className="mt-4 mb-0 text-sm">Справочник содержит {partsQuery.data.length} позиций.</p>
        ) : null}
      </Panel>

      <ConfirmDialog
        open={confirmOpen}
        title="Подтвердить резервирование?"
        description={`Запчасть ${partId}, количество: ${quantity}, салон ${dealershipId}.`}
        confirmLabel="Зарезервировать"
        loading={reserveMutation.isPending}
        onConfirm={() => reserveMutation.mutate()}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
