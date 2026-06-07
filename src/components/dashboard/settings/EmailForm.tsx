'use client'

import { useState } from 'react'
import { initiateEmailChange, confirmEmailChange } from '@/lib/actions/settings'
import { Mail, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'

export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function handleInitiate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const result = await initiateEmailChange(null, formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setNewEmail(result.email)
      setStep(2)
      setSuccess('Kode OTP telah dikirim ke email baru Anda.')
    }
    setIsPending(false)
  }

  async function handleConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('email', newEmail)
    const result = await confirmEmailChange(null, formData)
    
    if (result.error) {
      setError(result.error)
      setSuccess('')
    } else if (result.success) {
      setSuccess(result.success)
      // Reset after success
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
    setIsPending(false)
  }

  return (
    <div className="py-8 flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
      <div className="md:w-1/3 shrink-0">
        <h2 className="text-base font-bold text-slate-900">Alamat Email</h2>
        <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">Email untuk login dan notifikasi akun Anda.</p>
      </div>

      <div className="flex-1 max-w-lg">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-emerald-50/50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 flex items-center gap-3 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleInitiate} className="space-y-5">
          <div>
            <label htmlFor="newEmail" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Baru</label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              placeholder={currentEmail}
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
              Kirim OTP ke Email Baru
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-2">
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              Kami telah mengirimkan 6 digit kode OTP ke <span className="font-bold text-slate-900">{newEmail}</span>.
            </p>
          </div>
          <div>
            <label htmlFor="otp" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Kode OTP (6 Digit)</label>
            <input
              type="text"
              id="otp"
              name="otp"
              required
              maxLength={6}
              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all duration-300 font-black text-center text-xl tracking-[0.5em] text-slate-900"
              placeholder="••••••"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98] text-sm"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Verifikasi & Simpan
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setSuccess(''); setError('') }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all text-center active:scale-[0.98] text-sm"
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

