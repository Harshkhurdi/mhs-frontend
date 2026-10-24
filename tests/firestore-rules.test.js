import test from 'node:test'
import assert from 'node:assert/strict'
import process from 'node:process'
import { readFile } from 'node:fs/promises'
const host = process.env.FIRESTORE_EMULATOR_HOST
// This suite cannot contact production, even if a developer sets the variable.
test('website Firestore boundaries', { skip: !host && 'Run with a local Firestore emulator.' }, async t => {
  const address = new URL(`http://${host}`)
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(address.hostname))
  const { initializeTestEnvironment, assertFails, assertSucceeds } = await import('@firebase/rules-unit-testing')
  const { doc, setDoc, getDoc, getDocs, collection, updateDoc, serverTimestamp } = await import('firebase/firestore')
  const environment = await initializeTestEnvironment({ projectId: 'demo-mhs-audit', firestore: { host: address.hostname, port: Number(address.port), rules: await readFile(new URL('../firebase/firestore.rules', import.meta.url), 'utf8') } })
  t.after(() => environment.cleanup())
  await environment.clearFirestore()
  const anonymous = environment.unauthenticatedContext().firestore(), staff = environment.authenticatedContext('rE1K7ZYGZicgsqgVyOBCCm5zvTp1').firestore(), other = environment.authenticatedContext('unapproved-account').firestore()
  const put = async (path, value) => environment.withSecurityRulesDisabled(async context => setDoc(doc(context.firestore(), path), value))
  const inquiry = { name: 'Test Visitor', hospital: 'Test Hospital', department: 'ICU', email: 'staff@example.test', phone: '+91 172 1234567', message: '', items: [], type: 'equipment', status: 'new', is_deleted: false, created_at: serverTimestamp() }
  const image = 'data:image/webp;base64,AAAA'
  await put('teamProfiles/virender', { photo: image, updated_at: 1 })
  await put('products/public', { is_published: true }); await put('products/draft', { is_published: false })
  await put('events/album', { is_published: true })
  await put('events/album/photos/one', { src: image, asset_id: 'one', thumbnail: image, alt: 'Installation', position: 0, is_published: true, updated_at: 1 })
  await put('events/album/photoAssets/one', { src: image, is_published: true, updated_at: 1 })
  await t.test('draft portraits deny public and unapproved accounts while preserving both staff UIDs', async () => {
    await assertFails(getDoc(doc(anonymous, 'teamProfiles/virender'))); await assertFails(getDoc(doc(other, 'teamProfiles/virender')))
    await assertSucceeds(getDoc(doc(staff, 'teamProfiles/virender')))
    const second = environment.authenticatedContext('jULRArueS7gig2T92FlxXHBYERn1').firestore()
    await assertSucceeds(getDoc(doc(second, 'teamProfiles/virender')))
  })
  await t.test('published catalogue remains public and drafts remain staff-only', async () => {
    await assertSucceeds(getDoc(doc(anonymous, 'products/public'))); await assertFails(getDoc(doc(anonymous, 'products/draft'))); await assertSucceeds(getDoc(doc(staff, 'products/draft')))
  })
  await t.test('legacy create works before cutover and anonymous inquiry reads and updates remain forbidden', async () => {
    await assertSucceeds(setDoc(doc(anonymous, 'inquiries/legacy'), inquiry))
    await assertFails(getDoc(doc(anonymous, 'inquiries/legacy'))); await assertFails(getDocs(collection(anonymous, 'inquiries')))
    await assertFails(updateDoc(doc(anonymous, 'inquiries/legacy'), { is_deleted: true, deleted_at: 1 }))
    await assertSucceeds(getDoc(doc(staff, 'inquiries/legacy'))); await assertFails(getDoc(doc(other, 'inquiries/legacy')))
    await assertFails(setDoc(doc(anonymous, 'inquiries/invalid'), { ...inquiry, email: 'invalid' }))
    await assertFails(setDoc(doc(anonymous, 'inquiries/hidden'), { ...inquiry, is_deleted: true }))
  })
  await t.test('private gate disables every direct create and receipt/counter access stays private', async () => {
    await assertFails(setDoc(doc(anonymous, 'siteSettings/inquiryIntake'), { server_only: true }))
    await assertSucceeds(setDoc(doc(staff, 'siteSettings/inquiryIntake'), { server_only: true }))
    await assertFails(getDoc(doc(anonymous, 'siteSettings/inquiryIntake')))
    for (const client of [anonymous, other, staff]) await assertFails(setDoc(doc(client, 'inquiries/bypass'), inquiry))
    await put('_inquiryReceipts/test', { tokenHash: 'hash', digest: 'hash' })
    await assertFails(getDoc(doc(anonymous, '_inquiryReceipts/test'))); await assertFails(getDoc(doc(staff, '_inquiryReceipts/test')))
    await assertFails(setDoc(doc(anonymous, '_inquiryLimits/spoof'), { count: 0 }))
  })
  await t.test('full gallery assets require publication of original, thumbnail and parent album', async () => {
    await assertSucceeds(getDoc(doc(anonymous, 'events/album/photoAssets/one')))
    await put('events/album/photos/one', { is_published: false }); await assertFails(getDoc(doc(anonymous, 'events/album/photoAssets/one')))
    await assertSucceeds(getDoc(doc(staff, 'events/album/photoAssets/one')))
    await put('events/album/photos/one', { is_published: true }); await put('events/album', { is_published: false })
    await assertFails(getDoc(doc(anonymous, 'events/album/photoAssets/one')))
    await put('events/album', { is_published: true }); await put('events/album/photoAssets/one', { src: image, is_published: false, updated_at: 1 })
    await assertFails(getDoc(doc(anonymous, 'events/album/photoAssets/one')))
  })
  await t.test('staff write compatible legacy/split/versioned media and invalid references are denied', async () => {
    const photo = { src: image, asset_id: 'new', thumbnail: image, alt: 'Equipment', position: 0, is_published: true, updated_at: 1 }
    await assertSucceeds(setDoc(doc(staff, 'events/album/photos/new'), photo))
    await assertFails(setDoc(doc(staff, 'events/album/photos/wrong'), photo)); await assertFails(setDoc(doc(anonymous, 'events/album/photos/new'), photo))
    const { asset_id: unused, ...legacy } = photo; assert.equal(unused, 'new')
    await assertSucceeds(setDoc(doc(staff, 'events/album/photos/legacy'), legacy))
    const asset = { src: image, is_published: true, updated_at: 1 }
    await assertSucceeds(setDoc(doc(staff, 'events/album/photoAssets/new'), asset))
    await assertSucceeds(setDoc(doc(staff, 'events/album/photoAssets/versioned'), { ...asset, src: '/media/0123456789abcdef-installation.webp' }))
    await assertFails(setDoc(doc(staff, 'events/album/photoAssets/malformed'), { ...asset, src: '/media/short-installation.webp' }))
    await assertFails(setDoc(doc(staff, 'events/album/photoAssets/invalid'), { ...asset, extra: true })); await assertFails(setDoc(doc(anonymous, 'events/album/photoAssets/anon'), asset))
  })
  await t.test('staff trash/restore cannot rewrite visitor contact details', async () => {
    await assertSucceeds(updateDoc(doc(staff, 'inquiries/legacy'), { is_deleted: true, deleted_at: 1 }))
    await assertSucceeds(updateDoc(doc(staff, 'inquiries/legacy'), { is_deleted: false, deleted_at: null }))
    await assertFails(updateDoc(doc(staff, 'inquiries/legacy'), { email: 'someone@else.example' }))
  })
})
