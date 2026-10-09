import { parseApiError } from '@/services/api/errors.js'

export function applyApiFieldErrors(error, setError) {
  const parsed = parseApiError(error)
  Object.entries(parsed.fieldErrors || {}).forEach(([name, messages]) => {
    setError(name, { type: 'server', message: messages.join('; ') })
  })
  return parsed
}
