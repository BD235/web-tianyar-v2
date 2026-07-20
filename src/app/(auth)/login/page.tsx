'use client'

import { useState, useTransition, useRef, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ChevronLeft, Loader2 } from 'lucide-react'
import { loginAction, verifyOtpAction, resendOtpAction } from '@/actions/auth.actions'
import { useRouter } from 'next/navigation'

const OTP_LENGTH = 6 // 6 digit OTP

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'login' | 'verify'>('login')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null))

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(''))
      inputRefs.current[OTP_LENGTH - 1]?.focus()
    }
    e.preventDefault()
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    startTransition(async () => {
      const result = await loginAction(null, formData)
      if (result?.error) {
        setError(result.error)
        if (result.isRateLimited) alert(result.error)
      } else if (result?.success) {
        setStep('verify')
      }
    })
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const token = otp.join('')
    if (token.length < OTP_LENGTH) {
      setError(`Masukkan ${OTP_LENGTH} digit kode OTP`)
      return
    }
    const formData = new FormData()
    formData.append('email', email)
    formData.append('token', token)

    startTransition(async () => {
      const result = await verifyOtpAction(null, formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        router.push('/admin')
      }
    })
  }

  const handleResend = () => {
    setError(null)
    startTransition(async () => {
      const result = await resendOtpAction(email)
      if (result?.error) setError(result.error)
      else alert('Kode OTP telah dikirim ulang ke email Anda')
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">

      <div className="fixed top-3 left-0 right-0 z-50 pointer-events-none h-[64px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full h-full flex items-center justify-start">
          <button
            onClick={() => (step === 'verify' ? setStep('login') : router.push('/'))}
            className="pointer-events-auto p-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm">
        <AnimatePresence mode="wait">

          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Admin</h1>
                <p className="text-sm text-gray-500">Masuk ke admin untuk mengelola informasi wisata</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none text-sm text-gray-900 placeholder:text-gray-400"
                      required
                      disabled={isPending}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none text-sm text-gray-900 placeholder:text-gray-400"
                      required
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
                >
                  {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : 'Login'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Kode</h1>
                <p className="text-sm text-gray-500">
                  Kode OTP telah dikirim ke<br />
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-8">

                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 text-center text-xl font-semibold bg-gray-100 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition text-gray-900 disabled:opacity-50"
                      disabled={isPending}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isPending || otp.join('').length < 6}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Memverifikasi...</> : 'Verifikasi'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Tidak menerima kode?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isPending}
                  className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
                >
                  Kirim ulang
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
