import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Katalogi — Website Builder untuk Toko Online',
    template: '%s — Katalogi',
  },
  description:
    'Buat website toko online Anda dalam menit. Katalogi memudahkan siapa saja untuk tampil online tanpa keahlian coding.',
  keywords: ['website builder', 'toko online', 'katalog digital', 'tanpa coding'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning={true}>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: 'var(--font-outfit), system-ui, sans-serif' }} suppressHydrationWarning={true}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-indigo-600 focus:rounded-xl focus:shadow-lg focus:outline-none focus:font-bold focus:text-sm">
          Langsung ke konten utama
        </a>
        {children}
      </body>
    </html>
  )
}
