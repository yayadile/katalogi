# Requirements Document: Interactive Catalog with Cart & WhatsApp Checkout

## Introduction

Katalogi platform saat ini menampilkan produk secara statis dalam Catalog Block. Fitur ini mengubah Catalog Block menjadi sistem interaktif yang memungkinkan pengunjung website untuk:

1. Menambahkan produk ke keranjang dengan quantity counter
2. Mengelola keranjang belanja (tambah, kurangi, hapus item)
3. Melihat ringkasan belanja dalam modal checkout
4. Mengirim pesanan langsung ke WhatsApp penjual dengan format terstruktur

Fitur ini meningkatkan user experience dan conversion rate dengan membuat proses pembelian lebih intuitif dan terintegrasi dengan WhatsApp, platform komunikasi yang sudah familiar bagi pengguna Indonesia.

---

## Glossary

- **Catalog_Block**: Komponen React yang menampilkan daftar produk dengan kemampuan interaktif
- **Cart**: Keranjang belanja yang menyimpan item produk dengan quantity
- **Cart_Item**: Objek yang merepresentasikan produk dalam keranjang dengan properti: id, name, price, quantity, image, description
- **Cart_State**: State management untuk menyimpan dan mengelola cart items di client-side
- **Quantity_Counter**: UI component yang menampilkan tombol [-] [jumlah] [+] untuk mengubah jumlah item
- **Floating_Cart_Button**: Sticky button/bar yang muncul di bawah layar ketika ada item dalam keranjang
- **Checkout_Modal**: Dialog yang menampilkan ringkasan belanja sebelum checkout
- **WhatsApp_Integration**: Integrasi dengan WhatsApp API untuk mengirim pesan pesanan
- **Product_Data**: Struktur data produk dengan properti: id, name, price, image, description
- **Theme_Config**: Konfigurasi tema website yang tersimpan di database (primaryColor, fontFamily, dll)
- **Contact_Block**: Blok kontak yang menyimpan informasi WhatsApp penjual
- **Hydration_Mismatch**: Error yang terjadi ketika server-rendered HTML tidak cocok dengan client-rendered HTML
- **Client_Component**: Komponen React yang di-mark dengan 'use client' directive untuk berjalan di browser

---

## Requirements

### Requirement 1: Cart State Management dengan React Context

**User Story:** Sebagai developer, saya ingin mengelola state keranjang belanja secara terpusat, sehingga semua komponen dapat mengakses dan memodifikasi cart dengan konsisten.

#### Acceptance Criteria

1. THE CartContext SHALL provide cart state dengan properti: cartItems (array), totalPrice (number), totalItems (number)
2. THE CartContext SHALL provide methods: addToCart(product, quantity), removeFromCart(productId), updateQuantity(productId, quantity), clearCart(), getCartItem(productId)
3. WHEN addToCart dipanggil dengan product yang sudah ada di cart, THE CartContext SHALL update quantity item tersebut, bukan menambah item baru
4. WHEN updateQuantity dipanggil dengan quantity 0, THE CartContext SHALL menghapus item dari cart
5. THE CartContext SHALL calculate totalPrice dengan formula: sum(cartItem.price × cartItem.quantity) untuk semua items
6. THE CartContext SHALL calculate totalItems dengan formula: sum(cartItem.quantity) untuk semua items
7. THE CartContext SHALL persist cart state ke localStorage dengan key 'katalogi_cart' untuk mempertahankan data saat page refresh
8. WHEN page di-load, THE CartContext SHALL restore cart state dari localStorage jika tersedia
9. THE CartProvider component SHALL wrap aplikasi dengan 'use client' directive untuk memastikan context berjalan di client-side
10. WHERE cart state berubah, THE CartContext SHALL trigger re-render hanya pada komponen yang subscribe ke context tersebut

---

### Requirement 2: Interactive Catalog Block dengan Quantity Counter

