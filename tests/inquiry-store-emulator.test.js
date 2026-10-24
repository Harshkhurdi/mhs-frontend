import test from 'node:test'
import assert from 'node:assert/strict'
import process from 'node:process'
import { randomUUID } from 'node:crypto'
import { initializeApp, deleteApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { createInquiryService } from '../server/inquiryService.js'
import { createInquiryStore } from '../server/inquiryStore.js'
const host = process.env.FIRESTORE_EMULATOR_HOST
test('real Firestore transactions enforce quotas and concurrent idempotency', { skip: !host && 'Run against a local Firestore emulator.' }, async t => {
  assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(`http://${host}`).hostname))
  const app = initializeApp({ projectId: 'demo-mhs-inquiry-store' }, `inquiry-test-${randomUUID()}`), db = getFirestore(app)
  t.after(async () => { await db.terminate(); await deleteApp(app) })
  // Clear only our isolated, fixed demo project between emulator executions.
  for (const collection of ['inquiries', '_inquiryReceipts', '_inquiryLimits']) {
    const existing = await db.collection(collection).get()
    await Promise.all(existing.docs.map(document => document.ref.delete()))
  }
  let now = Date.now()
  const service = createInquiryService({ store: createInquiryStore(db), signingKey: 'emulator-only-signing-key-please-do-not-deploy', now: () => now })
  const payload = { name: 'Synthetic Visitor', hospital: 'Emulator Hospital', department: 'ICU', email: 'synthetic@example.test', phone: '1234567', message: '', items: [{ id: 'test', name: 'Test equipment', quantity: 1 }], type: 'equipment' }
  const prepare = async () => {
    const identity = { id: randomUUID(), token: randomUUID().replaceAll('-', '') + randomUUID().replaceAll('-', '') }, challenge = await service({ action: 'prepare', ...identity })
    now += 2100
    return { action: 'submit', ...identity, ...challenge, payload, website: '' }
  }
  const first = await prepare()
  assert.deepEqual(await Promise.all([service(first, '192.0.2.10'), service(first, '192.0.2.10')]), [{ status: 'received' }, { status: 'received' }])
  for (let index = 0; index < 4; index++) await service(await prepare(), '192.0.2.10')
  await assert.rejects(service(await prepare(), '192.0.2.10'), { status: 429 })
  await service(first, '192.0.2.10')
  const inquiries = await db.collection('inquiries').get()
  assert.equal(inquiries.size, 5)
  assert.equal(inquiries.docs.every(document => document.data().is_deleted === false && typeof document.data().created_at.toMillis() === 'number'), true)
  assert.deepEqual(Object.keys((await db.doc(`_inquiryReceipts/${first.id}`).get()).data()).sort(), ['digest', 'tokenHash'])
  assert.equal((await db.collection('_inquiryLimits').get()).docs.every(document => document.data().count === 5), true)
  assert.deepEqual(await service({ ...first, action: 'status' }), { status: 'received' })
})
