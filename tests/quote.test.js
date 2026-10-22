import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createInquirySubmission,
  inquiryEmail,
  safeExternalUrl,
  validItems,
  withTimeout,
} from '../src/lib/quote.js'

test('corrupted or unexpected saved quote data cannot break the basket', () => {
  assert.deepEqual(validItems({ id: 'x' }), [])
  assert.deepEqual(
    validItems([
      null,
      { id: ' ', name: 'Monitor', quantity: 1 },
      { id: 'empty-name', name: '', quantity: 1 },
      { id: 'x'.repeat(201), name: 'Monitor', quantity: 1 },
      { id: 'long-name', name: 'M'.repeat(501), quantity: 1 },
      { id: 'x', name: 'Monitor', quantity: -1 },
      { id: 'x', name: 'Monitor', quantity: 1000 },
      { id: 'x', name: 'Monitor', quantity: 1.5 },
      { id: 'x', name: 'Monitor', quantity: 2, extra: 'ignored' },
      { id: 'x', name: 'Duplicate', quantity: 1 },
    ]),
    [{ id: 'x', name: 'Monitor', quantity: 2 }],
  )
})

test('product media accepts web URLs and rejects executable or missing local links', () => {
  assert.equal(
    safeExternalUrl('https://example.org/brochure.pdf'),
    'https://example.org/brochure.pdf',
  )
  for (const input of [
    null,
    '',
    'javascript:alert(1)',
    'data:text/html,test',
    '//example.org/file',
    '/docs/missing.pdf',
  ])
    assert.equal(safeExternalUrl(input), '')
})

test('email fallback safely encodes visitor content and equipment quantities', () => {
  const url = new URL(
    inquiryEmail(
      {
        name: 'A & B',
        hospital: 'Clinic #1',
        department: 'ICU',
        email: 'test@example.org',
        phone: '+91 1234567890',
        message: 'Quote & service\nSecond line',
      },
      [{ id: 'x', name: 'Ventilator', quantity: 3 }],
    ),
  )
  assert.equal(url.protocol, 'mailto:')
  assert.equal(url.searchParams.get('subject'), 'Equipment inquiry — Clinic #1')
  assert.match(url.searchParams.get('body'), /Quote & service\nSecond line/)
  assert.match(url.searchParams.get('body'), /Ventilator — quantity 3/)
})

test('connection timeouts reject instead of leaving the UI waiting indefinitely', async () => {
  await assert.rejects(withTimeout(new Promise(() => {}), 5), /taking too long/)
  assert.equal(await withTimeout(Promise.resolve('saved'), 50), 'saved')
  await assert.rejects(
    withTimeout(Promise.reject(new Error('permission denied')), 50),
    /permission denied/,
  )
})

test('checking inquiry delivery after a timeout reuses the original write and its eventual receipt', async () => {
  let writes = 0
  let deliver
  const submission = createInquirySubmission(() => {
    writes += 1
    return new Promise((resolve) => { deliver = resolve })
  })
  await assert.rejects(withTimeout(submission.promise, 5), /taking too long/)
  assert.equal(submission.status, 'pending')
  deliver('received')
  assert.equal(await withTimeout(submission.promise, 50), 'received')
  assert.equal(submission.status, 'succeeded')
  assert.equal(await withTimeout(submission.promise, 50), 'received')
  assert.equal(writes, 1)
})

test('a definitively rejected inquiry is marked failed so the visitor can edit and retry', async () => {
  const submission = createInquirySubmission(() => Promise.reject(new Error('unavailable')))
  await assert.rejects(withTimeout(submission.promise, 50), /unavailable/)
  assert.equal(submission.status, 'failed')
})
