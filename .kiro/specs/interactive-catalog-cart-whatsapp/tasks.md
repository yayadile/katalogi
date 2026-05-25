# Implementation Plan: Interactive Catalog with Cart & WhatsApp Checkout

## Overview

This document outlines all implementation tasks for the interactive catalog feature with shopping cart and WhatsApp integration. Tasks are organized by phase with clear dependencies, including property-based testing tasks and integration testing tasks.

The feature transforms the static CatalogBlock into an interactive e-commerce system with:
- Client-side cart management using React Context
- Interactive quantity counters for each product
- Floating cart button with order summary
- Checkout modal for order review
- WhatsApp integration for direct order messaging
- Full hydration safety and performance optimization

## Tasks

---

## Phase 1: Core Cart System & Type Definitions

### 1.1 Create TypeScript Type Definitions for Cart System

**Depends on:** None

**Description:** Define all TypeScript interfaces and types needed for the cart system, including CartItem, CartState, CartContextType, and related types.

**Acceptance Criteria:**
- [x] Create `src/types/cart.ts` with all required interfaces
- [x] Define CartItem interface with: id, name, price, quantity, image, description
- [x] Define CartState interface with: items, totalPrice, totalItems
- [x] Define CartContextType interface with all methods: addToCart, removeFromCart, updateQuantity, clearCart, getCartItem
- [x] Define CatalogItem and CatalogContent interfaces
- [x] Define WhatsAppConfig interface
- [x] All types use strict TypeScript (no 'any' type)
- [x] Export all types for use in other modules

**Details:**
- File: `src/types/cart.ts`
- No external dependencies required
- Pure type definitions only

---

### 1.2 Create CartContext and CartProvider Component

**Depends on:** 1.1

**Description:** Implement React Context for cart state management with useReducer, localStorage persistence, and all required methods.

**Acceptance Criteria:**
- [x] Create `src/components/cart/CartContext.ts` with CartContext definition
- [x] Create `src/components/cart/CartProvider.tsx` with 'use client' directive
- [x] Implement useReducer with actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
- [x] Implement addToCart method that updates quantity if product exists (Req 1.3)
- [x] Implement removeFromCart method
- [x] Implement updateQuantity method that removes item at quantity 0 (Req 1.4)
- [x] Implement clearCart method
- [x] Implement getCartItem method
- [x] Calculate totalPrice correctly: sum(price × quantity) (Req 1.5)
- [x] Calculate totalItems correctly: sum(quantity) (Req 1.6)
- [x] Persist cart to localStorage with key 'katalogi_cart' (Req 1.7)
- [x] Restore cart from localStorage on mount (Req 1.8)
- [x] Use 'use client' directive (Req 1.9)
- [x] Implement debounced localStorage writes (500ms)
- [x] Handle localStorage errors gracefully (quota exceeded, security errors)
- [x] Validate localStorage data before restore

**Details:**
- File: `src/components/cart/CartContext.ts`
- File: `src/components/cart/CartProvider.tsx`
- Use useReducer for state management
- Use useEffect for localStorage operations
- Debounce localStorage writes to prevent performance issues
- Handle hydration mismatch by deferring localStorage access to useEffect

---

### 1.3 Create useCart Custom Hook

**Depends on:** 1.2

**Description:** Create a custom hook to simplify accessing cart context in components.

**Acceptance Criteria:**
- [x] Create `src/hooks/useCart.ts`
- [x] Export useCart hook that returns CartContextType
- [x] Throw error if used outside CartProvider
- [x] Provide convenient access to cart state and methods

**Details:**
- File: `src/hooks/useCart.ts`
- Simple wrapper around useContext(CartContext)
- Error handling for missing provider

---

### 1.4 Write Property-Based Tests for Cart Invariants

**Depends on:** 1.2, 1.3

**Description:** Write property-based tests to verify cart mathematical invariants hold across all operations.

**Acceptance Criteria:**
- [-] Create `src/components/cart/CartProvider.test.ts`
- [~] **Property 1: Cart Total Price Invariant** - For any sequence of cart operations, totalPrice always equals sum(price × quantity)
  - Validates: Requirements 1.5, 1.6
  - Generate random cart operations (add, remove, update)
  - Verify invariant holds for 100+ iterations
- [~] **Property 2: Idempotent Add to Cart** - Adding same product multiple times results in quantity increment, not duplication
  - Validates: Requirement 1.3
  - Generate random product and quantity
  - Add to cart twice
  - Verify cart has 1 item with correct quantity
  - Run 100+ iterations
- [~] **Property 3: Quantity Zero Removes Item** - Updating quantity to 0 removes item from cart
  - Validates: Requirement 1.4
  - Generate random cart with items
  - Update quantity to 0
  - Verify item is removed
  - Run 100+ iterations
