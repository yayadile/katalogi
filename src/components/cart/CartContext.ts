/**
 * CartContext.ts
 * 
 * Defines the React Context for cart state management.
 * This file contains the context definition and types.
 */

import { createContext } from 'react'
import type { CartContextType, CartState } from '@/types/cart'

/**
 * CartContext - Provides cart state and methods to all child components
 * 
 * Type: CartContextType | undefined
 * - undefined when context is not provided (error state)
 * - CartContextType when properly wrapped with CartProvider
 */
export const CartContext = createContext<CartContextType | undefined>(undefined)

CartContext.displayName = 'CartContext'

/**
 * Initial cart state - empty cart
 */
export const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
}

/**
 * localStorage key for persisting cart data
 */
export const CART_STORAGE_KEY = 'katalogi_cart'

/**
 * Debounce delay for localStorage writes (in milliseconds)
 */
export const STORAGE_DEBOUNCE_DELAY = 500
