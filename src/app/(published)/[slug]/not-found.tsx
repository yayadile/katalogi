import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan — Katalogi',
  description: 'Website yang Anda cari tidak ditemukan atau belum dipublikasikan.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Website Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-8">
          Website yang Anda cari tidak tersedia atau belum dipublikasikan.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  )
}