- [~] **Property 4: localStorage Round-Trip** - Serializing and deserializing cart state produces equivalent state
  - Validates: Requirements 1.7, 1.8, 11.1
  - Generate random cart state
  - Serialize to JSON and deserialize
  - Verify deserialized state equals original
  - Run 100+ iterations
- [~] Use fast-check for property-based testing
- [~] All tests pass

**Details:**
- File: `src/components/cart/CartProvider.test.ts`
- Use fast-check library for PBT
- Test framework: vitest (or existing test framework)
- Run with: `npm run test`


---

## Phase 2: UI Components - Quantity Counter & Cart Display

### 2.1 Create QuantityCounter Component

**Depends on:** 1.3

**Description:** Implement the quantity counter UI component with increment/decrement buttons.

**Acceptance Criteria:**
- [~] Create `src/components/cart/QuantityCounter.tsx`
- [~] Display [-] [quantity] [+] buttons (Req 2.3)
- [~] Decrease quantity on [-] click (Req 2.4)
- [~] Remove item when quantity reaches 0 (Req 2.5)
- [~] Increase quantity on [+] click (Req 2.6)
- [~] Display current quantity from cart (Req 2.7)
- [~] Apply primaryColor to buttons (Req 2.9)
- [~] Wrap with React.memo for optimization (Req 12.3)
- [~] Use useCallback for click handlers (Req 12.2)
- [~] Minimum touch target size 44x44px (Req 15.1)
- [~] Keyboard accessible with Tab navigation (Req 14.1)
- [~] Proper ARIA labels (Req 14.2)
- [~] Responsive design for mobile and desktop

**Details:**
- File: `src/components/cart/QuantityCounter.tsx`
- Props: productId, currentQuantity, onQuantityChange, primaryColor
- Use useCallback for memoization
- Wrap with React.memo
- Tailwind CSS for styling

---

### 2.2 Create FloatingCartButton Component

**Depends on:** 1.3

**Description:** Implement sticky cart button that displays cart summary.

**Acceptance Criteria:**
- [~] Create `src/components/cart/FloatingCartButton.tsx`
- [~] Only render when cart has ≥1 item (Req 3.1, 3.2)
- [~] Display format: "🛒 [totalItems] item - Rp [totalPrice]" (Req 3.3)
- [~] Apply primaryColor as background (Req 3.4)
- [~] Open CheckoutModal on click (Req 3.5)
- [~] Sticky position at bottom of screen (Req 3.6)
- [~] Production-ready styling with padding (Req 3.7)
- [~] Format price with Intl.NumberFormat (id-ID, IDR) (Req 3.8)
- [~] Display even with zero total price (Req 3.9)
- [~] Wrap with React.memo (Req 12.4)
- [~] Only re-render when totalItems or totalPrice changes
- [ ] Responsive design for mobile and desktop
- [~] Not overlap important content on mobile (Req 3.2)

**Details:**
- File: `src/components/cart/FloatingCartButton.tsx`
- Props: totalItems, totalPrice, primaryColor, onCheckout
- Use React.memo for optimization
- Tailwind CSS for styling
- Sticky positioning with z-index management

---

### 2.3 Create CheckoutModal Component

**Depends on:** 1.3

**Description:** Implement modal dialog for order review before checkout.

**Acceptance Criteria:**
- [~] Create `src/components/cart/CheckoutModal.tsx`
- [~] Display modal with overlay (Req 4.1)
- [~] List all cart items with: name, quantity, unit price, subtotal (Req 4.2)
- [~] Calculate subtotal per item: price × quantity (Req 4.3)
- [~] Display total price at bottom (Req 4.4)
- [~] Display "Kirim Pesanan via WhatsApp" button (Req 4.5)
- [~] Display "Lanjut Belanja" button to close (Req 4.6)
- [~] Close modal on "Lanjut Belanja" click (Req 4.7)
- [~] Format prices with Intl.NumberFormat (id-ID, IDR) (Req 4.8)
- [~] Display product image thumbnails (Req 4.9)
- [~] Responsive design: max-width 500px desktop, full-width mobile (Req 4.10)
- [~] Close button (X) in top-right corner (Req 4.5)
- [~] Smooth open/close animations (Req 10.8)
- [~] Keyboard accessible (Req 14.3, 14.4)
- [~] Focus management and focus trap (Req 14.8)
- [~] Handle close gracefully in inconsistent state (Req 4.11)

**Details:**
- File: `src/components/cart/CheckoutModal.tsx`
- Props: isOpen, items, totalPrice, totalItems, primaryColor, whatsappNumber, onClose, onCheckout
- Use Tailwind CSS for styling
- Implement focus trap for accessibility
- Smooth animations with CSS transitions

---

## Phase 3: WhatsApp Integration

### 3.1 Create WhatsApp Message Generation Function

**Depends on:** 1.1

**Description:** Implement pure function to generate structured WhatsApp messages from cart state.

