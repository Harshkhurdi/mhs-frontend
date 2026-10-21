import { useEffect, useRef, useState } from 'react'
import {
  HiArrowUpRight,
  HiOutlineXMark,
  HiOutlinePlus,
  HiOutlineDocumentText,
} from 'react-icons/hi2'
import { useRFQ } from './RFQContext'
import { manufacturerBrands } from '../data/products'
import { safeExternalUrl, safeImageUrl } from '../lib/quote'

export default function ProductDetails({ product, onClose }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const image = safeImageUrl(product.image)
  const { addItem, items, setIsOpen } = useRFQ()
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])
  const inQuote = items.some((i) => i.id === product.id)
  const source = safeExternalUrl(product.sourceUrl)
  const brochure = safeExternalUrl(product.pdfUrl)
  function quote() {
    ref.current.close()
    onClose()
    if (inQuote) setIsOpen(true)
    else addItem(product)
  }
  return (
    <dialog
      ref={ref}
      className="product-dialog"
      aria-labelledby="product-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="product-dialog-content">
        <button
          className="dialog-close icon-button"
          aria-label="Close product details"
          onClick={onClose}
        >
          <HiOutlineXMark size={25} />
        </button>
        <div className="product-dialog-image">
          {image && !failed ? (
            <img
              src={image}
              alt={product.name}
              width="760"
              height="660"
              onError={() => setFailed(true)}
            />
          ) : (
            <span className="image-unavailable">
              Product photograph unavailable
            </span>
          )}
        </div>
        <div className="product-dialog-copy">
          <p className="eyebrow">
            {manufacturerBrands.find((b) => b.id === product.brand)?.name ||
              product.brand}
          </p>
          <h2 id="product-title">{product.name}</h2>
          <span className="detail-category">
            {product.categoryLabel || 'Medical equipment'}
          </span>
          <p>{product.description}</p>
          {product.applications?.length > 0 && (
            <div className="application-tags">
              {product.applications.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
          <div className="product-literature">
            {source && (
              <a
                href={source}
                className="resource-card"
                target="_blank"
                rel="noreferrer"
              >
                <HiArrowUpRight />
                <span>
                  <strong>Official product information</strong>
                  <small>
                    Explore features and manufacturer specifications
                  </small>
                </span>
                <HiArrowUpRight />
              </a>
            )}
            {brochure && (
              <a
                href={brochure}
                className="resource-card"
                target="_blank"
                rel="noreferrer"
              >
                <HiOutlineDocumentText />
                <span>
                  <strong>Product literature</strong>
                  <small>
                    {product.literatureTitle || 'Manufacturer brochure or technical document'}
                  </small>
                </span>
                <HiArrowUpRight />
              </a>
            )}
          </div>
          <button className="button" onClick={quote}>
            {inQuote ? 'View your quote list' : 'Add to quote'}
            <HiOutlinePlus />
          </button>
          <p className="fine-print">
            Availability, configuration, accessories and service scope are
            confirmed by our team. Manufacturer images may show optional
            equipment.
          </p>
        </div>
      </div>
    </dialog>
  )
}
