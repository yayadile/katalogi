'use server'

import { prisma } from '@/lib/prisma'
import { generateOTP, sendOTPEmail } from '@/lib/mail'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'

type OTPResult = { success: true } | { success: false; error: string }

export async function sendOTP(email: string): Promise<OTPResult> {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'Email tidak ditemukan.' }
    }
    if (user.emailVerified) {
      return { success: false, error: 'Email sudah diverifikasi.' }
    }

    await prisma.verificationToken.updateMany({
      where: { email, type: 'EMAIL_VERIFICATION', usedAt: null },
      data: { usedAt: new Date() },
    })

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
      },
    })

    await sendOTPEmail(email, otp)

    return { success: true }
  } catch (error) {
    console.error('sendOTP error:', error)
    return { success: false, error: 'Gagal mengirim OTP.' }
  }
}

export async function verifyOTP(
  _state: { error?: string; success?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  if (!email || !otp) {
    return { error: 'Email dan kode OTP wajib diisi.' }
  }

  if (!/^\d{6}$/.test(otp)) {
    return { error: 'Kode OTP harus 6 digit angka.' }
  }

  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return { error: 'Kode OTP tidak valid atau sudah kedaluwarsa.' }
    }

    await prisma.verificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    })

    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    })

    await createSession(user.id, user.email, user.name)

    return { success: true }
  } catch (error) {
    console.error('verifyOTP error:', error)
    return { error: 'Terjadi kesalahan sistem.' }
  }
}

export async function verifyOTPRedirect(
  _state: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  if (!email || !otp) {
    return { error: 'Email dan kode OTP wajib diisi.' }
  }

  if (!/^\d{6}$/.test(otp)) {
    return { error: 'Kode OTP harus 6 digit angka.' }
  }

  try {
    const token = await prisma.verificationToken.findFirst({
      where: {
        email,
        token: otp,
        type: 'EMAIL_VERIFICATION',
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return { error: 'Kode OTP tidak valid atau sudah kedaluwarsa.' }
    }

    await prisma.verificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    })

    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    })

    await createSession(user.id, user.email, user.name)
  } catch (error) {
    console.error('verifyOTPRedirect error:', error)
    return { error: 'Terjadi kesalahan sistem.' }
  }

  redirect('/dashboard')
}

export async function sendPasswordResetOTP(email: string): Promise<OTPResult> {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'Email tidak terdaftar.' }
    }

    // Invalidate old tokens
    await prisma.verificationToken.updateMany({
      where: { email, type: 'PASSWORD_RESET', usedAt: null },
      data: { usedAt: new Date() },
    })

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        type: 'PASSWORD_RESET',
        expiresAt,
      },
    })

    // Reusing the same email template or create a generic one
    await sendOTPEmail(email, otp)

    return { success: true }
  } catch (error) {
    console.error('sendPasswordResetOTP error:', error)
    return { success: false, error: 'Gagal mengirim OTP.' }
  }
}

export async function verifyPasswordResetOTP(
  _state: { error?: string; success?: boolean } | undefined,
  formData: FormData,
): Promise<{ error?: string; success?: boolean; email?: string; otp?: string }> {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  if (!email || !otp) {
    return { error: 'Email dan kode OTP wajib diisi.' }
  }

  if (!/^\d{6}$/.test(otp)) {
    return { error: 'Kode OTP harus 6 digit angka.' }
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
      return { error: 'Kode OTP tidak valid atau sudah kedaluwarsa.' }
    }

    // Do NOT update usedAt here because we need it for the final reset step
    // Or we update it and rely on the UI state, but relying on UI state is less secure if the user reloads.
    // Instead, we just verify it exists here, and we'll mark it as used when they actually reset the password.
    
    return { success: true, email, otp }
  } catch (error) {
    console.error('verifyPasswordResetOTP error:', error)
    return { error: 'Terjadi kesalahan sistem.' }
  }
}
