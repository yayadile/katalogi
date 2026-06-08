export type TextContent = {
  text?: string
  html?: string
  /** Legacy fields used by some editor panels */
  body?: string
  content?: string
  title?: string
  align?: 'left' | 'center' | 'right'
}

type TextBlockProps = {
  content: TextContent
  theme?: {
    primaryColor: string
    secondaryColor: string
    backgroundColor?: string
    buttonStyle?: 'sharp' | 'rounded' | 'pill'
    fontFamily?: string
  }
}

export default function TextBlock({ content, theme }: TextBlockProps) {
  const primaryColor = theme?.primaryColor || '#9819ff'
  const { html, text, body, content: inner, title, align = 'left' } = content
  const richText = html || inner
  const plainText = text || body

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-3xl mx-auto" style={{ textAlign: align }}>
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{title}</h2>
        )}
        {richText ? (
          <div
            className="prose prose-slate prose-lg max-w-none"
            style={{ '--tw-prose-links': primaryColor } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: richText }}
          />
        ) : plainText ? (
          <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{plainText}</p>
        ) : (
          <p className="text-slate-400 italic text-center">Konten teks kosong.</p>
        )}
      </div>
    </section>
  )
}
