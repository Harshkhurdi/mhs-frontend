import test from 'node:test'
import assert from 'node:assert/strict'
import { correctProductSpecialty, productSpecialtyError } from '../src/lib/adminProducts.js'
import { mergeCatalogue } from '../src/lib/catalogue.js'

test('Nihon Kohden correction retains identity and becomes publicly eligible', () => {
  const original = { id: 'existing-nk', name: 'Defibrillator', description: 'Clinical equipment', brand: 'nihon-kohden', specialty: 'critical-care', is_published: true }
  assert.match(productSpecialtyError(original), /Defibrillators & AEDs/)
  assert.equal(mergeCatalogue([], [original]).length, 0)
  const corrected = correctProductSpecialty(original)
  assert.equal(corrected.id, original.id)
  assert.equal(corrected.specialty, 'defibrillation')
  assert.equal(original.specialty, 'critical-care')
  assert.equal(productSpecialtyError(corrected), '')
  assert.equal(mergeCatalogue([], [corrected]).length, 1)
  assert.equal(productSpecialtyError({ brand: 'hamilton', specialty: 'critical-care' }), '')
  assert.match(productSpecialtyError({ brand: 'unknown', specialty: 'critical-care' }), /manufacturer/)
})
