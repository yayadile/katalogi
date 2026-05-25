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
  theme?: {
    primaryColor: string
    secondaryColor: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily?: string
  }
}

export default function HeroBlock({ content, isEditing, theme }: HeroBlockProps) {
  const primaryColor = theme?.primaryColor || '#8b5cf6'
  const buttonStyle = theme?.buttonStyle || 'rounded'
  const buttonRadius = buttonStyle === 'sharp' ? 'rounded-none' : buttonStyle === 'pill' ? 'rounded-full' : 'rounded-2xl'
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

  const variant = content.variant || 'centered'

  const TextContent = () => (
    <div className={`relative z-10 ${variant === 'centered' ? 'text-center px-6 max-w-3xl mx-auto' : 'px-8 md:px-16 text-left max-w-xl'}`}>
      <h1
        className={`font-bold leading-tight mb-4 ${
          bgImage && variant === 'centered' ? 'text-white' : 'text-slate-900'
        } ${isEditing ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}
      >
        {headline || 'Judul Utama'}
      </h1>

      {subtext && (
        <p
          className={`text-lg md:text-xl mb-8 leading-relaxed ${
            bgImage && variant === 'centered' ? 'text-white/80' : 'text-slate-600'
          }`}
        >
          {subtext}
        </p>
      )}

      {ctaText && (
        <button
          className={`inline-flex items-center gap-2 px-8 py-4 ${buttonRadius} font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
          style={{ background: primaryColor }}
        >
          {ctaText}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}
    </div>
  )

  if (variant === 'centered') {
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
        <TextContent />
      </section>
    )
  }

  // Split Layouts
  return (
    <section 
      className="relative flex flex-col md:flex-row min-h-[480px] overflow-hidden bg-white"
      style={isEditing ? { minHeight: '340px' } : {}}
    >
      <div className={`flex-1 flex flex-col justify-center py-16 ${variant === 'split-right' ? 'md:order-2' : 'md:order-1'}`}>
        <TextContent />
      </div>
      <div className={`flex-1 relative min-h-[300px] ${variant === 'split-right' ? 'md:order-1' : 'md:order-2'}`}>
        {validBgImage && bgImage ? (
          <Image
            src={bgImage}
            alt="Hero image"
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
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
