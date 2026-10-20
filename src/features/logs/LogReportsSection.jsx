import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { downloadLogReport, fetchLogReport } from '@/features/logs/logService.js'
import { parseApiError } from '@/services/api'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Skeleton } from '@/shared/ui/Skeleton.jsx'
import { DataTable } from '@/shared/ui/Table.jsx'

const REPORTS = [
  { value: 'activity', label: 'Активность по периодам', hasPeriod: true },
  { value: 'top-users', label: 'Самые активные пользователи' },
  { value: 'crud-stats', label: 'Статистика CRUD-операций' },
  { value: 'anomalies', label: 'Аномалии' },
]

const PERIODS = [
  { value: 'day', label: 'День' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
]

function toColumns(rows) {
  const keys = new Set()
  rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)))
  return [...keys].map((key) => ({
    key,
    header: key,
    render: (row) =>
      row[key] == null
        ? '—'
        : String(typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key]),
  }))
}

export function LogReportsSection() {
  const { api } = useAuth()
  const [report, setReport] = useState(REPORTS[0].value)
  const [period, setPeriod] = useState('day')
  const [exportError, setExportError] = useState('')
  const [exporting, setExporting] = useState(false)

  const current = REPORTS.find((item) => item.value === report)
  const params = current.hasPeriod ? { period } : {}

  const query = useQuery({
    queryKey: ['log-report', report, params],
    queryFn: () => fetchLogReport(api, report, params),
  })

  const rows = Array.isArray(query.data) ? query.data : []

  async function handleExport(format) {
    setExportError('')
    setExporting(true)
    try {
      await downloadLogReport(api, report, params, format)
    } catch (error) {
      setExportError(parseApiError(error).message)
    } finally {
      setExporting(false)
    }
  }

  return (
    <Panel
      className="mt-8"
      title="Отчёты"
      description="Агрегированные отчёты по журналу аудита с выгрузкой в CSV или JSON."
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            disabled={exporting}
            onClick={() => handleExport('csv')}
          >
            Экспорт CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={exporting}
            onClick={() => handleExport('json')}
          >
            Экспорт JSON
          </Button>
        </>
      }
    >
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <Select
          id="report-type"
          className="mb-0"
          label="Отчёт"
          value={report}
          onChange={(event) => setReport(event.target.value)}
        >
          {REPORTS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        {current.hasPeriod ? (
          <Select
            id="report-period"
            className="mb-0"
            label="Период"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            {PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        ) : null}
      </div>

      {exportError ? <Alert variant="danger">{exportError}</Alert> : null}
      {query.isLoading ? <Skeleton className="h-40" /> : null}
      {query.isError ? <Alert variant="danger">{parseApiError(query.error).message}</Alert> : null}
      {query.isSuccess ? (
        <DataTable
          caption={current.label}
          columns={toColumns(rows)}
          rows={rows}
          getRowKey={(_, index) => index}
          emptyMessage="Нет данных для отчёта"
        />
      ) : null}
    </Panel>
  )
}
