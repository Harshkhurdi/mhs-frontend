import { createContext, useContext, useState, useCallback } from 'react'

const RFQContext = createContext(null)

export function RFQProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rfqItems')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  const saveItems = (newItems) => {
    setItems(newItems)
    sessionStorage.setItem('rfqItems', JSON.stringify(newItems))
  }

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      let newItems
      if (existing) {
        newItems = prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newItems = [...prev, { id: product.id, name: product.name, quantity: 1 }]
      }
      sessionStorage.setItem('rfqItems', JSON.stringify(newItems))
      return newItems
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id)
      sessionStorage.setItem('rfqItems', JSON.stringify(newItems))
      if (newItems.length === 0) setIsOpen(false)
      return newItems
    })
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return
    setItems((prev) => {
      const newItems = prev.map((i) =>
        i.id === id ? { ...i, quantity } : i
      )
      sessionStorage.setItem('rfqItems', JSON.stringify(newItems))
      return newItems
    })
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
    setIsOpen(false)
    sessionStorage.removeItem('rfqItems')
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

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
        totalItems,
      }}
    >
      {children}
    </RFQContext.Provider>
  )
}

export function useRFQ() {
  const ctx = useContext(RFQContext)
  if (!ctx) throw new Error('useRFQ must be used within RFQProvider')
  return ctx
}