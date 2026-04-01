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
  items: CatalogItem[]
}

type CatalogBlockProps = {
  content: CatalogContent
  primaryColor?: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

export default function CatalogBlock({ content, primaryColor = '#8b5cf6' }: CatalogBlockProps) {
  const { title, items } = content

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{title}</h2>
            <div
              className="w-16 h-1 mx-auto rounded-full"
              style={{ background: primaryColor }}
            />
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>Belum ada produk ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-slate-100"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
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
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">{item.name}</h3>
                  {item.desc && <p className="text-slate-500 text-sm mb-3 line-clamp-2">{item.desc}</p>}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl" style={{ color: primaryColor }}>
                      {formatPrice(item.price)}
                    </span>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
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