**Acceptance Criteria:**
- [~] Create `src/components/whatsapp/whatsappIntegration.ts`
- [~] Implement generateWhatsAppMessage(cartState) function
- [~] Include header: "Halo, saya ingin memesan produk berikut:" (Req 5.3)
- [~] List items with format: "[No]. [Product_Name] x[Quantity] = Rp[Subtotal]" (Req 5.4)
- [~] Include separator line "---" (Req 5.5)
- [~] Display summary: "Total: [totalItems] item | Rp[totalPrice]" (Req 5.6)
- [~] Include footer: "Terima kasih, tunggu konfirmasi dari Anda." (Req 5.7)
- [~] Enforce all structural components (Req 5.2)
- [~] URL-encode message (Req 5.8)
- [~] Avoid invalid special characters (Req 5.9)
- [~] Escape special characters in product names (Req 5.10)
- [~] Pure function with no side effects (Req 5.11)
- [~] Return object with: text, encodedText, url
- [~] Format prices with Intl.NumberFormat (id-ID, IDR)

**Details:**
- File: `src/components/whatsapp/whatsappIntegration.ts`
- Pure function implementation
- No localStorage or API calls
- Deterministic output for same input
- Testable with property-based testing

---

### 3.2 Create WhatsApp URL Construction Function

**Depends on:** 3.1

**Description:** Implement function to construct WhatsApp API URL with phone number and message.

**Acceptance Criteria:**
- [~] Implement constructWhatsAppUrl(phoneNumber, message) function
- [~] Construct URL: "https://api.whatsapp.com/send?phone=[PHONE]&text=[MESSAGE]" (Req 6.4)
- [~] Accept phone format: 62XXXXXXXXXX (Req 6.6)
- [~] Accept phone format: +62XXXXXXXXXX (Req 6.6)
- [~] Validate phone number format (Req 6.1)
- [~] Return complete WhatsApp URL
- [~] Handle URL encoding properly
- [~] Pure function with no side effects

**Details:**
- File: `src/components/whatsapp/whatsappIntegration.ts`
- Implement validatePhoneNumber(phoneNumber) helper
- Support both formats: 62XXXXXXXXXX and +62XXXXXXXXXX
- Normalize phone number to 62XXXXXXXXXX format

---

### 3.3 Create Phone Number Validation Function

**Depends on:** 3.2

**Description:** Implement phone number validation for WhatsApp integration.

**Acceptance Criteria:**
- [~] Implement validatePhoneNumber(phoneNumber) function
- [~] Accept format: 62XXXXXXXXXX (Req 7.2)
- [~] Accept format: +62XXXXXXXXXX (Req 7.2)
- [~] Reject format: 0XXXXXXXXXX (Req 7.2)
- [~] Reject invalid formats (Req 7.3)
- [~] Return boolean indicating validity
- [~] Pure function

**Details:**
- File: `src/components/whatsapp/whatsappIntegration.ts`
- Use regex for validation
- Support both international formats

---

### 3.4 Write Property-Based Tests for WhatsApp Message Generation

**Depends on:** 3.1, 3.2, 3.3

**Description:** Write property-based tests for WhatsApp message generation and URL construction.

**Acceptance Criteria:**
- [~] Create `src/components/whatsapp/whatsappIntegration.test.ts`
- [~] **Property 5: WhatsApp Message Format** - Generated message contains all required components and is properly URL-encoded
  - Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8
  - Generate random cart state
  - Generate WhatsApp message
  - Verify: contains header, items, separator, summary, footer
  - Verify: is URL-encoded
  - Verify: no invalid characters
  - Run 100+ iterations
- [~] **Property 8: WhatsApp URL Construction** - Constructed URL has correct format and is properly encoded
  - Validates: Requirement 6.4
  - Generate random valid phone number and message
  - Construct WhatsApp URL
  - Verify: URL matches pattern "https://api.whatsapp.com/send?phone=..."
  - Verify: phone number is in URL
  - Verify: message is URL-encoded
  - Run 100+ iterations
- [~] **Property 9: Phone Number Format Validation** - Validation correctly accepts valid formats and rejects invalid
  - Validates: Requirements 7.2, 7.3
  - Generate random valid phone numbers (both formats)
  - Generate random invalid phone numbers
  - Verify: valid formats accepted
  - Verify: invalid formats rejected
  - Run 100+ iterations
- [~] **Property 10: Message Purity** - Message generation is pure function (same input = same output)
  - Validates: Requirement 5.11
  - Generate random cart state
  - Call message generation 3 times
  - Verify: all outputs identical
  - Run 100+ iterations
- [ ] All tests pass

**Details:**
- File: `src/components/whatsapp/whatsappIntegration.test.ts`
- Use fast-check for PBT
- Test framework: vitest


---

## Phase 4: CatalogBlock Integration & Hydration

### 4.1 Update CatalogBlock Component for Interactive Cart

