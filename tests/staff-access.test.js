import test from 'node:test'
import assert from 'node:assert/strict'
import { isApprovedStaff } from '../src/lib/staffAccess.js'

test('both existing project accounts verified in Firebase console retain access by UID', () => {
  for (const uid of ['rE1K7ZYGZicgsqgVyOBCCm5zvTp1', 'jULRArueS7gig2T92FlxXHBYERn1'])
    assert.equal(isApprovedStaff({ uid }), true)
})

test('authentication, email addresses and self-declared admin roles do not grant staff access', () => {
  for (const user of [null, undefined, {}, { uid: '' }, { uid: 123 }, { uid: 'unapproved', email: 'mhs@test.com', admin: true }, { uid: 'unapproved', email: 'mhs.admin.test@demo.com', emailVerified: true }])
    assert.equal(isApprovedStaff(user), false)
})
