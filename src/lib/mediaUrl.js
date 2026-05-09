export function resolveMediaUrl(path) {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = import.meta.env.VITE_API_BASE_URL || ''
  try {
    const origin = new URL(base).origin
    const normalized = path.startsWith('/') ? path : `/${path}`
    return `${origin}${normalized}`
  } catch {
    return path
  }
}
