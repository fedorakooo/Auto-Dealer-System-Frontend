import { endpoints } from '@/services/api/endpoints.js'

export const LOG_EVENT_TYPES = ['USER_ACTION', 'DB_QUERY', 'ERROR']

export async function fetchLogs(api, params = {}) {
  const { data } = await api.get(endpoints.logs, { params })
  return data
}

export async function fetchLogReport(api, report, params = {}) {
  const { data } = await api.get(`${endpoints.logs}/reports/${report}`, { params })
  return data
}

/** Downloads a report as a CSV/JSON attachment through the authenticated client. */
export async function downloadLogReport(api, report, params, format) {
  const response = await api.get(`${endpoints.logs}/reports/${report}`, {
    params: { ...params, export: format },
    responseType: 'blob',
  })
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = `${report}.${format}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
