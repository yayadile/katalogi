'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prevItems) =>
      quantity <= 0
        ? prevItems.filter((i) => i.id !== itemId)
        : prevItems.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          )
    )
  }, [])

  const removeFromCart = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
