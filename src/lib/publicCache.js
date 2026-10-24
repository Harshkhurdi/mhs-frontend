// Public content only: customer inquiries and staff data never enter this cache.
const entries = new Map()
const flights = new Map()
let generation = 0
export function clearPublicCache() {
  generation++
  entries.clear()
  flights.clear()
}
export function publicResource(key, read, ttl = 15000) {
  const cached = entries.get(key)
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.value)
  if (flights.has(key)) return flights.get(key)
  const version = generation
  const task = Promise.resolve().then(read).then(value => {
    if (version === generation) {
      entries.delete(key)
      entries.set(key, { value, expires: Date.now() + ttl })
      while (entries.size > 24) entries.delete(entries.keys().next().value)
    }
    return value
  }).finally(() => { if (flights.get(key) === task) flights.delete(key) })
  flights.set(key, task)
  return task
}
export function invalidatePublicContent() {
  clearPublicCache()
  if (typeof window !== 'undefined') {
    try { localStorage.setItem('medelec-public-content-version', String(Date.now())) } catch { /* Storage is optional. */ }
    window.dispatchEvent(new Event('medelec-content-changed'))
  }
}
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key === 'medelec-public-content-version') {
    clearPublicCache()
    window.dispatchEvent(new Event('medelec-content-changed'))
  }
})
