# Design Document: Interactive Catalog with Cart & WhatsApp Checkout

## Overview

This design transforms the static CatalogBlock into an interactive e-commerce system with client-side cart management and WhatsApp integration. The system enables users to add products to a cart, manage quantities, review orders in a checkout modal, and send orders directly to WhatsApp.

**Key Design Principles:**
- Client-side state management using React Context API
- Hydration-safe implementation with proper 'use client' directives
- Type-safe implementation with TypeScript
- localStorage persistence for cart state
- Pure functions for message generation
- Responsive and accessible UI

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Published Website                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CatalogBlock (use client)                           │   │
│  │  ├─ Renders product grid                             │   │
│  │  ├─ Manages local UI state (expanded items)          │   │
│  │  └─ Integrates with CartContext                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CartProvider (use client)                           │   │
│  │  ├─ Manages cart state (items, totals)               │   │
│  │  ├─ Persists to localStorage                         │   │
│  │  └─ Provides context to all children                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│        ┌──────────────────┼──────────────────┐               │
│        ▼                  ▼                  ▼               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Quantity     │  │ Floating     │  │ Checkout     │      │
│  │ Counter      │  │ Cart Button  │  │ Modal        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                              │               │
│                                              ▼               │
│                                    ┌──────────────────┐     │
│                                    │ WhatsApp         │     │
│                                    │ Integration      │     │
│                                    │ (window.open)    │     │
│                                    └──────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
CatalogBlock (use client)
├── CartProvider (use client)
│   ├── QuantityCounter (per product)
│   ├── FloatingCartButton
│   │   └── CheckoutModal
│   │       └── WhatsApp Integration
│   └── [Product Grid]
```

---

## Data Models and TypeScript Interfaces

### Core Types

```typescript
// Cart Item Type
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
}

