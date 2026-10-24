import test from 'node:test'
import assert from 'node:assert/strict'
import { signInStaff, watchStaffSession } from '../src/lib/staffSession.js'
import { isApprovedStaff } from '../src/lib/staffAccess.js'
const staff = { uid: 'rE1K7ZYGZicgsqgVyOBCCm5zvTp1' }, tick = () => new Promise(resolve => queueMicrotask(resolve))
function deferred() { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }
test('restored sessions and sign-in wait for successful session-only persistence migration', async () => {
  const migration = deferred(), changes = []
  let observer, subscribed = false, signedIn = false
  const stop = watchStaffSession({ ready: migration.promise, subscribe(changed) { subscribed = true; observer = changed; return () => {} }, clear: async () => {}, approved: isApprovedStaff, changed: user => changes.push(user), failed: () => assert.fail('Unexpected failure') })
  const login = signInStaff({ ready: migration.promise, signIn: async () => { signedIn = true; return { user: staff } }, clear: async () => {}, approved: isApprovedStaff })
  await tick(); assert.equal(subscribed, false); assert.equal(signedIn, false)
  migration.resolve(); await login
  assert.equal(subscribed, true); assert.equal(signedIn, true)
  observer(staff); observer(null); assert.deepEqual(changes, [staff, null]); stop()
})
test('failed migration clears persistent auth and never exposes a user or signs in', async () => {
  const ready = Promise.reject(new Error('Storage denied')); let cleared = 0, failed = 0
  const stop = watchStaffSession({ ready, subscribe: () => assert.fail('Must not observe'), clear: async () => { cleared++ }, approved: isApprovedStaff, changed: () => assert.fail('Must not expose'), failed: () => { failed++ } })
  await assert.rejects(signInStaff({ ready, signIn: () => assert.fail('Must not sign in'), clear: async () => {}, approved: isApprovedStaff }), /Storage denied/)
  await tick(); assert.equal(cleared, 1); assert.equal(failed, 1); stop()
})
test('late migration cannot subscribe after unmount', async () => {
  const migration = deferred(), stop = watchStaffSession({ ready: migration.promise, subscribe: () => assert.fail('Unmounted'), clear: async () => {}, approved: isApprovedStaff, changed: () => assert.fail('Unmounted'), failed: () => assert.fail('Unmounted') })
  stop(); migration.resolve(); await tick()
})
test('unapproved accounts remain denied even if clearing auth fails', async () => {
  const changes = []; let observer, cleared = 0
  const stop = watchStaffSession({ ready: Promise.resolve(), subscribe(changed) { observer = changed; return () => {} }, clear: async () => { cleared++; throw new Error('Offline') }, approved: isApprovedStaff, changed: user => changes.push(user), failed: () => {} })
  await tick(); observer({ uid: 'unapproved' }); await tick()
  assert.deepEqual(changes, [null]); assert.equal(cleared, 1)
  await assert.rejects(signInStaff({ ready: Promise.resolve(), signIn: async () => ({ user: { uid: 'unapproved' } }), clear: async () => { throw new Error('Offline') }, approved: isApprovedStaff }), { code: 'auth/staff-access-denied' }); stop()
})
