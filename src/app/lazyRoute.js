import { lazy } from 'react'
export function lazyNamed(factory, exportName) {
  return lazy(async () => {
    const mod = await factory()
    const comp = mod[exportName]
    if (!comp) throw new Error(`Missing export "${exportName}" in lazy route module`)
    return {
      default: comp,
    }
  })
}
