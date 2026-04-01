import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    <html lang="id" className={`${inter.variable} ${poppins.variable} h-full antialiased`} suppressHydrationWarning={true}>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