**User Story:** Sebagai pengunjung website, saya ingin dapat menambahkan produk ke keranjang dengan mudah menggunakan quantity counter, sehingga saya dapat membeli multiple items dengan cepat.

#### Acceptance Criteria

1. THE CatalogBlock component SHALL render dengan 'use client' directive untuk menghindari hydration mismatch
2. WHEN page pertama kali di-load, THE CatalogBlock SHALL display tombol "Beli" untuk setiap produk
3. WHEN tombol "Beli" diklik, THE CatalogBlock SHALL replace tombol dengan Quantity_Counter yang menampilkan [-] [1] [+]
4. WHEN tombol [-] diklik pada Quantity_Counter, THE CatalogBlock SHALL decrease quantity sebesar 1
5. WHEN quantity mencapai 0 setelah tombol [-] diklik, THE CatalogBlock SHALL remove item dari cart dan replace Quantity_Counter dengan tombol "Beli" kembali
6. WHEN tombol [+] diklik pada Quantity_Counter, THE CatalogBlock SHALL increase quantity sebesar 1
7. WHEN Quantity_Counter ditampilkan, THE CatalogBlock SHALL display current quantity dari cart untuk produk tersebut
8. WHEN user mengklik produk lain atau area lain di halaman, THE Quantity_Counter state untuk produk tersebut SHALL persist (tidak hilang)
9. THE CatalogBlock SHALL apply primaryColor dari theme config ke tombol "Beli" dan Quantity_Counter
10. THE CatalogBlock SHALL display product image, name, description, dan price sesuai dengan data dari database
11. WHERE database query fails atau product data incomplete, THE CatalogBlock SHALL allow cart operations untuk items yang berhasil di-load

---

### Requirement 3: Floating Cart Button / Sticky Cart Bar

**User Story:** Sebagai pengunjung website, saya ingin melihat ringkasan keranjang saya yang selalu terlihat, sehingga saya dapat dengan mudah melihat total item dan harga kapan saja.

#### Acceptance Criteria

1. WHEN cart memiliki ≥1 item, THE CatalogBlock SHALL display Floating_Cart_Button di bawah layar (sticky position)
2. WHEN cart kosong (0 items), THE Floating_Cart_Button SHALL tidak ditampilkan
3. THE Floating_Cart_Button SHALL display total items dan total price dalam format: "🛒 [totalItems] item - Rp [totalPrice]"
4. THE Floating_Cart_Button SHALL apply primaryColor dari theme config sebagai background color
5. WHEN Floating_Cart_Button diklik, THE CatalogBlock SHALL open Checkout_Modal
6. THE Floating_Cart_Button SHALL remain visible saat user scroll halaman (sticky position)
7. THE Floating_Cart_Button SHALL display dengan padding dan styling yang rapi dan production-ready
8. THE Floating_Cart_Button SHALL format totalPrice menggunakan Intl.NumberFormat dengan locale 'id-ID' dan currency 'IDR'
9. WHEN cart memiliki items dengan total price = 0, THE Floating_Cart_Button SHALL still display

---

### Requirement 4: Checkout Modal dengan Item Summary

**User Story:** Sebagai pengunjung website, saya ingin melihat ringkasan lengkap pesanan saya sebelum checkout, sehingga saya dapat memverifikasi item, quantity, dan total harga.

#### Acceptance Criteria

