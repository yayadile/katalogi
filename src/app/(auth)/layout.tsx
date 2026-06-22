import type { Metadata } from 'next'
import { Sparkles, Shield, Palette, Zap, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Katalogi — Akun',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Decorative concentric rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-indigo-600/10 animate-ring-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-indigo-600/[0.06] animate-ring-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Gradient blur orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[150px] pointer-events-none" />

      {/* Floating decorative icons */}
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '8%', top: '15%' }}>
        <Sparkles className="w-8 h-8 animate-float-icon" />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '5%', top: '75%' }}>
        <Shield className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '88%', top: '20%' }}>
        <Palette className="w-8 h-8 animate-float-icon" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '92%', top: '70%' }}>
        <Zap className="w-7 h-7 animate-float-icon" style={{ animationDelay: '0.3s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '50%', top: '8%' }}>
        <Globe className="w-6 h-6 animate-float-icon" style={{ animationDelay: '0.8s' }} />
      </div>
      <div className="absolute pointer-events-none text-indigo-600/15" style={{ left: '50%', top: '92%' }}>
        <Palette className="w-5 h-5 animate-float-icon" style={{ animationDelay: '1.3s' }} />
      </div>

      <div className="w-full max-w-md animate-fade-in">{children}</div>
    </div>
  )
}
