import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { defaultEvents } from '../src/data/events.js'
import { galleryImage, mergeEvents, validateAlbum } from '../src/lib/events.js'
import { manufacturerBrands } from '../src/data/products.js'
import { mergeCatalogue, sortCatalogue } from '../src/lib/catalogue.js'

test('curated photo stories use real local photographs in the requested order', () => {
  assert.deepEqual(defaultEvents.map((event) => event.category), ['Visit', 'Installation', 'Training'])
  assert.equal(defaultEvents.reduce((total, event) => total + event.photos.length, 0), 4)
  for (const event of defaultEvents) {
    assert.equal(event.is_demo, false)
    assert.equal(event.event_date, '')
    assert.equal(validateAlbum(event, event.photos), '')
    for (const photo of event.photos) assert.ok(existsSync(new URL('../public' + photo.src, import.meta.url)))
  }
})
test('archived stories stay hidden, replacements retain their order and old demos never return', () => {
  const original = defaultEvents[0]
  const saved = { ...original, title: 'Updated staff album' }
  assert.equal(mergeEvents([saved])[0].title, saved.title)
  assert.equal(mergeEvents([{ ...saved, is_published: false }]).some(e => e.id === original.id), false)
  assert.equal(mergeEvents([{ ...saved, is_published: false }], true).find(e => e.id === original.id).is_published, false)
  assert.equal(mergeEvents([{ ...saved, id: 'demo-old', is_demo: true }]).length, 3)
})
test('album validation rejects invalid dates, oversized images, unsafe URLs and missing captions', () => {
  const event = defaultEvents[0], photos = event.photos
  assert.notEqual(validateAlbum({ ...event, event_date: '2026-02-31' }, photos), '')
  assert.notEqual(validateAlbum(event, []), '')
  assert.notEqual(validateAlbum(event, [{ ...photos[0], alt: ' ' }]), '')
  assert.notEqual(validateAlbum(event, Array.from({ length: 11 }, (_,i) => ({ ...photos[0], id: String(i) }))), '')
  assert.equal(galleryImage('javascript:alert(1)'), '')
  assert.equal(galleryImage('data:image/svg+xml;base64,PHN2Zz4='), '')
  assert.equal(galleryImage('data:image/webp;base64,' + 'a'.repeat(650001)), '')
  assert.ok(galleryImage('data:image/webp;base64,YWJj'))
})
test('only supported brands appear, with Nihon Kohden limited to defibrillation and the requested brand order', () => {
  const order = ['hamilton','karl-storz','spacelabs','kiran','samsung','linet','helmier','nihon-kohden']
  assert.deepEqual(manufacturerBrands.map(b => b.id), order)
  const entries = order.map(brand => ({ id: brand, name: brand, brand, specialty: 'defibrillation' }))
  const merged = mergeCatalogue(entries, [
    { id: 'competitor', name: 'Unsupported light', brand: 'drager' },
    { id: 'nk-monitor', name: 'Monitor', brand: 'nihon-kohden', specialty: 'patient-monitoring' },
  ])
  assert.equal(merged.length, 8)
  assert.deepEqual(sortCatalogue(merged.reverse(), 'brand').map(p => p.brand), order)
})
