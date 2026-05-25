'use client'

export type VideoContent = {
  url: string
  platform: 'youtube' | 'vimeo' | 'custom'
}

type ThemeProps = {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export function VideoBlock({ content }: { content: VideoContent; theme?: ThemeProps }) {
  const getEmbedUrl = () => {
    if (!content.url) return null

    if (content.platform === 'youtube') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      const match = content.url.match(regExp)
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`
      }
    } else if (content.platform === 'vimeo') {
      const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
      const match = content.url.match(regExp)
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`
      }
    }
    return content.url
  }

  const embedUrl = getEmbedUrl()

  return (
    <div className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {embedUrl ? (
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-500 font-medium">Video URL belum dikonfigurasi</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export type GalleryContent = {
  title?: string
  layout?: 'square' | 'video'
  columns?: number
  images?: string[]
}

export function GalleryBlock({ content }: { content: GalleryContent }) {
  const { title, layout = 'square', columns = 3, images = [] } = content

  const aspectClass = layout === 'video' ? 'aspect-video' : 'aspect-square'

  return (
    <div className="py-12 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">{title}</h2>
        )}
        
        {images.length > 0 ? (
          <div 
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {images.map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl bg-gray-100 ${aspectClass}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={src} 
                  alt={`Gallery image ${i + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 font-medium text-sm">Galeri kosong. Tambahkan gambar di panel pengaturan.</p>
          </div>
        )}
      </div>
    </div>
  )
}