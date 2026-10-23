import { arrayRemove, collection, doc, getDoc, getDocs, query, where, writeBatch, setDoc } from 'firebase/firestore/lite'
import { db } from '../config/firebaseDatabase'
import { withTimeout } from '../lib/quote'
import { mergeEvents, validateAlbum, VISIBILITY_PREFIX } from '../lib/events'
import { defaultEvents } from '../data/events'

// Public queries return this small metadata record when a bundled story is
// archived. It uses the existing event schema and does not expose its photos.
function updateBundledVisibility(batch, id, published) {
  const original = defaultEvents.find((event) => event.id === id)
  if (!original) return
  const now = Date.now()
  batch.set(doc(db, 'events', `${VISIBILITY_PREFIX}${id}`), {
    title: 'Gallery visibility', category: 'Community', event_date: '',
    location: 'Medelec', summary: 'Visibility metadata for a bundled photo story.',
    is_published: !published, is_demo: true, cover_image: original.cover_image,
    cover_alt: 'Gallery visibility', photo_count: 1, created_at: now, updated_at: now,
  })
  // Migrate an existing archive entry atomically; never grow the legacy list.
  batch.set(doc(db, 'siteSettings', 'gallery'), { hidden_demo_ids: arrayRemove(id) }, { merge: true })
}

export async function loadGallery(admin = false) {
  if (!db) throw new Error('The database connection is not configured.')
  const source = admin ? collection(db, 'events') : query(collection(db, 'events'), where('is_published', '==', true))
  const [snapshot, settings] = await withTimeout(Promise.all([
    getDocs(source),
    admin ? Promise.resolve(null) : getDoc(doc(db, 'siteSettings', 'gallery')),
  ]))
  const events = snapshot.docs.map((row) => ({ ...row.data(), id: row.id }))
  return { events: mergeEvents(events, admin, settings?.data()?.hidden_demo_ids) }
}

export async function loadAlbumPhotos(event, admin = false) {
  if (!event.remote) return (event.photos || []).map((p) => ({ ...p }))
  const source = admin ? collection(db, 'events', event.id, 'photos') : query(collection(db, 'events', event.id, 'photos'), where('is_published', '==', true))
  const snapshot = await withTimeout(getDocs(source))
  return snapshot.docs.map((row) => ({ ...row.data(), id: row.id })).filter((p) => p.is_published !== false).sort((a, b) => a.position - b.position)
}

export async function saveAlbum(form, photos, previousIds = []) {
  const error = validateAlbum(form, photos)
  if (error) throw new Error(error)
  const id = form.id || doc(collection(db, 'events')).id
  const timestamp = Date.now()
  const batch = writeBatch(db)
  batch.set(doc(db, 'events', id), {
    title: form.title.trim(), category: form.category, event_date: form.event_date,
    location: form.location.trim(), summary: form.summary.trim(),
    is_published: form.is_published === true, is_demo: form.is_demo === true,
    cover_image: photos[0].thumbnail, cover_alt: photos[0].alt, photo_count: photos.length,
    created_at: form.created_at || timestamp, updated_at: timestamp,
  })
  photos.forEach((photo, position) => batch.set(doc(db, 'events', id, 'photos', photo.id), {
    src: photo.src, thumbnail: photo.thumbnail, alt: photo.alt.trim(), position, is_published: true, updated_at: timestamp,
  }))
  for (const oldId of previousIds) if (!photos.some((p) => p.id === oldId)) batch.set(doc(db, 'events', id, 'photos', oldId), { is_published: false, updated_at: timestamp }, { merge: true })
  updateBundledVisibility(batch, id, form.is_published === true)
  await withTimeout(batch.commit(), 25000)
  return id
}

export async function setAlbumPublished(event, published) {
  if (!event.remote) return saveAlbum({ ...event, is_published: published }, event.photos)
  const batch = writeBatch(db)
  batch.set(doc(db, 'events', event.id), { is_published: published, updated_at: Date.now() }, { merge: true })
  updateBundledVisibility(batch, event.id, published)
  await withTimeout(batch.commit())
}

export async function loadTeamPhotos() {
  if (!db) return {}
  const snapshot = await withTimeout(getDocs(collection(db, 'teamProfiles')))
  return Object.fromEntries(snapshot.docs.map((row) => [row.id, row.data().photo || '']))
}

export async function saveTeamPhoto(id, photo) {
  await withTimeout(setDoc(doc(db, 'teamProfiles', id), { photo, updated_at: Date.now() }))
}
