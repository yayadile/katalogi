import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan — Katalogi',
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-gray-800">
      <Link href="/" className="text-sm text-indigo-600 font-semibold hover:underline">&larr; Kembali ke Beranda</Link>
      <h1 className="text-3xl font-black text-gray-900 mt-6 mb-8">Syarat & Ketentuan</h1>
      <div className="space-y-6 text-sm leading-relaxed">
        <p><strong>Terakhir diperbarui:</strong> Juni 2026</p>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. Layanan</h2>
          <p>Katalogi menyediakan platform pembuatan website katalog online. Akun gratis dapat membuat proyek tak terbatas dengan maksimal 1 website yang dipublikasikan. Akun PAID mendapatkan akses penuh.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. Pembayaran</h2>
          <p>Pembayaran untuk akun PAID bersifat satu kali (bukan berlangganan) via WhatsApp Business. Aktivasi dilakukan manual oleh admin setelah pembayaran dikonfirmasi.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. Tanggung Jawab Pengguna</h2>
          <p>Anda bertanggung jawab atas konten yang dipublikasikan melalui platform Katalogi. Dilarang menggunakan layanan untuk konten ilegal, melanggar hak cipta, atau menyebarkan malware.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. Pembatasan Layanan</h2>
          <p>Kami berhak menangguhkan atau menghapus akun yang melanggar syarat dan ketentuan tanpa pemberitahuan sebelumnya.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. Perubahan</h2>
          <p>Syarat dan ketentuan dapat berubah sewaktu-waktu. Pengguna akan diberitahu melalui email jika ada perubahan signifikan.</p>
        </section>
      </div>
    </main>
  )
}
