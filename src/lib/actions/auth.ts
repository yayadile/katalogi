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

  const adminEmail = process.env.ADMIN_EMAIL
  const isAdmin = !!(adminEmail && email === adminEmail)

  const existing = await prisma.user.findUnique({ where: { email } })
  let userId: string

  if (existing) {
    if (existing.emailVerified) {
      return { message: 'Email sudah terdaftar.' }
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { email },
      data: { passwordHash, name, emailVerified: isAdmin, role: isAdmin ? 'ADMIN' : 'USER' },
    })
    userId = existing.id
  } else {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash, name, emailVerified: isAdmin, role: isAdmin ? 'ADMIN' : 'USER' },
    })
    userId = user.id
  }

  if (isAdmin) {
    await createSession(userId, email, name, 'ADMIN')
    redirect('/admin')
  }

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

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && user.email === adminEmail && user.role !== 'ADMIN') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' },
      })
    }

    const role = adminEmail && user.email === adminEmail ? 'ADMIN' : user.role

    await createSession(user.id, user.email, user.name, role)

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

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!email || !otp || !password || !confirmPassword) {
    return { message: 'Semua kolom wajib diisi.' }
  }

  if (password.length < 6) {
    return { errors: { password: ['Password minimal 6 karakter.'] } }
  }

  if (password !== confirmPassword) {
    return { message: 'Konfirmasi password tidak cocok.' }
  }

  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
        token: otp,
        type: 'PASSWORD_RESET',
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return { message: 'Sesi reset password tidak valid atau sudah kedaluwarsa. Silakan ulangi.' }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    })

    await prisma.verificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    })
  } catch (error) {
    console.error('resetPassword error:', error)
    return { message: 'Terjadi kesalahan sistem.' }
  }

  redirect('/login?reset=success')
}
