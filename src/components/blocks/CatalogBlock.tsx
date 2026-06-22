'use client'

import { useState, useContext } from 'react'
import Image from 'next/image'
import { CartContext } from '@/components/cart/CartContext'

export type CatalogItem = {
  id: string
  name: string
  price: number
  image?: string
  desc?: string
  /** Optional per-item override link (e.g. a full https://wa.me/... URL) */
  actionLink?: string
}

export type CatalogContent = {
  title?: string
  layout?: 'grid' | 'list'
  imageRatio?: '1:1' | '4:3' | '16:9'
  /** Owner WhatsApp number for this catalog (format: 628xxxxxxxxxx) */
  whatsapp?: string
  items: CatalogItem[]
}

type CatalogBlockProps = {
  content: CatalogContent
  theme?: {
    primaryColor: string
    secondaryColor: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily?: string
  }
  /** Owner WhatsApp number (format: 628xxxxxxxxxx). Falls back from page/contact. */
  whatsapp?: string
  /** Store / website name, included in the WhatsApp order template. */
  storeName?: string
}

/** Normalize a WhatsApp number to the digits-only international format wa.me expects. */
function normalizeWaNumber(raw?: string): string {
  if (!raw) return ''
  let digits = raw.replace(/\D/g, '')
  // Convert leading 0 (local Indonesian format) to 62.
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  return digits
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

export default function CatalogBlock({ content, theme, whatsapp, storeName }: CatalogBlockProps) {
  const [searchQuery, setSearchQuery] = useState('')
  // Cart is optional: present on published pages (wrapped by CartProvider), absent elsewhere.
  const cart = useContext(CartContext)
  const primaryColor = theme?.primaryColor || '#9819ff'
  const buttonStyle = theme?.buttonStyle || 'rounded'
  const buttonRadius = buttonStyle === 'sharp' ? 'rounded-none' : buttonStyle === 'pill' ? 'rounded-full' : 'rounded-xl'
  const { title, items, layout = 'grid', imageRatio = '4:3' } = content

  // Owner WhatsApp number: per-catalog setting wins, else the value passed from the page (Contact block).
  const ownerWa = normalizeWaNumber(content.whatsapp || whatsapp)

  const aspectClass = 
    imageRatio === '1:1' ? 'aspect-square' :
    imageRatio === '16:9' ? 'aspect-video' : 
    'aspect-[4/3]'

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleCheckout = (item: CatalogItem) => {
    const isEditor = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')

    // Build the order template message sent to the owner's WhatsApp.
    const lines = [
      'Halo' + (storeName ? ` *${storeName}*` : '') + ', saya mau order:',
      '',
      `*${item.name}*`,
      `Harga: ${formatPrice(item.price)}`,
      '',
      'Apakah masih tersedia? Terima kasih 🙏',
    ]
    const text = encodeURIComponent(lines.join('\n'))

    // A per-item actionLink overrides everything (can be any URL).
    if (item.actionLink) {
      const sep = item.actionLink.includes('?') ? '&' : '?'
      const href = item.actionLink.includes('wa.me') || item.actionLink.includes('whatsapp')
        ? `${item.actionLink}${item.actionLink.includes('text=') ? '' : `${sep}text=${text}`}`
        : item.actionLink
      if (isEditor) {
        alert(`[PRATINJAU] Tombol beli "${item.name}" akan membuka: ${href}`)
      } else {
        window.open(href, '_blank', 'noopener,noreferrer')
      }
      return
    }

    if (isEditor) {
      alert(
        ownerWa
          ? `[PRATINJAU] Tombol beli "${item.name}" akan membuka WhatsApp ke ${ownerWa} dengan template pesanan.`
          : `[PRATINJAU] Nomor WhatsApp belum diatur. Tambahkan blok Kontak (isi WhatsApp) atau atur nomor di pengaturan Katalog.`
      )
      return
    }

    if (ownerWa) {
      window.open(`https://wa.me/${ownerWa}?text=${text}`, '_blank', 'noopener,noreferrer')
    } else {
      // No number configured anywhere — open WhatsApp with the prefilled text so the user can pick a chat.
      window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="max-w-5xl mx-auto">
        {(title || items.length > 0) && (
          <div className="text-center mb-10">
            {title && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
                <div
                  className="w-16 h-1 mx-auto rounded-full mb-8"
                  style={{ background: primaryColor }}
                />
              </>
            )}
            
            {items.length > 0 && (
              <div className="max-w-md mx-auto relative">
                <input 
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-white/50 backdrop-blur-sm transition-all"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>Belum ada produk ditambahkan.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p>Pencarian &quot;{searchQuery}&quot; tidak ditemukan.</p>
          </div>
        ) : (
          <div className={layout === 'list' ? 'flex flex-col gap-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-slate-100 ${
                  layout === 'list' ? 'flex flex-row items-center' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative bg-slate-100 overflow-hidden ${
                  layout === 'list' ? `w-32 sm:w-48 shrink-0 ${aspectClass}` : `w-full ${aspectClass}`
                }`}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: `${primaryColor}15` }}>
                      <svg className="w-12 h-12 opacity-30" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-5 ${layout === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">{item.name}</h3>
                  {item.desc && <p className="text-slate-500 text-sm mb-3 line-clamp-2">{item.desc}</p>}
                  <div className={`flex items-center justify-between gap-2 ${layout === 'list' && !item.desc ? 'mt-2' : ''}`}>
                    <span className="font-bold text-xl" style={{ color: primaryColor }}>
                      {formatPrice(item.price)}
                    </span>
                    {cart ? (
                      (() => {
                        const inCart = cart.getCartItem(item.id)
                        if (inCart) {
                          return (
                            <div className={`flex items-center gap-1 ${buttonRadius} border border-slate-200 p-0.5`}>
                              <button
                                aria-label="Kurangi"
                                onClick={() => cart.updateQuantity(item.id, inCart.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 transition-colors text-lg leading-none"
                              >
                                −
                              </button>
                              <span className="min-w-6 text-center text-sm font-bold text-slate-800">{inCart.quantity}</span>
                              <button
                                aria-label="Tambah"
                                onClick={() => cart.updateQuantity(item.id, inCart.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md text-white transition-colors text-lg leading-none"
                                style={{ background: primaryColor }}
                              >
                                +
                              </button>
                            </div>
                          )
                        }
                        return (
                          <button
                            onClick={() => cart.addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }, 1)}
                            className={`text-sm font-medium px-4 py-2 ${buttonRadius} text-white transition-all hover:opacity-90 whitespace-nowrap`}
                            style={{ background: primaryColor }}
                          >
                            + Keranjang
                          </button>
                        )
                      })()
                    ) : (
                      <button
                        onClick={() => handleCheckout(item)}
                        className={`text-sm font-medium px-4 py-2 ${buttonRadius} text-white transition-all hover:opacity-90`}
                        style={{ background: primaryColor }}
                      >
                        Beli
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
