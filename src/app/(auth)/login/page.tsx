'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">Katalogi</span>
        </div>
        <p className="text-slate-400 text-sm">Masuk ke akun Anda</p>
      </div>

      <form action={action} className="space-y-4">
        {state?.message && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
            {state.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-slate-300 text-sm font-medium mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nama@email.com"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          {state?.errors?.email && (
            <p className="text-red-400 text-xs mt-1">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-slate-300 text-sm font-medium mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          {state?.errors?.password && (
            <p className="text-red-400 text-xs mt-1">{state.errors.password[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
        >
          {pending ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="text-center text-slate-400 text-sm mt-6">
        Belum punya akun?{' '}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
          Daftar sekarang
        </Link>
      </p>
    </div>
  )
}