1. WHEN Floating_Cart_Button atau tombol checkout diklik, THE CatalogBlock SHALL display Checkout_Modal
2. THE Checkout_Modal SHALL display daftar semua cart items dengan kolom: product name, quantity, unit price, subtotal
3. THE Checkout_Modal SHALL calculate dan display subtotal untuk setiap item dengan formula: price × quantity
4. THE Checkout_Modal SHALL display total harga keseluruhan di bagian bawah modal
5. THE Checkout_Modal SHALL display tombol "Kirim Pesanan via WhatsApp" dengan styling yang prominent
6. THE Checkout_Modal SHALL display tombol "Lanjut Belanja" atau "Tutup" untuk menutup modal tanpa checkout
7. WHEN tombol "Lanjut Belanja" diklik, THE Checkout_Modal SHALL close dan user kembali ke halaman catalog
8. THE Checkout_Modal SHALL format semua harga menggunakan Intl.NumberFormat dengan locale 'id-ID' dan currency 'IDR'
9. THE Checkout_Modal SHALL display product images thumbnail untuk setiap item (opsional tapi recommended)
10. THE Checkout_Modal SHALL display dengan responsive design yang baik di mobile dan desktop
11. WHEN tombol "Lanjut Belanja" diklik dalam inconsistent state, THE system SHALL handle close operation gracefully

---

### Requirement 5: WhatsApp Integration - Message Generation

**User Story:** Sebagai penjual, saya ingin pesanan pelanggan dikirim ke WhatsApp saya dalam format terstruktur yang mudah dibaca, sehingga saya dapat memproses pesanan dengan cepat.

#### Acceptance Criteria

1. WHEN tombol "Kirim Pesanan via WhatsApp" diklik, THE CatalogBlock SHALL generate pesan WhatsApp dengan format terstruktur
2. THE WhatsApp message SHALL enforce all structural components: header, item list, separator, summary, footer
3. THE WhatsApp message SHALL include header dengan greeting ramah: "Halo, saya ingin memesan produk berikut:"
4. THE WhatsApp message SHALL list setiap cart item dengan format: "[No]. [Product_Name] x[Quantity] = Rp[Subtotal]"
5. THE WhatsApp message SHALL include separator line (---) antara item list dan summary
6. THE WhatsApp message SHALL display total items dan total price dengan format: "Total: [totalItems] item | Rp[totalPrice]"
7. THE WhatsApp message SHALL include footer dengan pesan ramah: "Terima kasih, tunggu konfirmasi dari Anda."
8. THE WhatsApp message text SHALL be URL-encoded untuk kompatibilitas dengan WhatsApp API
9. THE WhatsApp message SHALL NOT include special characters yang tidak support di WhatsApp (emoji boleh, tapi hindari karakter unicode kompleks)
10. WHERE product name atau description mengandung karakter khusus, THE message generation SHALL escape atau remove karakter tersebut
11. THE message generation function SHALL be pure function yang tidak memiliki side effects

---

### Requirement 6: WhatsApp Integration - API Integration

**User Story:** Sebagai pengunjung website, saya ingin dapat mengirim pesanan langsung ke WhatsApp penjual dengan satu klik, sehingga proses checkout menjadi seamless.

#### Acceptance Criteria

1. WHEN tombol "Kirim Pesanan via WhatsApp" diklik, THE CatalogBlock SHALL retrieve WhatsApp number dari Contact_Block atau theme config
2. THE WhatsApp number SHALL be stored di website.themeConfig atau di Contact_Block content
3. WHEN WhatsApp number tidak tersedia, THE CatalogBlock SHALL display error message: "Nomor WhatsApp penjual belum dikonfigurasi"
4. THE CatalogBlock SHALL construct WhatsApp URL dengan format: "https://api.whatsapp.com/send?phone=[PHONE_NUMBER]&text=[ENCODED_MESSAGE]"
5. WHEN WhatsApp URL di-construct, THE CatalogBlock SHALL use window.open() untuk membuka URL di tab baru
6. THE WhatsApp number SHALL be in format international: 62XXXXXXXXXX (tanpa +, tanpa 0 di awal)
7. WHEN window.open() dipanggil, THE browser SHALL open WhatsApp chat dengan pesan pre-filled
8. AFTER WhatsApp window dibuka, THE Checkout_Modal SHALL close dan cart SHALL remain intact (tidak auto-clear)
9. WHERE user tidak memiliki WhatsApp installed, THE window.open() SHALL redirect ke WhatsApp Web
10. THE WhatsApp integration SHALL NOT require backend API call (pure client-side implementation)

