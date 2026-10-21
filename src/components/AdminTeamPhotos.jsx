import { useEffect, useState } from 'react'
import { HiOutlineUser } from 'react-icons/hi2'
import { teamMembers } from '../data/team'
import { galleryImage } from '../lib/events'
import { preparePhoto } from '../lib/imageUpload'
import { loadTeamPhotos, saveTeamPhoto } from '../services/gallery'

export default function AdminTeamPhotos() {
  const [saved, setSaved] = useState({})
  const [pending, setPending] = useState({})
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    let cancelled = false
    loadTeamPhotos().then((photos) => { if (!cancelled) setSaved(photos) }).catch(() => { if (!cancelled) setError('Unable to load team photographs. Check staff permissions and refresh.') })
    return () => { cancelled = true }
  }, [])
  async function choose(id, e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setBusy(id); setError(''); setNotice('')
    try { const photo = await preparePhoto(file, true); setPending((current) => ({ ...current, [id]: photo.src })) } catch (err) { setError(err.message) } finally { setBusy('') }
  }
  async function save(id, photo) {
    setBusy(id); setError(''); setNotice('')
    try {
      await saveTeamPhoto(id, photo)
      setSaved((current) => ({ ...current, [id]: photo }))
      setPending((current) => { const next = { ...current }; delete next[id]; return next })
      setNotice('Team photograph saved. It will appear on the About page.')
    } catch { setError('Unable to confirm the save. Your selected photo is retained; check the About page before retrying.') } finally { setBusy('') }
  }
  return <div className="admin-team-photos"><p className="admin-gallery-help">Upload each engineer’s actual portrait. A small portrait sits beside their name on the About page. JPG, PNG and WebP photos are optimized automatically.</p>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="admin-success" role="status">{notice}</p>}
    {teamMembers.map((member) => { const photo = pending[member.id] ?? saved[member.id] ?? member.image; return <article key={member.id}><div className="team-photo-preview">{galleryImage(photo) ? <img src={galleryImage(photo)} alt={`${member.name} portrait preview`} /> : <HiOutlineUser />}</div><div><h3>{member.name}</h3><p>{member.role}</p><label htmlFor={`team-photo-${member.id}`}>Choose portrait</label><input id={`team-photo-${member.id}`} type="file" accept="image/jpeg,image/png,image/webp" disabled={!!busy} onChange={(e) => choose(member.id, e)} /></div><div className="admin-team-photo-actions">{pending[member.id] !== undefined && <button className="button button-small" disabled={!!busy} onClick={() => save(member.id, pending[member.id])}>{busy === member.id ? 'Saving…' : 'Save portrait'}</button>}{saved[member.id] && <button className="text-link" disabled={!!busy} onClick={() => save(member.id, '')}>Use placeholder</button>}</div></article> })}
  </div>
}
