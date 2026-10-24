import test from 'node:test'
import assert from 'node:assert/strict'
import { INQUIRY_PAGE_SIZE, inquiryPageResult } from '../src/lib/inquiryPages.js'

const document = (n, data) => ({ id: String(n).padStart(4, '0'), data: () => ({ name: `Person ${n}`, ...data }) })

test('legacy scans advance even through empty matches and retain every missing-marker record', () => {
  const records = Array.from({ length: 103 }, (_, n) => document(n, n < 25 || n % 3 ? { is_deleted: n % 2 === 0 } : {}))
  const found = []
  for (let offset = 0; offset < records.length; offset += INQUIRY_PAGE_SIZE) {
    const scanned = records.slice(offset, offset + INQUIRY_PAGE_SIZE)
    const page = inquiryPageResult(scanned, 'legacy')
    assert.equal(page.cursor, scanned.at(-1))
    assert.ok(page.scanned <= 25)
    assert.equal(page.hasMore, scanned.length === 25)
    found.push(...page.rows.map((row) => row.id))
    if (offset === 0) { assert.equal(page.rows.length, 0); assert.equal(page.hasMore, true) }
  }
  assert.deepEqual(found, records.filter((row) => row.data().is_deleted === undefined).map((row) => row.id))
  assert.equal(new Set(found).size, found.length)
})

test('inbox, Trash and legacy records stay separate, including after delete and restore', () => {
  const data = [{ is_deleted: false }, { is_deleted: true }, {}, { is_deleted: null }]
  const records = data.map((value, n) => document(n, value))
  assert.deepEqual(inquiryPageResult(records, 'inbox').rows.map((row) => row.id), ['0000'])
  assert.deepEqual(inquiryPageResult(records, 'trash').rows.map((row) => row.id), ['0001'])
  assert.deepEqual(inquiryPageResult(records, 'legacy').rows.map((row) => row.id), ['0002', '0003'])
  data[2].is_deleted = true
  assert.deepEqual(inquiryPageResult(records, 'trash').rows.map((row) => row.id), ['0001', '0002'])
  data[2].is_deleted = false
  assert.deepEqual(inquiryPageResult(records, 'inbox').rows.map((row) => row.id), ['0000', '0002'])
  assert.deepEqual(inquiryPageResult([], 'legacy'), { rows: [], cursor: null, hasMore: false, scanned: 0 })
  assert.throws(() => inquiryPageResult([], 'unknown'), /inquiry view/)
})
