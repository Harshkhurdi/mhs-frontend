import { useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { collection, doc, setDoc } from 'firebase/firestore/lite'
import {
  HiArrowUpRight,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import { db } from '../config/firebaseDatabase'
import { useRFQ } from '../components/RFQContext'
import { QuoteItems } from '../components/QuoteDrawer'
import PageIntro from '../components/PageIntro'
import { inquiryEmail, withTimeout } from '../lib/quote'

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
  const { items, clearAll, totalItems } = useRFQ()
  const [params] = useSearchParams()
  const [form, setForm] = useState(restoreDraft)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const inquiryRef = useRef(null)
  const sending = useRef(false)
  function change(e) {
    const next = { ...form, [e.target.name]: e.target.value }
    setForm(next)
    try {
      sessionStorage.setItem(draftKey, JSON.stringify(next))
    } catch {
      /* The form works without storage. */
    }
  }
  async function submit(e) {
    e.preventDefault()
    if (sending.current) return
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    )
    if (
      ['name', 'hospital', 'department', 'email', 'phone'].some(
        (key) => !cleaned[key],
      )
    ) {
      setError('Please complete each required field.')
      return
    }
    if (
      !/^\+?[\d\s().-]{7,25}$/.test(cleaned.phone) ||
      cleaned.phone.replace(/\D/g, '').length < 7
    ) {
      setError(
        'Please enter a valid phone number, including the country code if needed.',
      )
      return
    }
    setError('')
    setSubmitting(true)
    sending.current = true
    try {
      if (!db) throw new Error('Inquiry service unavailable')
      // A fixed document ID makes retries safe when the connection drops after a write.
      inquiryRef.current ||= doc(collection(db, 'inquiries'))
      await withTimeout(
        setDoc(inquiryRef.current, {
          ...cleaned,
          items: items.map(({ id, name, quantity }) => ({
            id,
            name,
            quantity,
          })),
          type: params.get('type') === 'service' ? 'service' : 'equipment',
          status: 'new',
          created_at: Date.now(),
        }),
      )
      setSubmitted(true)
      clearAll()
      inquiryRef.current = null
      try {
        sessionStorage.removeItem(draftKey)
      } catch {
        /* No draft to clear. */
      }
    } catch {
      setError(
        'We couldn’t confirm receipt of your inquiry. Your details and quote list are still here. Try again, send these details by email, or call our team.',
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
            <br />
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
                <HiOutlinePhone />
                <div>
                  <h3>Call our team</h3>
                  <a href="tel:+919316666888">
                    +91 93166 66888 <HiArrowUpRight />
                  </a>
                </div>
              </div>
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
                  Need to discuss something sooner? Call{' '}
                  <a href="tel:+919316666888">+91 93166 66888</a>.
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
                    {params.get('type') === 'service'
                      ? 'Request service support'
                      : 'Tell us what you need'}
                  </h2>
                  <p>
                    Fields marked <span aria-hidden="true">*</span> are
                    required.
                  </p>
                </div>
                {items.length > 0 && (
                  <div className="contact-quote">
                    <div>
                      <strong>Your equipment selection</strong>
                      <span>{totalItems} units</span>
                    </div>
                    <QuoteItems />
                  </div>
                )}
                <form onSubmit={submit}>
                  <fieldset disabled={submitting}>
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
                    {error && (
                      <div className="form-error" role="alert">
                        <p>{error}</p>
                        <a
                          href={inquiryEmail(form, items)}
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
                    <button type="submit" className="button submit-button">
                      {submitting ? 'Sending your inquiry…' : 'Send inquiry'}
                      <HiArrowUpRight />
                    </button>
                    <p className="fine-print form-privacy">
                      We use your contact details to respond to this inquiry.
                      Your selection is a request for a quotation, not a
                      purchase.
                    </p>
                  </fieldset>
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
