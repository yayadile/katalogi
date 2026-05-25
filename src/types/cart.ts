/**
 * Cart System Type Definitions
 * 
 * This file contains all TypeScript interfaces and types needed for the cart system,
 * including cart items, state management, context types, and related configurations.
 */

/**
 * Represents a single item in the shopping cart
 */
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
}

/**
 * Represents the complete state of the shopping cart
 */
export interface CartState {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

/**
 * Represents the context type for cart operations
 * Provides methods to manage cart items and state
 */
export interface CartContextType {
  state: CartState
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartItem: (productId: string) => CartItem | undefined
}

/**
 * Represents a single product in the catalog
 */
export interface CatalogItem {
  id: string
  name: string
  price: number
  image?: string
  desc?: string
}

/**
 * Represents the content structure of a catalog block
 */
export interface CatalogContent {
  title?: string
  items: CatalogItem[]
}

/**
 * Represents WhatsApp configuration for order messaging
 */
export interface WhatsAppConfig {
  phoneNumber: string // Format: 62XXXXXXXXXX or +62XXXXXXXXXX
  isConfigured: boolean
}

/**
 * Represents the generated WhatsApp message with various formats
 */
export interface WhatsAppMessage {
  text: string // Plain text message
  encodedText: string // URL-encoded message
  url: string // Complete WhatsApp API URL
}

/**
 * Props for the CartProvider component
 */
export interface CartProviderProps {
  children: React.ReactNode
}

/**
 * Props for the QuantityCounter component
 */
export interface QuantityCounterProps {
  productId: string
  currentQuantity: number
  onQuantityChange: (quantity: number) => void
  primaryColor?: string
}

/**
 * Props for the FloatingCartButton component
 */
export interface FloatingCartButtonProps {
  totalItems: number
  totalPrice: number
  primaryColor?: string
  onCheckout: () => void
}

/**
 * Props for the CheckoutModal component
 */
export interface CheckoutModalProps {
  isOpen: boolean
  items: CartItem[]
  totalPrice: number
  totalItems: number
  primaryColor?: string
  whatsappNumber?: string
  onClose: () => void
  onCheckout: () => void
}

/**
 * Props for the CatalogBlock component
 */
export interface CatalogBlockProps {
  content: CatalogContent
  primaryColor?: string
  whatsappNumber?: string
}

/**
 * Represents a cart action for the reducer
 */
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string } // productId
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'RESTORE_CART'; payload: CartState }

/**
 * Represents the result of cart operations
 */
export interface CartOperationResult {
  success: boolean
  error?: string
  data?: CartState
}

/**
 * Represents validation result for phone numbers
 */
export interface PhoneNumberValidationResult {
  isValid: boolean
  normalizedNumber?: string
  error?: string
}
