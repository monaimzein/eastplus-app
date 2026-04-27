'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginAction } from './actions'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await loginAction(email, password)

    if ('error' in result) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success('تم تسجيل الدخول بنجاح')
    // router.refresh() forces the server to re-read cookies set by the action.
    // router.replace() navigates without a full page reload, so cookies stay synced.
    router.refresh()
    router.replace(result.redirectTo)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="EAST PLUS" width={64} height={78} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold gold-text">EAST PLUS</h1>
          </Link>
          <p className="text-gray-400 mt-2">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="bg-white/5 backdrop-blur-lg border border-[#DCBE81]/10 rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-gray-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#DCBE81] transition-colors"
                placeholder="example@company.com"
                required
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-gray-700 rounded-xl pr-10 pl-10 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#DCBE81] transition-colors"
                placeholder="••••••••"
                required
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            ليس لديك حساب؟{' '}
            <Link
              href="/auth/signup"
              className="text-[#DCBE81] hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
