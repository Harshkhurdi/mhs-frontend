// Match the HTML email input's ASCII address syntax. This checks shape, not
// ownership or delivery; those still require a conversation with the visitor.
const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const fieldLimits = { name: 120, hospital: 180, department: 200, email: 254, phone: 25 }

export function inquiryContactError(form) {
  if (Object.keys(fieldLimits).some((key) => typeof form?.[key] !== 'string' || !form[key].trim()))
    return 'Please complete each required field.'
  if (Object.entries(fieldLimits).some(([key, limit]) => form[key].length > limit) || typeof form.message !== 'string' || form.message.length > 5000)
    return 'Please shorten your details to fit the displayed field limits.'
  if (!emailPattern.test(form.email)) return 'Please enter a valid email address.'
  if (!/^\+?[-0-9 ().]{7,25}$/.test(form.phone) || form.phone.replace(/\D/g, '').length < 7)
    return 'Please enter a valid phone number, including the country code if needed.'
  return ''
}

export const pendingInquiryKey = 'medelec-pending-inquiry-v1'
export function readPendingInquiry(storage) {
  try {
    storage ??= globalThis.sessionStorage
    const raw = storage?.getItem(pendingInquiryKey)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (saved?.version === 1 && ['legacy', 'api'].includes(saved.mode) && /^[0-9a-f-]{36}$/.test(saved.id) && /^[0-9a-f]{64}$/.test(saved.token) && saved.payload && !inquiryContactError(saved.payload) && Array.isArray(saved.payload.items)) return saved
    return { blocked: true }
  } catch { return { blocked: true } }
}
export function savePendingInquiry(pending, storage = globalThis.sessionStorage) {
  if (!storage) throw new Error('Keep this tab open and email our team: this browser cannot safely keep a delivery reference.')
  storage.setItem(pendingInquiryKey, JSON.stringify(pending))
}
export function clearPendingInquiry(storage = globalThis.sessionStorage) { storage?.removeItem(pendingInquiryKey) }
export function newPendingInquiry(payload, mode, crypto = globalThis.crypto) {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return { version: 1, mode, id: crypto.randomUUID(), token: Array.from(bytes, value => value.toString(16).padStart(2, '0')).join(''), payload }
}
export async function inquiryRequest(body) {
  const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', cache: 'no-store', body: JSON.stringify(body) })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Inquiry delivery is unavailable.')
  return result
}
export async function deliverPendingInquiry(pending, { post = inquiryRequest, save = savePendingInquiry, now = Date.now, wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)) } = {}) {
  const identity = () => ({ id: pending.id, token: pending.token, issuedAt: pending.issuedAt, proof: pending.proof })
  if (pending.proof) {
    const receipt = await post({ action: 'status', ...identity() })
    if (receipt.status === 'received') return receipt
    if (receipt.status !== 'missing') throw new Error('Delivery is still unresolved. Please contact our team.')
  }
  if (!pending.proof || now() - pending.issuedAt > 29 * 60 * 1000) {
    Object.assign(pending, await post({ action: 'prepare', id: pending.id, token: pending.token }))
    save(pending)
  }
  await wait(Math.max(0, 2100 - (now() - pending.issuedAt)))
  const receipt = await post({ action: 'submit', ...identity(), payload: pending.payload, website: pending.website || '' })
  if (receipt.status !== 'received') throw new Error('Delivery is still unresolved. Please contact our team.')
  return receipt
}
export function sameInquiryItems(current, submitted) {
  return current.length === submitted.length && current.every((item, index) => item.id === submitted[index].id && item.name === submitted[index].name && item.quantity === submitted[index].quantity)
}
