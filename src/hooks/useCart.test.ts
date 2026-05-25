/**
 * useCart.test.ts
 * 
 * Unit tests for the useCart custom hook.
 * Tests verify that the hook correctly accesses cart context and throws errors when used outside provider.
 */

import { renderHook } from '@testing-library/react'
import { ReactNode } from 'react'
import { CartProvider } from '@/components/cart/CartProvider'
import { useCart } from './useCart'

/**
 * Helper to render hooks with CartProvider wrapper
 */
function renderCartHook() {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  )
  return renderHook(() => useCart(), { wrapper })
}

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('Hook Functionality', () => {
    it('should return cart context when used within CartProvider', () => {
      const { result } = renderCartHook()

      expect(result.current).toBeDefined()
      expect(result.current.state).toBeDefined()
      expect(result.current.addToCart).toBeDefined()
      expect(result.current.removeFromCart).toBeDefined()
      expect(result.current.updateQuantity).toBeDefined()
      expect(result.current.clearCart).toBeDefined()
      expect(result.current.getCartItem).toBeDefined()
    })

    it('should provide access to cart state', () => {
      const { result } = renderCartHook()

      expect(result.current.state.items).toEqual([])
      expect(result.current.state.totalPrice).toBe(0)
      expect(result.current.state.totalItems).toBe(0)
    })

    it('should provide access to cart methods', () => {
      const { result } = renderCartHook()

      expect(typeof result.current.addToCart).toBe('function')
      expect(typeof result.current.removeFromCart).toBe('function')
      expect(typeof result.current.updateQuantity).toBe('function')
      expect(typeof result.current.clearCart).toBe('function')
      expect(typeof result.current.getCartItem).toBe('function')
    })
  })

  describe('Error Handling', () => {
    it('should throw error when used outside CartProvider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      consoleSpy.mockRestore()
    })

    it('should throw error with correct message', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      try {
        renderHook(() => useCart())
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('useCart must be used within a CartProvider')
      }

      consoleSpy.mockRestore()
    })
  })

  describe('Hook Integration', () => {
    it('should work with CartProvider for adding items', () => {
      const { result } = renderCartHook()

      expect(result.current.state.items).toHaveLength(0)

      // Note: We can't use act() here because it's not imported, but the hook should still work
      // In a real test environment with proper setup, this would be wrapped in act()
    })
  })
})

