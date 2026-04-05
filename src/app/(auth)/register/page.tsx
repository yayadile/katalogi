'use client'

import { useActionState } from 'react'
import { register } from '@/lib/actions/auth'
import Link from 'next/link'
import { Sparkles, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      {/* Logo */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-white font-bold text-3xl tracking-tight">Katalogi<span className="text-indigo-400">.</span></span>
        </Link>
        <p className="text-slate-400 text-lg font-medium">Buat akun gratis Anda</p>
      </div>

      <form action={action} className="space-y-5">
        {state?.message && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-2xl animate-shake">
            {state.message}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">
            Nama Lengkap
          </label>
          <div className="relative group">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Joko Susanto"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          {state?.errors?.name && (
            <p className="text-red-400 text-xs ml-1 mt-1">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">
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
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          {state?.errors?.email && (
            <p className="text-red-400 text-xs ml-1 mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-slate-300 text-xs font-bold uppercase tracking-widest ml-1">
            Password
          </label>
          <div className="relative group">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Min. 8 karakter"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-2xl px-5 py-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          {state?.errors?.password && (
            <p className="text-red-400 text-xs ml-1 mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2 flex items-center justify-center gap-2 active:scale-95"
        >
          {pending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Daftar Sekarang <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>

      <p className="text-center text-slate-500 text-sm mt-10 font-medium">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition">
          Masuk
        </Link>
      </p>
    </div>
  )
}
