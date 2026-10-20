export const MAX_QUANTITY = 999

export function validItems(value) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  return value
    .filter((item) => {
      if (
        !item ||
        typeof item.id !== 'string' ||
        typeof item.name !== 'string' ||
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

export function inquiryEmail(form, items) {
  const body = `Name: ${form.name}\nHospital / organisation: ${form.hospital}\nDepartment: ${form.department}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}\n\nEquipment requested:\n${items.map((i) => `${i.name} — quantity ${i.quantity}`).join('\n') || 'Please see message above.'}`
  return `mailto:info@medelec.com?subject=${encodeURIComponent(`Equipment inquiry — ${form.hospital || form.name}`)}&body=${encodeURIComponent(body)}`
}
