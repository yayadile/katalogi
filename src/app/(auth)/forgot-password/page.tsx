'use client'

import { useState } from 'react'
import { sendPasswordResetOTP } from '@/lib/actions/otp'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    
    if (!email) {
      setError('Email wajib diisi.')
      setPending(false)
      return
    }

    try {
      const res = await sendPasswordResetOTP(email)
      if (res.success) {
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
      } else {
        setError(res.error || 'Terjadi kesalahan sistem.')
        setPending(false)
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem.')
      setPending(false)
    }
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 md:p-12 shadow-lg animate-fade-up overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-indigo-600/10 animate-ring-pulse pointer-events-none" />

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
            src="/logo.png" 
            alt="Katalogi Logo" 
            width={160} 
            height={48} 
            className="h-12 sm:h-14 w-auto rounded-2xl shadow-sm" 
            priority
          />
        </Link>
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Kata Sandi?</h1>
        <p className="text-gray-500 text-sm font-medium">Jangan khawatir, masukkan email Anda dan kami akan mengirimkan kode reset.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-1.5 animate-fade-up delay-200">
          <label htmlFor="email" className="block text-gray-700 text-xs font-bold uppercase tracking-widest ml-1">
            Email Terdaftar
          </label>
          <div className="relative group">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nama@email.com"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-linear-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 flex items-center justify-center gap-2 active:scale-95 animate-fade-up delay-300"
        >
          {pending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Kirim Kode OTP <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-10 font-medium animate-fade-up delay-400">
        Ingat kata sandi Anda?{' '}
        <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition">
          Kembali ke Login
        </Link>
      </p>
    </div>
  )
}