**Depends on:** 1.3, 2.1, 2.2, 2.3

**Description:** Update CatalogBlock to integrate with cart system and display interactive UI.

**Acceptance Criteria:**
- [~] Update `src/components/blocks/CatalogBlock.tsx`
- [~] Add 'use client' directive (Req 2.1, 8.1)
- [~] Render product grid with "Beli" button for each product (Req 2.2)
- [~] Replace button with QuantityCounter when product added (Req 2.3)
- [ ] Display current quantity from cart (Req 2.7)
- [~] Persist QuantityCounter state when user clicks elsewhere (Req 2.8)
- [~] Apply primaryColor to buttons and counter (Req 2.9)
- [~] Display product: image, name, description, price (Req 2.10)
- [~] Handle incomplete product data gracefully (Req 2.11)
- [~] Display FloatingCartButton when cart has items (Req 3.1)
- [~] Hide FloatingCartButton when cart empty (Req 3.2)
- [~] Integrate with CartContext via useCart hook
- [~] Manage local state: expandedItems (Set of product IDs)
- [~] Use useEffect for hydration-safe initialization (Req 8.4)
- [~] Prevent hydration mismatch (Req 8.8)
- [~] Use React.memo for optimization (Req 12.3)
- [~] Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop (Req 15.4)

**Details:**
- File: `src/components/blocks/CatalogBlock.tsx`
- Props: content (CatalogContent), primaryColor, whatsappNumber
- Local state: expandedItems (Set<string>)
- Use useEffect for hydration
- Integrate QuantityCounter, FloatingCartButton, CheckoutModal
- Tailwind CSS for responsive grid

---

### 4.2 Implement Hydration-Safe Patterns in CatalogBlock

**Depends on:** 4.1

**Description:** Ensure CatalogBlock renders identically on server and client to prevent hydration mismatch.

**Acceptance Criteria:**
- [~] Use 'use client' directive (Req 8.1)
- [~] Don't access window/document in render phase (Req 8.3)
- [~] Use useEffect for browser-dependent operations (Req 8.4)
- [~] Initialize state with server-safe defaults (Req 8.5)
- [~] Render placeholder for FloatingCartButton initially (Req 8.6)
- [~] Use isMounted flag for conditional rendering (Req 8.7)
- [~] Same content rendered on server and client (Req 8.8)
- [~] No hydration mismatch errors in console
- [~] Test with Next.js build and preview

**Details:**
- File: `src/components/blocks/CatalogBlock.tsx`
- Use useState with useEffect pattern
- Initialize expandedItems as empty Set
- Restore from cart context after mount
- Use isMounted flag for browser-dependent rendering

---

## Phase 5: WhatsApp Configuration & Integration

### 5.1 Update ContactSettings Component for WhatsApp Number

**Depends on:** 3.3

**Description:** Add WhatsApp number input field to Contact Block settings panel.

**Acceptance Criteria:**
- [~] Update `src/components/editor/settings/ContactSettings.tsx`
- [~] Add WhatsApp number input field (Req 7.1)
- [ ] Accept format: 62XXXXXXXXXX (Req 7.2)
- [ ] Accept format: +62XXXXXXXXXX (Req 7.2)
- [~] Validate format and display error if invalid (Req 7.3)
- [~] Store WhatsApp number in Contact Block content JSON (Req 7.4)
- [~] Display validation error message in Indonesian
- [~] Update immediately reflects in published website (Req 7.7)

**Details:**
- File: `src/components/editor/settings/ContactSettings.tsx`
- Add input field for WhatsApp number
- Use validatePhoneNumber function
- Store in block content

---

### 5.2 Implement WhatsApp Checkout Integration in CatalogBlock

**Depends on:** 4.1, 3.1, 3.2, 5.1

**Description:** Integrate WhatsApp checkout flow into CatalogBlock and CheckoutModal.

**Acceptance Criteria:**
- [~] Retrieve WhatsApp number from Contact Block or theme config (Req 6.1, 6.2)
- [~] Display error if WhatsApp number not configured (Req 6.3)
- [~] Construct WhatsApp URL with message (Req 6.4)
- [~] Use window.open() to open WhatsApp (Req 6.5)
- [~] Support international format: 62XXXXXXXXXX (Req 6.6)
- [~] Open WhatsApp chat with pre-filled message (Req 6.7)
- [~] Close modal after window.open() (Req 6.8)
- [~] Keep cart intact after checkout (Req 6.8)
- [~] Redirect to WhatsApp Web if app not installed (Req 6.9)
- [~] Pure client-side implementation (Req 6.10)
- [~] Handle errors gracefully with user-friendly messages

**Details:**
- File: `src/components/cart/CheckoutModal.tsx`
- Implement onCheckout handler
- Call generateWhatsAppMessage and constructWhatsAppUrl
- Use window.open(url, '_blank')
- Error handling for missing WhatsApp number

---

