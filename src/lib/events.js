import { defaultEvents, eventCategories } from '../data/events.js'
import { safeImageUrl } from './quote.js'

export const MAX_ALBUM_PHOTOS = 10
export const MAX_PHOTO_CHARS = 650000

export function galleryImage(value) {
  if (typeof value !== 'string') return ''
  if (value.length <= MAX_PHOTO_CHARS && /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(value)) return value
  if (/^\/images\/events\/[a-zA-Z0-9_-]+\.webp$/.test(value)) return value
  return safeImageUrl(value)
}

export function mergeEvents(remote = [], includeDrafts = false, hiddenAlbumIds = []) {
  const hidden = new Set(Array.isArray(hiddenAlbumIds) ? hiddenAlbumIds : [])
  const result = new Map(defaultEvents.map((event) => [event.id, event]))
  for (const event of remote) {
    // Retire all sample albums, including older copies saved in Firestore.
    if (!event?.id || typeof event.title !== 'string' || event.is_demo || event.id.startsWith('demo-')) continue
    if (!includeDrafts && hidden.has(event.id)) continue
    const original = result.get(event.id)
    result.delete(event.id)
    if (includeDrafts || event.is_published === true) result.set(event.id, { ...original, ...event, display_order: original?.display_order ?? 3, remote: true })
  }
  return [...result.values()].filter((event) => includeDrafts || !hidden.has(event.id)).sort((a, b) => (a.display_order ?? 3) - (b.display_order ?? 3) || String(b.event_date).localeCompare(String(a.event_date)) || a.title.localeCompare(b.title))
}

export function validateAlbum(form, photos) {
  if (!form.title?.trim() || !form.location?.trim() || !form.summary?.trim()) return 'Add a title, location and description for this album.'
  if (form.event_date && (!/^\d{4}-\d{2}-\d{2}$/.test(form.event_date) || Number.isNaN(Date.parse(form.event_date)) || new Date(form.event_date).toISOString().slice(0, 10) !== form.event_date)) return 'Choose a valid event date or leave it blank.'
  if (!eventCategories.includes(form.category)) return 'Choose an event category.'
  if (form.title.length > 140 || form.location.length > 140 || form.summary.length > 2000) return 'Shorten the title, location or description to fit the displayed limits.'
  if (!Array.isArray(photos) || !photos.length || photos.length > MAX_ALBUM_PHOTOS) return `Choose between 1 and ${MAX_ALBUM_PHOTOS} photographs.`
  if (new Set(photos.map((p) => p.id)).size !== photos.length) return 'Two photographs have the same identifier. Remove the duplicate and try again.'
  if (photos.some((p) => !galleryImage(p.src) || !galleryImage(p.thumbnail) || p.thumbnail.length > 65000 || !p.alt?.trim() || p.alt.length > 240)) return 'Each photograph needs a supported image and a short descriptive caption.'
  return ''
}

export function eventDate(value) {
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? 'Date to be confirmed' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
