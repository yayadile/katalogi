'use client'

/**
 * CartProvider.tsx
 * 
 * Provides cart state management using React Context and useReducer.
 * Handles localStorage persistence with debouncing and error handling.
 * 
 * Features:
 * - useReducer for predictable state updates
 * - localStorage persistence with debouncing (500ms)
 * - Hydration-safe implementation
 * - Error handling for localStorage quota and security errors
 * - Data validation on restore
 */

import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react'
import { CartContext, initialCartState, CART_STORAGE_KEY, STORAGE_DEBOUNCE_DELAY } from './CartContext'
import type { CartState, CartAction, CartItem, CartContextType } from '@/types/cart'

interface CartProviderProps {
  children: ReactNode
}

/**
 * Cart reducer function
 * Handles all cart state mutations: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART, RESTORE_CART
 */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        // Item already exists - update quantity instead of adding duplicate
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return calculateTotals(updatedItems)
      }

      // New item - add to cart
      const newItems = [...state.items, action.payload]
      return calculateTotals(newItems)
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter((item) => item.id !== action.payload)
      return calculateTotals(filteredItems)
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload

      // Validate quantity
      if (!Number.isInteger(quantity) || quantity < 0) {
        console.error('Invalid quantity:', quantity)
        return state
      }

      // Remove item if quantity is 0
      if (quantity === 0) {
        const filteredItems = state.items.filter((item) => item.id !== productId)
        return calculateTotals(filteredItems)
      }

      // Update quantity
      const updatedItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
      return calculateTotals(updatedItems)
    }

    case 'CLEAR_CART': {
      return initialCartState
    }

    case 'RESTORE_CART': {
      return action.payload
    }

    default:
      return state
  }
}

/**
 * Calculate totals for cart state
 * totalPrice = sum(price × quantity)
 * totalItems = sum(quantity)
 */
function calculateTotals(items: CartItem[]): CartState {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    totalPrice,
    totalItems,
  }
}

/**
 * Validate cart state structure and data types
 */
function isValidCartState(data: unknown): data is CartState {
  if (!data || typeof data !== 'object') return false

  const state = data as Record<string, unknown>

  // Check required properties
  if (!Array.isArray(state.items)) return false
  if (typeof state.totalPrice !== 'number') return false
  if (typeof state.totalItems !== 'number') return false

  // Validate each item
  return state.items.every((item: unknown) => {
    if (!item || typeof item !== 'object') return false
    const cartItem = item as Record<string, unknown>
    return (
      typeof cartItem.id === 'string' &&
      typeof cartItem.name === 'string' &&
      typeof cartItem.price === 'number' &&
      typeof cartItem.quantity === 'number' &&
      cartItem.quantity > 0 &&
      cartItem.price >= 0
    )
  })
}

/**
 * Restore cart state from localStorage
 * Returns null if localStorage is unavailable or data is invalid
 */
function restoreCartFromStorage(): CartState | null {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Validate data structure
    if (!isValidCartState(parsed)) {
      console.warn('Invalid cart data in localStorage, using empty cart')
      return null
    }

    return parsed
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Failed to parse cart data from localStorage:', error)
    } else if (error instanceof DOMException && error.name === 'SecurityError') {
      console.warn('localStorage not available (private browsing or restricted access)')
    } else {
      console.error('Error restoring cart from localStorage:', error)
    }
    return null
  }
}

/**
 * Save cart state to localStorage
 * Handles quota exceeded and security errors gracefully
 */
function saveCartToStorage(state: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      // QuotaExceededError
      console.error('localStorage quota exceeded, cart not persisted')
      // Fallback to in-memory state - continue operation
    } else if (error instanceof DOMException && error.name === 'SecurityError') {
      console.warn('localStorage not available, cart not persisted')
      // Fallback to in-memory state - continue operation
    } else {
      console.error('Error saving cart to localStorage:', error)
    }
  }
}

/**
 * Clear cart from localStorage
 */
function clearCartFromStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error)
  }
}

/**
 * CartProvider Component
 * 
 * Provides cart state and methods to all child components via React Context.
 * 
 * Features:
 * - useReducer for state management
 * - localStorage persistence with debouncing
 * - Hydration-safe (defers localStorage access to useEffect)
 * - Error handling for localStorage and data validation
 * - Methods: addToCart, removeFromCart, updateQuantity, clearCart, getCartItem
 */
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  // Refs for debouncing localStorage writes
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isHydratedRef = useRef(false)

  /**
   * Debounced localStorage save
   * Prevents excessive writes during rapid cart updates
   */
  const debouncedSave = useCallback((cartState: CartState) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      saveCartToStorage(cartState)
      debounceTimerRef.current = null
    }, STORAGE_DEBOUNCE_DELAY)
  }, [])

  /**
   * Effect: Restore cart from localStorage on mount (hydration-safe)
   * This runs only once after component mounts on the client
   */
  useEffect(() => {
    if (isHydratedRef.current) return

    isHydratedRef.current = true

    const restoredState = restoreCartFromStorage()
    if (restoredState) {
      dispatch({ type: 'RESTORE_CART', payload: restoredState })
    }
  }, [])

  /**
   * Effect: Persist cart to localStorage when state changes
   * Debounced to prevent excessive writes
   */
  useEffect(() => {
    // Skip saving on initial mount (before hydration)
    if (!isHydratedRef.current) return

    debouncedSave(state)
  }, [state, debouncedSave])

  /**
   * Effect: Cleanup debounce timer on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  /**
   * Add product to cart
   * If product already exists, updates quantity instead of adding duplicate
   */
  const addToCart = useCallback(
    (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
      if (!product.id || !product.name || product.price < 0) {
        console.error('Invalid product data:', product)
        return
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        console.error('Invalid quantity:', quantity)
        return
      }

      dispatch({
        type: 'ADD_ITEM',
        payload: {
          ...product,
          quantity,
        },
      })
    },
    []
  )

  /**
   * Remove product from cart
   */
  const removeFromCart = useCallback((productId: string) => {
    if (!productId) {
      console.error('Invalid product ID')
      return
    }

    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId,
    })
  }, [])

  /**
   * Update product quantity
   * If quantity is 0, removes the item from cart
   */
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId) {
      console.error('Invalid product ID')
      return
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      console.error('Invalid quantity:', quantity)
      return
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    })
  }, [])

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
    clearCartFromStorage()
  }, [])

  /**
   * Get a specific cart item by product ID
   */
  const getCartItem = useCallback(
    (productId: string): CartItem | undefined => {
      return state.items.find((item) => item.id === productId)
    },
    [state.items]
  )

  const contextValue: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}


