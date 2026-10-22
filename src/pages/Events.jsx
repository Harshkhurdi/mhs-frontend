import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowUpRight, HiOutlinePhoto, HiOutlineMapPin, HiOutlineXMark, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import PageMeta from '../components/PageMeta'
import { eventCategories } from '../data/events'
import { eventDate, galleryImage, mergeEvents } from '../lib/events'
import { loadGallery, loadAlbumPhotos } from '../services/gallery'

function AlbumDialog({ event, onClose }) {
  const dialog = useRef(null)
  const [photos, setPhotos] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    dialog.current.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    let cancelled = false
    loadAlbumPhotos(event).then((data) => {
      if (!cancelled) setPhotos(data)
    }).catch(() => {
      if (!cancelled) setError('We couldn’t load this album. Close it and try again.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; document.body.style.overflow = previous }
  }, [event])
  const move = (direction) => setIndex((current) => (current + direction + photos.length) % photos.length)
  return (
    <dialog ref={dialog} className="album-dialog" aria-labelledby="album-title" onCancel={onClose} onClick={(e) => { if (e.target === dialog.current) onClose() }} onKeyDown={(e) => {
      if (photos.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <header className="album-dialog-header">
        <div>
          <p className="eyebrow">{event.category}{event.is_demo ? ' · DEMO ALBUM' : ''}</p>
          <h2 id="album-title">{event.title}</h2>
          <p>{event.event_date && <>{eventDate(event.event_date)} · </>}{event.location}</p>
        </div>
        <button className="album-close" aria-label="Close album" onClick={onClose}><HiOutlineXMark /></button>
      </header>
      {loading ? <p className="album-status" role="status">Opening photographs…</p> : error ? <p className="form-error" role="alert">{error}</p> : photos.length ? <>
        <div className="album-viewer">
          <img src={galleryImage(photos[index].src)} alt={photos[index].alt || event.title} />
          {photos.length > 1 && <>
            <button className="album-previous" aria-label="Previous photograph" onClick={() => move(-1)}><HiChevronLeft /></button>
            <button className="album-next" aria-label="Next photograph" onClick={() => move(1)}><HiChevronRight /></button>
          </>}
        </div>
        <div className="album-caption"><p>{photos[index].alt}</p><span aria-live="polite">{index + 1} / {photos.length}</span></div>
        {photos.length > 1 && <div className="album-thumbnails" aria-label="Album photographs">{photos.map((photo, i) => <button key={photo.id} aria-label={`Show photograph ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)}><img src={galleryImage(photo.thumbnail || photo.src)} alt="" /></button>)}</div>}
      </> : <p className="album-status">The photographs for this album are being updated.</p>}
      <div className="album-description"><p>{event.summary}</p>{event.is_demo && <p className="fine-print">Sample album with representative photography. These images do not document a Medelec event.</p>}</div>
    </dialog>
  )
}

export default function Events() {
  const [events, setEvents] = useState(() => mergeEvents())
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    loadGallery().then((data) => { if (!cancelled) setEvents(data.events) }).catch(() => {
      if (!cancelled) setError('Recent updates are temporarily unavailable. Our selected photo stories are available below.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])
  const visible = events.filter((event) => category === 'All' || event.category === category)
  return <>
    <PageMeta title="Conferences & Events | Medelec Healthcare Solutions" description="Photographs, conversations and shared learning from Medelec conferences, workshops and healthcare events." />
    <section className="events-hero">
      <div className="wrap">
        <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Photos & events</span></div>
        <div className="events-intro">
          <div>
            <p className="eyebrow">INSTALLATIONS · PEOPLE · PRACTICAL LEARNING</p>
            <h1>Technology in place.<br /><em>People in focus.</em></h1>
            <p className="events-lede">From a new installation to a hands-on training session, see the people and moments behind our work.</p>
            <a className="text-link" href="#event-albums">Explore the albums <HiArrowUpRight /></a>
          </div>
          <div className="events-mosaic" aria-hidden="true">{events.slice(0, 3).map((event) => <img key={event.id} src={galleryImage(event.cover_image)} alt="" width="640" height="480" />)}</div>
        </div>
      </div>
    </section>
    <section className="section events-section" id="event-albums">
      <div className="wrap">
        <div className="events-heading"><div><p className="eyebrow">MOMENTS WORTH SHARING</p><h2>Care, brought to life.</h2></div><p>On site. Alongside your team.<br />Explore the stories behind the equipment.</p></div>
        <div className="event-filters" aria-label="Filter event albums">{['All', ...eventCategories.filter((name) => events.some((event) => event.category === name))].map((name) => <button key={name} aria-pressed={category === name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name === 'All' ? 'All albums' : name}<span>{events.filter((event) => name === 'All' || event.category === name).length}</span></button>)}</div>
        {error && <p className="gallery-load-note" role="status">{error}</p>}
        {loading && <p className="fine-print" role="status">Checking for recent albums…</p>}
        <div className="event-grid">{visible.map((event) => <article key={event.id} className={event.id === 'punjab-cm-equipment-visit' ? 'event-feature' : ''}>
          <button className="event-card" onClick={() => setSelected(event)} aria-label={`Open ${event.title} photo album`}>
            <span className="event-card-image"><img src={galleryImage(event.cover_image)} alt="" width="720" height="540" loading="lazy" /><span className="event-category">{event.category}</span>{event.is_demo && <span className="event-demo">Demo</span>}<span className="event-photo-count"><HiOutlinePhoto />{event.photo_count || 1}</span></span>
            <span className="event-card-content"><span className="event-card-meta">{event.event_date && <time>{eventDate(event.event_date)}</time>}<span><HiOutlineMapPin />{event.location}</span></span>
            <span className="event-card-title">{event.title}</span>
            <span className="event-card-summary">{event.summary}</span>
            <span className="event-card-action">View the story <HiArrowUpRight /></span></span>
          </button>
        </article>)}</div>
        {!visible.length && !loading && <div className="empty-state"><h2>No albums in this category yet.</h2><p>Visit again for new photographs from our team.</p><button className="text-link" onClick={() => setCategory('All')}>Show all albums <HiArrowUpRight /></button></div>}
      </div>
    </section>
    {selected && <AlbumDialog key={selected.id} event={selected} onClose={() => setSelected(null)} />}
  </>
}
