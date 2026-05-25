/**
 * CartProvider.test.tsx
 * 
 * Unit tests for CartProvider component and cart state management.
 * Tests verify all acceptance criteria are met.
 */

import { renderHook, act } from '@testing-library/react'
import { ReactNode } from 'react'
import { CartProvider } from './CartProvider'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/types/cart'

/**
 * Helper to render hooks with CartProvider wrapper
 */
function renderCartHook() {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  )
  return renderHook(() => useCart(), { wrapper })
}

describe('CartProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderCartHook()

      expect(result.current.state.items).toEqual([])
      expect(result.current.state.totalPrice).toBe(0)
      expect(result.current.state.totalItems).toBe(0)
    })
  })

  describe('addToCart', () => {
    it('should add new item to cart with quantity 1 by default', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product)
      })

      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0]).toEqual({
        ...product,
        quantity: 1,
      })
    })

    it('should add new item with specified quantity', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 3)
      })

      expect(result.current.state.items[0].quantity).toBe(3)
    })

    it('should update quantity if product already exists (Req 1.3)', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 2)
      })

      expect(result.current.state.items[0].quantity).toBe(2)

      act(() => {
        result.current.addToCart(product, 3)
      })

      // Should update to 2 + 3 = 5, not replace
      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0].quantity).toBe(5)
    })

    it('should reject invalid product data', () => {
      const { result } = renderCartHook()
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      act(() => {
        result.current.addToCart(
          { id: '', name: 'Invalid', price: 50000 },
          1
        )
      })

      expect(result.current.state.items).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should reject invalid quantity', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      act(() => {
        result.current.addToCart(product, -1)
      })

      expect(result.current.state.items).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product)
      })

      expect(result.current.state.items).toHaveLength(1)

      act(() => {
        result.current.removeFromCart('prod-1')
      })

      expect(result.current.state.items).toHaveLength(0)
    })

    it('should not affect other items when removing one', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 })
        result.current.addToCart({ id: 'prod-2', name: 'Product 2', price: 30000 })
      })

      expect(result.current.state.items).toHaveLength(2)

      act(() => {
        result.current.removeFromCart('prod-1')
      })

      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0].id).toBe('prod-2')
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 2)
      })

      act(() => {
        result.current.updateQuantity('prod-1', 5)
      })

      expect(result.current.state.items[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0 (Req 1.4)', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 2)
      })

      expect(result.current.state.items).toHaveLength(1)

      act(() => {
        result.current.updateQuantity('prod-1', 0)
      })

      expect(result.current.state.items).toHaveLength(0)
    })

    it('should reject negative quantity', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 2)
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      act(() => {
        result.current.updateQuantity('prod-1', -1)
      })

      expect(result.current.state.items[0].quantity).toBe(2)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should reject non-integer quantity', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 2)
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      act(() => {
        result.current.updateQuantity('prod-1', 2.5)
      })

      expect(result.current.state.items[0].quantity).toBe(2)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 })
        result.current.addToCart({ id: 'prod-2', name: 'Product 2', price: 30000 })
      })

      expect(result.current.state.items).toHaveLength(2)

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.state.items).toHaveLength(0)
      expect(result.current.state.totalPrice).toBe(0)
      expect(result.current.state.totalItems).toBe(0)
    })
  })

  describe('getCartItem', () => {
    it('should return cart item by product ID', () => {
      const { result } = renderCartHook()
      const product: Omit<CartItem, 'quantity'> = {
        id: 'prod-1',
        name: 'Product 1',
        price: 50000,
      }

      act(() => {
        result.current.addToCart(product, 2)
      })

      const item = result.current.getCartItem('prod-1')
      expect(item).toEqual({ ...product, quantity: 2 })
    })

    it('should return undefined for non-existent item', () => {
      const { result } = renderCartHook()

      const item = result.current.getCartItem('non-existent')
      expect(item).toBeUndefined()
    })
  })

  describe('Total Price Calculation (Req 1.5)', () => {
    it('should calculate totalPrice as sum(price × quantity)', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 }, 2)
        result.current.addToCart({ id: 'prod-2', name: 'Product 2', price: 30000 }, 3)
      })

      // (50000 × 2) + (30000 × 3) = 100000 + 90000 = 190000
      expect(result.current.state.totalPrice).toBe(190000)
    })

    it('should update totalPrice when quantity changes', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 }, 2)
      })

      expect(result.current.state.totalPrice).toBe(100000)

      act(() => {
        result.current.updateQuantity('prod-1', 5)
      })

      expect(result.current.state.totalPrice).toBe(250000)
    })

    it('should update totalPrice when item is removed', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 }, 2)
        result.current.addToCart({ id: 'prod-2', name: 'Product 2', price: 30000 }, 1)
      })

      expect(result.current.state.totalPrice).toBe(130000)

      act(() => {
        result.current.removeFromCart('prod-1')
      })

      expect(result.current.state.totalPrice).toBe(30000)
    })
  })

  describe('Total Items Calculation (Req 1.6)', () => {
    it('should calculate totalItems as sum(quantity)', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 }, 2)
        result.current.addToCart({ id: 'prod-2', name: 'Product 2', price: 30000 }, 3)
      })

      // 2 + 3 = 5
      expect(result.current.state.totalItems).toBe(5)
    })

    it('should update totalItems when quantity changes', () => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 }, 2)
      })

      expect(result.current.state.totalItems).toBe(2)

      act(() => {
        result.current.updateQuantity('prod-1', 5)
      })

      expect(result.current.state.totalItems).toBe(5)
    })
  })

  describe('localStorage Persistence (Req 1.7, 1.8)', () => {
    it('should persist cart to localStorage with key "katalogi_cart"', (done) => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 }, 2)
      })

      // Wait for debounce (500ms)
      setTimeout(() => {
        const stored = localStorage.getItem('katalogi_cart')
        expect(stored).toBeTruthy()

        const parsed = JSON.parse(stored!)
        expect(parsed.items).toHaveLength(1)
        expect(parsed.items[0].id).toBe('prod-1')
        expect(parsed.totalPrice).toBe(100000)
        expect(parsed.totalItems).toBe(2)

        done()
      }, 600)
    })

    it('should restore cart from localStorage on mount', () => {
      // Pre-populate localStorage
      const cartData = {
        items: [
          { id: 'prod-1', name: 'Product 1', price: 50000, quantity: 2 },
        ],
        totalPrice: 100000,
        totalItems: 2,
      }
      localStorage.setItem('katalogi_cart', JSON.stringify(cartData))

      const { result } = renderCartHook()

      // Should restore from localStorage
      expect(result.current.state.items).toHaveLength(1)
      expect(result.current.state.items[0].id).toBe('prod-1')
      expect(result.current.state.totalPrice).toBe(100000)
      expect(result.current.state.totalItems).toBe(2)
    })

    it('should handle invalid localStorage data gracefully', () => {
      localStorage.setItem('katalogi_cart', 'invalid json')

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderCartHook()

      // Should fallback to empty cart
      expect(result.current.state.items).toHaveLength(0)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should validate localStorage data before restore', () => {
      // Invalid data (missing required fields)
      const invalidData = {
        items: [{ id: 'prod-1' }], // Missing name, price, quantity
        totalPrice: 100000,
      }
      localStorage.setItem('katalogi_cart', JSON.stringify(invalidData))

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      const { result } = renderCartHook()

      // Should fallback to empty cart
      expect(result.current.state.items).toHaveLength(0)
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should clear localStorage when clearCart is called', (done) => {
      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 })
      })

      setTimeout(() => {
        expect(localStorage.getItem('katalogi_cart')).toBeTruthy()

        act(() => {
          result.current.clearCart()
        })

        expect(localStorage.getItem('katalogi_cart')).toBeNull()
        done()
      }, 600)
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage quota exceeded gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Mock localStorage.setItem to throw QuotaExceededError
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementation(() => {
          const error = new DOMException('QuotaExceededError')
          error.code = 22
          throw error
        })

      const { result } = renderCartHook()

      act(() => {
        result.current.addToCart({ id: 'prod-1', name: 'Product 1', price: 50000 })
      })

      // Should continue operation with in-memory state
      expect(result.current.state.items).toHaveLength(1)
      expect(consoleSpy).toHaveBeenCalled()

      setItemSpy.mockRestore()
      consoleSpy.mockRestore()
    })
  })

  describe('useCart Hook', () => {
    it('should throw error when used outside CartProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      consoleSpy.mockRestore()
    })
  })
})
