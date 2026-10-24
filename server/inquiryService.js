import { Buffer } from 'node:buffer'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { inquiryContactError } from '../src/lib/inquirySubmission.js'

export const MAX_PAYLOAD_BYTES = 450000
export const CHALLENGE_WAIT_MS = 2000
export class InquiryError extends Error {
  constructor(status, message) { super(message); this.status = status }
}
const fail = (status, message) => { throw new InquiryError(status, message) }
const hash = value => createHash('sha256').update(value).digest('hex')
const hmac = (key, value) => createHmac('sha256', key).update(value).digest('hex')
function equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const left = Buffer.from(a), right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
export function validateInquiry(value) {
  const fields = ['name', 'hospital', 'department', 'email', 'phone', 'message', 'items', 'type']
  if (!value || typeof value !== 'object' || Object.keys(value).some(key => !fields.includes(key)) || fields.some(key => !(key in value))) fail(400, 'Please check the inquiry details.')
  const error = inquiryContactError(value)
  if (error) fail(400, error)
  if (!['equipment', 'service'].includes(value.type) || !Array.isArray(value.items) || value.items.length > 500) fail(400, 'Please check your inquiry type and equipment selection (up to 500 products).')
  const seen = new Set()
  for (const item of value.items) {
    if (!item || typeof item !== 'object' || Object.keys(item).sort().join(',') !== 'id,name,quantity' ||
      typeof item.id !== 'string' || !item.id.trim() || item.id.length > 200 ||
      typeof item.name !== 'string' || !item.name.trim() || item.name.length > 500 ||
      !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 999 || seen.has(item.id)) fail(400, 'Please check each selected product and quantity (1–999).')
    seen.add(item.id)
  }
  return Object.fromEntries(fields.map(key => [key, key === 'items' ? value.items.map(({ id, name, quantity }) => ({ id, name, quantity })) : value[key]]))
}
export function quotaBuckets(key, ip, now) {
  const hour = Math.floor(now / 3600000), day = Math.floor(now / 86400000), address = hmac(key, ip)
  return [
    { id: `${address}-h-${hour}`, max: 5, expiresAt: (hour + 2) * 3600000 },
    { id: `${address}-d-${day}`, max: 30, expiresAt: (day + 2) * 86400000 },
    { id: `global-h-${hour}`, max: 100, expiresAt: (hour + 2) * 3600000 },
    { id: `global-d-${day}`, max: 500, expiresAt: (day + 2) * 86400000 },
  ]
}
export function createInquiryService({ store, signingKey, now = Date.now }) {
  if (typeof signingKey !== 'string' || signingKey.length < 32) throw new Error('Inquiry signing key must contain at least 32 characters.')
  function identity(body) {
    if (typeof body?.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(body.id) || !/^[a-f0-9]{64}$/.test(body?.token || '')) fail(400, 'Invalid inquiry reference.')
  }
  function proof(body) {
    identity(body)
    if (!Number.isSafeInteger(body.issuedAt) || body.issuedAt > now() || !equal(body.proof, hmac(signingKey, `${body.id}:${body.token}:${body.issuedAt}`))) fail(400, 'Invalid delivery receipt. Please contact our team with your inquiry reference.')
  }
  return async function handle(body, ip) {
    if (!body || typeof body !== 'object' || Buffer.byteLength(JSON.stringify(body)) > MAX_PAYLOAD_BYTES) fail(413, 'Your inquiry is too large. Please email our team for help.')
    if (body.action === 'prepare') {
      identity(body)
      const issuedAt = now()
      return { issuedAt, proof: hmac(signingKey, `${body.id}:${body.token}:${issuedAt}`) }
    }
    proof(body)
    const tokenHash = hash(body.token)
    if (body.action === 'status') {
      const receipt = await store.receipt(body.id)
      if (receipt && !equal(receipt.tokenHash, tokenHash)) fail(409, 'Inquiry reference cannot be reused.')
      return { status: receipt ? 'received' : 'missing' }
    }
    if (body.action !== 'submit') fail(400, 'Unsupported inquiry request.')
    const payload = validateInquiry(body.payload), digest = hash(JSON.stringify(payload))
    const existing = await store.receipt(body.id)
    if (existing) {
      if (!equal(existing.tokenHash, tokenHash) || !equal(existing.digest, digest)) fail(409, 'Inquiry reference cannot be reused for different details.')
      return { status: 'received' }
    }
    const age = now() - body.issuedAt
    if (body.website !== '' || age < CHALLENGE_WAIT_MS || age > 30 * 60 * 1000) fail(400, 'Please wait a moment and try checking delivery again.')
    if (!ip) fail(503, 'Inquiry service is temporarily unavailable. Please email our team.')
    await store.commit({ id: body.id, tokenHash, digest, payload, now: now(), buckets: quotaBuckets(signingKey, ip, now()) })
    return { status: 'received' }
  }
}
