'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/lib/actions/settings'
import { User, Loader2, CheckCircle2 } from 'lucide-react'

export function ProfileForm({ currentName }: { currentName: string }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <div className="py-8 flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
      <div className="md:w-1/3 shrink-0">
        <h2 className="text-base font-bold text-slate-900">Profil Publik</h2>
        <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">Ubah nama yang ditampilkan di dasbor Anda.</p>
      </div>

      <form action={formAction} className="flex-1 space-y-5 max-w-lg">
        {state?.error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="p-4 bg-emerald-50/50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {state.success}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={currentName}
            required
            className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all duration-300 text-slate-900 font-bold"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 active:scale-[0.98] text-sm"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  )
}

