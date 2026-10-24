import { useEffect, useRef, useState } from 'react'
import AdminEvents from '../components/AdminEvents'
import { loadInquiryPage, setInquiryDeleted } from '../services/inquiries'
import AdminTeamPhotos from '../components/AdminTeamPhotos'
import PageMeta from '../components/PageMeta'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore/lite'
import { HiArrowUpRight, HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUturnLeft } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { db } from '../config/firebaseDatabase'
import { clinicalSpecialties, manufacturerBrands } from '../data/products'
import { safeExternalUrl, withTimeout } from '../lib/quote'
import { inquiryDateValue as dateValue } from '../lib/inquiries'
import { normalizeProduct } from '../lib/catalogue'
import { correctProductSpecialty, productSpecialtyError } from '../lib/adminProducts'
import { invalidatePublicContent } from '../lib/publicCache'

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
  const [inquiryView, setInquiryView] = useState('inbox')
  const [cursors, setCursors] = useState([null])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageResult, setPageResult] = useState({ cursor: null, hasMore: false, scanned: 0 })
  const inquiryCursor = cursors[pageIndex]
  const showTrash = inquiryView === 'trash'
  const pendingId = useRef(null)
  const editorInput = useRef(null)
  const editorOrigin = useRef(null)
  const editButtons = useRef(new Map())
  const addProductButton = useRef(null)
  const restoreFocus = useRef(false)
  useEffect(() => {
    if (editing) {
      editorInput.current?.focus()
      editorInput.current?.scrollIntoView({ block: 'center' })
    } else if (restoreFocus.current && !loading) {
      restoreFocus.current = false
      const origin = editorOrigin.current
      const target = origin?.element?.isConnected ? origin.element : editButtons.current.get(origin?.id) || addProductButton.current
      target?.focus()
    }
  }, [editing, loading])
  useEffect(() => {
    if (!['products', 'inquiries'].includes(tab)) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        if (tab === 'inquiries') {
          const result = await loadInquiryPage(inquiryView, inquiryCursor)
          if (!cancelled) { setRows(result.rows); setPageResult(result) }
        } else {
          const snapshot = await withTimeout(getDocs(collection(db, 'products')))
          const data = snapshot.docs.map((d) => normalizeProduct(d.data(), d.id))
            .sort((a, b) => dateValue(b.created_at) - dateValue(a.created_at))
          if (!cancelled) setRows(data)
        }
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
  }, [tab, refresh, inquiryView, inquiryCursor])
  const change = (e) =>
    setForm((prev) => correctProductSpecialty({
      ...prev,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))
  function edit(product, origin) {
    setError('')
    setNotice('')
    pendingId.current = null
    editorOrigin.current = { element: origin, id: product?.id }
    editorInput.current?.focus()
    if (product?.brand === 'nihon-kohden' && product.specialty !== 'defibrillation') {
      setNotice('This Nihon Kohden record used an unsupported specialty. The editor now shows Defibrillators & AEDs; save to apply the correction.')
    }
    setForm(
      correctProductSpecialty(product
        ? Object.fromEntries(
            Object.keys(emptyProduct).map((k) => [
              k,
              product[k] ?? emptyProduct[k],
            ]),
          )
        : { ...emptyProduct }),
    )
    setEditing(product?.id || 'new')
  }
  function closeEditor() {
    restoreFocus.current = true
    setEditing(null)
  }
  function changeInquiryView(view) {
    setInquiryView(view)
    setCursors([null])
    setPageIndex(0)
    setRows([])
    setLoading(true)
    setNotice('')
  }
  function changeInquiryPage(next) {
    if (busy || loading) return
    if (next > pageIndex) {
      if (!pageResult.hasMore || !pageResult.cursor) return
      setCursors((current) => [...current.slice(0, pageIndex + 1), pageResult.cursor])
    }
    setPageIndex(next)
    setRows([])
    setLoading(true)
    setNotice('')
  }
  async function save(e) {
    e.preventDefault()
    if (busy) return
    const specialtyError = productSpecialtyError(form)
    if (specialtyError) { setError(specialtyError); return }
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
      invalidatePublicContent()
      setLoading(true)
      closeEditor()
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
    const specialtyError = productSpecialtyError(product)
    if (!product.is_published && specialtyError) { setError(specialtyError); return }
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
      invalidatePublicContent()
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
      setRows((current) => current.filter((row) => row.id !== inquiry.id))
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
                if (!busy && key !== tab) {
                  setTab(key)
                  setEditing(null)
                  setNotice('')
                  setRows([])
                  setLoading(true)
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
              : 'Browse up to 25 records per page in stable record order. Dates are shown in Indian Standard Time.'}
          </p>
          <div className="flex gap-4">
            {tab === 'inquiries' && <label>Inquiry view<select aria-label="Inquiry view" value={inquiryView} disabled={busy || loading} onChange={(event) => changeInquiryView(event.target.value)}><option value="inbox">Inbox</option><option value="trash">Trash</option><option value="legacy">Legacy records</option></select></label>}
            <button
              className="text-link"
              onClick={() => { setLoading(true); setRefresh((n) => n + 1) }}
              disabled={busy || loading}
            >
              Refresh
            </button>
            {tab === 'products' && (
              <button
                className="button button-small"
                ref={addProductButton}
                onClick={(event) => edit(null, event.currentTarget)}
                disabled={busy}
              >
                <HiOutlinePlus /> Add product
              </button>
            )}
          </div>
        </div>
        {tab === 'inquiries' && <p className="fine-print mb-6">Older inquiries without an inbox marker remain available under Legacy records. Each legacy page scans at most 25 records and may contain no matches; use Next scan to continue. No records are migrated or deleted by browsing.</p>}
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
                    ref={editorInput}
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
                    {clinicalSpecialties.filter((specialty) => form.brand !== 'nihon-kohden' || specialty.id === 'defibrillation').map((s) => (
                      <option value={s.id} key={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {form.brand === 'nihon-kohden' && <p className="fine-print">Nihon Kohden is available for defibrillators and AEDs only.</p>}
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
                  onClick={closeEditor}
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
                : inquiryView === 'legacy' ? 'No legacy inquiries in this scan.' : showTrash ? 'This Trash page is empty.' : 'This inbox page is empty.'}
            </h2>
            <p>
              {tab === 'products'
                ? 'Add your first product to make it available to visitors.'
                : inquiryView === 'legacy' ? 'Continue scanning to find older records, or return to Inbox.' : 'Choose Legacy records to check older inquiries, or refresh this view.'}
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
                          ref={(element) => { if (element) editButtons.current.set(p.id, element); else editButtons.current.delete(p.id) }}
                          disabled={busy}
                          onClick={(event) => edit(p, event.currentTarget)}
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
            {rows.map((i) => (
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
        {tab === 'inquiries' && <nav className="community-pagination" aria-label="Inquiry pages">
          <button type="button" disabled={loading || busy || pageIndex === 0} onClick={() => changeInquiryPage(pageIndex - 1)}>Previous {inquiryView === 'legacy' ? 'scan' : 'page'}</button>
          <span role="status" aria-live="polite">{inquiryView === 'legacy' ? 'Scan' : 'Page'} {pageIndex + 1}{!loading && !error ? ` · ${rows.length} inquiries${inquiryView === 'legacy' ? ` from ${pageResult.scanned} scanned records` : ''}` : ''}</span>
          <button type="button" disabled={loading || busy || Boolean(error) || !pageResult.hasMore} onClick={() => changeInquiryPage(pageIndex + 1)}>Next {inquiryView === 'legacy' ? 'scan' : 'page'}</button>
        </nav>}
        </>}
      </div>
    </section>
  )
}
