import { useEffect, useRef, useState } from 'react'
import { HiOutlinePlus, HiArrowUpRight, HiOutlineArrowUp, HiOutlineXMark } from 'react-icons/hi2'
import { collection, doc } from 'firebase/firestore/lite'
import { db } from '../config/firebaseDatabase'
import { eventCategories } from '../data/events'
import { eventDate, galleryImage, MAX_ALBUM_PHOTOS } from '../lib/events'
import { preparePhoto } from '../lib/imageUpload'
import { loadGallery, loadAlbumPhotos, saveAlbum, setAlbumPublished } from '../services/gallery'

const emptyAlbum = { title: '', summary: '', category: 'Conference', event_date: '', location: '', is_published: true, is_demo: false }

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null)
  const [photos, setPhotos] = useState([])
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refresh, setRefresh] = useState(0)
  const previousIds = useRef([])
  const editor = useRef(null)
  useEffect(() => {
    let cancelled = false
    loadGallery(true).then((data) => {
      if (!cancelled) { setEvents(data.events) }
    }).catch(() => { if (!cancelled) setError('Unable to load albums. Check your connection and staff permissions, then refresh.') }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [refresh])
  const editingId = editing?.id
  useEffect(() => { if (editingId) editor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [editingId])
  async function edit(event) {
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try {
      const images = event ? await loadAlbumPhotos(event, true) : []
      previousIds.current = images.map((photo) => photo.id)
      setPhotos(images)
      setEditing(event ? { ...event } : { ...emptyAlbum, id: doc(collection(db, 'events')).id })
    } catch { setError('Unable to open this album. Please refresh and try again.') } finally { setBusy(false) }
  }
  async function addFiles(e) {
    const files = [...e.target.files]
    e.target.value = ''
    if (photos.length + files.length > MAX_ALBUM_PHOTOS) { setError(`An album can contain up to ${MAX_ALBUM_PHOTOS} photographs.`); return }
    setBusy(true); setError('')
    try {
      const prepared = []
      for (const file of files) prepared.push(await preparePhoto(file))
      setPhotos((current) => [...current, ...prepared])
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  async function save(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try {
      await saveAlbum(editing, photos, previousIds.current)
      setEditing(null); setPhotos([]); setNotice('Album saved. Published albums appear on Photos & events.'); setRefresh((value) => value + 1)
    } catch (err) { setError(`${err.message || 'We couldn’t confirm the save.'} Your changes are still here; refresh the album list to check before retrying.`) } finally { setBusy(false) }
  }
  async function toggle(event) {
    setBusy(true); setError(''); setNotice('')
    try {
      await setAlbumPublished(event, !event.is_published)
      setNotice(event.is_published ? 'Album archived. Its photographs are retained.' : 'Album published.')
      setRefresh((value) => value + 1)
    } catch { setError('Unable to confirm the status change. Refresh the album list before trying again.') } finally { setBusy(false) }
  }
  return <div className="admin-gallery">
    <div className="admin-gallery-toolbar"><p>Create an album, upload photographs and publish when it is ready. Our selected photo stories can be edited or archived here.</p><div><button className="text-link" disabled={busy} onClick={() => setRefresh((v) => v + 1)}>Refresh</button><button className="button button-small" disabled={busy} onClick={() => edit(null)}><HiOutlinePlus />Add album</button></div></div>
    {error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="admin-success" role="status">{notice}</p>}
    {editing && <form ref={editor} className="album-editor" onSubmit={save}>
      <fieldset disabled={busy}>
        <h2>{events.some((event) => event.id === editing.id) ? 'Edit album' : 'New album'}</h2>
        <div className="form-grid">
          <div className="full-width"><label htmlFor="album-name">Album title *</label><input id="album-name" required maxLength="140" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
          <div><label htmlFor="album-category">Category</label><select id="album-category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>{eventCategories.map((name) => <option key={name}>{name}</option>)}</select></div>
          <div><label htmlFor="album-date">Event date (optional)</label><input id="album-date" type="date" value={editing.event_date} onChange={(e) => setEditing({ ...editing, event_date: e.target.value })} /></div>
          <div className="full-width"><label htmlFor="album-location">Location *</label><input id="album-location" required maxLength="140" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
          <div className="full-width"><label htmlFor="album-summary">Description *</label><textarea id="album-summary" required maxLength="2000" rows="3" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></div>
        </div>
        <div className="album-upload"><label htmlFor="album-files">Upload photographs</label><input id="album-files" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} /><p>Up to {MAX_ALBUM_PHOTOS} JPG, PNG or WebP photos. Images are optimized automatically. The first photograph becomes the cover.</p></div>
        <div className="admin-photo-grid">{photos.map((photo, index) => <div key={photo.id} className="admin-photo"><img src={galleryImage(photo.thumbnail || photo.src)} alt={photo.alt} /><div className="admin-photo-actions"><span>{index === 0 ? 'Cover photograph' : `Photo ${index + 1}`}</span>{index > 0 && <button type="button" aria-label={`Make photograph ${index + 1} the cover`} onClick={() => setPhotos([photo, ...photos.filter((p) => p.id !== photo.id)])}><HiOutlineArrowUp /></button>}<button type="button" aria-label={`Remove photograph ${index + 1}`} onClick={() => setPhotos(photos.filter((p) => p.id !== photo.id))}><HiOutlineXMark /></button></div><label htmlFor={`caption-${photo.id}`}>Photo caption *</label><input id={`caption-${photo.id}`} required maxLength="240" value={photo.alt} onChange={(e) => setPhotos(photos.map((p) => p.id === photo.id ? { ...p, alt: e.target.value } : p))} /></div>)}</div>
        <div className="album-options"><label><input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />Publish on the website</label></div>
        <div className="album-editor-actions"><button className="button" type="submit">{busy ? 'Saving…' : 'Save album'}<HiArrowUpRight /></button><button className="button button-outline" type="button" onClick={() => { setEditing(null); setError('') }}>Cancel</button></div>
      </fieldset>
    </form>}

    {loading ? <p role="status">Loading albums…</p> : <div className="admin-album-list">{events.map((event) => <article key={event.id}><img src={galleryImage(event.cover_image)} alt="" /><div><p className="eyebrow">{event.category}{event.is_demo ? ' · DEMO' : ''}</p><h3>{event.title}</h3><p>{event.event_date && <>{eventDate(event.event_date)} · </>}{event.location}</p><span className={`album-state${event.is_published ? ' published' : ''}`}>{event.is_published ? 'Published' : 'Archived / draft'}</span></div><div className="admin-album-actions"><button className="text-link" disabled={busy} onClick={() => edit(event)}>Edit album</button><button className="text-link" disabled={busy} onClick={() => toggle(event)}>{event.is_published ? 'Archive' : 'Publish'}</button></div></article>)}</div>}
    {!loading && !events.length && <p className="empty-state">No albums yet. Add an album to begin.</p>}
  </div>
}