## Phase 6: Error Handling & Edge Cases

### 6.1 Implement Error Handling for localStorage

**Depends on:** 1.2

**Description:** Add robust error handling for localStorage operations.

**Acceptance Criteria:**
- [~] Handle QuotaExceededError gracefully (Req 13.2)
- [~] Fallback to in-memory cart when quota exceeded (Req 13.2)
- [~] Notify user: "Penyimpanan lokal penuh, data tidak dapat disimpan" (Req 13.2)
- [~] Handle SecurityError (private browsing) (Req 13.2)
- [~] Handle JSON parse errors (Req 13.2)
- [~] Fallback to empty cart on invalid data (Req 13.2)
- [~] Log errors to console for debugging (Req 13.8)
- [~] Continue operation with fallback state

**Details:**
- File: `src/components/cart/CartProvider.tsx`
- Try-catch blocks for localStorage operations
- Error logging in development mode
- User-friendly error messages in Indonesian

---

### 6.2 Implement Error Handling for WhatsApp Integration

**Depends on:** 5.2

**Description:** Add error handling for WhatsApp integration failures.

**Acceptance Criteria:**
- [ ] Display error if WhatsApp number not configured (Req 6.3)
- [~] Display error if WhatsApp number invalid (Req 6.3)
- [~] Display error if URL construction fails (Req 6.3)
- [~] Prevent window.open() if validation fails (Req 6.3)
- [~] User-friendly error messages in Indonesian (Req 13.7)
- [~] Log errors to console (Req 13.8)

**Details:**
- File: `src/components/cart/CheckoutModal.tsx`
- Validation before window.open()
- Error messages in Indonesian

---

### 6.3 Implement Error Handling for Product Data

**Depends on:** 4.1

**Description:** Handle incomplete or invalid product data gracefully.

**Acceptance Criteria:**
- [~] Skip rendering products with missing required fields (Req 2.11)
- [~] Log error for invalid products (Req 2.11)
- [~] Allow cart operations for valid products (Req 2.11)
- [~] Validate product data: id, name, price (Req 13.3)
- [~] Reject invalid quantity (negative, non-integer) (Req 13.4)
- [~] Maintain previous quantity on invalid input (Req 13.4)

**Details:**
- File: `src/components/blocks/CatalogBlock.tsx`
- Validation functions for product data
- Error logging

---

## Phase 7: Accessibility & Mobile Optimization

### 7.1 Implement Accessibility Features

**Depends on:** 2.1, 2.2, 2.3

**Description:** Add keyboard navigation and screen reader support.

**Acceptance Criteria:**
- [~] QuantityCounter buttons keyboard accessible (Req 14.1)
- [~] Tab navigation works correctly (Req 14.1)
- [~] FloatingCartButton has descriptive aria-label (Req 14.2)
- [~] CheckoutModal has proper ARIA roles and labels (Req 14.3)
- [~] Modal close button keyboard accessible (Req 14.4)
- [~] Product list has semantic HTML (Req 14.5)
- [~] Form inputs have associated labels (Req 14.6)
- [~] Color-only indicators have text alternative (Req 14.7)
- [~] Focus management in modal (Req 14.8)
- [~] Focus trap in modal (Req 14.8)
- [~] Focus restored on modal close (Req 14.8)

**Details:**
- Files: QuantityCounter, FloatingCartButton, CheckoutModal
- Add aria-label, aria-describedby attributes
- Semantic HTML: button, ul/li, proper heading hierarchy
- Focus management with useRef and useEffect
- Focus trap implementation

---

### 7.2 Optimize for Mobile Responsiveness

**Depends on:** 2.1, 2.2, 2.3, 4.1

**Description:** Ensure optimal mobile experience with proper touch targets and responsive layout.

**Acceptance Criteria:**
- [~] QuantityCounter buttons: minimum 44x44px touch target (Req 15.1)
- [~] FloatingCartButton doesn't overlap content on mobile (Req 15.2)
- [~] CheckoutModal full-width on mobile with padding (Req 15.3)
- [~] Product grid: 1 col mobile, 2 col tablet, 3 col desktop (Req 15.4)
- [~] Modal close button easily tappable on mobile (Req 15.5)
- [~] Text size minimum 16px (prevent iOS auto-zoom) (Req 15.6)
- [~] Handle landscape orientation gracefully (Req 15.7)
- [~] Test on various mobile devices

**Details:**
- Files: QuantityCounter, FloatingCartButton, CheckoutModal, CatalogBlock
- Tailwind CSS responsive classes
- Touch target sizing
- Viewport meta tag verification

---

## Phase 8: Performance Optimization

### 8.1 Implement Performance Optimizations

**Depends on:** 1.2, 2.1, 2.2, 2.3, 3.1

**Description:** Add memoization and optimization techniques to prevent unnecessary re-renders.

