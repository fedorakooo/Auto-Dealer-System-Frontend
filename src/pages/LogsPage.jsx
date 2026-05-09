import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchLogs } from '@/features/logs/logService.js'
import { Semester2DemoPanel } from '@/features/logs/Semester2DemoPanel.jsx'
import { LogReportsSection } from '@/features/logs/LogReportsSection.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'
import { ErrorFallback } from '@/shared/ui/ErrorFallback.jsx'
import { parseApiError } from '@/services/api'
import { Button } from '@/shared/ui/Button.jsx'
import { Input } from '@/shared/ui/Input.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { z } from 'zod'
const logListSchema = z.array(z.record(z.string(), z.unknown()))
function toIsoFromLocal(localDatetime) {
  if (!localDatetime) return undefined
  const d = new Date(localDatetime)
  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}
function logRowKey(row, index) {
  const id = row._id
  if (typeof id === 'string') return id
  return `row-${index}`
}
export function LogsPage() {
  const { api } = useAuth()
  const [startLocal, setStartLocal] = useState('')
  const [endLocal, setEndLocal] = useState('')
  const [userId, setUserId] = useState('')
  const [eventType, setEventType] = useState('')
  const [limit, setLimit] = useState('50')
  const [skip, setSkip] = useState('0')
  const [applied, setApplied] = useState({
    start_time: undefined,
    end_time: undefined,
    user_id: undefined,
    event_type: undefined,
    limit: 50,
    skip: 0,
  })
  const q = useQuery({
    queryKey: ['logs', applied],
    queryFn: async () => {
      const raw = await fetchLogs(api, applied)
      return logListSchema.parse(raw)
    },
  })
  function applyFilters(e) {
    e.preventDefault()
    const lim = Math.min(1000, Math.max(1, parseInt(limit, 10) || 50))
    const sk = Math.max(0, parseInt(skip, 10) || 0)
    setApplied({
      start_time: toIsoFromLocal(startLocal),
      end_time: toIsoFromLocal(endLocal),
      user_id: userId.trim() || undefined,
      event_type: eventType || undefined,
      limit: lim,
      skip: sk,
    })
  }
  function clearFilters() {
    setStartLocal('')
    setEndLocal('')
    setUserId('')
    setEventType('')
    setLimit('50')
    setSkip('0')
    setApplied({
      start_time: undefined,
      end_time: undefined,
      user_id: undefined,
      event_type: undefined,
      limit: 50,
      skip: 0,
    })
  }
  return (
    <div>
      <PageHeader
        kicker="Аудит"
        title="Логи и отчёты (MongoDB)"
        subtitle="Поиск по журналу, агрегированные отчёты и экспорт CSV/JSON — см. раздел 6.13 API."
      />

      <Semester2DemoPanel />

      <form
        onSubmit={applyFilters}
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          alignItems: 'end',
          marginBottom: '1rem',
          padding: '1rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
        }}
      >
        <Input
          id="log-start"
          label="С (дата/время)"
          type="datetime-local"
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
        />
        <Input
          id="log-end"
          label="По (дата/время)"
          type="datetime-local"
          value={endLocal}
          onChange={(e) => setEndLocal(e.target.value)}
        />
        <Input
          id="log-user"
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UUID"
        />
        <Select
          id="log-event"
          label="Тип события"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="">Все</option>
          <option value="USER_ACTION">USER_ACTION</option>
          <option value="DB_QUERY">DB_QUERY</option>
          <option value="ERROR">ERROR</option>
        </Select>
        <Input
          id="log-limit"
          label="Limit"
          type="number"
          min={1}
          max={1000}
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        <Input
          id="log-skip"
          label="Skip"
          type="number"
          min={0}
          value={skip}
          onChange={(e) => setSkip(e.target.value)}
        />
        <Button type="submit">Применить фильтры</Button>
        <Button type="button" variant="secondary" onClick={clearFilters}>
          Сбросить
        </Button>
      </form>

      {q.isLoading ? <Spinner /> : null}
      {q.isError ? (
        <ErrorFallback message={parseApiError(q.error).message} onRetry={() => q.refetch()} />
      ) : null}

      {q.isSuccess ? (
        <>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.75rem',
            }}
          >
            Записей: {q.data.length}
          </p>
          <div
            style={{
              overflow: 'auto',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.8rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--color-surface)',
                    textAlign: 'left',
                  }}
                >
                  <th
                    style={{
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    timestamp
                  </th>
                  <th
                    style={{
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    event_type
                  </th>
                  <th
                    style={{
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    user_id
                  </th>
                  <th
                    style={{
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    action / query
                  </th>
                </tr>
              </thead>
              <tbody>
                {q.data.map((row, index) => (
                  <tr
                    key={logRowKey(row, index)}
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <td
                      style={{
                        padding: '0.4rem 0.75rem',
                        verticalAlign: 'top',
                      }}
                    >
                      {String(row.timestamp ?? '—')}
                    </td>
                    <td
                      style={{
                        padding: '0.4rem 0.75rem',
                        verticalAlign: 'top',
                      }}
                    >
                      {String(row.event_type ?? '—')}
                    </td>
                    <td
                      style={{
                        padding: '0.4rem 0.75rem',
                        verticalAlign: 'top',
                        wordBreak: 'break-all',
                      }}
                    >
                      {row.user_id != null ? String(row.user_id) : '—'}
                    </td>
                    <td
                      style={{
                        padding: '0.4rem 0.75rem',
                        verticalAlign: 'top',
                        wordBreak: 'break-word',
                      }}
                    >
                      {(() => {
                        if (row.action != null) return String(row.action)
                        if (row.query != null) {
                          const s = String(row.query)
                          return s.length > 120 ? `${s.slice(0, 120)}…` : s
                        }
                        return '—'
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
              }}
            >
              Полный JSON ответа
            </summary>
            <pre
              style={{
                fontSize: '0.75rem',
                overflow: 'auto',
                padding: '1rem',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 4,
                maxHeight: '50vh',
              }}
            >
              {JSON.stringify(q.data, null, 2)}
            </pre>
          </details>
        </>
      ) : null}

      <LogReportsSection />
    </div>
  )
}
