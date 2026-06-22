import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi — Katalogi',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-gray-800">
      <Link href="/" className="text-sm text-indigo-600 font-semibold hover:underline">&larr; Kembali ke Beranda</Link>
      <h1 className="text-3xl font-black text-gray-900 mt-6 mb-8">Kebijakan Privasi</h1>
      <div className="space-y-6 text-sm leading-relaxed">
        <p><strong>Terakhir diperbarui:</strong> Juni 2026</p>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">1. Data yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan data yang Anda berikan saat mendaftar, seperti nama, alamat email, dan konten website yang Anda buat. Kami juga menyimpan cookie sesi untuk menjaga Anda tetap login.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">2. Penggunaan Data</h2>
          <p>Data Anda digunakan untuk: (a) menyediakan dan memelihara layanan, (b) memproses aktivasi akun PAID, (c) mengirim informasi terkait layanan, (d) meningkatkan pengalaman pengguna.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">3. Penyimpanan & Keamanan</h2>
          <p>Data Anda disimpan di server yang aman dengan enkripsi. Kami tidak menjual data pribadi Anda ke pihak ketiga.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">4. Cookie</h2>
          <p>Kami menggunakan cookie sesi untuk autentikasi. Anda dapat menolak cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">5. Kontak</h2>
          <p>Jika ada pertanyaan tentang kebijakan privasi, hubungi kami via <a href="https://wa.me/6281931920409" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">WhatsApp Business</a>.</p>
        </section>
      </div>
    </main>
  )
}
