import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowUpRight, HiOutlinePhoto, HiOutlineMapPin, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import AlbumDialog from '../components/AlbumDialog'
import PageMeta from '../components/PageMeta'
import { eventCategories } from '../data/events'
import { eventDate, galleryImage } from '../lib/events'
import { loadGallery } from '../services/gallery'


export default function Events() {
  const [events, setEvents] = useState([])
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(0)
  const gallery = useRef(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    loadGallery().then((data) => { if (!cancelled) setEvents(data.events) }).catch(() => {
      if (!cancelled) setError('The photo albums are temporarily unavailable. Please refresh to try again.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])
  const filtered = events.filter((event) => category === 'All' || event.category === category)
  const pageCount = Math.max(1, Math.ceil(filtered.length / 9))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(currentPage * 9, (currentPage + 1) * 9)
  const heroEvents = events.slice(0, 3)
  function changePage(direction) {
    setPage(Math.max(0, Math.min(pageCount - 1, currentPage + direction)))
    gallery.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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
          <div className="events-mosaic" aria-hidden="true">{heroEvents.map((event) => <img key={event.id} src={galleryImage(event.cover_image)} alt="" width="640" height="480" />)}</div>
        </div>
      </div>
    </section>
    <section className="section events-section" id="event-albums" ref={gallery}>
      <div className="wrap">
        <div className="events-heading"><div><p className="eyebrow">MOMENTS WORTH SHARING</p><h2>Care, brought to life.</h2></div><p>On site. Alongside your team.<br />Explore the stories behind the equipment.</p></div>
        <div className="event-filters" aria-label="Filter event albums">{['All', ...eventCategories.filter((name) => events.some((event) => event.category === name))].map((name) => <button key={name} aria-pressed={category === name} className={category === name ? 'active' : ''} onClick={() => { setCategory(name); setPage(0) }}>{name === 'All' ? 'All albums' : name}<span>{events.filter((event) => name === 'All' || event.category === name).length}</span></button>)}</div>
        {error && <p className="gallery-load-note" role="status">{error}</p>}
        {loading && <p className="fine-print" role="status">Checking for recent albums…</p>}
        <div className="event-grid">{visible.map((event) => <article key={event.id} className={['punjab-cm-equipment-visit', 'community--hamilton--partner-meeting-dubai-2025'].includes(event.id) ? 'event-feature' : ''}>
          <button className="event-card" onClick={() => setSelected(event)} aria-label={`Open ${event.title} photo album`}>
            <span className="event-card-image"><img src={galleryImage(event.cover_image)} alt="" width="720" height="540" loading="lazy" /><span className="event-category">{event.category}</span>{event.is_demo && <span className="event-demo">Demo</span>}<span className="event-photo-count"><HiOutlinePhoto />{event.photo_count || 1}</span></span>
            <span className="event-card-content">{!event.remote && event.photos?.length > 1 && <span className="story-photo-preview" aria-hidden="true">{event.photos.slice(0, 3).map((photo) => <img key={photo.id} src={galleryImage(photo.thumbnail || photo.src)} alt="" width="100" height="70" loading="lazy" />)}<span>{event.photo_count} moments<br />One story</span></span>}<span className="event-card-meta">{event.event_date && <time>{eventDate(event.event_date)}</time>}<span><HiOutlineMapPin />{event.location}</span></span>
            <span className="event-card-title">{event.title}</span>
            <span className="event-card-summary">{event.summary}</span>
            <span className="event-card-action">View the story <HiArrowUpRight /></span></span>
          </button>
        </article>)}</div>
        {pageCount > 1 && <nav className="community-pagination" aria-label="Event album pages"><button aria-label="Previous event page" disabled={currentPage === 0} onClick={() => changePage(-1)}><HiChevronLeft />Previous</button><span aria-live="polite">Page {currentPage + 1} of {pageCount}</span><button aria-label="Next event page" disabled={currentPage === pageCount - 1} onClick={() => changePage(1)}>Next<HiChevronRight /></button></nav>}
        {!visible.length && !loading && !error && <div className="empty-state"><h2>No albums in this category yet.</h2><p>Visit again for new photographs from our team.</p><button className="text-link" onClick={() => { setCategory('All'); setPage(0) }}>Show all albums <HiArrowUpRight /></button></div>}
      </div>
    </section>
    {selected && <AlbumDialog key={selected.id} event={selected} onClose={() => setSelected(null)} />}
  </>
}