**Acceptance Criteria:**
- [~] CartContext updates don't cause unnecessary re-renders (Req 12.1)
- [~] QuantityCounter click handlers use useCallback (Req 12.2)
- [~] CatalogBlock wrapped with React.memo (Req 12.3)
- [~] FloatingCartButton only re-renders on totalItems/totalPrice change (Req 12.4)
- [~] WhatsApp message generation memoized with useMemo (Req 12.5)
- [~] localStorage operations debounced (Req 12.6)
- [~] No new function instances per render (Req 12.7)
- [~] Performance verified with React DevTools Profiler

**Details:**
- Files: CartProvider, QuantityCounter, FloatingCartButton, CatalogBlock, whatsappIntegration
- Use React.memo for components
- Use useCallback for handlers
- Use useMemo for expensive computations
- Debounce localStorage writes (500ms)

---

## Phase 9: Integration Testing

### 9.1 Write Integration Tests for WhatsApp Integration

**Depends on:** 5.2

**Description:** Test WhatsApp integration end-to-end.

**Acceptance Criteria:**
- [~] Create `src/components/cart/CheckoutModal.integration.test.ts`
- [~] Test 1: Verify window.open() called with correct URL format
  - Add items to cart
  - Open checkout modal
  - Click "Kirim Pesanan via WhatsApp"
  - Verify window.open() called with correct URL
- [~] Test 2: Verify window.open() called with correct phone number
  - Verify phone number in URL matches configured number
- [~] Test 3: Verify window.open() called with URL-encoded message
  - Verify message is properly encoded in URL
- [ ] All tests pass

**Details:**
- File: `src/components/cart/CheckoutModal.integration.test.ts`
- Mock window.open
- Test framework: vitest

---

### 9.2 Write Integration Tests for localStorage Persistence

**Depends on:** 1.2

**Description:** Test cart persistence across page reloads.

**Acceptance Criteria:**
- [~] Create `src/components/cart/CartProvider.integration.test.ts`
- [~] Test 1: Cart persists after page reload
  - Add items to cart
  - Simulate page reload
  - Verify cart restored with same items
- [~] Test 2: Cart persists across browser sessions
  - Add items to cart
  - Verify localStorage contains cart data
  - Simulate new browser session
  - Verify cart restored
- [~] Test 3: Cart clears when clearCart() called
  - Add items to cart
  - Call clearCart()
  - Verify localStorage cleared
- [ ] All tests pass

**Details:**
- File: `src/components/cart/CartProvider.integration.test.ts`
- Mock localStorage
- Test framework: vitest

---

### 9.3 Write Integration Tests for Theme Config Integration

**Depends on:** 4.1, 5.1

**Description:** Test that theme colors and WhatsApp number are read correctly.

**Acceptance Criteria:**
- [~] Create `src/components/blocks/CatalogBlock.integration.test.ts`
- [~] Test 1: primaryColor applied to buttons
  - Render CatalogBlock with primaryColor prop
  - Verify buttons have correct color
- [~] Test 2: WhatsApp number retrieved from Contact Block
  - Render CatalogBlock with whatsappNumber prop
  - Click checkout
  - Verify WhatsApp number used in URL
- [~] Test 3: Fallback to theme config if Contact Block missing
  - Render without whatsappNumber prop
  - Verify fallback behavior
- [ ] All tests pass

**Details:**
- File: `src/components/blocks/CatalogBlock.integration.test.ts`
- Test framework: vitest

---

### 9.4 Write Integration Tests for Hydration Safety

**Depends on:** 4.2

**Description:** Test that hydration mismatch doesn't occur.

**Acceptance Criteria:**
- [~] Create `src/components/blocks/CatalogBlock.hydration.test.ts`
- [~] Test 1: No hydration mismatch with Next.js build
  - Build Next.js project
  - Run preview
  - Verify no hydration errors in console
- [~] Test 2: Server and client render same content
  - Render CatalogBlock on server
  - Render CatalogBlock on client
  - Verify content matches
- [ ] All tests pass

**Details:**
- File: `src/components/blocks/CatalogBlock.hydration.test.ts`
- Test framework: vitest
- Run Next.js build and preview

---

## Phase 10: Unit Tests & Edge Cases

### 10.1 Write Unit Tests for QuantityCounter

**Depends on:** 2.1

**Description:** Test QuantityCounter component behavior.

**Acceptance Criteria:**
- [~] Create `src/components/cart/QuantityCounter.test.ts`
- [~] Test: Increment button increases quantity
- [~] Test: Decrement button decreases quantity
- [~] Test: Decrement at 1 removes item
- [~] Test: Displays current quantity
- [~] Test: Calls onQuantityChange with correct value
- [~] Test: Keyboard accessible
- [ ] All tests pass

**Details:**
- File: `src/components/cart/QuantityCounter.test.ts`
- Test framework: vitest
- Use React Testing Library

---

### 10.2 Write Unit Tests for FloatingCartButton

