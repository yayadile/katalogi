'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MoreVertical, UserX, UserCheck, Shield, ShieldOff, Trash2, Eye } from 'lucide-react'
import { suspendUser, unsuspendUser, deleteUser, setUserRole } from '@/lib/actions/admin'

type User = {
  id: string
  name: string | null
  email: string
  role: string
  isSuspended: boolean
  _count: { websites: number }
}

export function UserActions({ user }: { user: User }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 min-w-[180px]">
            <Link
              href={`/admin/users/${user.id}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-400" />
              Detail
            </Link>

            {user.role !== 'ADMIN' && (
              <form
                action={async () => {
                  if (confirm(`Yakin ingin ${user.isSuspended ? 'aktifkan kembali' : 'nonaktifkan'} pengguna ini?`)) {
                    if (user.isSuspended) {
                      await unsuspendUser(user.id)
                    } else {
                      await suspendUser(user.id)
                    }
                  }
                  setOpen(false)
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                >
                  {user.isSuspended ? (
                    <><UserCheck className="w-4 h-4 text-emerald-500" /> Aktifkan</>
                  ) : (
                    <><UserX className="w-4 h-4 text-red-500" /> Nonaktifkan</>
                  )}
                </button>
              </form>
            )}

            <form
              action={async () => {
                const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
                if (confirm(`Ubah role ${user.email} menjadi ${newRole}?`)) {
                  await setUserRole(user.id, newRole as 'USER' | 'ADMIN')
                }
                setOpen(false)
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
              >
                {user.role === 'ADMIN' ? (
                  <><ShieldOff className="w-4 h-4 text-amber-500" /> Turunkan ke User</>
                ) : (
                  <><Shield className="w-4 h-4 text-indigo-500" /> Jadikan Admin</>
                )}
              </button>
            </form>

            {user.role !== 'ADMIN' && (
              <form
                action={async () => {
                  if (confirm(`Hapus user ${user.email}? Semua website akan ikut terhapus.`)) {
                    await deleteUser(user.id)
                  }
                  setOpen(false)
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100 mt-1 pt-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus User
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  )
}