// Cart State Type
interface CartState {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

// Cart Context Type
interface CartContextType {
  state: CartState
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartItem: (productId: string) => CartItem | undefined
}

// Product Type (from CatalogBlock)
interface CatalogItem {
  id: string
  name: string
  price: number
  image?: string
  desc?: string
}

// Catalog Content Type
interface CatalogContent {
  title?: string
  items: CatalogItem[]
}

// WhatsApp Configuration
interface WhatsAppConfig {
  phoneNumber: string // Format: 62XXXXXXXXXX
  isConfigured: boolean
}

// Message Generation Result
interface WhatsAppMessage {
  text: string
  encodedText: string
  url: string
}
```

---

## State Management Flow

### CartContext Implementation Strategy

**Initialization:**
1. CartProvider initializes with empty cart or restores from localStorage
2. useEffect hook handles localStorage restoration after mount (hydration-safe)
3. State updates trigger localStorage persistence (debounced)

**State Update Flow:**
```
User Action (click button)
    ↓
Component calls context method (addToCart, updateQuantity, etc.)
    ↓
Reducer updates state
    ↓
useEffect detects state change
    ↓
Serialize to JSON and persist to localStorage
    ↓
Context subscribers re-render
```

**Persistence Strategy:**
- Key: `'katalogi_cart'`
- Format: JSON string of CartState
- Debounce: 500ms to prevent excessive writes
- Error handling: Fallback to in-memory state if localStorage fails

---

## Component Specifications

### 1. CartProvider Component

**Purpose:** Provides cart state and methods to all child components via React Context

**Props:**
```typescript
interface CartProviderProps {
  children: React.ReactNode
}
```

**Key Features:**
- Marked with 'use client' directive
- Uses useReducer for state management
- Implements localStorage persistence with debouncing
- Provides 5 methods: addToCart, removeFromCart, updateQuantity, clearCart, getCartItem
- Handles hydration mismatch by deferring localStorage access to useEffect

**Implementation Notes:**
- Initial state: empty cart
- Reducer handles: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
- Debounce localStorage writes to prevent performance issues
- Validate localStorage data before restore

### 2. CatalogBlock Component (Updated)

**Purpose:** Displays product grid with interactive cart functionality

**Props:**
```typescript
interface CatalogBlockProps {
  content: CatalogContent
  primaryColor?: string
  whatsappNumber?: string
}
```

**Key Features:**
- Marked with 'use client' directive
- Renders product grid with "Beli" button for each product
- Replaces button with QuantityCounter when product is added to cart
- Displays FloatingCartButton when cart has items
- Integrates with CartContext for state management
- Handles hydration by using useState with useEffect

**State Management:**
- Local state: `expandedItems` (Set of product IDs with quantity counter visible)
- Context state: cart items and totals
- Hydration: Initialize expandedItems from cart items after mount

### 3. QuantityCounter Component

**Purpose:** Allows users to adjust product quantity

**Props:**
```typescript
interface QuantityCounterProps {
  productId: string
  currentQuantity: number
  onQuantityChange: (quantity: number) => void
  primaryColor?: string
}
```

**Key Features:**
- Displays [-] [quantity] [+] buttons
- Decreases quantity on [-] click
- Increases quantity on [+] click
- Removes item when quantity reaches 0
- Memoized with React.memo to prevent unnecessary re-renders
- Click handlers use useCallback for optimization

### 4. FloatingCartButton Component

**Purpose:** Sticky button showing cart summary

**Props:**
```typescript
interface FloatingCartButtonProps {
  totalItems: number
  totalPrice: number
  primaryColor?: string
  onCheckout: () => void
}
```

**Key Features:**
- Only renders when totalItems > 0
- Displays: "🛒 [totalItems] item - Rp [totalPrice]"
- Sticky position at bottom of screen
- Formats price using Intl.NumberFormat (id-ID, IDR)
- Opens CheckoutModal on click
- Memoized to prevent unnecessary re-renders

### 5. CheckoutModal Component

**Purpose:** Displays order summary before checkout

**Props:**
```typescript
interface CheckoutModalProps {
  isOpen: boolean
  items: CartItem[]
  totalPrice: number
  totalItems: number
  primaryColor?: string
  whatsappNumber?: string
  onClose: () => void
  onCheckout: () => void
}
```

**Key Features:**
- Modal dialog with overlay
- Displays all cart items with: name, quantity, unit price, subtotal
- Shows total price at bottom
- "Kirim Pesanan via WhatsApp" button (prominent)
- "Lanjut Belanja" button to close without checkout
- Responsive design (full-width on mobile, max-width 500px on desktop)
- Close button (X) in top-right corner
- Smooth open/close animations

---

## WhatsApp Integration Flow

### Message Generation Algorithm

**Input:** CartState (items, totalPrice, totalItems)

**Output:** WhatsAppMessage (text, encodedText, url)

**Algorithm:**
```
1. Initialize message with header:
   "Halo, saya ingin memesan produk berikut:"

2. For each item in cart:
   - Format: "[No]. [Product_Name] x[Quantity] = Rp[Subtotal]"
   - Escape special characters in product name
   - Calculate subtotal: price × quantity
   - Append to message

3. Add separator:
   "---"

4. Add summary:
   "Total: [totalItems] item | Rp[totalPrice]"

5. Add footer:
   "Terima kasih, tunggu konfirmasi dari Anda."

6. URL-encode the message

7. Construct WhatsApp URL:
   "https://api.whatsapp.com/send?phone=[PHONE_NUMBER]&text=[ENCODED_MESSAGE]"

8. Return message object with text, encodedText, and url
```

**Pure Function Implementation:**
- No side effects (no localStorage access, no API calls)
- Deterministic output for same input
- Testable with property-based testing

### WhatsApp URL Construction

**Format:**
```
https://api.whatsapp.com/send?phone=62XXXXXXXXXX&text=<URL_ENCODED_MESSAGE>
```

**Phone Number Validation:**
- Accept: `62XXXXXXXXXX` (international format without +)
- Accept: `+62XXXXXXXXXX` (with + prefix)
- Reject: `0XXXXXXXXXX` (local format)
- Reject: Invalid formats

**Message Encoding:**
- URL-encode using `encodeURIComponent()`
- Preserve line breaks as `%0A`
- Handle special characters appropriately

### Integration Flow

```
User clicks "Kirim Pesanan via WhatsApp"
    ↓
Generate WhatsApp message from cart state
    ↓
Validate WhatsApp number
    ↓
Construct WhatsApp URL
    ↓
Call window.open(url, '_blank')
    ↓
Browser opens WhatsApp (app or web)
    ↓
User confirms and sends message
    ↓
Close CheckoutModal
    ↓
Keep cart intact (don't auto-clear)
```

---

## localStorage Persistence Strategy

### Storage Schema

**Key:** `'katalogi_cart'`

**Value:** JSON string of CartState
```json
{
  "items": [
    {
      "id": "prod-1",
      "name": "Product Name",
      "price": 50000,
      "quantity": 2,
      "image": "https://...",
      "description": "Product description"
    }
  ],
  "totalPrice": 100000,
  "totalItems": 2
}
```

### Persistence Operations

**Save to localStorage:**
- Triggered on cart state change
- Debounced to 500ms to prevent excessive writes
- Serialize CartState to JSON
- Handle errors gracefully (quota exceeded, etc.)

**Restore from localStorage:**
- Triggered in useEffect after component mount
- Parse JSON string to CartState
- Validate data structure and types
- Fallback to empty cart if invalid

**Clear localStorage:**
- Triggered on clearCart() action
- Remove 'katalogi_cart' key

### Error Handling

**localStorage Quota Exceeded:**
- Catch QuotaExceededError
- Fallback to in-memory state
- Notify user: "Penyimpanan lokal penuh, data tidak dapat disimpan"
- Continue operation with in-memory state

**Invalid Data:**
- Catch JSON parse errors
- Fallback to empty cart
- Log error for debugging

**localStorage Unavailable:**
- Catch SecurityError (private browsing)
- Fallback to in-memory state
- Continue operation normally

---

## Hydration Handling Strategy

### Problem

Next.js renders components on server and hydrates on client. If server and client render different content, hydration mismatch occurs.

### Solution

**1. Use 'use client' Directive**
- Mark CartProvider with 'use client'
- Mark CatalogBlock with 'use client'
- Ensures components run only on client

**2. Defer Browser-Dependent Operations**
- Don't access window, document, localStorage in render phase
- Use useEffect to access browser APIs after mount
- Initialize state with server-safe defaults

**3. Hydration-Safe Pattern**

```typescript
// ❌ WRONG - Causes hydration mismatch
function Component() {
  const [isMounted, setIsMounted] = useState(typeof window !== 'undefined')
  return isMounted ? <ClientContent /> : <ServerContent />
}

// ✅ CORRECT - Hydration-safe
function Component() {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) return <Placeholder />
  return <ClientContent />
}
```

**4. localStorage Restoration**
- Initialize cart with empty state
- In useEffect, restore from localStorage
- Trigger re-render with restored state

**5. Floating Cart Button**
- Render placeholder (hidden) on server
- Show actual button after hydration
- Use isMounted flag to control visibility

---

## Performance Optimization Techniques

### 1. Memoization

**React.memo:**
- Wrap QuantityCounter with React.memo
- Wrap FloatingCartButton with React.memo
- Prevent re-renders when props don't change

**useMemo:**
- Memoize WhatsApp message generation
- Memoize formatted price strings
- Memoize cart totals calculations

**useCallback:**
- Memoize click handlers in QuantityCounter
- Memoize onAddToCart handler in CatalogBlock
- Memoize onCheckout handler

### 2. Context Optimization

**Separate Contexts:**
- Consider splitting CartContext into:
  - CartStateContext (read-only state)
  - CartDispatchContext (methods only)
- Prevents unnecessary re-renders of components that only dispatch

**Selective Subscription:**
- Components only re-render when subscribed values change
- FloatingCartButton only re-renders when totalItems or totalPrice changes
- QuantityCounter only re-renders when its product's quantity changes

### 3. localStorage Optimization

**Debounce Writes:**
- Debounce localStorage persistence to 500ms
- Prevents excessive writes during rapid updates
- Improves performance on slow devices

**Lazy Restoration:**
- Restore from localStorage only once on mount
- Don't restore on every render

### 4. Component Optimization

**Code Splitting:**
- CheckoutModal can be lazy-loaded
- WhatsApp integration functions are tree-shakeable

**Avoid Inline Functions:**
- Define functions outside render
- Use useCallback for event handlers
- Prevents new function instances on each render

---

## Error Handling Patterns

### 1. localStorage Errors

```typescript
try {
  localStorage.setItem('katalogi_cart', JSON.stringify(state))
} catch (error) {
  if (error instanceof DOMException && error.code === 22) {
    // QuotaExceededError
    console.error('localStorage quota exceeded')
    // Fallback to in-memory state
  } else if (error instanceof SecurityError) {
    // Private browsing or restricted access
    console.error('localStorage not available')
    // Fallback to in-memory state
  }
}
```

### 2. WhatsApp Integration Errors

```typescript
// Missing WhatsApp number
if (!whatsappNumber) {
  showError('Nomor WhatsApp penjual belum dikonfigurasi')
  return
}

// Invalid phone number format
if (!isValidPhoneNumber(whatsappNumber)) {
  showError('Format nomor WhatsApp tidak valid')
  return
}

// URL construction failure
try {
  const url = constructWhatsAppUrl(phoneNumber, message)
  window.open(url, '_blank')
} catch (error) {
  showError('Gagal membuka WhatsApp')
}
```

### 3. Data Validation Errors

```typescript
// Invalid product data
if (!product.id || !product.name || product.price < 0) {
  console.error('Invalid product data:', product)
  // Skip rendering this product
  return null
}

// Invalid quantity
if (!Number.isInteger(quantity) || quantity < 0) {
  console.error('Invalid quantity:', quantity)
  // Reject the update
  return
}
```

### 4. User-Friendly Error Messages

All error messages in Indonesian:
- "Nomor WhatsApp penjual belum dikonfigurasi"
- "Format nomor WhatsApp tidak valid"
- "Gagal membuka WhatsApp"
- "Penyimpanan lokal penuh, data tidak dapat disimpan"
- "Terjadi kesalahan, silakan coba lagi"

---

## Testing Strategy

### Property-Based Testing (PBT)

Property-based testing is appropriate for this feature because:
- Core logic involves pure functions (message generation, calculations)
- Universal properties exist (cart invariants, round-trip serialization)
- Input space is large (many product combinations, quantities)
- Cost-effective to run 100+ iterations

**PBT Library:** fast-check (for TypeScript/JavaScript)

### Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Cart Total Price Invariant

**Property:** For any sequence of cart operations (add, remove, update), the totalPrice must always equal the sum of (price × quantity) for all items.

**Validates:** Requirements 1.5, 1.6

**Test Implementation:**
```typescript
// Generate random cart operations
// Verify: totalPrice === sum(item.price * item.quantity)
// Run 100+ iterations with varying product counts and quantities
```

### Property 2: Idempotent Add to Cart

**Property:** For any product already in cart, calling addToCart with the same product and quantity multiple times results in the same cart state (quantity increments once, not duplicates).

**Validates:** Requirement 1.3

**Test Implementation:**
```typescript
// Generate random product and quantity
// Add to cart twice
// Verify: cart has 1 item with quantity = original quantity
// Run 100+ iterations
```

### Property 3: Quantity Zero Removes Item

**Property:** For any item in cart, calling updateQuantity with quantity 0 removes the item from cart.

**Validates:** Requirement 1.4

**Test Implementation:**
```typescript
// Generate random cart with items
// Update quantity to 0 for random item
// Verify: item is removed from cart
// Run 100+ iterations
```

### Property 4: localStorage Round-Trip

**Property:** For any cart state, serializing to localStorage and deserializing produces an equivalent cart state.

**Validates:** Requirements 1.7, 1.8, 11.1

**Test Implementation:**
```typescript
// Generate random cart state
// Serialize to JSON and store
// Deserialize from JSON
// Verify: deserialized state equals original state
// Run 100+ iterations
```

### Property 5: WhatsApp Message Format

**Property:** For any cart state, the generated WhatsApp message contains all required structural components (header, items, separator, summary, footer) and is properly URL-encoded.

**Validates:** Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8

**Test Implementation:**
```typescript
// Generate random cart state
// Generate WhatsApp message
// Verify: message contains header, items, separator, summary, footer
// Verify: message is URL-encoded
// Verify: no invalid characters
// Run 100+ iterations
```

### Property 6: Item Subtotal Calculation

**Property:** For any cart item, the subtotal must equal price × quantity.

**Validates:** Requirement 4.3

**Test Implementation:**
```typescript
// Generate random item with price and quantity
// Calculate subtotal
// Verify: subtotal === price * quantity
// Run 100+ iterations
```

### Property 7: Price Formatting Consistency

**Property:** For any price value, formatting with Intl.NumberFormat (id-ID, IDR) produces a valid formatted string.

**Validates:** Requirements 3.8, 4.8

**Test Implementation:**
```typescript
// Generate random price values
// Format with Intl.NumberFormat
// Verify: formatted string is valid and contains "Rp"
// Run 100+ iterations
```

### Property 8: WhatsApp URL Construction

**Property:** For any valid phone number and message, the constructed WhatsApp URL has correct format and is properly encoded.

**Validates:** Requirement 6.4

**Test Implementation:**
```typescript
// Generate random valid phone number and message
// Construct WhatsApp URL
// Verify: URL matches pattern "https://api.whatsapp.com/send?phone=..."
// Verify: phone number is in URL
// Verify: message is URL-encoded in URL
// Run 100+ iterations
```

### Property 9: Phone Number Format Validation

**Property:** For any phone number input, validation correctly accepts 62XXXXXXXXXX and +62XXXXXXXXXX formats, and rejects invalid formats.

**Validates:** Requirement 7.2, 7.3

**Test Implementation:**
```typescript
// Generate random valid phone numbers (both formats)
// Generate random invalid phone numbers
// Verify: valid formats are accepted
// Verify: invalid formats are rejected
// Run 100+ iterations
```

### Property 10: Message Purity

**Property:** For any cart state, calling the message generation function multiple times with the same input produces identical output (pure function).

**Validates:** Requirement 5.11

**Test Implementation:**
```typescript
// Generate random cart state
// Call message generation function 3 times
// Verify: all 3 outputs are identical
// Run 100+ iterations
```

### Integration Tests

Integration tests verify external service behavior and infrastructure wiring (1-3 examples each):

1. **WhatsApp Integration:** Verify window.open() is called with correct URL
2. **localStorage Persistence:** Verify cart persists and restores correctly
3. **Theme Config Integration:** Verify primaryColor and WhatsApp number are read correctly
4. **Contact Block Integration:** Verify WhatsApp number is retrieved from Contact Block
5. **Hydration Safety:** Verify no hydration mismatch errors occur
6. **Error Handling:** Verify error messages display correctly for various error scenarios

### Unit Tests

Unit tests verify specific examples and edge cases:

1. **Cart Operations:** Add, remove, update quantity operations
2. **Quantity Counter:** Increment, decrement, remove at zero
3. **Modal Open/Close:** Modal state management
4. **Price Formatting:** Various price values
5. **Phone Number Validation:** Valid and invalid formats
6. **Message Generation:** Various cart states

---

## Implementation Checklist

### Phase 1: Core Cart System
- [ ] Create CartContext with useReducer
- [ ] Implement CartProvider component
- [ ] Add localStorage persistence with debouncing
- [ ] Create useCart custom hook
- [ ] Write property-based tests for cart invariants

### Phase 2: UI Components
- [ ] Create QuantityCounter component
- [ ] Create FloatingCartButton component
- [ ] Create CheckoutModal component
- [ ] Update CatalogBlock to use cart context
- [ ] Add 'use client' directives

### Phase 3: WhatsApp Integration
- [ ] Implement message generation function
- [ ] Implement WhatsApp URL construction
- [ ] Add phone number validation
- [ ] Implement window.open() integration
- [ ] Write property-based tests for message generation

### Phase 4: Hydration & Performance
- [ ] Implement hydration-safe patterns
- [ ] Add React.memo to components
- [ ] Add useCallback to handlers
- [ ] Add useMemo to expensive computations
- [ ] Test hydration with Next.js build

### Phase 5: Error Handling & Polish
- [ ] Add error handling for localStorage
- [ ] Add error handling for WhatsApp integration
- [ ] Add user-friendly error messages
- [ ] Add accessibility features
- [ ] Test on mobile devices

---

## File Structure

```
src/
├── components/
│   ├── blocks/
│   │   └── CatalogBlock.tsx (updated)
│   ├── cart/
│   │   ├── CartProvider.tsx
│   │   ├── CartContext.ts
│   │   ├── QuantityCounter.tsx
│   │   ├── FloatingCartButton.tsx
│   │   └── CheckoutModal.tsx
│   └── whatsapp/
│       └── whatsappIntegration.ts
├── hooks/
│   └── useCart.ts
├── types/
│   └── cart.ts
└── lib/
    └── cartUtils.ts
```

---

## Key Implementation Considerations

1. **'use client' Directives:** Mark CartProvider and CatalogBlock with 'use client'
2. **Hydration Safety:** Use useEffect for browser-dependent operations
3. **Type Safety:** Define all interfaces and avoid 'any' type
4. **Performance:** Memoize components and functions appropriately
5. **Error Handling:** Gracefully handle localStorage and WhatsApp errors
6. **Testing:** Write property-based tests for core logic
7. **Accessibility:** Ensure keyboard navigation and screen reader support
8. **Mobile:** Test on various screen sizes and touch devices

---

## Next Steps

1. Review this design document with stakeholders
2. Proceed to task creation phase
3. Implement components following the specifications
4. Write and run property-based tests
5. Conduct integration testing
6. Deploy to production
