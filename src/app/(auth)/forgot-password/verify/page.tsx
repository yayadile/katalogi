'use client'

import { useActionState, useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyPasswordResetOTP, sendPasswordResetOTP } from '@/lib/actions/otp'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2, Mail, RotateCw, CheckCircle2, XCircle } from 'lucide-react'

type OTPState = { error?: string; success?: boolean; email?: string; otp?: string } | undefined

async function verifyAction(state: OTPState, formData: FormData): Promise<OTPState> {
  return verifyPasswordResetOTP(state, formData)
}

function VerifyPasswordOTPForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') ?? ''
  const [state, action, pending] = useActionState(verifyAction, undefined)
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (state?.success && state.email && state.otp) {
      router.push(`/forgot-password/reset?email=${encodeURIComponent(state.email)}&otp=${encodeURIComponent(state.otp)}`)
    }
  }, [state, router])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtpValues = [...otpValues]
    // Handle pasting multiple digits
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('')
      digits.forEach((d, i) => {
        if (index + i < 6) newOtpValues[index + i] = d
      })
      setOtpValues(newOtpValues)
      const nextEmpty = newOtpValues.findIndex(v => v === '')
      if (nextEmpty !== -1) {
        inputRefs.current[nextEmpty]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
      return
    }

    newOtpValues[index] = value
    setOtpValues(newOtpValues)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (resending || !email) return
    setResending(true)
    setResendMessage('')
    
    try {
      const res = await sendPasswordResetOTP(email)
      if (res.success) {
        setResendMessage('Kode OTP baru telah dikirim!')
      } else {
        setResendMessage(res.error || 'Gagal mengirim OTP.')
      }
    } catch {
      setResendMessage('Terjadi kesalahan.')
    } finally {
      setTimeout(() => setResending(false), 3000)
    }
  }

  if (!email) {
    return (
      <div className="relative bg-white border border-gray-200 rounded-[2.5rem] p-10 shadow-lg text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Tautan Tidak Valid</h1>
        <p className="text-gray-500 mb-8">Email tidak ditemukan. Silakan ulangi proses lupa sandi.</p>
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
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Mail className="w-8 h-8 text-indigo-600" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Cek Email Anda</h1>
        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
          Kami telah mengirimkan 6 digit kode OTP ke email<br/>
          <span className="text-indigo-600 font-bold">{email}</span>
        </p>
      </div>

      <form action={action} className="space-y-6 relative z-10">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="otp" value={otpValues.join('')} />
        
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-2xl animate-fade-in text-center">
            {state.error}
          </div>
        )}

        <div className="animate-fade-up delay-200">
          <div className="flex justify-center gap-2 sm:gap-3 mb-8">
            {otpValues.map((value, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
              />
            ))}
          </div>
        </div>

        <button type="submit" disabled={pending || otpValues.join('').length < 6}
          className="w-full bg-linear-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2 active:scale-95 animate-fade-up delay-300">
          {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verifikasi OTP <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <div className="text-center mt-8 animate-fade-up delay-400 relative z-10">
        <p className="text-gray-500 text-sm mb-3 font-medium">Belum menerima email?</p>
        {resendMessage ? (
          <p className="text-sm font-medium text-green-600 bg-green-50 py-2 px-4 rounded-full inline-block animate-fade-in">{resendMessage}</p>
        ) : (
          <button 
            onClick={handleResend} 
            disabled={resending}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            Kirim ulang kode
          </button>
        )}
      </div>
    </div>
  )
}

export default function VerifyPasswordOTPPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <VerifyPasswordOTPForm />
    </Suspense>
  )
}