**Depends on:** 2.2

**Description:** Test FloatingCartButton component behavior.

**Acceptance Criteria:**
- [~] Create `src/components/cart/FloatingCartButton.test.ts`
- [~] Test: Renders when totalItems > 0
- [~] Test: Hidden when totalItems = 0
- [~] Test: Displays correct format
- [~] Test: Calls onCheckout on click
- [~] Test: Formats price correctly
- [~] Test: Applies primaryColor
- [ ] All tests pass

**Details:**
- File: `src/components/cart/FloatingCartButton.test.ts`
- Test framework: vitest

---

### 10.3 Write Unit Tests for CheckoutModal

**Depends on:** 2.3

**Description:** Test CheckoutModal component behavior.

**Acceptance Criteria:**
- [~] Create `src/components/cart/CheckoutModal.test.ts`
- [~] Test: Displays all cart items
- [~] Test: Calculates subtotals correctly
- [~] Test: Displays total price
- [~] Test: "Lanjut Belanja" closes modal
- [~] Test: "Kirim Pesanan" calls onCheckout
- [~] Test: Close button (X) closes modal
- [~] Test: Formats prices correctly
- [~] Test: Responsive layout
- [ ] All tests pass

**Details:**
- File: `src/components/cart/CheckoutModal.test.ts`
- Test framework: vitest

---

### 10.4 Write Unit Tests for Message Generation

**Depends on:** 3.1

**Description:** Test WhatsApp message generation with specific examples.

**Acceptance Criteria:**
- [~] Create `src/components/whatsapp/whatsappIntegration.unit.test.ts`
- [~] Test: Message includes header
- [~] Test: Message lists all items
- [~] Test: Message includes separator
- [~] Test: Message includes summary
- [~] Test: Message includes footer
- [~] Test: Message is URL-encoded
- [~] Test: Handles special characters
- [ ] Test: Formats prices correctly
- [ ] All tests pass

**Details:**
- File: `src/components/whatsapp/whatsappIntegration.unit.test.ts`
- Test framework: vitest

---

## Phase 11: Final Verification & Documentation

### 11.1 Verify All Requirements Met

**Depends on:** All previous tasks

**Description:** Verify that all requirements from requirements.md are implemented and tested.

**Acceptance Criteria:**
- [~] All 15 requirements implemented
- [~] All acceptance criteria met
- [~] All property-based tests pass
- [~] All integration tests pass
- [~] All unit tests pass
- [~] No hydration mismatch errors
- [~] No console errors or warnings
- [~] Performance acceptable (no unnecessary re-renders)
- [~] Accessibility verified (keyboard navigation, screen reader)
- [~] Mobile responsiveness verified
- [~] Error handling tested

**Details:**
- Comprehensive testing checklist
- Manual verification on multiple devices
- Cross-browser testing

---

### 11.2 Code Review & Documentation

**Depends on:** 11.1

**Description:** Review code quality and add documentation.

**Acceptance Criteria:**
- [~] All code follows TypeScript best practices
- [~] No 'any' types used
- [~] All functions have JSDoc comments
- [~] All components have prop documentation
- [~] Code is readable and maintainable
- [~] No dead code or unused imports
- [~] Consistent code style throughout

