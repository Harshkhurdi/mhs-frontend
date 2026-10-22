import { useEffect, useRef, useState } from 'react'
import AdminEvents from '../components/AdminEvents'
import { setInquiryDeleted } from '../services/inquiries'
import AdminTeamPhotos from '../components/AdminTeamPhotos'
import PageMeta from '../components/PageMeta'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore/lite'
import { HiArrowUpRight, HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUturnLeft } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebaseDatabase'
import { clinicalSpecialties, manufacturerBrands } from '../data/products'
import { safeExternalUrl, withTimeout } from '../lib/quote'
import { inquiryDateValue as dateValue, normalizeInquiry } from '../lib/inquiries'

const emptyProduct = {
  name: '',
  specialty: 'critical-care',
  brand: 'hamilton',
  description: '',
  image_url: '',
  pdf_url: '',
  is_published: true,
}
const formatDate = (value) =>
  dateValue(value)
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      }).format(dateValue(value)) + ' IST'
    : 'Date unavailable'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('products')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...emptyProduct })
  const [busy, setBusy] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const inquiryRows = rows.filter((row) => (row.is_deleted === true) === showTrash)
  const pendingId = useRef(null)
  useEffect(() => {
    if (!['products', 'inquiries'].includes(tab)) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const snapshot = await withTimeout(getDocs(collection(db, tab)))
        const data = snapshot.docs
          .map((d) => tab === 'inquiries'
            ? normalizeInquiry(d.data(), d.id)
            : { ...d.data(), id: d.id })
          .sort((a, b) => dateValue(b.created_at) - dateValue(a.created_at))
        if (!cancelled) setRows(data)
      } catch {
        if (!cancelled) {
          setError(
            'Unable to load this section. Check your connection and admin permissions, then retry.',
          )
          setRows([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [tab, refresh])
  const change = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))
  function edit(product) {
    setError('')
    setNotice('')
    pendingId.current = null
    setForm(
      product
        ? Object.fromEntries(
            Object.keys(emptyProduct).map((k) => [
              k,
              product[k] ?? emptyProduct[k],
            ]),
          )
        : { ...emptyProduct },
    )
    setEditing(product?.id || 'new')
  }
  async function save(e) {
    e.preventDefault()
    if (busy) return
    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description cannot be blank.')
      return
    }
    for (const key of ['image_url', 'pdf_url']) {
      if (form[key].trim() && !safeExternalUrl(form[key].trim())) {
        setError(
          'Use a complete http:// or https:// URL for images and brochures.',
        )
        return
      }
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      pendingId.current ||=
        editing === 'new'
          ? doc(collection(db, 'products'))
          : doc(db, 'products', editing)
      const payload = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        image_url: form.image_url.trim() || null,
        pdf_url: form.pdf_url.trim() || null,
        slug: form.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      }
      if (editing === 'new') payload.created_at = Date.now()
      await withTimeout(setDoc(pendingId.current, payload, { merge: true }))
      setEditing(null)
      pendingId.current = null
      setNotice('Product saved.')
      setRefresh((n) => n + 1)
    } catch {
      setError(
        'We couldn’t confirm the save. Your changes are still in the form. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }
  async function toggle(product) {
    if (busy) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await withTimeout(
        setDoc(
          doc(db, 'products', product.id),
          { is_published: !product.is_published },
          { merge: true },
        ),
      )
      setNotice(
        product.is_published
          ? 'Product archived. You can publish it again at any time.'
          : 'Product published.',
      )
      setRefresh((n) => n + 1)
    } catch {
      setError(
        'Unable to confirm the update. Refresh this section to check the current status.',
      )
    } finally {
      setBusy(false)
    }
  }
  async function signOut() {
    try {
      await logout()
    } catch {
      setError('Unable to sign out. Check your connection and try again.')
    }
  }
  async function moveInquiry(inquiry, deleted) {
    if (busy) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await setInquiryDeleted(inquiry.id, deleted)
      setRows((current) => current.map((row) => row.id === inquiry.id ? { ...row, is_deleted: deleted } : row))
      setNotice(deleted ? 'Inquiry moved to Trash. Open Trash to restore it at any time.' : 'Inquiry restored to your inbox.')
    } catch {
      setError('Unable to confirm this change. Refresh the inbox to check its current status, then try again.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="admin-page">
      <PageMeta
        title="Staff dashboard | Medelec Healthcare Solutions"
        noindex
      />
      <div className="wrap">
        <header className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="eyebrow">MEDELEC / ADMINISTRATION</p>
            <h1 className="mt-3">Your workspace.</h1>
            <p className="text-xs text-text-muted mt-2">
              Signed in as {user?.email}
            </p>
          </div>
          <button className="button button-outline" onClick={signOut}>
            Sign out <HiArrowUpRight />
          </button>
        </header>
        <nav className="admin-tabs" aria-label="Admin sections">
          {[
            ['products', 'Equipment catalogue'],
            ['inquiries', 'Customer inquiries'],
            ['events', 'Photos & events'],
            ['community', 'Community photographs'],
            ['team', 'Team photographs'],
          ].map(([key, label]) => (
            <button
              key={key}
              aria-current={tab === key ? 'page' : undefined}
              className={tab === key ? 'active' : ''}
              onClick={() => {
                if (!busy) {
                  setTab(key)
                  setEditing(null)
                  setNotice('')
                }
              }}
              disabled={busy}
            >
              {label}
            </button>
          ))}
        </nav>
        {tab === 'events' || tab === 'community' ? <AdminEvents key={tab} community={tab === 'community'} /> : tab === 'team' ? <AdminTeamPhotos /> : <>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-sm text-text-muted">
            {tab === 'products'
              ? 'Create, edit, publish or archive equipment. Archived products stay available here.'
              : 'Review submitted inquiries. Dates are shown in Indian Standard Time.'}
          </p>
          <div className="flex gap-4">
            {tab === 'inquiries' && <label className="inquiry-trash-toggle"><input type="checkbox" checked={showTrash} disabled={busy || loading} onChange={(e) => { setShowTrash(e.target.checked); setNotice('') }} />Trash ({rows.filter((row) => row.is_deleted === true).length})</label>}
            <button
              className="text-link"
              onClick={() => setRefresh((n) => n + 1)}
              disabled={busy || loading}
            >
              Refresh
            </button>
            {tab === 'products' && (
              <button
                className="button button-small"
                onClick={() => edit(null)}
                disabled={busy}
              >
                <HiOutlinePlus /> Add product
              </button>
            )}
          </div>
        </div>
        {error && (
          <p className="form-error mb-6" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p
            className="bg-surgical-teal/10 text-surgical-teal p-4 rounded-md mb-6 text-sm"
            role="status"
          >
            {notice}
          </p>
        )}
        {editing && tab === 'products' && (
          <form
            onSubmit={save}
            className="bg-white border border-border-light rounded-lg p-6 md:p-8 mb-8"
          >
            <fieldset disabled={busy}>
              <h2 className="text-xl font-semibold">
                {editing === 'new' ? 'New equipment' : 'Edit equipment'}
              </h2>
              <div className="form-grid">
                <div className="full-width">
                  <label htmlFor="product-name">Product name *</label>
                  <input
                    id="product-name"
                    name="name"
                    required
                    maxLength="180"
                    value={form.name}
                    onChange={change}
                  />
                </div>
                <div>
                  <label htmlFor="product-brand">Manufacturer *</label>
                  <select
                    id="product-brand"
                    name="brand"
                    value={form.brand}
                    onChange={change}
                  >
                    {manufacturerBrands.map((b) => (
                      <option value={b.id} key={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="product-specialty">
                    Clinical specialty *
                  </label>
                  <select
                    id="product-specialty"
                    name="specialty"
                    value={form.specialty}
                    onChange={change}
                  >
                    {clinicalSpecialties.map((s) => (
                      <option value={s.id} key={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="full-width">
                  <label htmlFor="product-description">Description *</label>
                  <textarea
                    id="product-description"
                    name="description"
                    rows="4"
                    required
                    maxLength="5000"
                    value={form.description}
                    onChange={change}
                  />
                </div>
                <div>
                  <label htmlFor="product-image">Product image URL</label>
                  <input
                    id="product-image"
                    type="url"
                    name="image_url"
                    value={form.image_url}
                    onChange={change}
                    placeholder="https://…"
                  />
                </div>
                <div>
                  <label htmlFor="product-brochure">Brochure URL</label>
                  <input
                    id="product-brochure"
                    type="url"
                    name="pdf_url"
                    value={form.pdf_url}
                    onChange={change}
                    placeholder="https://…"
                  />
                </div>
                <label className="full-width flex! items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_published"
                    className="w-4!"
                    checked={form.is_published}
                    onChange={change}
                  />{' '}
                  Published in the public catalogue
                </label>
              </div>
              <p className="fine-print mt-3">
                Use publicly accessible manufacturer or hosted media URLs.
                Optional fields can be left blank.
              </p>
              <div className="flex gap-4 mt-6">
                <button className="button" type="submit">
                  {busy ? 'Saving…' : 'Save product'}
                  <HiArrowUpRight />
                </button>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
            </fieldset>
          </form>
        )}
        {loading ? (
          <p className="py-12 text-center text-text-muted" role="status">
            Loading {tab}…
          </p>
        ) : !rows.length && !error ? (
          <div className="empty-state">
            <h2>
              {tab === 'products'
                ? 'Your catalogue starts here.'
                : 'No inquiries yet.'}
            </h2>
            <p>
              {tab === 'products'
                ? 'Add your first product to make it available to visitors.'
                : 'Submitted contact forms and quote requests will appear here.'}
            </p>
          </div>
        ) : tab === 'products' ? (
          <div className="overflow-x-auto border border-border-light rounded-lg bg-white">
            <table className="w-full text-sm text-left">
              <thead className="bg-bg-platinum text-xs">
                <tr>
                  {[
                    'Equipment',
                    'Manufacturer',
                    'Specialty',
                    'Status',
                    'Actions',
                  ].map((h) => (
                    <th key={h} className="p-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-border-light">
                    <td className="p-4 min-w-52 font-medium">{p.name}</td>
                    <td className="p-4 text-text-muted">
                      {manufacturerBrands.find((b) => b.id === p.brand)?.name ||
                        p.brand}
                    </td>
                    <td className="p-4 text-text-muted">
                      {clinicalSpecialties.find((s) => s.id === p.specialty)
                        ?.name || p.specialty}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-sm ${p.is_published ? 'bg-surgical-teal/10 text-surgical-teal' : 'bg-bg-platinum text-text-muted'}`}
                      >
                        {p.is_published ? 'Published' : 'Archived'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <button
                          className="text-link"
                          disabled={busy}
                          onClick={() => edit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-link"
                          disabled={busy}
                          onClick={() => toggle(p)}
                        >
                          {p.is_published ? 'Archive' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="inquiry-cards">
            {!inquiryRows.length && !loading && <p className="empty-state">{showTrash ? 'Trash is empty.' : 'No inquiries in your inbox.'}</p>}
            {inquiryRows.map((i) => (
              <article className="admin-inquiry" key={i.id}>
                <header>
                  <div>
                    <p className="eyebrow">
                      {i.type === 'service'
                        ? 'SERVICE REQUEST'
                        : 'EQUIPMENT INQUIRY'}
                    </p>
                    <h2 className="mt-2">{i.hospital || i.name}</h2>
                  </div>
                  <time>{formatDate(i.created_at)}</time>
                </header>
                <p>
                  <strong>{i.name}</strong> · {i.department}
                </p>
                <p>
                  <a href={`mailto:${encodeURIComponent(i.email || '')}`}>
                    {i.email}
                  </a>{' '}
                  ·{' '}
                  <a
                    href={`tel:${String(i.phone || '').replace(/[^+\d]/g, '')}`}
                  >
                    {i.phone}
                  </a>
                </p>
                {i.message && <p className="message">{i.message}</p>}
                {Array.isArray(i.items) && i.items.length > 0 && (
                  <ul className="list-disc pl-5">
                    {i.items.map((item, n) => (
                      <li key={item.id || n}>
                        {item.name} — quantity {item.quantity}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="inquiry-actions">
                  {showTrash ? <><span className="inquiry-trash-label">In Trash</span><button className="text-link" disabled={busy} onClick={() => moveInquiry(i, false)}><HiOutlineArrowUturnLeft />Restore inquiry</button></> : <button className="inquiry-delete" disabled={busy} onClick={() => moveInquiry(i, true)}><HiOutlineTrash />Delete inquiry</button>}
                </div>
              </article>
            ))}
          </div>
        )}
        </>}
      </div>
    </section>
  )
}
