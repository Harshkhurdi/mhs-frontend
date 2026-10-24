import { clinicalSpecialties, manufacturerBrands } from '../data/products.js'

export function productSpecialtyError(product) {
  if (!manufacturerBrands.some((brand) => brand.id === product.brand)) return 'Choose a supported manufacturer.'
  if (!clinicalSpecialties.some((specialty) => specialty.id === product.specialty)) return 'Choose a supported clinical specialty.'
  return product.brand === 'nihon-kohden' && product.specialty !== 'defibrillation'
    ? 'Nihon Kohden products must use Defibrillators & AEDs. Edit this product to correct its specialty before publishing.'
    : ''
}

export function correctProductSpecialty(product) {
  return product.brand === 'nihon-kohden' ? { ...product, specialty: 'defibrillation' } : product
}
