import axios from 'axios'
export function parseApiError(err) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const data = err.response?.data
    if (data && typeof data === 'object') {
      const detail = data.detail
      let message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((d) => (typeof d === 'object' && d?.msg ? d.msg : String(d))).join('; ')
            : err.message
      let fieldErrors
      if (Array.isArray(data.errors)) {
        fieldErrors = {}
        for (const item of data.errors) {
          const loc = Array.isArray(item.loc) ? item.loc.filter(Boolean).join('.') : 'field'
          const msg = item.msg || String(item)
          if (!fieldErrors[loc]) fieldErrors[loc] = []
          fieldErrors[loc].push(msg)
        }
      }
      return {
        message: message || 'Request failed',
        fieldErrors,
        status,
      }
    }
    return {
      message: err.message || 'Network error',
      status,
    }
  }
  if (err instanceof Error) {
    return {
      message: err.message,
    }
  }
  return {
    message: String(err),
  }
}
export const normalizeApiError = parseApiError
