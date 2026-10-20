import { useState } from 'react'
import {
  HiArrowUpRight,
  HiOutlinePlus,
  HiOutlineCheck,
  HiOutlineDocumentText,
} from 'react-icons/hi2'
import { useRFQ } from './RFQContext'
import { safeExternalUrl, safeImageUrl } from '../lib/quote'

export default function ProductCard({ product, brandName, onDetails }) {
  const { addItem, items, setIsOpen } = useRFQ()
  const [failed, setFailed] = useState(false)
  const inQuote = items.some((i) => i.id === product.id)
  const image = safeImageUrl(product.image)
  const brochure = safeExternalUrl(product.pdfUrl)
  const source = safeExternalUrl(product.sourceUrl)
  return (
    <article className="product-card">
      <button
        className="product-image product-image-button"
        onClick={() => onDetails(product)}
        aria-label={`View details: ${product.name}`}
      >
        {image && !failed ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            width="760"
            height="660"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="image-unavailable">
            Product photograph unavailable
          </span>
        )}
        <span className="product-image-open">
          <HiArrowUpRight />
        </span>
      </button>
      <div className="product-info">
        <p className="product-manufacturer">{brandName}</p>
        <h2>
          <button onClick={() => onDetails(product)}>{product.name}</button>
        </h2>
        <p className="product-category-label">
          {product.categoryLabel || 'Medical equipment'}
        </p>
        <div className="product-resource-links">
          {source && (
            <a href={source} target="_blank" rel="noreferrer">
              Official product page <HiArrowUpRight />
            </a>
          )}
          {brochure && (
            <a href={brochure} target="_blank" rel="noreferrer">
              <HiOutlineDocumentText /> Literature <HiArrowUpRight />
            </a>
          )}
        </div>
        <div className="product-actions">
          <button
            className={`button ${inQuote ? 'button-added' : ''}`}
            onClick={() => (inQuote ? setIsOpen(true) : addItem(product))}
            aria-label={`${inQuote ? 'View quote for' : 'Add to quote:'} ${product.name}`}
          >
            {inQuote ? (
              <>
                <HiOutlineCheck /> In your quote list
              </>
            ) : (
              <>
                <HiOutlinePlus /> Add to quote
              </>
            )}
          </button>
          <button
            className="product-detail-button"
            onClick={() => onDetails(product)}
          >
            Details <HiArrowUpRight />
          </button>
        </div>
      </div>
    </article>
  )
}