**Details:**
- Code review checklist
- JSDoc documentation
- README for cart system

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": ["1.1"],
      "description": "Type definitions foundation"
    },
    {
      "wave": 2,
      "tasks": ["1.2", "1.3"],
      "description": "Cart context and hook",
      "dependsOn": ["1.1"]
    },
    {
      "wave": 3,
      "tasks": ["2.1", "2.2", "2.3"],
      "description": "UI components (QuantityCounter, FloatingCartButton, CheckoutModal)",
      "dependsOn": ["1.3"]
    },
    {
      "wave": 4,
      "tasks": ["3.1", "3.2", "3.3"],
      "description": "WhatsApp integration functions",
      "dependsOn": ["1.1"]
    },
    {
      "wave": 5,
      "tasks": ["3.4"],
      "description": "Property-based tests for WhatsApp",
      "dependsOn": ["3.1", "3.2", "3.3"]
    },
    {
      "wave": 6,
      "tasks": ["4.1", "4.2"],
      "description": "CatalogBlock integration and hydration",
      "dependsOn": ["1.3", "2.1", "2.2", "2.3"]
    },
    {
      "wave": 7,
      "tasks": ["5.1", "5.2"],
      "description": "WhatsApp configuration and checkout",
      "dependsOn": ["3.3", "4.1"]
    },
    {
      "wave": 8,
      "tasks": ["6.1", "6.2", "6.3"],
      "description": "Error handling",
      "dependsOn": ["1.2", "5.2", "4.1"]
    },
    {
      "wave": 9,
      "tasks": ["7.1", "7.2"],
      "description": "Accessibility and mobile optimization",
      "dependsOn": ["2.1", "2.2", "2.3", "4.1"]
    },
    {
      "wave": 10,
      "tasks": ["8.1"],
      "description": "Performance optimization",
      "dependsOn": ["1.2", "2.1", "2.2", "2.3", "3.1"]
    },
    {
      "wave": 11,
      "tasks": ["9.1", "9.2", "9.3", "9.4"],
      "description": "Integration tests",
      "dependsOn": ["5.2", "1.2", "4.1", "4.2"]
    },
    {
      "wave": 12,
      "tasks": ["10.1", "10.2", "10.3", "10.4"],
      "description": "Unit tests",
      "dependsOn": ["2.1", "2.2", "2.3", "3.1"]
    },
    {
      "wave": 13,
      "tasks": ["11.1", "11.2"],
      "description": "Final verification and code review",
      "dependsOn": ["all"]
    }
  ]
}
```

---

## Testing Summary

### Property-Based Tests (10 properties)
- Property 1: Cart Total Price Invariant
- Property 2: Idempotent Add to Cart
- Property 3: Quantity Zero Removes Item
- Property 4: localStorage Round-Trip
- Property 5: WhatsApp Message Format
- Property 6: Item Subtotal Calculation
- Property 7: Price Formatting Consistency
- Property 8: WhatsApp URL Construction
- Property 9: Phone Number Format Validation
- Property 10: Message Purity

### Integration Tests (4 suites)
- WhatsApp Integration (3 tests)
- localStorage Persistence (3 tests)
- Theme Config Integration (3 tests)
- Hydration Safety (2 tests)

### Unit Tests (4 suites)
- QuantityCounter (7 tests)
- FloatingCartButton (7 tests)
- CheckoutModal (9 tests)
- Message Generation (9 tests)

**Total: 10 PBT properties + 11 integration tests + 32 unit tests = 53 tests**



## Notes

### Implementation Guidelines

1. **'use client' Directives:** Mark CartProvider and CatalogBlock with 'use client' directive to ensure components run on client-side only.

2. **Hydration Safety:** Use useEffect for all browser-dependent operations (localStorage access, window object access) to prevent hydration mismatch errors.

3. **Type Safety:** Maintain strict TypeScript throughout - no 'any' types except for truly dynamic JSON parsing.

4. **Performance:** Use React.memo, useCallback, and useMemo appropriately to prevent unnecessary re-renders.

5. **Testing Strategy:** 
   - Write 10 property-based tests for core logic (cart invariants, message generation, URL construction)
   - Write 11 integration tests for external service behavior (WhatsApp, localStorage, theme config)
   - Write 32 unit tests for component behavior and edge cases
   - Total: 53 tests

6. **Error Handling:** All error messages should be in Indonesian (Bahasa Indonesia) and user-friendly.

7. **localStorage Persistence:** Debounce writes to 500ms to prevent performance issues. Handle quota exceeded and security errors gracefully.

8. **WhatsApp Integration:** Pure client-side implementation using window.open() with WhatsApp Web API. No backend required.

9. **Accessibility:** Ensure keyboard navigation, screen reader support, and proper ARIA labels throughout.

10. **Mobile Optimization:** Test on various devices. Ensure 44x44px minimum touch targets and responsive layouts.

### Testing Framework

- **Property-Based Testing:** fast-check library
- **Unit & Integration Tests:** vitest
- **React Testing:** React Testing Library

### File Structure

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
│   │   ├── CheckoutModal.tsx
│   │   ├── CartProvider.test.ts
│   │   ├── CartProvider.integration.test.ts
│   │   ├── QuantityCounter.test.ts
│   │   ├── FloatingCartButton.test.ts
│   │   └── CheckoutModal.test.ts
│   └── whatsapp/
│       ├── whatsappIntegration.ts
│       ├── whatsappIntegration.test.ts
│       └── whatsappIntegration.unit.test.ts
├── hooks/
│   └── useCart.ts
├── types/
│   └── cart.ts
└── lib/
    └── cartUtils.ts
```

### Key Considerations

- **Next.js Version:** This project uses Next.js 15+ with App Router. Refer to `node_modules/next/dist/docs/` for latest APIs.
- **Hydration:** Server renders components, client hydrates. Ensure identical rendering on both sides.
- **localStorage:** Not available on server. Always access in useEffect after mount.
- **Performance:** Avoid creating new function instances on each render. Use useCallback and React.memo.
- **Type Safety:** Define interfaces for all data structures. Validate external data before use.

### Verification Checklist

Before marking tasks complete:
- [ ] All acceptance criteria met
- [~] All tests pass (PBT, integration, unit)
- [ ] No hydration mismatch errors
- [ ] No console errors or warnings
- [~] TypeScript compilation successful
- [~] Code follows project conventions
- [~] Accessibility verified
- [ ] Mobile responsiveness verified
- [~] Performance acceptable

