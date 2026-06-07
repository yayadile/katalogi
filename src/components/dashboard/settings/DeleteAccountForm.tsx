'use client'

import { useState } from 'react'
import { deleteAccount } from '@/lib/actions/settings'
import { TriangleAlert, Loader2 } from 'lucide-react'

export function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await deleteAccount(null, formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    }
    // If success, it redirects via deleteSession/next-navigation
  }

  return (
    <div className="py-8 flex flex-col md:flex-row md:items-start gap-6 md:gap-16 group">
      <div className="md:w-1/3 shrink-0">
        <h2 className="text-base font-bold text-slate-900">
          Penghapusan Akun
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</p>
      </div>

      <div className="flex-1 max-w-lg">
        <p className="text-slate-600 font-medium text-sm mb-6 leading-relaxed">
          Menghapus akun Anda akan secara permanen menghapus seluruh data katalog, riwayat pengunjung, serta pengaturan profil Anda dari peladen kami. Harap pastikan Anda telah mencadangkan data yang diperlukan.
        </p>

        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-all duration-300 border border-red-100 active:scale-[0.98] text-sm"
          >
            Hapus Akun Permanen
          </button>
        ) : (
          <form onSubmit={handleDelete} className="space-y-5 bg-red-50/30 p-6 rounded-2xl border border-red-100 animate-in fade-in zoom-in-95 duration-200">
            {error && (
              <div className="p-4 bg-white text-red-600 text-sm font-bold rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="password-delete" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                id="password-delete"
                name="password"
                required
                className="w-full px-4 py-3 bg-white border border-red-200 focus:bg-white rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-300 font-bold text-slate-900"
                placeholder="Kata sandi saat ini"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98] text-sm"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Hapus Permanen
              </button>
              <button
                type="button"
                onClick={() => { setIsOpen(false); setError('') }}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all text-center active:scale-[0.98] text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

