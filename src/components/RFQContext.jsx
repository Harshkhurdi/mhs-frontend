import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { MAX_QUANTITY, validItems } from '../lib/quote'

const RFQContext = createContext(null)
function readItems() {
  for (const key of ['medelec-quote', 'rfqItems']) {
    for (const storageName of ['localStorage', 'sessionStorage']) {
      try {
        const saved = window[storageName].getItem(key)
        if (saved) return validItems(JSON.parse(saved))
      } catch {
        /* Storage can be disabled. The basket still works in memory. */
      }
    }
  }
  return []
}

export function RFQProvider({ children }) {
  const [items, setItems] = useState(readItems)
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem('medelec-quote', JSON.stringify(items))
    } catch {
      /* Keep the current in-memory selection. */
    }
    try {
      sessionStorage.removeItem('rfqItems')
    } catch {
      /* Legacy draft cleanup is optional. */
    }
  }, [items])
  const addItem = useCallback((product) => {
    setItems((prev) =>
      prev.some((i) => i.id === product.id)
        ? prev.map((i) =>
            i.id === product.id
              ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + 1) }
              : i,
          )
        : [...prev, { id: product.id, name: product.name, quantity: 1 }],
    )
    setIsOpen(true)
  }, [])
  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [],
  )
  const updateQuantity = useCallback((id, value) => {
    const quantity = Number(value)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY)
      return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }, [])
  const clearAll = useCallback(() => {
    setItems([])
    setIsOpen(false)
  }, [])
  return (
    <RFQContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearAll,
        isOpen,
        setIsOpen,
        totalItems: items.reduce((n, i) => n + i.quantity, 0),
      }}
    >
      {children}
    </RFQContext.Provider>
  )
}
export function useRFQ() {
  const context = useContext(RFQContext)
  if (!context) throw new Error('useRFQ must be used within RFQProvider')
  return context
}
