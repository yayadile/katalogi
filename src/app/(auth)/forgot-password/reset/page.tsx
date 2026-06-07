'use client'

import { useActionState, Suspense, useEffect } from 'react'
import { resetPassword } from '@/lib/actions/auth'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, ArrowRight, Loader2, KeyRound, XCircle } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') ?? ''
  const otp = searchParams.get('otp') ?? ''
  
  const [state, action, pending] = useActionState(resetPassword, undefined)

  useEffect(() => {
    // If the reset action redirects, it will be handled by Next.js router.
    // We only need to catch the "SUCCESS" message if we didn't redirect.
    if (state?.message === 'SUCCESS') {
      router.push('/login?reset=success')
    }
  }, [state, router])

  if (!email || !otp) {
    return (
      <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-lg text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Tautan Tidak Valid</h1>
        <p className="text-gray-500 mb-8">Informasi sesi tidak lengkap. Silakan ulangi proses lupa sandi.</p>
        <Link href="/forgot-password" className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-br from-indigo-500 to-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Kembali
        </Link>
      </div>
    )
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-12 shadow-lg animate-fade-up overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-indigo-600/10 animate-ring-pulse pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, #4f46e5 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      <div className="text-center mb-10 relative z-10 animate-fade-up delay-100">
        <Link href="/" className="inline-flex items-center mb-6 group">
          <Image src="/logo.png" alt="Katalogi Logo" width={160} height={48} className="h-12 sm:h-14 w-auto rounded-2xl shadow-sm" priority />
        </Link>
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Kata Sandi Baru</h1>
        <p className="text-gray-500 text-sm font-medium">Buat kata sandi baru yang kuat dan mudah diingat.</p>
      </div>

      <form action={action} className="space-y-5 relative z-10">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="otp" value={otp} />

        {state?.message && state.message !== 'SUCCESS' && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl animate-fade-in text-center">
            {state.message}
          </div>
        )}

        <div className="space-y-1.5 animate-fade-up delay-200">
          <label htmlFor="password" className="block text-gray-700 text-xs font-bold uppercase tracking-widest ml-1">
            Kata Sandi Baru
          </label>
          <div className="relative group">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          {state?.errors?.password && (
            <p className="text-red-500 text-xs ml-1 mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-1.5 animate-fade-up delay-300">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-xs font-bold uppercase tracking-widest ml-1">
            Konfirmasi Kata Sandi Baru
          </label>
          <div className="relative group">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-linear-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 flex items-center justify-center gap-2 active:scale-95 animate-fade-up delay-400"
        >
          {pending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Simpan Kata Sandi <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
