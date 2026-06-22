import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan — Katalogi',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-2xl font-black">404</span>
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">Halaman tidak ditemukan</h1>
      <p className="text-gray-500 max-w-md leading-relaxed mb-8">
        Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-95"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
