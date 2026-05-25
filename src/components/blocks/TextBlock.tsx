export type TextContent = {
  text?: string
  html?: string
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
  const primaryColor = theme?.primaryColor || '#8b5cf6'
  const { html, text } = content

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        {html ? (
          <div
            className="prose prose-slate prose-lg max-w-none"
            style={{ '--tw-prose-links': primaryColor } as React.CSSProperties}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : text ? (
          <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">{text}</p>
        ) : (
          <p className="text-slate-400 italic text-center">Konten teks kosong.</p>
        )}
      </div>
    </section>
  )
}
