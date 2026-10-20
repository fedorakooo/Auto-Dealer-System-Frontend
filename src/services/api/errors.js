import axios from 'axios'
import { ZodError } from 'zod'

const INVALID_RESPONSE_MESSAGE = 'Сервер вернул данные в неожиданном формате. Попробуйте позже.'

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
      const validationItems = Array.isArray(data.errors)
        ? data.errors
        : Array.isArray(data.detail)
          ? data.detail
          : null
      if (validationItems) {
        fieldErrors = {}
        for (const item of validationItems) {
          const rawLoc = Array.isArray(item.loc) ? item.loc.filter(Boolean) : ['field']
          const loc =
            rawLoc.filter((part) => part !== 'body' && part !== 'query').join('.') || 'field'
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
  if (err instanceof ZodError) {
    return {
      message: INVALID_RESPONSE_MESSAGE,
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
