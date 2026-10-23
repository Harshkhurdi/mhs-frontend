import { compareStoriesByImpact } from './storyOrder.js'
import { manufacturerBrands } from '../data/products.js'

// Company IDs live in the document ID so uploads use the existing gallery
// schema and deployed permissions. IDs are stable after publication.
export function communityCompany(event) {
  if (event?.id?.startsWith('hamilton-c6-')) return 'hamilton'
  const [, company] = String(event?.id || '').split('--')
  return String(event?.id || '').startsWith('community--') && manufacturerBrands.some((brand) => brand.id === company) ? company : ''
}

export function communityId(company, token) {
  if ((company !== 'medelec' && !manufacturerBrands.some((brand) => brand.id === company)) || !/^[a-zA-Z0-9_-]+$/.test(token || '')) throw new Error('Choose a supported company before saving.')
  return `community--${company}--${token}`
}

export function communityAlbums(events, company = 'all') {
  return events.filter((event) => event.is_published === true && (company === 'all' || communityCompany(event) === company))
    .sort(compareStoriesByImpact)
}

export function swipeDirection(start, end) {
  if (!start || !end) return 0
  const x = end.x - start.x, y = end.y - start.y
  return Math.abs(x) >= 50 && Math.abs(x) > Math.abs(y) * 1.25 ? (x < 0 ? 1 : -1) : 0
}
