export const MAX_QUANTITY = 999
export const MAX_QUOTE_ITEMS = 500

export function validItems(value) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  return value
    .filter((item) => {
      if (
        !item ||
        typeof item.id !== 'string' ||
        !item.id.trim() ||
        item.id.length > 200 ||
        typeof item.name !== 'string' ||
        !item.name.trim() ||
        item.name.length > 500 ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > MAX_QUANTITY ||
        seen.has(item.id)
      )
        return false
      seen.add(item.id)
      return true
    })
    .map(({ id, name, quantity }) => ({ id, name, quantity }))
}

export function safeExternalUrl(value) {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export function safeImageUrl(value) {
  if (
    typeof value === 'string' &&
    /^\/images\/(products|brand)\/[a-zA-Z0-9._-]+\.(webp|png|jpe?g)$/.test(
      value,
    )
  )
    return value
  return safeExternalUrl(value)
}

export async function withTimeout(promise, milliseconds = 12000) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error('The connection is taking too long. Please try again.'),
            ),
          milliseconds,
        )
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

// A timeout stops waiting, not the underlying write. Keep its result so checking
// delivery never turns an already-created public inquiry into a forbidden update.
export function createInquirySubmission(write) {
  const submission = { status: 'pending', promise: null }
  submission.promise = Promise.resolve()
    .then(write)
    .then(
      (result) => {
        submission.status = 'succeeded'
        return result
      },
      (error) => {
        submission.status = 'failed'
        throw error
      },
    )
  return submission
}

export function inquiryEmail(form, items) {
  const body = `Name: ${form.name}\nHospital / organisation: ${form.hospital}\nDepartment: ${form.department}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}\n\nEquipment requested:\n${items.map((i) => `${i.name} — quantity ${i.quantity}`).join('\n') || 'Please see message above.'}`
  return `mailto:info@medelec.in?subject=${encodeURIComponent(`Equipment inquiry — ${form.hospital || form.name}`)}&body=${encodeURIComponent(body)}`
}
