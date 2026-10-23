import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowUpRight, HiOutlinePhoto } from 'react-icons/hi2'
import { defaultEvents } from '../data/events'
import AlbumDialog from './AlbumDialog'

const teamStory = defaultEvents.find((event) => event.id === 'community--medelec--our-team')

export default function TeamTogether() {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [open, setOpen] = useState(false)
  if (!teamStory) return null
  return <section className="section team-together" aria-labelledby="team-together-heading">
    <div className="wrap team-together-grid">
      <div className="team-together-copy"><p className="eyebrow">MEDELEC, TOGETHER</p><h2 id="team-together-heading">More than equipment.{' '}<br className="heading-break" /><em>A team beside you.</em></h2><p>Meet the people behind the installations, the conversations and the service visits.</p><p>These photographs bring our team together at the Medelec office. Different responsibilities, a shared commitment to the healthcare teams we support.</p><div className="team-together-notes"><span>Equipment coordination</span><span>On-site support</span><span>Ongoing service</span></div><Link to="/community" className="text-link">See more of life at Medelec <HiArrowUpRight /></Link></div>
      <figure className="team-together-figure">
        <button className="team-together-photo" onClick={() => setOpen(true)} aria-label="Open photographs of the Medelec team"><img src={teamStory.photos[photoIndex].src} alt={teamStory.photos[photoIndex].alt} width="1280" height="960" loading="lazy" decoding="async" /><span><HiOutlinePhoto />View both photographs <HiArrowUpRight /></span></button>
        <figcaption><div><strong>Our people. Our commitment.</strong><p>The Medelec team, at our office.</p></div><div className="team-photo-switch" role="group" aria-label="Choose a team photograph">{teamStory.photos.map((photo, index) => <button key={photo.id} aria-label={`Team photograph ${index + 1}`} aria-pressed={photoIndex === index} onClick={() => setPhotoIndex(index)}>{String(index + 1).padStart(2, '0')}</button>)}</div></figcaption>
      </figure>
    </div>
    {open && <AlbumDialog event={teamStory} initialIndex={photoIndex} onClose={() => setOpen(false)} />}
  </section>
}
