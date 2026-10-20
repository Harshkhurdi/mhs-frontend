import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import {
  mergeCatalogue,
  filterCatalogue,
  sortCatalogue,
} from '../src/lib/catalogue.js'
import { safeImageUrl } from '../src/lib/quote.js'
const { products } = JSON.parse(
  readFileSync(
    new URL('../src/data/manufacturerCatalogue.json', import.meta.url),
  ),
)
const hosts = {
  hamilton: 'www.hamilton-medical.com',
  samsung: 'www.samsunghealthcare.com',
  linet: 'www.linet.com',
  spacelabs: 'spacelabshealthcare.com',
}
const specialties = [
  'critical-care',
  'radiology',
  'ward-infrastructure',
  'patient-monitoring',
  'cardiology',
  'pressure-care',
  'accessories',
]

test('every manufacturer entry has unique identity, a real local photograph and an official product link', () => {
  assert.equal(products.length, 108)
  assert.equal(new Set(products.map((p) => p.id)).size, 108)
  for (const p of products) {
    assert.equal(new URL(p.sourceUrl).hostname, hosts[p.brand], p.id)
    assert.equal(new URL(p.sourceUrl).protocol, 'https:')
    assert.ok(specialties.includes(p.specialty), p.id)
    assert.ok(existsSync(new URL('../public' + p.image, import.meta.url)), p.id)
    assert.equal(safeImageUrl(p.image), p.image)
    assert.ok(p.imageUrl.startsWith('https://'), p.id)
    if (p.pdfUrl) assert.equal(new URL(p.pdfUrl).protocol, 'https:')
  }
  assert.equal(products.filter((p) => p.pdfUrl).length, 51)
})

test('published listings enrich matching equipment without losing distinct families or verified media', () => {
  const originals = JSON.stringify(products)
  const live = [
    {
      id: 'live-c6',
      name: 'Hamilton C6 ICU Ventilator',
      brand: 'hamilton',
      image: 'https://invalid.example/old.jpg',
    },
    { id: 'live-e5', name: 'LINET Eleganza 5 ICU Bed', brand: 'linet' },
    {
      id: 'live-qube',
      name: 'Qube Compact Patient Monitor',
      brand: 'spacelabs',
    },
  ]
  const merged = mergeCatalogue(products, live)
  assert.equal(merged.length, 108)
  assert.equal(merged.filter((p) => p.name === 'Solido 3').length, 1)
  for (const p of live) {
    const entry = merged.find((m) => m.inventoryRecordId === p.id)
    assert.ok(entry, p.name)
    assert.match(entry.image, /^\/images\/products\//)
    assert.ok(entry.sourceUrl.startsWith('https://'))
    assert.ok(entry.manufacturerRecordId)
    assert.equal(entry.id, entry.manufacturerRecordId)
  }
  assert.equal(JSON.stringify(products), originals)
  assert.equal(
    mergeCatalogue(products, [
      { id: 'custom', name: 'Custom equipment', brand: 'other' },
    ]).length,
    109,
  )
})

test('search combines model and application terms, respects filters and sorting never mutates the data', () => {
  assert.equal(filterCatalogue(products, { brand: 'samsung' }).length, 30)
  assert.equal(filterCatalogue(products, { brand: 'linet' }).length, 50)
  assert.equal(
    filterCatalogue(products, { search: '  HAMILTON c6  ' })[0].id,
    'hamilton-c6',
  )
  assert.equal(
    filterCatalogue(products, { brand: 'linet', search: 'HAMILTON c6' }).length,
    0,
  )
  const cardiology = filterCatalogue(products, { specialty: 'cardiology' })
  assert.ok(cardiology.length > 0)
  assert.ok(cardiology.every((p) => p.specialty === 'cardiology'))
  const before = products.map((p) => p.id)
  assert.equal(sortCatalogue(products)[0].id, 'hamilton-c6')
  assert.deepEqual(
    products.map((p) => p.id),
    before,
  )
})
