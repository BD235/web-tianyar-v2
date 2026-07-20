'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'

// Rate limit 1 menit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 1000

function checkRateLimit(identifier: string) {
  const now = Date.now()

  // Lazy cleanup entry yang sudah expired untuk mencegah memory leak di server
  if (rateLimitMap.size > 30) {
    for (const [key, record] of rateLimitMap) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key)
      }
    }
  }

  const record = rateLimitMap.get(identifier)

  if (record) {
    if (now > record.resetAt) {
      rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
      return { success: true }
    }
    if (record.count >= RATE_LIMIT_MAX) {
      return { success: false, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
    }
    record.count += 1
    rateLimitMap.set(identifier, record)
    return { success: true }
  }

  rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
  return { success: true }
}

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

// Step 1: Kirim OTP
export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const rateLimit = checkRateLimit(email || 'global')
  if (!rateLimit.success) {
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${rateLimit.retryAfter} detik.`,
      isRateLimited: true,
    }
  }

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (signInError) {
    return { error: 'Email atau password salah.' }
  }

    // Sign out sesi lama sebelum OTP
  await supabase.auth.signOut()

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
  })

  if (otpError) {
    console.error('[OTP Error]', otpError)
    return { error: `Gagal kirim OTP: ${otpError.message || 'Cek konfigurasi SMTP Supabase'}` }
  }

  return { success: true, email: parsed.data.email }
}

// Step 2: Verifikasi OTP
export async function verifyOtpAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const rateLimit = checkRateLimit(`otp-${email || 'global'}`)
  if (!rateLimit.success) {
    return { error: `Terlalu banyak percobaan. Coba lagi dalam ${rateLimit.retryAfter} detik.` }
  }

  if (!token || token.length < 6) {
    return { error: 'Kode OTP tidak lengkap.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    return { error: 'Kode OTP salah atau sudah kadaluarsa.' }
  }

  return { success: true }
}

// Kirim ulang OTP
export async function resendOtpAction(email: string) {
  const rateLimit = checkRateLimit(`resend-${email}`)
  if (!rateLimit.success) {
    return { error: `Terlalu banyak percobaan. Coba lagi dalam ${rateLimit.retryAfter} detik.` }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({ email })

  if (error) {
    console.error('[Resend OTP Error]', error)
    return { error: `Gagal kirim ulang: ${error.message}` }
  }

  return { success: true }
}

// Logout
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
