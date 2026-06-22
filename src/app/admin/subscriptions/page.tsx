import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Crown, Check, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { upgradeUserTier, downgradeUserTier } from '@/lib/actions/admin'

export const metadata: Metadata = {
  title: 'Langganan — Admin Katalogi',
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

const WA_BUSINESS_URL = 'https://wa.me/6281931920409'

export default async function AdminSubscriptionsPage(props: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  await requireAdmin()
  const raw = await props.searchParams
  const q = raw.q
  const filter = raw.filter ?? 'free'
  const where: Record<string, unknown> = {}
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (filter === 'free') where.tier = 'FREE'
  if (filter === 'paid') where.tier = 'PAID'

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { websites: true } } },
  })

  const [freeCount, paidCount] = await Promise.all([
    prisma.user.count({ where: { tier: 'FREE' } }),
    prisma.user.count({ where: { tier: 'PAID' } }),
  ])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight">Langganan</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Kelola status langganan pengguna</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <X className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-950">{freeCount}</p>
              <p className="text-xs font-medium text-gray-400">Free</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-950">{paidCount}</p>
              <p className="text-xs font-medium text-gray-400">Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <form className="flex items-center gap-3 flex-wrap">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Cari nama atau email..."
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
        />
        <select
          name="filter"
          defaultValue={filter}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
        >
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm"
        >
          Cari
        </button>
        {(q || filter !== 'free') && (
          <Link
            href="/admin/subscriptions"
            className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Reset
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Pengguna</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Tier</th>
                <th className="text-center px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Website</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Dibayar</th>
                <th className="text-right px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                        {(user.name ?? user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{user.name ?? 'Tanpa Nama'}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${
                      user.tier === 'PAID'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.tier === 'PAID' ? 'PAID' : 'FREE'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-gray-900 text-sm">{user._count.websites}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {user.paidAt ? formatDate(user.paidAt) : '-'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {user.tier === 'FREE' ? (
                      <form action={upgradeUserTier.bind(null, user.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs transition-all border border-emerald-200"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Validasi
                        </button>
                      </form>
                    ) : (
                      <form action={downgradeUserTier.bind(null, user.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs transition-all border border-amber-200"
                        >
                          <X className="w-3.5 h-3.5" />
                          Turunkan
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="text-center py-12 text-gray-400 font-medium">
            {filter === 'paid' ? 'Belum ada user berbayar.' : 'Semua user sudah PAID!'}
          </p>
        )}
      </div>

      {/* Info card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <ExternalLink className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900 text-sm">Panduan Validasi</h3>
          <p className="text-amber-700 text-xs mt-1 leading-relaxed">
            Pastikan pembayaran sudah diterima sebelum memvalidasi. 
            Hubungi pengguna via <a href={WA_BUSINESS_URL} target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-900">WhatsApp</a> jika diperlukan.
          </p>
        </div>
      </div>
    </div>
  )
}