---

### Requirement 7: WhatsApp Number Configuration

**User Story:** Sebagai penjual, saya ingin mengkonfigurasi nomor WhatsApp saya di website builder, sehingga pesanan pelanggan dapat dikirim ke nomor yang benar.

#### Acceptance Criteria

1. THE Contact_Block settings panel SHALL include field untuk input WhatsApp number
2. THE WhatsApp number field SHALL accept format: 62XXXXXXXXXX atau +62XXXXXXXXXX
3. WHEN WhatsApp number di-input, THE system SHALL validate format dan display error jika invalid
4. THE WhatsApp number SHALL be stored di Contact_Block content JSON
5. WHERE WhatsApp number tidak tersedia di Contact_Block, THE CatalogBlock SHALL fallback ke website.themeConfig.whatsapp
6. THE WhatsApp number SHALL be accessible dari CatalogBlock component via props atau context
7. WHEN WhatsApp number di-update di editor, THE change SHALL immediately reflect di published website
8. THE WhatsApp number SHALL always be encrypted atau masked di database regardless of security settings

---

### Requirement 8: Hydration Mismatch Prevention

**User Story:** Sebagai developer, saya ingin memastikan tidak ada hydration mismatch error, sehingga website dapat render dengan sempurna di server dan client.

#### Acceptance Criteria

1. THE CatalogBlock component SHALL be marked dengan 'use client' directive
2. THE CartProvider component SHALL be marked dengan 'use client' directive
3. WHEN CatalogBlock di-render, THE component SHALL NOT access browser APIs (window, document, localStorage) di render phase
4. THE CatalogBlock SHALL use useEffect hook untuk initialize browser-dependent state setelah component mount
5. WHEN cart state di-restore dari localStorage, THE operation SHALL happen di useEffect jika actual data restoration terjadi
6. THE CatalogBlock SHALL render placeholder atau skeleton untuk Floating_Cart_Button di server, kemudian hydrate di client
7. WHERE conditional rendering bergantung pada browser state, THE CatalogBlock SHALL use useEffect untuk set flag setelah mount
8. THE component SHALL NOT render different content di server vs client untuk same props

---

### Requirement 9: TypeScript Type Safety

**User Story:** Sebagai developer, saya ingin memiliki type safety yang ketat, sehingga saya dapat menangkap error di compile time dan mengurangi bugs di production.

#### Acceptance Criteria

1. THE CartContext SHALL define TypeScript interfaces: CartItem, CartContextType, CartProviderProps
2. THE CatalogBlock component SHALL define TypeScript types untuk props: CatalogBlockProps, CatalogContent, CatalogItem
3. THE WhatsApp integration functions SHALL have explicit return types dan parameter types
4. ALL functions SHALL NOT use 'any' type (kecuali untuk JSON parsing yang truly dynamic)
5. THE CartContext methods SHALL have strict parameter validation dengan TypeScript
6. WHERE external data (dari database atau API) di-receive, THE component SHALL validate dan cast ke correct type
7. THE component SHALL use 'as const' untuk string literals yang digunakan sebagai keys atau identifiers

---

### Requirement 10: Styling dan UI/UX

**User Story:** Sebagai pengunjung website, saya ingin interface yang rapi, responsive, dan konsisten dengan theme website, sehingga pengalaman berbelanja menjadi menyenangkan.

#### Acceptance Criteria

