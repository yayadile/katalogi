'use client'

import { useState } from 'react'
import { CartProvider } from '@/components/cart/CartProvider'
import { useCart } from '@/hooks/useCart'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
}

function normalizeWaNumber(raw?: string): string {
  if (!raw) return ''
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  return digits
}

type CartUIProps = {
  whatsapp?: string
  storeName?: string
  primaryColor: string
}

function CartUI({ whatsapp, storeName, primaryColor }: CartUIProps) {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const ownerWa = normalizeWaNumber(whatsapp)

  const handleCheckout = () => {
    if (state.items.length === 0) return

    const lines: string[] = [
      `Halo${storeName ? ` *${storeName}*` : ''}, saya mau order:`,
      '',
    ]
    state.items.forEach((item, idx) => {
      lines.push(
        `${idx + 1}. *${item.name}* x${item.quantity} — ${formatPrice(item.price * item.quantity)}`
      )
    })
    lines.push('', `*Total: ${formatPrice(state.totalPrice)}*`, '', 'Mohon info ketersediaan & cara pembayaran. Terima kasih 🙏')

    const text = encodeURIComponent(lines.join('\n'))
    const url = ownerWa ? `https://wa.me/${ownerWa}?text=${text}` : `https://wa.me/?text=${text}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (state.totalItems === 0 && !isOpen) return null

  return (
    <>
      {/* Floating cart button */}
      {state.totalItems > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 pl-4 pr-5 py-3 rounded-full text-white shadow-2xl transition-transform hover:scale-105 active:scale-95"
          style={{ background: primaryColor }}
          aria-label="Buka keranjang"
        >
          <span className="relative">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-white text-[11px] font-extrabold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1" style={{ color: primaryColor }}>
              {state.totalItems}
            </span>
          </span>
          <span className="font-bold text-sm">{formatPrice(state.totalPrice)}</span>
        </button>
      )}

      {/* Checkout drawer/modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Keranjang Belanja</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {state.items.length === 0 ? (
                <p className="text-center text-slate-400 py-12">Keranjang masih kosong.</p>
              ) : (
                state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <div className="w-14 h-14 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
                      <p className="text-sm font-bold" style={{ color: primaryColor }}>{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 text-lg leading-none"
                        aria-label="Kurangi"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-white text-lg leading-none"
                        style={{ background: primaryColor }}
                        aria-label="Tambah"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      aria-label="Hapus item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer / checkout */}
            {state.items.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-sm">Total</span>
                  <span className="font-extrabold text-lg text-slate-900">{formatPrice(state.totalPrice)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold transition-transform active:scale-95"
                  style={{ background: '#25D366' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.127.558 4.12 1.532 5.847L.056 23.964l6.283-1.645A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm.001 21.818a9.812 9.812 0 01-5.031-1.384l-.359-.214-3.731.977.997-3.64-.235-.374A9.818 9.818 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z" />
                  </svg>
                  Pesan via WhatsApp
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Kosongkan keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

type StoreShellProps = {
  children: React.ReactNode
  whatsapp?: string
  storeName?: string
  primaryColor?: string
}

/**
 * Wraps published page content with a cart provider and renders the floating
 * cart + WhatsApp checkout. Catalog "+ Keranjang" buttons add items here; the
 * checkout button sends the whole order to the owner's WhatsApp.
 */
export default function StoreShell({ children, whatsapp, storeName, primaryColor = '#9819ff' }: StoreShellProps) {
  return (
    <CartProvider>
      {children}
      <CartUI whatsapp={whatsapp} storeName={storeName} primaryColor={primaryColor} />
    </CartProvider>
  )
}
