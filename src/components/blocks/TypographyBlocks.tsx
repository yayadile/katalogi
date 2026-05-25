'use client'

export type HeadingContent = {
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}

type ThemeProps = {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export function HeadingBlock({ content }: { content: HeadingContent; theme?: ThemeProps }) {
  const level = content.level || 1
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
  const styles = {
    h1: 'text-4xl md:text-5xl font-black mb-6',
    h2: 'text-3xl md:text-4xl font-bold mb-5',
    h3: 'text-2xl md:text-3xl font-bold mb-4',
    h4: 'text-xl md:text-2xl font-bold mb-3',
    h5: 'text-lg md:text-xl font-bold mb-2',
    h6: 'text-base md:text-lg font-bold mb-2',
  }

  return (
    <div className="py-4 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <Tag className={`${styles[(`h${level}` as keyof typeof styles)] || styles.h1} text-gray-900`}>
          {content.text}
        </Tag>
      </div>
    </div>
  )
}

export type ParagraphContent = {
  text: string
}

export function ParagraphBlock({ content }: { content: ParagraphContent; theme?: ThemeProps }) {
  return (
    <div className="py-4 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          {content.text}
        </p>
      </div>
    </div>
  )
}

export type QuoteContent = {
  text: string
  author?: string
}

export function QuoteBlock({ content, theme }: { content: QuoteContent; theme?: ThemeProps }) {
  const primaryColor = theme?.primaryColor || '#4f46e5'
  
  return (
    <div className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto border-l-4 pl-6" style={{ borderColor: primaryColor }}>
        <blockquote className="text-2xl italic font-medium text-gray-900 mb-2">
          &ldquo;{content.text}&rdquo;
        </blockquote>
        {content.author && (
          <cite className="text-gray-500 font-medium">&mdash; {content.author}</cite>
        )}
      </div>
    </div>
  )
}