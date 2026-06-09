import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Mail, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react'

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

export default async function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await props.params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { websites: true } },
      websites: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!user) notFound()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl pt-16">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div className="bg-white border border-gray-200 rounded-3xl p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-950">{user.name ?? 'Tanpa Nama'}</h1>
            <p className="text-gray-500 font-medium mt-1">{user.email}</p>
          </div>
          <span className={`text-xs font-bold px-4 py-2 rounded-full ${
            user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600'
          }`}>
            {user.role}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
              <p className="font-bold text-gray-900">{user.emailVerified ? 'Verified' : 'Unverified'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Website</p>
              <p className="font-bold text-gray-900">{user._count.websites}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bergabung</p>
              <p className="font-bold text-gray-900 text-sm">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user.isSuspended ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
              <p className={`font-bold ${user.isSuspended ? 'text-red-600' : 'text-emerald-600'}`}>
                {user.isSuspended ? 'Suspended' : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-8">
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest mb-6">
          Website {user.name ?? 'Pengguna'}
        </h2>
        {user.websites.length === 0 ? (
          <p className="text-gray-400 font-medium text-center py-8">Belum ada website.</p>
        ) : (
          <div className="space-y-4">
            {user.websites.map((website) => (
              <div key={website.id} className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-2xl">
                <div>
                  <Link
                    href={`/dashboard/websites/${website.id}/edit`}
                    className="font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {website.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">/{website.slug}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{website.pageViews} views</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    website.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {website.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