1. THE Quantity_Counter SHALL display dengan styling yang konsisten dengan tombol "Beli"
2. THE Floating_Cart_Button SHALL use primaryColor dari theme config sebagai background
3. THE Checkout_Modal SHALL use Tailwind CSS untuk styling dan responsive design
4. THE Checkout_Modal SHALL display dengan max-width 500px di desktop dan full-width di mobile
5. THE Checkout_Modal SHALL include close button (X) di top-right corner
6. THE Quantity_Counter buttons SHALL have hover effect dan disabled state jika quantity sudah 0
7. THE Floating_Cart_Button SHALL have shadow dan rounded corners untuk visual hierarchy
8. THE Checkout_Modal SHALL use smooth transitions dan animations untuk open/close
9. THE component styling SHALL follow Tailwind CSS best practices dan avoid inline styles (kecuali untuk dynamic colors)
10. THE Floating_Cart_Button SHALL always use the theme's primaryColor regardless of contrast ratio

---

### Requirement 11: Data Persistence dan State Management

**User Story:** Sebagai pengunjung website, saya ingin cart saya tetap ada meskipun saya refresh halaman atau menutup browser, sehingga saya tidak perlu menambahkan item lagi.

#### Acceptance Criteria

1. THE CartContext SHALL persist cart state ke localStorage dengan key 'katalogi_cart'
2. WHEN page di-refresh, THE CartContext SHALL restore cart state dari localStorage
3. WHEN browser di-close dan di-open kembali, THE cart state SHALL persist (localStorage tidak di-clear)
4. WHERE localStorage tidak tersedia (private browsing), THE cart state SHALL remain di memory untuk session tersebut
5. THE localStorage data SHALL be serialized sebagai JSON string
6. WHEN cart di-clear, THE localStorage entry SHALL di-remove atau di-set ke empty array
7. THE CartContext SHALL validate localStorage data sebelum restore (check format dan data integrity)
8. WHERE localStorage data corrupt, THE CartContext SHALL fallback ke empty cart dan log error
9. WHERE localStorage data invalid format tapi tidak corrupt, THE system SHALL try to preserve valid data yang dapat di-extract

---

### Requirement 12: Performance Optimization

**User Story:** Sebagai pengguna, saya ingin website berrespons cepat saat menambah/mengurangi item, sehingga pengalaman berbelanja menjadi smooth.

#### Acceptance Criteria

1. THE CartContext updates SHALL NOT cause unnecessary re-renders di komponen yang tidak subscribe ke cart
2. THE Quantity_Counter click handlers SHALL use useCallback untuk memoization
3. THE CatalogBlock SHALL use React.memo untuk prevent re-render saat parent component re-render
4. THE Floating_Cart_Button SHALL only re-render ketika totalItems atau totalPrice berubah
5. THE WhatsApp message generation SHALL be memoized dengan useMemo untuk prevent regeneration
6. THE localStorage operations SHALL be debounced untuk prevent excessive writes
7. THE component SHALL NOT create new function instances di setiap render

---

### Requirement 13: Error Handling dan Edge Cases

**User Story:** Sebagai developer, saya ingin error handling yang robust, sehingga aplikasi tidak crash dan user mendapat feedback yang jelas.

#### Acceptance Criteria

1. WHEN WhatsApp number tidak tersedia, THE system SHALL display user-friendly error message
2. WHEN localStorage quota exceeded, THE system SHALL fallback ke in-memory cart dan notify user immediately
3. WHEN product data invalid (missing required fields), THE CatalogBlock SHALL skip rendering produk tersebut dan log error
4. WHEN quantity input invalid (negative atau non-integer), THE system SHALL reject dan maintain previous quantity
5. WHEN WhatsApp URL construction fails, THE system SHALL display error message dan prevent window.open()
6. WHERE network error terjadi saat fetch product data, THE system SHALL display retry button
7. THE error messages SHALL be user-friendly dan dalam Bahasa Indonesia
8. THE system SHALL log errors ke console untuk debugging (development mode)
9. WHERE localStorage operations fail untuk reasons lain selain quota exceeded, THE system SHALL handle gracefully tanpa fallback ke in-memory

---

### Requirement 14: Accessibility

