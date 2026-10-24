import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createInquiryService, validateInquiry } from '../server/inquiryService.js'
import { createInquiryStore } from '../server/inquiryStore.js'
import { deliverPendingInquiry, newPendingInquiry, readPendingInquiry, sameInquiryItems, savePendingInquiry } from '../src/lib/inquirySubmission.js'

const payload = { name: 'Test Visitor', hospital: 'Test Hospital', department: 'ICU', email: 'staff@example.test', phone: '+91 172 1234567', message: '', type: 'equipment', items: [{ id: 'monitor', name: 'Monitor', quantity: 2 }] }
function fixture() {
  let clock = 1800000000000, queue = Promise.resolve()
  const documents = new Map(), snapshot = ref => ({ exists: documents.has(ref.path), data: () => documents.get(ref.path) })
  const db = {
    collection(name) { return { doc: id => ({ path: `${name}/${id}`, async get() { return snapshot(this) } }) } },
    runTransaction(callback) {
      const result = queue.then(async () => {
        const writes = []
        await callback({ get: async ref => snapshot(ref), getAll: async (...refs) => refs.map(snapshot),
          create(ref, value) { if (documents.has(ref.path)) throw new Error('Already exists'); writes.push([ref.path, value]) },
          set(ref, value) { writes.push([ref.path, value]) },
        })
        for (const [path, value] of writes) documents.set(path, value)
      })
      queue = result.catch(() => {})
      return result
    },
  }
  const handle = createInquiryService({ store: createInquiryStore(db), signingKey: 'test-signing-key-that-is-never-used-in-production', now: () => clock })
  async function prepared() {
    const identity = { id: randomUUID(), token: 'a'.repeat(64) }, challenge = await handle({ action: 'prepare', ...identity })
    clock += 2100
    return { action: 'submit', ...identity, ...challenge, payload, website: '' }
  }
  return { handle, prepared, documents, count: () => [...documents.keys()].filter(key => key.startsWith('inquiries/')).length, advance: amount => { clock += amount }, now: () => clock }
}
test('all 500 quote elements are validated without removing legitimate products', () => {
  const items = Array.from({ length: 500 }, (_, index) => ({ id: `item-${index}`, name: 'n'.repeat(500), quantity: 999 }))
  assert.equal(validateInquiry({ ...payload, items }).items.length, 500)
  for (const item of [null, {}, { id: 'x', name: 'x', quantity: 0 }, { id: 'x', name: 'x', quantity: 1.5 }, { id: 'x', name: 'x', quantity: 1000 }, { id: 'x', name: 'x'.repeat(501), quantity: 1 }, { id: 'x', name: 'x', quantity: 1, extra: true }]) assert.throws(() => validateInquiry({ ...payload, items: [...items.slice(0, 499), item] }), { status: 400 })
  assert.throws(() => validateInquiry({ ...payload, items: [...items, items[0]] }), { status: 400 })
  assert.throws(() => validateInquiry({ ...payload, items: [items[0], items[0]] }), { status: 400 })
  assert.throws(() => validateInquiry({ ...payload, unknown: 'extra' }), { status: 400 })
})
test('signed challenge, elapsed time, honeypot and payload bound reject before writes', async () => {
  const f = fixture(), request = await f.prepared()
  await assert.rejects(f.handle({ ...request, website: 'spam' }, '192.0.2.1'), { status: 400 })
  await assert.rejects(f.handle({ ...request, proof: 'b'.repeat(64) }, '192.0.2.1'), { status: 400 })
  const challenge = await f.handle({ action: 'prepare', id: request.id, token: request.token })
  await assert.rejects(f.handle({ ...request, ...challenge }, '192.0.2.1'), { status: 400 })
  await assert.rejects(f.handle({ ...request, padding: 'x'.repeat(450000) }, '192.0.2.1'), { status: 413 })
  assert.equal(f.count(), 0)
})
test('actual transaction adapter bounds bursts and retries do not consume another quota', async () => {
  const f = fixture(), requests = await Promise.all(Array.from({ length: 6 }, () => f.prepared()))
  const results = await Promise.allSettled(requests.map(request => f.handle(request, '192.0.2.1')))
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 5)
  assert.equal(results.find(result => result.status === 'rejected').reason.status, 429)
  await f.handle(requests[0], '192.0.2.1')
  assert.equal(f.count(), 5)
  await assert.rejects(f.handle({ ...requests[0], payload: { ...payload, message: 'changed' } }, '192.0.2.1'), { status: 409 })
  f.advance(31 * 60 * 1000)
  assert.deepEqual(await f.handle(requests[0], '192.0.2.200'), { status: 'received' })
})
test('global and daily quotas persist across addresses and hourly windows', async () => {
  const f = fixture()
  for (let index = 0; index < 100; index++) await f.handle(await f.prepared(), `192.0.2.${index}`)
  await assert.rejects(f.handle(await f.prepared(), '198.51.100.1'), { status: 429 })
  const day = fixture()
  for (let hour = 0; hour < 6; hour++) {
    for (let index = 0; index < 5; index++) await day.handle(await day.prepared(), '192.0.2.1')
    day.advance(3600000)
  }
  await assert.rejects(day.handle(await day.prepared(), '192.0.2.1'), { status: 429 })
})
test('lost acknowledgement then reload reconciles one private receipt and exactly one inquiry', async () => {
  const f = fixture(), values = new Map(), storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }
  const pending = newPendingInquiry(payload, 'api')
  savePendingInquiry(pending, storage)
  let lose = true
  const post = async body => { const result = await f.handle(body, '192.0.2.1'); if (body.action === 'submit' && lose) { lose = false; throw new Error('Lost acknowledgement') } return result }
  const options = { post, save: value => savePendingInquiry(value, storage), now: f.now, wait: async amount => f.advance(amount) }
  await assert.rejects(deliverPendingInquiry(pending, options), /Lost acknowledgement/)
  const restored = readPendingInquiry(storage)
  assert.equal(restored.id, pending.id)
  assert.deepEqual(restored.payload, payload)
  assert.deepEqual(await deliverPendingInquiry(restored, options), { status: 'received' })
  assert.equal(f.count(), 1)
  assert.deepEqual(Object.keys(f.documents.get(`_inquiryReceipts/${pending.id}`)).sort(), ['digest', 'tokenHash'])
  await assert.rejects(f.handle({ ...pending, action: 'status', token: 'b'.repeat(64) }), { status: 400 })
})
test('missing or expired receipt reuses its ID; legacy/corrupt state never silently resets it', async () => {
  const f = fixture(), values = new Map(), storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }
  const pending = newPendingInquiry(payload, 'api')
  Object.assign(pending, await f.handle({ action: 'prepare', id: pending.id, token: pending.token }))
  savePendingInquiry(pending, storage); f.advance(31 * 60 * 1000)
  const restored = readPendingInquiry(storage)
  await deliverPendingInquiry(restored, { post: body => f.handle(body, '192.0.2.1'), save: value => savePendingInquiry(value, storage), now: f.now, wait: async amount => f.advance(amount) })
  assert.equal(restored.id, pending.id); assert.equal(f.count(), 1)
  const legacy = newPendingInquiry(payload, 'legacy'); savePendingInquiry(legacy, storage)
  assert.equal(readPendingInquiry(storage).id, legacy.id)
  storage.setItem('medelec-pending-inquiry-v1', '{bad')
  assert.deepEqual(readPendingInquiry(storage), { blocked: true })
  assert.throws(() => savePendingInquiry(pending, { setItem() { throw new Error('Storage denied') } }), /Storage denied/)
})
test('restored submitted selection clears only an unchanged basket', () => {
  const restored = JSON.parse(JSON.stringify(payload.items))
  assert.equal(sameInquiryItems(restored, payload.items), true)
  assert.equal(sameInquiryItems([{ ...restored[0], quantity: 3 }], payload.items), false)
  assert.equal(sameInquiryItems([...restored, { id: 'other', name: 'Other', quantity: 1 }], payload.items), false)
})
