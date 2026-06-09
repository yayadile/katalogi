import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Users, Globe, Eye, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Admin Katalogi',
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'rb'
  return n.toLocaleString('id-ID')
}

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [totalUsers, totalWebsites, totalViewsAgg, publishedCount, recentUsers, topWebsites] =
    await Promise.all([
      prisma.user.count(),
      prisma.website.count(),
      prisma.website.aggregate({ _sum: { pageViews: true } }),
      prisma.website.count({ where: { isPublished: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { _count: { select: { websites: true } } },
      }),
      prisma.website.findMany({
        orderBy: { pageViews: 'desc' },
        take: 5,
        include: { user: { select: { name: true } } },
      }),
    ])

  const totalViews = totalViewsAgg._sum.pageViews ?? 0

  const stats = [
    { label: 'Total User', value: totalUsers, icon: Users, color: 'text-indigo-600 bg-indigo-50', change: '+12%' },
    { label: 'Total Website', value: totalWebsites, icon: Globe, color: 'text-emerald-600 bg-emerald-50', change: '+8%' },
    { label: 'Published', value: publishedCount, icon: CheckCircle, color: 'text-blue-600 bg-blue-50', change: `${totalWebsites > 0 ? Math.round(publishedCount / totalWebsites * 100) : 0}%` },
    { label: 'Total Dilihat', value: formatCompact(totalViews), icon: Eye, color: 'text-amber-600 bg-amber-50', change: formatCompact(totalViews) },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Beranda</h1>
        <p className="text-gray-500 mt-1 font-medium">Dashboard keseluruhan platform Katalogi</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-950">{stat.value}</p>
            <p className="text-sm font-medium text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two column: Top websites + Recent users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Websites */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Website Terpopuler
            </h2>
            <Link href="/admin/websites" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
              Lihat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {topWebsites.map((w, i) => (
              <div key={w.id} className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                  i === 0 ? 'bg-amber-100 text-amber-700' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{w.title}</p>
                  <p className="text-xs text-gray-500 truncate">{w.user.name ?? 'Tanpa Nama'} &middot; /{w.slug}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-gray-900">{formatCompact(w.pageViews)}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">dilihat</p>
                </div>
              </div>
            ))}
            {topWebsites.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8 font-medium">Belum ada website.</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              User Terbaru
            </h2>
            <Link href="/admin/users" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
              Lihat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                  {(u.name ?? u.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{u.name ?? 'Tanpa Nama'}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="text-xs text-gray-400">{u._count.websites} website</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    u.emailVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {u.emailVerified ? 'OK' : 'OTP'}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8 font-medium">Belum ada user.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
