'use client'

/**
 * useCart.ts
 * 
 * Custom hook for accessing cart context in components.
 * Provides convenient access to cart state and methods.
 * 
 * Usage:
 * ```tsx
 * const { state, addToCart, removeFromCart, updateQuantity, clearCart, getCartItem } = useCart()
 * ```
 * 
 * Must be used within a CartProvider component.
 * Throws an error if used outside of CartProvider.
 */

import { useContext } from 'react'
import { CartContext } from '@/components/cart/CartContext'
import type { CartContextType } from '@/types/cart'

/**
 * useCart Hook
 * 
 * Returns the cart context value containing state and methods.
 * 
 * @returns {CartContextType} Cart state and methods
 * @throws {Error} If used outside of CartProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, addToCart } = useCart()
 *   
 *   return (
 *     <button onClick={() => addToCart({ id: '1', name: 'Product', price: 100 }, 1)}>
 *       Add to Cart
 *     </button>
 *   )
 * }
 * ```
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
