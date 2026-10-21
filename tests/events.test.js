import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { demoEvents } from '../src/data/events.js'
import { galleryImage, mergeEvents, validateAlbum } from '../src/lib/events.js'
import { manufacturerBrands } from '../src/data/products.js'
import { mergeCatalogue, sortCatalogue } from '../src/lib/catalogue.js'

test('demo albums use existing photographs and are explicitly identified as samples', () => {
  assert.equal(demoEvents.length, 6)
  for (const event of demoEvents) {
    assert.equal(event.is_demo, true)
    assert.equal(validateAlbum(event, event.photos), '')
    assert.ok(existsSync(new URL('../public' + event.cover_image, import.meta.url)))
  }
})
test('archived or replaced demos never reappear and drafts stay private', () => {
  const demo = demoEvents[0]
  const saved = { ...demo, title: 'Actual staff album', is_demo: false }
  assert.equal(mergeEvents([saved]).filter(e => e.id === demo.id).length, 1)
  assert.equal(mergeEvents([{ ...saved, is_published: false }]).some(e => e.id === demo.id), false)
  assert.equal(mergeEvents([], { hidden_demo_ids: [demo.id] }).some(e => e.id === demo.id), false)
  assert.equal(mergeEvents([], { show_demos: false }).length, 0)
  assert.equal(mergeEvents([{ ...saved, is_published: false }], { show_demos: false }, true).length, 1)
})
test('album validation rejects invalid dates, oversized images, unsafe URLs and missing captions', () => {
  const event = demoEvents[0], photos = event.photos
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
