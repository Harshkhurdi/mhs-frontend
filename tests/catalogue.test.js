import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import {
  mergeCatalogue,
  filterCatalogue,
  sortCatalogue,
} from '../src/lib/catalogue.js'
import { safeImageUrl } from '../src/lib/quote.js'
import { manufacturerBrands, clinicalSpecialties } from '../src/data/products.js'
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
  'karl-storz': 'www.karlstorz.com',
  kiran: 'www.kiranxray.com',
  helmier: 'www.helmier.com',
  'nihon-kohden': 'in.nihonkohden.com',
}
const specialties = clinicalSpecialties.map((s) => s.id)

test('every manufacturer entry has unique identity, a real local photograph and an official product link', () => {
  assert.ok(products.length >= 290)
  assert.equal(new Set(products.map((p) => p.id)).size, products.length)
  for (const brand of manufacturerBrands) {
    assert.ok(products.some((p) => p.brand === brand.id), brand.name)
  }
  for (const p of products) {
    assert.ok([hosts[p.brand], ...(p.brand === 'nihon-kohden' ? ['ae.nihonkohden.com'] : [])].includes(new URL(p.sourceUrl).hostname), p.id)
    assert.equal(new URL(p.sourceUrl).protocol, 'https:')
    assert.ok(specialties.includes(p.specialty), p.id)
    assert.ok(existsSync(new URL('../public' + p.image, import.meta.url)), p.id)
    assert.equal(safeImageUrl(p.image), p.image)
    assert.ok(p.imageUrl.startsWith('https://'), p.id)
    if (p.pdfUrl) assert.equal(new URL(p.pdfUrl).protocol, 'https:')
  }
  assert.ok(products.filter((p) => p.pdfUrl).length >= 190)
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
  assert.equal(merged.length, products.length)
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
    products.length,
  )
})

test('search combines model and application terms, respects filters and sorting never mutates the data', () => {
  assert.equal(filterCatalogue(products, { brand: 'samsung' }).length, 30)
  assert.equal(filterCatalogue(products, { brand: 'linet' }).length, 50)
  assert.ok(filterCatalogue(products, { brand: 'karl-storz', search: 'RUBINA' }).length > 0)
  assert.ok(filterCatalogue(products, { brand: 'kiran', specialty: 'radiation-protection' }).length > 0)
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

test('KARL STORZ featured order starts with C-MAC, former pages 3 and 4, then page 1', () => {
  const storz = filterCatalogue(mergeCatalogue(products, []), { brand: 'karl-storz' })
  const former = sortCatalogue(storz)
  assert.equal(former[35].id, 'karl-storz-8404zx')
  const expected = [former[35], ...former.slice(36, 72), ...former.slice(0, 18), ...former.slice(18, 35), ...former.slice(72)]
  const reordered = sortCatalogue(storz, 'featured', 'karl-storz')
  assert.deepEqual(reordered.map((p) => p.id), expected.map((p) => p.id))
  assert.equal(reordered.length, 140)
  assert.equal(new Set(reordered.map((p) => p.id)).size, 140)
  assert.deepEqual(storz, filterCatalogue(mergeCatalogue(products, []), { brand: 'karl-storz' }))
  assert.deepEqual(sortCatalogue(storz, 'name', 'karl-storz'), sortCatalogue(storz, 'name'))
  const live = mergeCatalogue(products, [{ id: 'published-cmac', brand: 'karl-storz', name: former[35].name }])
  assert.equal(sortCatalogue(filterCatalogue(live, { brand: 'karl-storz' }), 'featured', 'karl-storz')[0].inventoryRecordId, 'published-cmac')
  assert.equal(sortCatalogue(live)[0].id, 'hamilton-c6')
})
