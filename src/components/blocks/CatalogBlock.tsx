'use client'

import { useState } from 'react'
import Image from 'next/image'

export type CatalogItem = {
  id: string
  name: string
  price: number
  image?: string
  desc?: string
}

export type CatalogContent = {
  title?: string
  layout?: 'grid' | 'list'
  imageRatio?: '1:1' | '4:3' | '16:9'
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
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

export default function CatalogBlock({ content, theme }: CatalogBlockProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const primaryColor = theme?.primaryColor || '#9819ff'
  const buttonStyle = theme?.buttonStyle || 'rounded'
  const buttonRadius = buttonStyle === 'sharp' ? 'rounded-none' : buttonStyle === 'pill' ? 'rounded-full' : 'rounded-xl'
  const { title, items, layout = 'grid', imageRatio = '4:3' } = content

  const aspectClass = 
    imageRatio === '1:1' ? 'aspect-square' :
    imageRatio === '16:9' ? 'aspect-video' : 
    'aspect-[4/3]'

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleCheckout = (item: CatalogItem) => {
    // We will assume phone number is in a global state or block config, 
    // but for now, we just redirect to a mock WA link if we don't have a specific number.
    // However, WhatsApp dynamic format requires a phone number. 
    // Let's implement a Toast/Alert for Editor mode. We can check if window.location.pathname includes '/dashboard'.
    const isEditor = typeof window !== 'undefined' && window.location.pathname.includes('/dashboard');
    const text = encodeURIComponent(`Halo, saya mau order:\n\n*${item.name}*\nHarga: ${formatPrice(item.price)}\n\nApakah masih tersedia?`);
    
    if (isEditor) {
      alert(`[MOCK WHATSAPP] Anda mengklik tombol beli untuk: ${item.name}. Di website asli, ini akan membuka WhatsApp.`);
    } else {
      // In a real app, you'd get the whatsapp number from the ContactBlock or ThemeConfig.
      // For now, redirect to a generic wa.me link with text.
      window.open(`https://wa.me/?text=${text}`, '_blank');
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
                  <div className={`flex items-center justify-between ${layout === 'list' && !item.desc ? 'mt-2' : ''}`}>
                    <span className="font-bold text-xl" style={{ color: primaryColor }}>
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => handleCheckout(item)}
                      className={`text-sm font-medium px-4 py-2 ${buttonRadius} text-white transition-all hover:opacity-90`}
                      style={{ background: primaryColor }}
                    >
                      Beli
                    </button>
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
