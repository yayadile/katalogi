'use client'

import { useActionState, useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyOTP, sendOTP } from '@/lib/actions/otp'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2, Mail, RotateCw, CheckCircle2, XCircle } from 'lucide-react'

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
      <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-12 shadow-lg text-center overflow-hidden animate-fade-up">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Tautan Tidak Valid</h1>
          <p className="text-gray-500 mb-8">Email tidak ditemukan. Silakan daftar ulang.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-12 shadow-lg animate-fade-up overflow-hidden">
      {/* Decorative ring behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-indigo-600/10 animate-ring-pulse pointer-events-none" />

      {/* Decorative dot pattern inside card */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="text-center mb-10 relative z-10 animate-fade-up delay-100">
        <Link href="/" className="inline-flex items-center mb-6 group">
          <Image 
            src="/logo1.svg" 
            alt="Katalogi Logo" 
            width={160} 
            height={48} 
            className="h-10 sm:h-12 w-auto" 
            priority
          />
        </Link>
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cek Email Anda</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Kami telah mengirim kode OTP 6 digit ke <strong className="text-gray-700">{email}</strong>
        </p>
      </div>

      <form action={action} className="space-y-6 relative z-10">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl animate-fade-in flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {state.error}
          </div>
        )}

        {resendMsg && (
          <div className={`text-sm px-5 py-4 rounded-2xl flex items-center gap-2 animate-fade-in ${
            resendMsg.includes('dikirim') ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {resendMsg.includes('dikirim') ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
            {resendMsg}
          </div>
        )}

        <input type="hidden" name="email" value={email} />

        <div className="space-y-1.5 animate-fade-up delay-200">
          <label htmlFor="otp" className="block text-gray-700 text-xs font-bold uppercase tracking-widest ml-1">
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
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 rounded-2xl px-5 py-4 text-center text-3xl font-mono tracking-[12px] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
        </div>

        <button type="submit" disabled={pending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2 active:scale-95 animate-fade-up delay-300">
          {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verifikasi <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <div className="text-center mt-8 animate-fade-up delay-400">
        <button
          onClick={handleResend}
          disabled={resending || countdown > 0}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
      <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-12 shadow-lg text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #4f46e5 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-indigo-600/10 animate-ring-pulse pointer-events-none" />
        <div className="relative z-10">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
        </div>
      </div>
    }>
      <VerifyOTPForm />
    </Suspense>
  )
}
