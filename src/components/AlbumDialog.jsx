import { useEffect, useRef, useState } from 'react'
import { HiOutlineXMark, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { eventDate, galleryImage } from '../lib/events'
import { communityCompany, swipeDirection } from '../lib/community'
import { manufacturerBrands } from '../data/products'
import { loadAlbumPhotos } from '../services/gallery'

export default function AlbumDialog({ event, onClose, onAdjacent, startAtEnd = false }) {
  const dialog = useRef(null)
  const touch = useRef(null)
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
      if (!cancelled) { setPhotos(data); setIndex(startAtEnd ? Math.max(0, data.length - 1) : 0) }
    }).catch(() => {
      if (!cancelled) setError('We couldn’t load this album. Close it and try again.')
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; document.body.style.overflow = previous }
  }, [event, startAtEnd])
  const canMove = photos.length > 1 || Boolean(onAdjacent)
  const move = (direction) => {
    if (!photos.length) return
    const next = index + direction
    if (onAdjacent && (next < 0 || next >= photos.length)) onAdjacent(direction)
    else setIndex((next + photos.length) % photos.length)
  }
  return (
    <dialog ref={dialog} className="album-dialog" aria-labelledby="album-title" onCancel={onClose} onClick={(e) => { if (e.target === dialog.current) onClose() }} onKeyDown={(e) => {
      if (canMove && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key === 'ArrowLeft' ? -1 : 1) }
    }}>
      <header className="album-dialog-header">
        <div>
          <p className="eyebrow">{manufacturerBrands.find((brand) => brand.id === communityCompany(event))?.name || event.category}</p>
          <h2 id="album-title">{event.title}</h2>
          <p>{event.event_date && <>{eventDate(event.event_date)} · </>}{event.location}</p>
        </div>
        <button className="album-close" aria-label="Close album" onClick={onClose}><HiOutlineXMark /></button>
      </header>
      {loading ? <p className="album-status" role="status">Opening photographs…</p> : error ? <p className="form-error" role="alert">{error}</p> : photos.length ? <>
        <div className="album-viewer" onTouchStart={(e) => { const point = e.touches[0]; touch.current = { x: point.clientX, y: point.clientY } }} onTouchCancel={() => { touch.current = null }} onTouchEnd={(e) => {
          const point = e.changedTouches[0]
          const direction = point ? swipeDirection(touch.current, { x: point.clientX, y: point.clientY }) : 0
          touch.current = null
          if (direction && canMove) move(direction)
        }}>
          <img src={galleryImage(photos[index].src)} alt={photos[index].alt || event.title} />
          {canMove && <>
            <button className="album-previous" aria-label="Previous photograph" onClick={() => move(-1)}><HiChevronLeft /></button>
            <button className="album-next" aria-label="Next photograph" onClick={() => move(1)}><HiChevronRight /></button>
          </>}
        </div>
        <div className="album-caption"><div><p>{photos[index].alt}</p>{canMove && <p className="viewer-hint">Swipe or use the arrows to browse photographs.</p>}</div><span aria-live="polite">{index + 1} / {photos.length}</span></div>
        {photos.length > 1 && <div className="album-thumbnails" aria-label="Album photographs">{photos.map((photo, i) => <button key={photo.id} aria-label={`Show photograph ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)}><img src={galleryImage(photo.thumbnail || photo.src)} alt="" /></button>)}</div>}
      </> : <p className="album-status">The photographs for this album are being updated.</p>}
      <div className="album-description"><p>{event.summary}</p>{event.is_demo && <p className="fine-print">Sample album with representative photography. These images do not document a Medelec event.</p>}</div>
    </dialog>
  )
}

