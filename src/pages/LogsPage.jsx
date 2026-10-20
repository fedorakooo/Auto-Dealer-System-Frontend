import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { LOG_EVENT_TYPES, fetchLogs } from '@/features/logs/logService.js'
import { LogReportsSection } from '@/features/logs/LogReportsSection.jsx'
import { parseApiError } from '@/services/api'
import { formatDateTime } from '@/lib/format.js'
import { Badge } from '@/shared/ui/Badge.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'
import { DataTable } from '@/shared/ui/Table.jsx'

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 1000

const logListSchema = z.array(z.record(z.string(), z.unknown()))

const EVENT_TONES = { USER_ACTION: 'info', DB_QUERY: 'neutral', ERROR: 'danger' }

const EMPTY_FILTERS = {
  start_time: undefined,
  end_time: undefined,
  user_id: undefined,
  event_type: undefined,
  limit: DEFAULT_LIMIT,
  skip: 0,
}

function toIsoFromLocal(localDatetime) {
  if (!localDatetime) return undefined
  const date = new Date(localDatetime)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function describeAction(row) {
  if (row.action != null) return String(row.action)
  if (row.query != null) {
    const text = String(row.query)
    return text.length > 120 ? `${text.slice(0, 120)}…` : text
  }
  return '—'
}

const COLUMNS = [
  {
    key: 'timestamp',
    header: 'Время',
    className: 'whitespace-nowrap',
    render: (row) => (row.timestamp ? formatDateTime(String(row.timestamp)) : '—'),
  },
  {
    key: 'event_type',
    header: 'Тип события',
    render: (row) =>
      row.event_type ? (
        <Badge tone={EVENT_TONES[row.event_type] ?? 'neutral'}>{String(row.event_type)}</Badge>
      ) : (
        '—'
      ),
  },
  {
    key: 'user_id',
    header: 'Пользователь',
    className: 'font-mono text-xs break-all',
    render: (row) => (row.user_id != null ? String(row.user_id) : '—'),
  },
  { key: 'action', header: 'Действие / запрос', className: 'break-words', render: describeAction },
]

export function LogsPage() {
  const { api } = useAuth()
  const [startLocal, setStartLocal] = useState('')
  const [endLocal, setEndLocal] = useState('')
  const [userId, setUserId] = useState('')
  const [eventType, setEventType] = useState('')
  const [limit, setLimit] = useState(String(DEFAULT_LIMIT))
  const [skip, setSkip] = useState('0')
  const [applied, setApplied] = useState(EMPTY_FILTERS)

  const query = useQuery({
    queryKey: ['logs', applied],
    queryFn: async () => {
      const raw = await fetchLogs(api, applied)
      return logListSchema.parse(raw)
    },
  })

  function applyFilters(event) {
    event.preventDefault()
    setApplied({
      start_time: toIsoFromLocal(startLocal),
      end_time: toIsoFromLocal(endLocal),
      user_id: userId.trim() || undefined,
      event_type: eventType || undefined,
      limit: Math.min(MAX_LIMIT, Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT)),
      skip: Math.max(0, parseInt(skip, 10) || 0),
    })
  }

  function clearFilters() {
    setStartLocal('')
    setEndLocal('')
    setUserId('')
    setEventType('')
    setLimit(String(DEFAULT_LIMIT))
    setSkip('0')
    setApplied(EMPTY_FILTERS)
  }

  return (
    <div>
      <PageHeader
        kicker="Аудит"
        title="Логи и отчёты"
        subtitle="Поиск по журналу аудита, агрегированные отчёты и выгрузка в CSV/JSON."
      />

      <Panel title="Фильтры журнала" className="mb-6">
        <form
          onSubmit={applyFilters}
          className="grid items-end gap-x-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Input
            id="log-start"
            label="С (дата/время)"
            type="datetime-local"
            value={startLocal}
            onChange={(event) => setStartLocal(event.target.value)}
          />
          <Input
            id="log-end"
            label="По (дата/время)"
            type="datetime-local"
            value={endLocal}
            onChange={(event) => setEndLocal(event.target.value)}
          />
          <Input
            id="log-user"
            label="ID пользователя"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="UUID"
          />
          <Select
            id="log-event"
            label="Тип события"
            value={eventType}
            onChange={(event) => setEventType(event.target.value)}
          >
            <option value="">Все</option>
            {LOG_EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Input
            id="log-limit"
            label="Лимит записей"
            type="number"
            min={1}
            max={MAX_LIMIT}
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
          />
          <Input
            id="log-skip"
            label="Пропустить"
            type="number"
            min={0}
            value={skip}
            onChange={(event) => setSkip(event.target.value)}
          />
          <div className="mb-4 flex gap-3 sm:col-span-2 lg:col-span-3">
            <Button type="submit">Применить фильтры</Button>
            <Button variant="secondary" onClick={clearFilters}>
              Сбросить
            </Button>
          </div>
        </form>
      </Panel>

      {query.isLoading ? <Skeleton className="h-64" /> : null}
      {query.isError ? (
        <ErrorFallback
          message={parseApiError(query.error).message}
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess ? (
        <>
          <p className="mb-3 text-sm" aria-live="polite">
            Записей: <strong className="text-[var(--color-text)]">{query.data.length}</strong>
          </p>
          <DataTable
            caption="Журнал аудита"
            columns={COLUMNS}
            rows={query.data}
            getRowKey={(row, index) => (typeof row._id === 'string' ? row._id : `row-${index}`)}
            emptyMessage="Записей по заданным фильтрам нет"
          />
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-[var(--color-text)]">
              Полный JSON ответа
            </summary>
            <pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg border border-[var(--color-border)] bg-slate-950 p-4 text-xs text-slate-100">
              {JSON.stringify(query.data, null, 2)}
            </pre>
          </details>
        </>
      ) : null}

      <LogReportsSection />
    </div>
  )
}
