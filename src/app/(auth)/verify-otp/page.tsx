'use client'

import { useActionState, useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyOTP, sendOTP } from '@/lib/actions/otp'
import Link from 'next/link'
import { Sparkles, ArrowRight, Loader2, Mail, RotateCw, CheckCircle2, XCircle } from 'lucide-react'

type OTPState = { error?: string; success?: boolean } | undefined

async function verifyAction(state: OTPState, formData: FormData): Promise<OTPState> {
  return verifyOTP(state, formData)
}

function VerifyOTPForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') ?? ''
  const [state, action, pending] = useActionState(verifyAction, undefined)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard')
    }
  }, [state?.success, router])

  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0 || !email) return
    setResending(true)
    setResendMsg(null)
    const result = await sendOTP(email)
    setResending(false)
    if (result.success) {
      setResendMsg('Kode OTP baru telah dikirim!')
      setCountdown(60)
    } else {
      setResendMsg(result.error ?? 'Gagal mengirim ulang.')
    }
  }

  if (!email) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-3">Tautan Tidak Valid</h1>
        <p className="text-slate-400 mb-8">Email tidak ditemukan. Silakan daftar ulang.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Kembali ke Daftar
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-bold text-3xl tracking-tight">Katalogi<span className="text-indigo-400">.</span></span>
        </Link>
        <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Cek Email Anda</h1>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          Kami telah mengirim kode OTP 6 digit ke <strong className="text-slate-300">{email}</strong>
        </p>
      </div>

      <form action={action} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-2xl animate-shake flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
          </div>
        )}

        {resendMsg && (
          <div className={`text-sm px-5 py-4 rounded-2xl flex items-center gap-2 ${
            resendMsg.includes('dikirim') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {resendMsg.includes('dikirim') ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
            {resendMsg}
          </div>
        )}

        <input type="hidden" name="email" value={email} />

        <div className="space-y-1.5">
          <label htmlFor="otp" className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">
            Kode OTP
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            placeholder="000000"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl px-5 py-4 text-center text-3xl font-mono tracking-[12px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <button type="submit" disabled={pending}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2 active:scale-95">
          {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verifikasi <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <div className="text-center mt-8">
        <button
          onClick={handleResend}
          disabled={resending || countdown > 0}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
          {countdown > 0
            ? `Kirim ulang (${countdown}s)`
            : resending
              ? 'Mengirim...'
              : 'Kirim ulang kode'}
        </button>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl text-center">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
      </div>
    }>
      <VerifyOTPForm />
    </Suspense>
  )
}
