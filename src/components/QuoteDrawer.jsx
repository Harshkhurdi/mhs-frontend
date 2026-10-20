import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  HiArrowUpRight,
  HiOutlineXMark,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'
import { useRFQ } from './RFQContext'
import { MAX_QUANTITY } from '../lib/quote'

export function QuoteItems() {
  const { items, removeItem, updateQuantity } = useRFQ()
  return (
    <ul className="quote-items">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <button
              className="remove-item"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
          <div className="quantity-control">
            <button
              aria-label={`Decrease quantity of ${item.name}`}
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max={MAX_QUANTITY}
              aria-label={`Quantity for ${item.name}`}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, e.target.value)}
            />
            <button
              aria-label={`Increase quantity of ${item.name}`}
              disabled={item.quantity >= MAX_QUANTITY}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function QuoteDrawer() {
  const { isOpen, setIsOpen, items, totalItems, clearAll } = useRFQ()
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
    if (!isOpen) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])
  return (
    <dialog
      ref={ref}
      className="quote-drawer"
      aria-labelledby="quote-title"
      onCancel={() => setIsOpen(false)}
      onClose={() => setIsOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false)
      }}
    >
      <div className="drawer-content">
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">YOUR EQUIPMENT SELECTION</p>
            <h2 id="quote-title">
              Quote list <span>({totalItems})</span>
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Close quote list"
            onClick={() => setIsOpen(false)}
          >
            <HiOutlineXMark size={24} />
          </button>
        </div>
        {items.length ? (
          <>
            <p className="muted">
              Review quantities, then share your requirements with our team.
            </p>
            <QuoteItems />
            <div className="drawer-bottom">
              <Link
                to="/contact#inquiry"
                className="button"
                onClick={() => setIsOpen(false)}
              >
                Continue to inquiry <HiArrowUpRight />
              </Link>
              <button className="text-link" onClick={clearAll}>
                Clear quote list
              </button>
              <p className="fine-print">
                Selecting equipment does not place an order.
              </p>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <HiOutlineClipboardDocumentList size={46} />
            <h3>Your list is ready when you are.</h3>
            <p>
              Explore our medical equipment and add products to request a
              personalised quotation.
            </p>
            <Link
              to="/solutions"
              className="button"
              onClick={() => setIsOpen(false)}
            >
              Explore equipment <HiArrowUpRight />
            </Link>
          </div>
        )}
      </div>
    </dialog>
  )
}
