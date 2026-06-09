import { requireAdmin } from '@/lib/session'
import { getTotalStats, getGrowthRate, getUserGrowth, getWebsiteGrowth, getContentStats, getUserConversionStats } from '@/lib/analytics-data'
import { GrowthChart } from '@/components/admin/analytics/GrowthChart'
import type { Metadata } from 'next'
import { TrendingUp, TrendingDown, Users, Globe, Layers, Eye, CheckCircle, BookOpen, ShoppingBag, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Analitik — Admin Katalogi',
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'rb'
  return n.toLocaleString('id-ID')
}

export default async function AdminAnalyticsPage() {
  await requireAdmin()

  const [stats, growthRate, userGrowth, websiteGrowth, contentStats, conversion] = await Promise.all([
    getTotalStats(),
    getGrowthRate(),
    getUserGrowth(),
    getWebsiteGrowth(),
    getContentStats(),
    getUserConversionStats(),
  ])

  const kpiCards = [
    {
      label: 'Total User',
      value: formatCompact(stats.totalUsers),
      change: growthRate.userGrowthRate,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: 'Total Website',
      value: formatCompact(stats.totalWebsites),
      change: growthRate.websiteGrowthRate,
      icon: Globe,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Rata-rata Blok',
      value: String(stats.avgBlocksPerSite),
      icon: Layers,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Publikasi Rate',
      value: `${stats.publishRate}%`,
      icon: CheckCircle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Total Dilihat',
      value: formatCompact(stats.totalViews),
      icon: Eye,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Total Blok',
      value: formatCompact(stats.totalBlocks),
      icon: Layers,
      color: 'text-rose-600 bg-rose-50',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight">Analitik</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">Pertumbuhan & statistik platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color} mb-3`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-950">{kpi.value}</p>
            <p className="text-xs font-medium text-gray-400 mt-0.5">{kpi.label}</p>
            {'change' in kpi && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                kpi.change! >= 0 ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {kpi.change! >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change! >= 0 ? '+' : ''}{kpi.change}% 30d
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthChart data={userGrowth} label="Pertumbuhan User (30hr)" color="#6366f1" />
        <GrowthChart data={websiteGrowth} label="Pertumbuhan Website (30hr)" color="#10b981" />
      </div>

      {/* Konten + Konversi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistik Konten */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Statistik Konten</h3>
          <div className="grid grid-cols-2 gap-4">
            <ContentStatBox
              label="Total Halaman"
              value={contentStats.totalPages}
              icon={FileText}
              color="text-indigo-600 bg-indigo-50"
            />
            <ContentStatBox
              label="Total Blok"
              value={contentStats.totalBlocks}
              icon={Layers}
              color="text-emerald-600 bg-emerald-50"
            />
            <ContentStatBox
              label="Rata-rata Blok/Halaman"
              value={contentStats.avgBlocksPerPage}
              icon={BookOpen}
              color="text-blue-600 bg-blue-50"
            />
            <ContentStatBox
              label="Website dengan Katalog"
              value={contentStats.websitesWithCatalog}
              icon={ShoppingBag}
              color="text-amber-600 bg-amber-50"
            />
          </div>
        </div>

        {/* Konversi User */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Konversi User</h3>
          <div className="space-y-5">
            <ConversionStep
              label="Total Terdaftar"
              value={conversion.totalUsers}
              total={conversion.totalUsers}
              color="bg-indigo-600"
            />
            <ConversionStep
              label="Buat Website"
              value={conversion.usersWithWebsites}
              total={conversion.totalUsers}
              color="bg-emerald-500"
            />
            <ConversionStep
              label="Published"
              value={conversion.usersWithPublished}
              total={conversion.totalUsers}
              color="bg-amber-500"
            />
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-gray-950">
                {conversion.totalUsers > 0 ? Math.round(conversion.usersWithWebsites / conversion.totalUsers * 100) : 0}%
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Buat Rate</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-950">
                {conversion.usersWithWebsites > 0 ? Math.round(conversion.usersWithPublished / conversion.usersWithWebsites * 100) : 0}%
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Publikasi Rate</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-950">
                {conversion.totalUsers > 0 ? Math.round(conversion.usersWithPublished / conversion.totalUsers * 100) : 0}%
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Keseluruhan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContentStatBox({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof FileText; color: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-950">{value.toLocaleString('id-ID')}</p>
      <p className="text-xs font-medium text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function ConversionStep({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-sm font-black text-gray-950">{value.toLocaleString('id-ID')}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1">{pct.toFixed(0)}% dari total user</p>
    </div>
  )
}
