'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import Link from 'next/link'
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

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

      {/* Logo */}
      <div className="text-center mb-10 relative z-10 animate-fade-up delay-100">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-gray-900 font-bold text-3xl tracking-tight">Katalogi<span className="text-indigo-600">.</span></span>
        </Link>
        <p className="text-gray-500 text-lg font-medium">Bikin katalog online sekejap.</p>
      </div>

      <form action={action} className="space-y-5 relative z-10">
        {state?.message && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl animate-fade-in">
            {state.message}
          </div>
        )}

        <div className="space-y-1.5 animate-fade-up delay-200">
          <label htmlFor="email" className="block text-gray-700 text-xs font-bold uppercase tracking-widest ml-1">
            Email
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
          {state?.errors?.email && (
            <p className="text-red-500 text-xs ml-1 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1.5 animate-fade-up delay-300">
          <div className="flex items-center justify-between ml-1">
            <label htmlFor="password" className="block text-gray-700 text-xs font-bold uppercase tracking-widest">
              Password
            </label>
          </div>
          <div className="relative group">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
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

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 flex items-center justify-center gap-2 active:scale-95 animate-fade-up delay-400"
        >
          {pending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Masuk <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-10 font-medium animate-fade-up delay-500">
        Belum punya akun?{' '}
        <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold transition">
          Daftar sekarang
        </Link>
      </p>
    </div>
  )
}
