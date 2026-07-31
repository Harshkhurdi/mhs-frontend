import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import ScrollReveal from '../components/ScrollReveal'
import { useRFQ } from '../components/RFQContext'
import { HiLocationMarker, HiPhone, HiMail, HiClock } from 'react-icons/hi'

const position = [30.7046, 76.7179]

export default function Contact() {
  const { items, clearAll, totalItems } = useRFQ()
  const [formData, setFormData] = useState({
    name: '',
    hospital: '',
    department: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (items.length > 0 && !formData.department) {
      const itemList = items.map((i) => `${i.name} (Qty: ${i.quantity})`).join(', ')
      setFormData((prev) => ({
        ...prev,
        department: `RFQ for: ${itemList}`,
        message: `I would like to request a quotation for the following equipment:\n\n${items
          .map((i) => `- ${i.name} (Qty: ${i.quantity})`)
          .join('\n')}`,
      }))
    }
  }, [items])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = `RFQ Inquiry from ${formData.hospital || formData.name}`
    const body = `Name: ${formData.name}
Hospital: ${formData.hospital}
Department/Equipment: ${formData.department}
Email: ${formData.email}
Phone: ${formData.phone}

${formData.message}

---
Items from RFQ List:
${items.length > 0 ? items.map((i) => `- ${i.name} (Qty: ${i.quantity})`).join('\n') : 'None'}`

    window.location.href = `mailto:info@medelec.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
    clearAll()
  }

  return (
    <>
      <Helmet>
        <title>Contact Hub | Medelec Healthcare Solutions</title>
      </Helmet>

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-bg-platinum border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-surgical-teal">Contact Hub</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-blue mt-4 mb-4">Get in Touch</h1>
            <p className="text-text-muted max-w-2xl text-lg">
              Reach out for product inquiries, RFQ submissions, technical support, or partnership opportunities. We respond within one business day.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Map + Address */}
            <ScrollReveal>
              <div>
                {/* Map */}
                <div className="rounded-sm overflow-hidden border border-border-light shadow-sm h-[360px] mb-8">
                  <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
                    <Marker position={position}>
                      <Popup>
                        <strong>Medelec Healthcare Solutions</strong><br />
                        F-382, Asha Towers, Phase 8B<br />
                        Mohali, Punjab — 160055
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* Address Block */}
                <div className="bg-bg-platinum p-8 rounded-sm border border-border-light">
                  <h2 className="text-lg font-bold text-primary-blue mb-6">Corporate Address</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-surgical-teal/10 rounded-sm flex items-center justify-center shrink-0">
                        <HiLocationMarker className="text-surgical-teal" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-blue mb-1">Medelec Healthcare Solutions</p>
                        <a href="https://maps.google.com/?q=F-382,Asha+Towers,Phase+8B,Industrial+Area,Sector+74,Mohali,Punjab" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted leading-relaxed hover:text-surgical-teal transition-colors duration-200">
                          F-382, Asha Towers, Phase 8B,<br />Industrial Area, Sector 74,<br />Mohali, Punjab — 160055
                        </a>
                        <p className="text-xs text-text-muted mt-1">Sunday: Closed</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-surgical-teal/10 rounded-sm flex items-center justify-center shrink-0">
                        <HiPhone className="text-surgical-teal" size={18} />
                      </div>
                      <a href="tel:+919316666888" className="text-sm text-text-muted hover:text-surgical-teal transition-colors duration-200">
                        +91 9316666888
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-surgical-teal/10 rounded-sm flex items-center justify-center shrink-0">
                        <HiMail className="text-surgical-teal" size={18} />
                      </div>
                      <a href="mailto:info@medelec.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-surgical-teal transition-colors duration-200">
                        info@medelec.com
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-surgical-teal/10 rounded-sm flex items-center justify-center shrink-0">
                        <HiClock className="text-surgical-teal" size={18} />
                      </div>
                      <p className="text-sm text-text-muted">Mon – Sat: 9:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: RFQ Form */}
            <ScrollReveal delay={100}>
              <div className="bg-white p-8 lg:p-10 rounded-sm border border-border-light shadow-sm">
                <h2 className="text-xl font-bold text-primary-blue mb-2">Request for Quote (RFQ)</h2>
                <p className="text-sm text-text-muted mb-6">
                  Fill out the form below. If you've selected items from our catalog, they'll be included automatically.
                </p>

                {totalItems > 0 && (
                  <div className="mb-6 p-4 bg-surgical-teal/5 border border-surgical-teal/20 rounded-sm">
                    <p className="text-sm font-medium text-surgical-teal mb-2">✓ {totalItems} item(s) from your RFQ list will be included</p>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <p key={item.id} className="text-xs text-text-muted">• {item.name} (Qty: {item.quantity})</p>
                      ))}
                    </div>
                  </div>
                )}

                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-16 h-16 bg-surgical-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-surgical-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-primary-blue mb-2">Email Client Opened</h3>
                    <p className="text-sm text-text-muted mb-6">Your email client should now be open with your RFQ details. Our team will respond within one business day.</p>
                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', hospital: '', department: '', email: '', phone: '', message: '' }) }} className="btn-outline">Send Another Inquiry</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1.5">Name <span className="text-surgical-teal">*</span></label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1.5">Hospital Name <span className="text-surgical-teal">*</span></label>
                      <input type="text" name="hospital" required value={formData.hospital} onChange={handleChange} className="input-field" placeholder="Hospital / Institution name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1.5">Department / Equipment Needed <span className="text-surgical-teal">*</span></label>
                      <input type="text" name="department" required value={formData.department} onChange={handleChange} className="input-field" placeholder="e.g., ICU, Radiology, or specific equipment" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-primary-blue mb-1.5">Email <span className="text-surgical-teal">*</span></label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="your.email@hospital.in" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-blue mb-1.5">Phone Number <span className="text-surgical-teal">*</span></label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-blue mb-1.5">Additional Details</label>
                      <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="input-field resize-none" placeholder="Any specific requirements, timelines, or questions..." />
                    </div>
                    <button type="submit" className="btn-teal w-full">Submit RFQ Inquiry →</button>
                    <p className="text-xs text-text-muted text-center">Your inquiry will be sent directly to our Managing Director's office for prompt attention.</p>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}