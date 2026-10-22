import test from 'node:test'
import assert from 'node:assert/strict'
import { inquiryDateValue, normalizeInquiry } from '../src/lib/inquiries.js'

test('malformed public inquiry data cannot pass objects into the inbox renderer', () => {
  const inquiry = normalizeInquiry({
    id: 'spoofed', name: { bad: true }, hospital: ['bad'], email: {},
    phone: {}, department: {}, message: { bad: true }, created_at: 1e100,
    is_deleted: 'true', items: [null, { id: 'x', name: {}, quantity: 1 }],
  }, 'actual-document')
  assert.equal(inquiry.id, 'actual-document')
  assert.equal(inquiry.name, 'Name unavailable')
  for (const field of ['hospital', 'email', 'phone', 'department', 'message'])
    assert.equal(inquiry[field], '')
  assert.equal(inquiry.created_at, 0)
  assert.equal(inquiry.is_deleted, false)
  assert.deepEqual(inquiry.items, [])
})

test('inquiry dates preserve supported legacy types and reject invalid ranges', () => {
  const timestamp = Date.parse('2026-10-22T12:00:00Z')
  for (const value of [timestamp, '2026-10-22T12:00:00Z', { toMillis: () => timestamp }])
    assert.equal(inquiryDateValue(value), timestamp)
  for (const value of [NaN, Infinity, -Infinity, 1e100, {}, null, 'invalid', { toMillis: () => { throw new Error('bad') } }])
    assert.equal(inquiryDateValue(value), 0)
})

test('valid service inquiries and reversible Trash state remain intact', () => {
  const inquiry = normalizeInquiry({
    name: 'Test Contact', hospital: 'Test Hospital', type: 'service',
    is_deleted: true, items: [{ id: 'c6', name: 'HAMILTON-C6', quantity: 2 }],
  }, 'inquiry-id')
  assert.equal(inquiry.type, 'service')
  assert.equal(inquiry.hospital, 'Test Hospital')
  assert.equal(inquiry.is_deleted, true)
  assert.deepEqual(inquiry.items, [{ id: 'c6', name: 'HAMILTON-C6', quantity: 2 }])
})
