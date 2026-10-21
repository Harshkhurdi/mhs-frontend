import { demoEvents, eventCategories } from '../data/events.js'
import { safeImageUrl } from './quote.js'

export const MAX_ALBUM_PHOTOS = 10
export const MAX_PHOTO_CHARS = 650000

export function galleryImage(value) {
  if (typeof value !== 'string') return ''
  if (value.length <= MAX_PHOTO_CHARS && /^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(value)) return value
  if (/^\/images\/events\/[a-zA-Z0-9_-]+\.webp$/.test(value)) return value
  return safeImageUrl(value)
}

export function mergeEvents(remote = [], settings = {}, includeDrafts = false) {
  const hidden = new Set(settings.hidden_demo_ids || [])
  const result = new Map()
  if (settings.show_demos !== false) {
    for (const event of demoEvents) if (!hidden.has(event.id)) result.set(event.id, event)
  }
  for (const event of remote) {
    if (!event?.id || typeof event.title !== 'string') continue
    result.delete(event.id)
    if (includeDrafts || event.is_published === true) result.set(event.id, { ...event, remote: true })
  }
  return [...result.values()].sort((a, b) => String(b.event_date).localeCompare(String(a.event_date)) || a.title.localeCompare(b.title))
}

export function validateAlbum(form, photos) {
  if (!form.title?.trim() || !form.location?.trim() || !form.summary?.trim()) return 'Add a title, location and description for this album.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.event_date || '') || Number.isNaN(Date.parse(form.event_date)) || new Date(form.event_date).toISOString().slice(0, 10) !== form.event_date) return 'Choose the event date.'
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
