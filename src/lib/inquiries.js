import { validItems } from './quote.js'

const text = (value, limit) => typeof value === 'string' ? value.slice(0, limit) : ''

export function inquiryDateValue(value) {
  let timestamp
  try {
    timestamp = typeof value?.toMillis === 'function'
      ? value.toMillis()
      : typeof value === 'number'
        ? value
        : typeof value === 'string' ? Date.parse(value) : 0
  } catch {
    return 0
  }
  return Number.isFinite(timestamp) && Math.abs(timestamp) <= 8640000000000000
    ? timestamp : 0
}

// Inquiries are public submissions. Treat old or malformed records as untrusted
// display data so one record cannot prevent staff from opening their inbox.
export function normalizeInquiry(value, id) {
  const row = value && typeof value === 'object' ? value : {}
  return {
    id,
    name: text(row.name, 120) || 'Name unavailable',
    hospital: text(row.hospital, 180),
    department: text(row.department, 200),
    email: text(row.email, 254),
    phone: text(row.phone, 25),
    message: text(row.message, 5000),
    type: row.type === 'service' ? 'service' : 'equipment',
    created_at: inquiryDateValue(row.created_at),
    is_deleted: row.is_deleted === true,
    items: validItems(row.items).slice(0, 500).map((item) => ({
      ...item, id: item.id.slice(0, 200), name: item.name.slice(0, 500),
    })),
  }
}
