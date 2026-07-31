import { useState } from 'react'
import { HiDocumentDownload, HiOutlinePlus } from 'react-icons/hi'
import { useRFQ } from './RFQContext'

export default function ProductCard({ product, brandName, specialtyName }) {
  const { addItem, items } = useRFQ()
  const [showVault, setShowVault] = useState(false)
  const [vaultEmail, setVaultEmail] = useState('')
  const [vaultUnlocked, setVaultUnlocked] = useState(false)

  const inRFQ = items.some((i) => i.id === product.id)

  const handleAddRFQ = () => {
    addItem(product)
  }

  const handleVaultSubmit = (e) => {
    e.preventDefault()
    if (vaultEmail.trim()) {
      setVaultUnlocked(true)
    }
  }

  return (
    <>
      <div className="card overflow-hidden flex flex-col group hover:border-surgical-teal/30 h-full">
        {/* Product Image Placeholder */}
        <div className="aspect-[4/3] bg-bg-platinum flex items-center justify-center relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-white rounded-sm border border-border-light flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-primary-blue/20">
                  {brandName?.charAt(0) || 'M'}
                </span>
              </div>
              <p className="text-xs text-text-muted">{brandName}</p>
            </div>
          )}

          {/* Brand badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-primary-blue rounded-sm border border-border-light">
            {brandName}
          </span>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-2">
            <span className="text-xs text-surgical-teal font-medium uppercase tracking-wider">
              {specialtyName}
            </span>
          </div>
          <h3 className="text-base font-semibold text-primary-blue mb-2 group-hover:text-surgical-teal transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-5 flex-1">
            {product.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddRFQ}
              disabled={inRFQ}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 ${
                inRFQ
                  ? 'bg-surgical-teal/10 text-surgical-teal cursor-default'
                  : 'bg-primary-blue text-white hover:bg-primary-blue/90'
              }`}
            >
              {inRFQ ? (
                '✓ Added to RFQ'
              ) : (
                <>
                  <HiOutlinePlus size={16} />
                  Request Technical Specification / RFQ
                </>
              )}
            </button>

            <button
              onClick={() => setShowVault(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-blue border border-border-light rounded-sm hover:border-surgical-teal hover:text-surgical-teal transition-all duration-300"
            >
              <HiDocumentDownload size={16} />
              PDF Resources
            </button>
          </div>
        </div>
      </div>

      {/* PDF Vault Modal */}
      {showVault && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setShowVault(false)
            setVaultUnlocked(false)
            setVaultEmail('')
          }}
        >
          <div
            className="bg-white rounded-sm max-w-md w-full p-8 shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary-blue">PDF Resource Vault</h3>
                <p className="text-sm text-text-muted mt-1">{product.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowVault(false)
                  setVaultUnlocked(false)
                  setVaultEmail('')
                }}
                className="text-text-muted hover:text-primary-blue text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {!vaultUnlocked ? (
              <form onSubmit={handleVaultSubmit}>
                <p className="text-sm text-text-muted mb-4">
                  Enter your email to access official brochures, structural footprints, and
                  compliance certifications.
                </p>
                <input
                  type="email"
                  required
                  value={vaultEmail}
                  onChange={(e) => setVaultEmail(e.target.value)}
                  placeholder="your.email@hospital.in"
                  className="input-field mb-4"
                />
                <button type="submit" className="btn-teal w-full">
                  Unlock Resources
                </button>
              </form>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <p className="text-sm text-surgical-teal font-medium mb-4">
                  ✓ Access granted.
                </p>
                {product.pdfUrl ? (
                  <a
                    href={product.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-between p-3 border border-border-light rounded-sm hover:border-surgical-teal hover:bg-bg-platinum transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <HiDocumentDownload className="text-surgical-teal" size={20} />
                      <span className="text-sm font-medium text-primary-blue">Download Official Product Brochure</span>
                    </div>
                    <span className="text-xs text-text-muted group-hover:text-surgical-teal">
                      PDF
                    </span>
                  </a>
                ) : (
                  <div className="p-4 bg-bg-platinum rounded-sm border border-border-light text-center">
                    <p className="text-sm text-text-muted">No official PDF document currently attached for this product.</p>
                    <p className="text-xs text-text-muted mt-1">Please submit an RFQ to receive technical datasheets via email.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}