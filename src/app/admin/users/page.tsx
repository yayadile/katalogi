import { requireAdmin } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { UserActions } from '@/components/admin/UserActions'
import { Pagination } from '@/components/admin/Pagination'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pengguna — Admin Katalogi',
}

const PER_PAGE = 20

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ q?: string; filter?: string; page?: string }>
}) {
  await requireAdmin()
  const raw = await props.searchParams
  const q = raw.q
  const filter = raw.filter
  const currentPage = Math.max(1, parseInt(raw.page ?? '1'))

  const where: Record<string, unknown> = {}
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ]
  }
  if (filter === 'verified') where.emailVerified = true
  if (filter === 'unverified') where.emailVerified = false
  if (filter === 'admin') where.role = 'ADMIN'
  if (filter === 'suspended') where.isSuspended = true

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { _count: { select: { websites: true } } },
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(total / PER_PAGE)
  const searchParams: Record<string, string> = {}
  if (q) searchParams.q = q
  if (filter) searchParams.filter = filter

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-2xl font-black text-gray-950 tracking-tight">Pengguna</h1>
        <p className="text-gray-500 mt-1 font-medium text-sm">{total} total pengguna</p>
      </div>

      <form className="flex items-center gap-3 flex-wrap">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Cari nama atau email..."
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
        />
        <select
          name="filter"
          defaultValue={filter ?? ''}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
        >
          <option value="">Semua</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="admin">Admin</option>
          <option value="suspended">Di-suspend</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm"
        >
          Cari
        </button>
        {(q || filter) && (
          <a
            href="/admin/users"
            className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Reset
          </a>
        )}
      </form>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Pengguna</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Peran</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Status</th>
                <th className="text-center px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Website</th>
                <th className="text-left px-5 py-3.5 font-black text-gray-500 uppercase tracking-wider text-[11px]">Tanggal</th>
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
                      user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        user.isSuspended ? 'bg-red-500' : user.emailVerified ? 'bg-emerald-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs font-semibold text-gray-600">
                        {user.isSuspended ? 'Suspended' : user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center font-bold text-gray-900 text-sm">{user._count.websites}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <UserActions user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="text-center py-12 text-gray-400 font-medium">Tidak ada user ditemukan.</p>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/users" searchParams={searchParams} />
      </div>
    </div>
  )
}
