import Image from 'next/image'

export type HeroContent = {
  headline: string
  subtext?: string
  ctaText?: string
  bgImage?: string
}

type HeroBlockProps = {
  content: HeroContent
  isEditing?: boolean
  primaryColor?: string
}

export default function HeroBlock({ content, isEditing, primaryColor = '#8b5cf6' }: HeroBlockProps) {
  const { headline, subtext, ctaText, bgImage } = content

  let validBgImage = false
  try {
    if (bgImage) {
      new URL(bgImage)
      validBgImage = true
    }
  } catch {
    if (bgImage?.startsWith('/')) validBgImage = true
  }

  return (
    <section
      className="relative min-h-[480px] flex items-center justify-center overflow-hidden"
      style={isEditing ? { minHeight: '340px' } : {}}
    >
      {/* Background */}
      {validBgImage && bgImage ? (
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}22 0%, ${primaryColor}66 50%, ${primaryColor}11 100%)`,
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: primaryColor }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-15 blur-3xl"
            style={{ background: primaryColor }}
          />
        </div>
      )}

      {/* Overlay for image bg */}
      {bgImage && <div className="absolute inset-0 bg-black/50" />}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1
          className={`font-bold leading-tight mb-4 ${
            bgImage ? 'text-white' : 'text-slate-900'
          } ${isEditing ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}
        >
          {headline || 'Judul Utama'}
        </h1>

        {subtext && (
          <p
            className={`text-lg md:text-xl mb-8 leading-relaxed ${
              bgImage ? 'text-white/80' : 'text-slate-600'
            }`}
          >
            {subtext}
          </p>
        )}

        {ctaText && (
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{ background: primaryColor }}
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}
