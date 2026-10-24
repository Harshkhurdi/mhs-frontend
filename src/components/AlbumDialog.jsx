import { useEffect, useRef, useState } from 'react'
import { HiOutlineXMark, HiChevronLeft, HiChevronRight, HiOutlineMapPin, HiOutlinePhoto, HiOutlineArrowPath } from 'react-icons/hi2'
import { eventDate, galleryImage } from '../lib/events'
import { communityCompany, swipeDirection } from '../lib/community'
import { manufacturerBrands } from '../data/products'
import './AlbumDialog.css'

let returnTarget = null

export default function AlbumDialog({ event, onClose, onAdjacent, startAtEnd = false, initialIndex = 0 }) {
  const dialog = useRef(null)
  const touch = useRef(null)
  const [photos, setPhotos] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [source, setSource] = useState({ id: '', src: '', error: false })
  const [loaded, setLoaded] = useState('')
  const [retry, setRetry] = useState(0)
  const [albumRetry, setAlbumRetry] = useState(0)
  useEffect(() => {
    const node = dialog.current
    if (!returnTarget?.isConnected) returnTarget = document.activeElement
    node.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      node.close()
      // Retain the original gallery trigger across adjacent-album remounts.
      queueMicrotask(() => {
        if (!document.querySelector('.album-dialog[open]')) {
          if (returnTarget?.isConnected) returnTarget.focus()
          returnTarget = null
        }
      })
    }
  }, [])
  useEffect(() => {
    let cancelled = false
    import('../services/gallery').then(({ loadAlbumPhotos }) => loadAlbumPhotos(event)).then(data => {
      if (!cancelled) {
        setPhotos(data)
        setIndex(startAtEnd ? Math.max(0, data.length - 1) : Math.max(0, Math.min(initialIndex, data.length - 1)))
      }
    }).catch(() => { if (!cancelled) setError('We couldn’t open these photographs. Please try again.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [event, startAtEnd, initialIndex, albumRetry])
  const active = photos[index]
  useEffect(() => {
    if (!active) return
    let cancelled = false
    import('../services/gallery').then(async ({ loadPhotoImage }) => {
      const src = await loadPhotoImage(event, active)
      if (!cancelled) setSource({ id: active.id, src: galleryImage(src), error: false })
      const adjacent = photos[(index + 1) % photos.length]
      if (photos.length > 1 && adjacent.asset_id) loadPhotoImage(event, adjacent).catch(() => {})
    }).catch(() => { if (!cancelled) setSource({ id: active.id, src: '', error: true }) })
    return () => { cancelled = true }
  }, [event, active, photos, index, retry])
  const canMove = photos.length > 1 || Boolean(onAdjacent)
  const move = direction => {
    if (!photos.length) return
    const next = index + direction
    if (onAdjacent && (next < 0 || next >= photos.length)) onAdjacent(direction)
    else setIndex((next + photos.length) % photos.length)
  }
  const src = source.id === active?.id ? source.src : ''
  const failed = source.id === active?.id && source.error
  const company = manufacturerBrands.find(brand => brand.id === communityCompany(event))?.name || event.category
  function again() {
    if (error) { setError(''); setLoading(true); setAlbumRetry(value => value + 1) }
    else setRetry(value => value + 1)
  }
  return (
    <dialog ref={dialog} className="album-dialog" aria-labelledby="album-title" onCancel={e => { e.preventDefault(); onClose() }} onClick={e => { if (e.target === dialog.current) onClose() }} onKeyDown={e => {
      if (canMove && ['ArrowLeft', 'ArrowRight'].includes(e.key) && !e.target.closest('.album-thumbnails')) { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <button type="button" className="album-close" aria-label="Close album" onClick={onClose}><HiOutlineXMark /></button>
      <div className="album-stage">
        <div className="album-stage-top"><span><HiOutlinePhoto /> MEDELEC IN PICTURES</span><span>{loading ? 'Opening album' : `${index + (photos.length ? 1 : 0)} / ${photos.length}`}</span></div>
        <div className="album-viewer" onTouchStart={e => {
          if (e.touches.length !== 1) { touch.current = null; return }
          const point = e.touches[0]; touch.current = { x: point.clientX, y: point.clientY }
        }} onTouchCancel={() => { touch.current = null }} onTouchEnd={e => {
          const point = e.changedTouches[0]
          const direction = point ? swipeDirection(touch.current, { x: point.clientX, y: point.clientY }) : 0
          touch.current = null
          if (direction && canMove) move(direction)
        }}>
          {src && !failed && <img key={src} src={src} alt={active?.alt || event.title} onLoad={() => setLoaded(src)} onError={() => setSource({ id: active.id, src: '', error: true })} className={loaded === src ? 'is-loaded' : ''} />}
          {(loading || (!error && !failed && active && (!src || loaded !== src))) && <div className="album-status" role="status"><span className="album-loading-ring" />Opening photograph…</div>}
          {(error || failed) && <div className="album-status" role="alert"><HiOutlinePhoto /><p>{error || 'This photograph could not load.'}</p><button type="button" onClick={again}><HiOutlineArrowPath /> Try again</button></div>}
          {!loading && !error && !photos.length && <p className="album-status">These photographs are being updated.</p>}
          {canMove && <><button type="button" className="album-previous" aria-label="Previous photograph" onClick={() => move(-1)}><HiChevronLeft /></button><button type="button" className="album-next" aria-label="Next photograph" onClick={() => move(1)}><HiChevronRight /></button></>}
        </div>
        {photos.length > 1 && <div className="album-thumbnails" aria-label="Album photographs">{photos.map((photo, i) => <button type="button" key={photo.id} aria-label={`Show photograph ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)}><img src={galleryImage(photo.thumbnail || photo.src)} alt="" loading="lazy" /><span>{String(i + 1).padStart(2, '0')}</span></button>)}</div>}
      </div>
      <aside className="album-story">
        <div className="album-dialog-header"><p className="eyebrow">{company}</p><h2 id="album-title">{event.title}</h2><div className="album-location"><HiOutlineMapPin /><span>{event.location}{event.event_date && <time> · {eventDate(event.event_date)}</time>}</span></div></div>
        <div className="album-description"><p>{event.summary}</p>{event.is_demo && <p className="fine-print">Sample album with representative photography. These images do not document a Medelec event.</p>}</div>
        {active && <div className="album-caption" aria-live="polite"><span className="album-caption-label">PHOTOGRAPH {String(index + 1).padStart(2, '0')}</span><p>{active.alt || event.title}</p></div>}
        <div className="album-story-footer"><span className="status-dot" />Real moments. Shared progress.{canMove && <p>Use the arrows or swipe to explore.</p>}</div>
      </aside>
    </dialog>
  )
}
