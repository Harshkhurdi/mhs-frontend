import { useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import {
  HiArrowUpRight,
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import { db } from '../config/firebaseDatabase'
import { useRFQ } from '../components/RFQContext'
import { QuoteItems } from '../components/QuoteDrawer'
import PageIntro from '../components/PageIntro'
import { clearPendingInquiry, deliverPendingInquiry, inquiryContactError, newPendingInquiry, readPendingInquiry, sameInquiryItems, savePendingInquiry } from '../lib/inquirySubmission'
import {
  createInquirySubmission,
  inquiryEmail,
  MAX_QUOTE_ITEMS,
  withTimeout,
} from '../lib/quote'

const emptyForm = {
  name: '',
  hospital: '',
  department: '',
  email: '',
  phone: '',
  message: '',
}
const draftKey = 'medelec-inquiry-draft'
function restoreDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(draftKey))
    return Object.fromEntries(
      Object.keys(emptyForm).map((key) => [
        key,
        typeof draft?.[key] === 'string' ? draft[key] : '',
      ]),
    )
  } catch {
    return { ...emptyForm }
  }
}

export default function Contact() {
  const { items, clearSubmittedItems, totalItems } = useRFQ()
  const [params] = useSearchParams()
  const [pending, setPending] = useState(readPendingInquiry)
  const [form, setForm] = useState(() => pending?.payload ? Object.fromEntries(Object.keys(emptyForm).map(key => [key, pending.payload[key]])) : restoreDraft())
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [awaitingReceipt, setAwaitingReceipt] = useState(Boolean(pending))
  const [error, setError] = useState(pending ? 'An earlier inquiry is awaiting confirmation. Keep its reference and check delivery before sending another copy.' : '')
  const inquiryRef = useRef(null)
  const sending = useRef(false)
  const shownItems = pending?.payload?.items || items
  const shownTotal = pending ? shownItems.reduce((sum, item) => sum + item.quantity, 0) : totalItems
  function change(e) {
    const next = { ...form, [e.target.name]: e.target.value }
    setForm(next)
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(next))
    } catch {
      /* Keep details in memory for the email fallback. */
    }
  }
  async function submit(e) {
    e.preventDefault()
    if (sending.current) return
    if (!awaitingReceipt && items.length > MAX_QUOTE_ITEMS) {
      setError(`Please keep each inquiry to ${MAX_QUOTE_ITEMS} different products or fewer. Your full quote list is still here; remove some products or contact our team for help with a larger request.`)
      return
    }
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    )
    const validationError = inquiryContactError(cleaned)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setSubmitting(true)
    sending.current = true
    try {
      let active = pending
      if (active?.blocked) throw new Error('Your earlier delivery reference could not be restored. Please contact our team before sending another inquiry.')
      if (!active) {
        active = newPendingInquiry({
          ...cleaned,
          items: items.map(({ id, name, quantity }) => ({ id, name, quantity })),
          type: params.get('type') === 'service' ? 'service' : 'equipment',
        }, import.meta.env.VITE_INQUIRY_API_ENABLED === 'true' ? 'api' : 'legacy')
        active.website = website
        savePendingInquiry(active)
        setPending(active)
        if (active.mode === 'legacy') {
          if (!db) { clearPendingInquiry(); setPending(null); throw new Error('Inquiry service unavailable') }
          const document = doc(db, 'inquiries', active.id)
          inquiryRef.current = createInquirySubmission(() => setDoc(document, {
            ...active.payload, status: 'new', is_deleted: false, created_at: serverTimestamp(),
          }))
        }
      }
      if (active.mode === 'api') {
        await withTimeout(deliverPendingInquiry(active))
      } else {
        // Anonymous reads stay denied. An unresolved remounted inquiry must not
        // allocate another ID or overwrite an already-committed document.
        if (!inquiryRef.current) throw new Error('Please ask our team to confirm receipt using the reference below. We cannot safely check this earlier delivery online.')
        await withTimeout(inquiryRef.current.promise)
      }
      setSubmitted(true)
      setAwaitingReceipt(false)
      if (sameInquiryItems(items, active.payload.items)) clearSubmittedItems(items)
      clearPendingInquiry()
      setPending(null)
      inquiryRef.current = null
      try {
        sessionStorage.removeItem(draftKey)
      } catch {
        /* No draft to clear. */
      }
    } catch (failure) {
      const unresolved = Boolean(readPendingInquiry())
      setAwaitingReceipt(unresolved)
      setError(
        unresolved
          ? `${failure.message || 'We are still checking delivery.'} Your submitted details are kept unchanged. Check delivery below or contact our team with your reference before sending another copy.`
          : 'We couldn’t confirm receipt of your inquiry. Your details and quote list are still here. Try again or send these details by email.',
      )
    } finally {
      setSubmitting(false)
      sending.current = false
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Contact us"
        title={
          <>
            Let’s find the
            {' '}<br className="heading-break" />
            <span>right solution.</span>
          </>
        }
        description="Planning a new installation, looking for equipment or needing technical support? Tell us what you have in mind."
      />
      <section className="section contact-section">
        <div className="wrap contact-layout">
          <aside className="contact-details">
            <p className="eyebrow">A REAL TEAM. A DIRECT CONVERSATION.</p>
            <h2>We’re here to help.</h2>
            <p>
              Connect with our Mohali team for equipment advice, quotations and
              service coordination.
            </p>
            <div className="contact-methods">
              <div>
                <HiOutlineEnvelope />
                <div>
                  <h3>Email us</h3>
                  <a href="mailto:info@medelec.in">
                    info@medelec.in <HiArrowUpRight />
                  </a>
                </div>
              </div>
              <div>
                <HiOutlineMapPin />
                <div>
                  <h3>Visit our office</h3>
                  <p>
                    F-382, Asha Towers, Phase 8B,
                    <br />
                    Industrial Area, Sector 74,
                    <br />
                    Mohali, Punjab — 160055
                  </p>
                  <a
                    className="text-link"
                    href="https://maps.google.com/?q=F-382,Asha+Towers,Phase+8B,Industrial+Area,Sector+74,Mohali,Punjab"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get directions <HiArrowUpRight />
                  </a>
                </div>
              </div>
              <div>
                <HiOutlineClock />
                <div>
                  <h3>Office hours</h3>
                  <p>
                    Monday–Saturday, 9:00 AM–6:00 PM IST
                    <br />
                    Sunday closed
                  </p>
                </div>
              </div>
            </div>
            <div className="contact-note">
              <span className="status-dot" />
              <p>
                Supporting healthcare institutions across Punjab, Chandigarh,
                Haryana, Himachal Pradesh, Jammu & Kashmir and Delhi NCR.
              </p>
            </div>
          </aside>
          <div id="inquiry" className="inquiry-panel">
            {submitted ? (
              <div className="success-panel" role="status" aria-live="polite">
                <HiOutlineCheckCircle size={56} />
                <p className="eyebrow">THANK YOU FOR GETTING IN TOUCH</p>
                <h2>Your inquiry is with us.</h2>
                <p>
                  Our team will review your requirements and contact you using
                  the details you provided.
                </p>
                <p className="fine-print">
                  Need to discuss something sooner? Email{' '}
                  <a href="mailto:info@medelec.in">info@medelec.in</a>.
                </p>
                <button
                  className="button button-outline"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ ...emptyForm })
                  }}
                >
                  Send another inquiry <HiArrowUpRight />
                </button>
              </div>
            ) : (
              <>
                <div className="form-heading">
                  <span className="eyebrow">START A CONVERSATION</span>
                  <h2>
                    {(pending?.payload?.type || params.get('type')) === 'service'
                      ? 'Request service support'
                      : 'Tell us what you need'}
                  </h2>
                  <p>
                    Fields marked <span aria-hidden="true">*</span> are
                    required.
                  </p>
                </div>
                {shownItems.length > 0 && (
                  <div className="contact-quote">
                    <div>
                      <strong>{pending ? 'Submitted equipment selection' : 'Your equipment selection'}</strong>
                      <span>{shownTotal} units</span>
                    </div>
                    {pending ? (
                      <ul className="quote-items">{shownItems.map(item => <li key={item.id}><strong>{item.name}</strong><span>Quantity: {item.quantity}</span></li>)}</ul>
                    ) : <QuoteItems />}
                  </div>
                )}
                <form onSubmit={submit}>
                  <div hidden aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} />
                  </div>
                  <fieldset disabled={submitting || awaitingReceipt}>
                    <div className="form-grid">
                      <div>
                        <label htmlFor="contact-name">Full name *</label>
                        <input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          required
                          maxLength="120"
                          value={form.name}
                          onChange={change}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-hospital">
                          Hospital / organisation *
                        </label>
                        <input
                          id="contact-hospital"
                          name="hospital"
                          autoComplete="organization"
                          required
                          maxLength="180"
                          value={form.hospital}
                          onChange={change}
                          placeholder="Your organisation"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email">Work email *</label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          maxLength="254"
                          value={form.email}
                          onChange={change}
                          placeholder="you@hospital.in"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone">Phone number *</label>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          maxLength="25"
                          value={form.phone}
                          onChange={change}
                          placeholder="+91"
                        />
                      </div>
                      <div className="full-width">
                        <label htmlFor="contact-department">
                          Department / requirement *
                        </label>
                        <input
                          id="contact-department"
                          name="department"
                          required
                          maxLength="200"
                          value={form.department}
                          onChange={change}
                          placeholder="e.g. ICU, radiology, equipment maintenance"
                        />
                      </div>
                      <div className="full-width">
                        <label htmlFor="contact-message">
                          How can we help?
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows="5"
                          maxLength="5000"
                          value={form.message}
                          onChange={change}
                          placeholder="Equipment, quantities, service issue or project timeline…"
                        />
                        <p className="fine-print">
                          Please do not include patient information or medical
                          records.
                        </p>
                      </div>
                    </div>
                  </fieldset>
                  {error && (
                    <div className="form-error" role="alert">
                      <p>{error}</p>
                      {pending?.id && <p className="fine-print">Inquiry reference: {pending.id}</p>}
                      <a
                        href={inquiryEmail({ ...form, message: pending?.id ? `Please confirm delivery of website inquiry ${pending.id} before processing another copy.\n\n${form.message}` : form.message }, pending?.payload?.items || items)}
                        className="text-link"
                      >
                        Open an email with these details <HiArrowUpRight />
                      </a>
                      <p className="fine-print">
                        An email draft still needs to be sent from your email
                        app.
                      </p>
                    </div>
                  )}
                  <button type="submit" className="button submit-button" disabled={submitting}>
                    {submitting
                      ? (awaitingReceipt ? 'Checking delivery…' : 'Sending your inquiry…')
                      : (awaitingReceipt ? 'Check inquiry status' : 'Send inquiry')}
                    <HiArrowUpRight />
                  </button>
                  <p className="fine-print form-privacy">
                    We use your contact details to respond to this inquiry.
                    Your selection is a request for a quotation, not a
                    purchase.
                  </p>
                </form>
              </>
            )}
            <Link to="/solutions" className="back-to-catalogue">
              ← Back to medical solutions
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
