import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Check, X, Crown, ChevronRight, ExternalLink } from 'lucide-react'

const WA_BUSINESS_URL = 'https://wa.me/6281931920409'

const FEATURES = [
  { label: 'Jumlah proyek', free: 'Tak terbatas', paid: 'Tak terbatas' },
  { label: 'Website dipublikasikan', free: 'Maksimal 1', paid: 'Tak terbatas' },
  { label: 'Template Basic', free: <Check className="w-4 h-4 text-green-600" />, paid: <Check className="w-4 h-4 text-green-600" /> },
  { label: 'Template Premium', free: <X className="w-4 h-4 text-red-400" />, paid: <Check className="w-4 h-4 text-green-600" /> },
  { label: 'Branding "Dibuat dengan Katalogi"', free: <X className="w-4 h-4 text-red-400" />, paid: <Check className="w-4 h-4 text-green-600" /> },
  { label: 'Upload gambar sendiri', free: <Check className="w-4 h-4 text-green-600" />, paid: <Check className="w-4 h-4 text-green-600" /> },
  { label: 'Mode publikasi', free: 'Manual', paid: 'Manual' },
  { label: 'Dukungan prioritas', free: <X className="w-4 h-4 text-red-400" />, paid: <Check className="w-4 h-4 text-green-600" /> },
]

export default async function BillingPage() {
  const session = await requireAuth()

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { tier: true, paidAt: true },
  })

  const isPaid = user?.tier === 'PAID'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
          <Crown className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Paket & Langganan</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Informasi paket dan cara pembelian</p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className={`rounded-[2rem] p-8 mb-10 border ${
        isPaid
          ? 'bg-gradient-to-br from-indigo-500 to-indigo-900 border-indigo-400 text-white'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isPaid ? 'bg-white/15' : 'bg-amber-100'
              }`}>
                <Crown className={`w-5 h-5 ${isPaid ? 'text-white' : 'text-amber-600'}`} />
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${isPaid ? 'text-indigo-200' : 'text-amber-600'}`}>
                Paket Saat Ini
              </span>
            </div>
            <h2 className={`text-2xl font-black ${isPaid ? 'text-white' : 'text-gray-900'}`}>
              {isPaid ? 'PAID' : 'FREE'}
            </h2>
            {isPaid && user?.paidAt && (
              <p className={`text-sm mt-1 ${isPaid ? 'text-indigo-200' : 'text-gray-500'}`}>
                Aktif sejak {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(user.paidAt))}
              </p>
            )}
          </div>

          {!isPaid && (
            <a
              href={WA_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-green-600/20"
            >
              <Crown className="w-4 h-4" />
              Beli Paket
            </a>
          )}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden mb-10">
        <div className="px-8 py-6 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-lg">Bandingkan Fitur</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="px-8 py-4 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-gray-700 flex-1">{feature.label}</span>
              <div className="w-28 text-center">
                <span className="text-sm font-medium text-gray-500">{feature.free}</span>
              </div>
              <div className="w-28 text-center">
                <span className="text-sm font-medium text-indigo-600">{feature.paid}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Column headers */}
        <div className="px-8 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest">
          <span className="flex-1" />
          <span className="w-28 text-center text-gray-500">GRATIS</span>
          <span className="w-28 text-center text-indigo-600">PAID</span>
        </div>
      </div>

      {/* How to Buy */}
      <div className="bg-white border border-gray-200 rounded-[2rem] p-8">
        <h3 className="font-black text-gray-900 text-lg mb-6">Cara pembelian</h3>

        <div className="space-y-5">
          {[
            { step: 1, title: 'Hubungi kami via WhatsApp', desc: 'Klik tombol di bawah untuk terhubung dengan admin Katalogi.' },
            { step: 2, title: 'Lakukan pembayaran', desc: 'Admin akan memberikan panduan pembayaran satu kali (bukan berlangganan).' },
            { step: 3, title: 'Tunggu aktivasi', desc: 'Setelah pembayaran dikonfirmasi, admin akan mengaktivasi akun PAID Anda — langsung bisa publish tanpa batas!' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black flex items-center justify-center">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={WA_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-green-600/20"
          >
            <ExternalLink className="w-4 h-4" />
            Hubungi WhatsApp
            <ChevronRight className="w-4 h-4" />
          </a>
          {!isPaid && (
            <a
              href="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold rounded-xl text-sm transition-all"
            >
              Kembali ke Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
