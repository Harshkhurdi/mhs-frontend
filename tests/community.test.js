import test from 'node:test'
import assert from 'node:assert/strict'
import { communityAlbums, communityCompany, communityId, swipeDirection } from '../src/lib/community.js'
import { manufacturerBrands } from '../src/data/products.js'
import { defaultEvents } from '../src/data/events.js'
import { validateAlbum } from '../src/lib/events.js'

test('community posts retain company association for every supported company using existing gallery records', () => {
  const photo = defaultEvents[0].photos[0]
  const albums = manufacturerBrands.map((brand) => {
    const event = { ...defaultEvents[0], id: communityId(brand.id, 'unique-123'), category: 'Community', title: `${brand.name} community`, photos: [photo] }
    assert.equal(communityCompany(event), brand.id)
    assert.equal(validateAlbum(event, [photo]), '')
    return event
  })
  for (const brand of manufacturerBrands) assert.deepEqual(communityAlbums(albums, brand.id).map(communityCompany), [brand.id])
  assert.equal(communityAlbums([...albums, { ...albums[0], is_published: false }]).length, 8)
  assert.throws(() => communityId('unsupported', '123'))
  assert.throws(() => communityId('hamilton', '../unsafe'))
})

test('existing Hamilton stories appear in their company and general stories remain in all companies', () => {
  assert.equal(communityAlbums(defaultEvents).length, 21)
  assert.equal(communityAlbums(defaultEvents, 'hamilton').length, 13)
  assert.equal(communityAlbums(defaultEvents, 'kiran').length, 1)
  assert.equal(communityCompany({ id: 'community--unsupported--123' }), '')
  assert.equal(communityCompany(defaultEvents[0]), '')
})

test('swipe navigation distinguishes horizontal gestures from scrolling and taps', () => {
  const start = { x: 150, y: 120 }
  assert.equal(swipeDirection(start, { x: 65, y: 130 }), 1)
  assert.equal(swipeDirection(start, { x: 220, y: 110 }), -1)
  assert.equal(swipeDirection(start, { x: 130, y: 121 }), 0)
  assert.equal(swipeDirection(start, { x: 65, y: 250 }), 0)
  assert.equal(swipeDirection(null, start), 0)
})


test('newly uploaded community stories appear first without changing the source list', () => {
  const older = { ...defaultEvents[0], id: communityId('kiran', 'older'), created_at: 100 }
  const newer = { ...older, id: communityId('kiran', 'newer'), created_at: 200 }
  const input = [...defaultEvents, older, newer]
  assert.deepEqual(communityAlbums(input).slice(0, 2).map((event) => event.id), [newer.id, older.id])
  assert.equal(input[0].id, defaultEvents[0].id)
})
