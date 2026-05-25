'use server'

import { prisma } from '@/lib/prisma'
import { userSchema, loginSchema } from '@/lib/validations'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { sendOTP } from './otp'

// ─── Register ─────────────────────────────────────────────────────────────────

type AuthFormStateData = {
  errors?: {
    email?: string[]
    password?: string[]
    name?: string[]
  }
  message?: string
  email?: string
}

export type AuthFormState = AuthFormStateData | null | undefined

export async function register(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = userSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as AuthFormStateData['errors'] }
  }

  const { email, password, name } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    if (!existing.emailVerified) {
      await prisma.user.delete({ where: { email } })
    } else {
      return { message: 'Email sudah terdaftar.' }
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: { email, passwordHash, name, emailVerified: false },
  })

  const otpResult = await sendOTP(email)
  if (!otpResult.success) {
    return { message: 'Gagal mengirim kode verifikasi. Silakan coba lagi.' }
  }

  redirect(`/verify-otp?email=${encodeURIComponent(email)}`)
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as AuthFormStateData['errors'] }
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return { message: 'Email atau password salah.' }
  }

  if (!user.emailVerified) {
    const otpResult = await sendOTP(email)
    if (otpResult.success) {
      redirect(`/verify-otp?email=${encodeURIComponent(email)}`)
    }
    return { message: 'Email belum diverifikasi. Gagal mengirim ulang OTP.' }
  }

  try {
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { message: 'Email atau password salah.' }
    }

    await createSession(user.id, user.email, user.name)

  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) {
        throw error;
    }
    console.error("Login Error:", error)
    return { message: 'Terjadi kesalahan sistem.' }
  }

  redirect('/dashboard')
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(_formData: FormData) {
  await deleteSession()
  redirect('/login')
}