**User Story:** Sebagai pengguna dengan kebutuhan aksesibilitas, saya ingin dapat menggunakan fitur cart dengan keyboard dan screen reader, sehingga saya dapat berbelanja dengan nyaman.

#### Acceptance Criteria

1. THE Quantity_Counter buttons SHALL be keyboard accessible dengan Tab navigation
2. THE Floating_Cart_Button SHALL have aria-label yang descriptive
3. THE Checkout_Modal SHALL have proper ARIA roles dan labels
4. THE modal close button SHALL be keyboard accessible dengan Enter/Space key
5. THE product list SHALL have semantic HTML structure (ul/li atau proper heading hierarchy)
6. THE form inputs (jika ada) SHALL have associated labels dengan htmlFor attribute
7. THE color-only indicators SHALL have text alternative (e.g., "✓" untuk selected state)
8. THE component SHALL support focus management (focus trap di modal, restore focus saat close)

---

### Requirement 15: Mobile Responsiveness

**User Story:** Sebagai pengguna mobile, saya ingin interface yang optimal di smartphone, sehingga saya dapat berbelanja dengan mudah di perangkat kecil.

#### Acceptance Criteria

1. THE Quantity_Counter buttons SHALL have minimum touch target size 44x44px
2. THE Floating_Cart_Button SHALL not overlap dengan important content di mobile
3. THE Checkout_Modal SHALL display full-width di mobile dengan padding yang adequate
4. THE product grid SHALL display 1 column di mobile, 2 columns di tablet, 3 columns di desktop
5. THE modal close button SHALL be easily tappable di mobile
6. THE text size SHALL be minimum 16px untuk prevent auto-zoom di iOS
7. THE component SHALL handle landscape orientation gracefully

---

## Acceptance Criteria Testing Strategy

### Property-Based Testing Candidates

1. **Cart Invariant**: Untuk ANY sequence of addToCart/removeFromCart/updateQuantity operations, cart.totalPrice ALWAYS equals sum(item.price × item.quantity)

2. **Round-Trip Property**: Untuk ANY cart state, serializing to localStorage dan deserializing SHALL produce equivalent cart state

3. **Idempotence**: Calling addToCart dengan same product dan quantity multiple times SHALL result in same cart state (quantity tidak double)

4. **Quantity Bounds**: Untuk ANY updateQuantity operation, quantity SHALL always be ≥ 0, dan item SHALL be removed jika quantity = 0

5. **Message Format**: Untuk ANY cart state, generated WhatsApp message SHALL be valid URL-encoded dan NOT contain invalid characters

### Integration Testing Candidates

1. **WhatsApp Integration**: Test bahwa window.open() dipanggil dengan correct URL format (1-2 examples)

2. **LocalStorage Persistence**: Test bahwa cart state persist dan restore correctly (1-2 examples)

3. **Theme Config Integration**: Test bahwa primaryColor dan WhatsApp number di-read dari correct sources (1-2 examples)

4. **Contact Block Integration**: Test bahwa WhatsApp number di-retrieve dari Contact_Block jika tersedia (1-2 examples)

---

## Implementation Notes

### Technology Stack
- **Framework**: Next.js 15+ (App Router)
- **State Management**: React Context API + useReducer
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Storage**: Browser localStorage
- **Integration**: WhatsApp Web API (client-side)

### File Structure (Proposed)
```
src/
├── components/
│   ├── blocks/
│   │   ├── CatalogBlock.tsx (updated)
│   │   └── CatalogBlock.module.css (if needed)
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
└── types/
    └── cart.ts
```

### Key Implementation Considerations
1. Gunakan 'use client' directive di root component (CartProvider) dan CatalogBlock
2. Implement useEffect untuk browser-dependent operations
3. Validate WhatsApp number format sebelum construct URL
4. Handle localStorage errors gracefully
5. Memoize expensive computations (message generation, calculations)
6. Test hydration dengan running Next.js build dan preview

