import { usePublicContentVersion } from '../lib/usePublicContentVersion'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { HiArrowUpRight, HiChevronLeft, HiChevronRight, HiOutlinePhoto } from 'react-icons/hi2'
import PageMeta from '../components/PageMeta'
import AlbumDialog from '../components/AlbumDialog'
import { manufacturerBrands } from '../data/products'
import { communityAlbums, communityCompany, swipeDirection } from '../lib/community'
import { eventDate, galleryImage } from '../lib/events'
import { loadGallery } from '../services/gallery'

const PAGE_SIZE = 9

export default function Community() {
  const contentVersion = usePublicContentVersion()
  const [params, setParams] = useSearchParams()
  const requestedCompany = params.get('company')
  const company = manufacturerBrands.some((brand) => brand.id === requestedCompany) ? requestedCompany : 'all'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [page, setPage] = useState(0)
  const [selection, setSelection] = useState(null)
  const touch = useRef(null)
  const swiped = useRef(false)
  const gallery = useRef(null)
  useEffect(() => {
    let cancelled = false
    loadGallery().then((data) => { if (!cancelled) { setEvents(data.events); setError('') } }).catch(() => {
      if (!cancelled) setError('We couldn’t load the community photographs. Please try again.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [refresh, contentVersion])
  const albums = communityAlbums(events, company)
  const pages = Math.max(1, Math.ceil(albums.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages - 1)
  const visible = albums.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  const selected = selection ? albums.find((event) => event.id === selection.id) : null
  const hero = communityAlbums(events)[0]
  const brand = manufacturerBrands.find((item) => item.id === company)
  function changeCompany(id) {
    setPage(0); setSelection(null)
    setParams(id === 'all' ? {} : { company: id }, { replace: true })
  }
  function changePage(direction) {
    const next = Math.max(0, Math.min(pages - 1, currentPage + direction))
    if (next !== currentPage) { setPage(next); gallery.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  }
  function adjacentAlbum(direction) {
    const index = albums.findIndex((event) => event.id === selection.id)
    const next = albums[(index + direction + albums.length) % albums.length]
    setSelection({ id: next.id, startAtEnd: direction < 0 })
  }
  return <>
    <PageMeta title="Community | Medelec Healthcare Solutions" description="Explore real installations, training, conferences and community photographs from Medelec and the medical technology companies we support." />
    <section className="community-hero">
      <div className="wrap">
        <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Community</span></div>
        <div className="community-intro">
          <div><p className="eyebrow">THE PEOPLE. THE PARTNERSHIPS. THE PROGRESS.</p><h1>Our community.{' '}<br className="heading-break" /><em>Shared progress.</em></h1><p>Good technology brings people together. A glimpse of our installations, hands-on learning and moments with the teams we support.</p><a href="#community-gallery" className="text-link">Explore the photographs <HiArrowUpRight /></a></div>
          {hero && <button className="community-hero-photo" onClick={() => { changeCompany('all'); setSelection({ id: hero.id }) }} aria-label={`View ${hero.title}`}><img src={galleryImage(hero.cover_image)} alt={hero.cover_alt || hero.title} width="960" height="640" /><span><span>IN GOOD COMPANY</span><strong>{hero.title}</strong><HiArrowUpRight /></span></button>}
        </div>
      </div>
    </section>
    <section className="section community-section" id="community-gallery" ref={gallery}>
      <div className="wrap">
        <div className="community-heading"><div><p className="eyebrow">A CLOSER LOOK AT OUR WORK</p><h2>One community.{' '}<br className="heading-break" />Many connections.</h2></div><p>Choose a company to explore its photographs. Open a story and swipe through the moments.</p></div>
        <div className="community-companies" role="group" aria-label="Filter community photographs by company">
          <button className="community-all" aria-pressed={company === 'all'} onClick={() => changeCompany('all')}><HiOutlinePhoto /><span>All companies</span></button>
          {manufacturerBrands.map((item) => <button key={item.id} className={item.logo.theme === 'dark' ? 'company-dark' : ''} aria-label={item.name} aria-pressed={company === item.id} onClick={() => changeCompany(item.id)}><img src={item.logo.src} alt={item.name} width={item.logo.width} height={item.logo.height} /><span>{item.shortName || item.name}</span></button>)}
        </div>
        <div className="community-gallery-heading"><h3>{brand ? brand.name : 'From across our community'}</h3>{!loading && !error && <span>{albums.length} {albums.length === 1 ? 'story' : 'stories'}</span>}</div>
        {loading && <p className="empty-state" role="status">Loading community photographs…</p>}
        {error && <div className="empty-state" role="alert"><p>{error}</p><button className="button button-outline" onClick={() => { setLoading(true); setRefresh((value) => value + 1) }}>Try again</button></div>}
        {!loading && !error && <>
          <div className="community-grid" onPointerDown={() => { swiped.current = false }} onClickCapture={(e) => { if (swiped.current && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); swiped.current = false } }} onTouchStart={(e) => { swiped.current = false; const point = e.touches[0]; touch.current = { x: point.clientX, y: point.clientY } }} onTouchCancel={() => { touch.current = null }} onTouchEnd={(e) => {
            const point = e.changedTouches[0]
            const direction = point ? swipeDirection(touch.current, { x: point.clientX, y: point.clientY }) : 0
            touch.current = null
            if (direction) { swiped.current = true; changePage(direction) }
          }}>{visible.map((event) => <article key={event.id}>
            <button className="community-card" onClick={() => setSelection({ id: event.id })} aria-label={`View ${event.title}`}>
              <span className="community-card-photo"><img src={galleryImage(event.cover_image)} alt={event.cover_alt || event.title} width="720" height="540" loading="lazy" /><span><HiOutlinePhoto />{event.photo_count || 1}</span></span>
              <span className="community-card-body">{!event.remote && event.photos?.length > 1 && <span className="story-photo-preview" aria-hidden="true">{event.photos.slice(0, 3).map((photo) => <img key={photo.id} src={galleryImage(photo.thumbnail || photo.src)} alt="" width="100" height="70" loading="lazy" />)}</span>}<span className="eyebrow">{manufacturerBrands.find((item) => item.id === communityCompany(event))?.name || event.category}</span><strong>{event.title}</strong><span className="community-card-meta">{event.event_date ? eventDate(event.event_date) : event.location}</span><span className="community-card-link">Explore the moments <HiArrowUpRight /></span></span>
            </button>
          </article>)}</div>
          {!albums.length && <div className="community-empty"><HiOutlinePhoto /><h3>A space for our next shared moment.</h3><p>{brand ? `Photographs from our work with ${brand.name} will appear here as our team publishes them.` : 'Our team will share new photographs here soon.'}</p>{brand && <button className="text-link" onClick={() => changeCompany('all')}>Explore all photographs <HiArrowUpRight /></button>}</div>}
          {pages > 1 && <nav className="community-pagination" aria-label="Community gallery pages"><button aria-label="Previous page" disabled={currentPage === 0} onClick={() => changePage(-1)}><HiChevronLeft />Previous</button><span aria-live="polite">Page {currentPage + 1} of {pages}</span><button aria-label="Next page" disabled={currentPage === pages - 1} onClick={() => changePage(1)}>Next<HiChevronRight /></button></nav>}
        </>}
        <div className="community-footnote"><span>Built on partnership. Backed by service.</span><Link to="/contact">Connect with our team <HiArrowUpRight /></Link></div>
      </div>
    </section>
    {selected && <AlbumDialog key={selected.id} event={selected} startAtEnd={selection.startAtEnd} onAdjacent={albums.length > 1 ? adjacentAlbum : undefined} onClose={() => setSelection(null)} />}
  </>
}
