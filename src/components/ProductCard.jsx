import { useState } from 'react'
import { HiArrowUpRight, HiOutlinePlus, HiOutlineCheck } from 'react-icons/hi2'
import { useRFQ } from './RFQContext'
import EquipmentArt from './EquipmentArt'
import { safeExternalUrl } from '../lib/quote'

export default function ProductCard({ product, brandName, specialtyName }) {
  const { addItem, items, setIsOpen } = useRFQ()
  const [imageFailed, setImageFailed] = useState(false)
  const inQuote = items.some((i) => i.id === product.id)
  const image = safeExternalUrl(product.image)
  const brochure = safeExternalUrl(product.pdfUrl)
  return (
    <article className="product-card">
      <div className="product-image">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <>
            <EquipmentArt specialty={product.specialty} />
            <span className="illustration-label">Category illustration</span>
          </>
        )}
        <span className="product-brand">{brandName}</span>
      </div>
      <div className="product-info">
        <p className="eyebrow">{specialtyName}</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="product-actions">
          <button
            className={`button ${inQuote ? 'button-added' : ''}`}
            onClick={() => (inQuote ? setIsOpen(true) : addItem(product))}
            aria-label={`${inQuote ? 'View quote for' : 'Add to quote:'} ${product.name}`}
          >
            {inQuote ? (
              <>
                <HiOutlineCheck /> Added to quote
              </>
            ) : (
              <>
                <HiOutlinePlus /> Add to quote
              </>
            )}
          </button>
          {brochure ? (
            <a
              href={brochure}
              className="text-link brochure-link"
              target="_blank"
              rel="noreferrer"
            >
              Product brochure <HiArrowUpRight />
            </a>
          ) : (
            <span className="fine-print">Ask our team for specifications</span>
          )}
        </div>
      </div>
    </article>
  )
}
