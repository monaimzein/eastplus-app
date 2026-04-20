'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2,
  FileText,
  Receipt,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    company_name: '',
    commercial_registration: '',
    vat_number: '',
    whatsapp_number: '',
    email: '',
    national_address: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة')
      return
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          company_name: formData.company_name,
          commercial_registration: formData.commercial_registration,
          vat_number: formData.vat_number,
          whatsapp_number: formData.whatsapp_number,
          national_address: formData.national_address,
          role: 'user',
        },
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      // Try to update profile directly (works if email confirmation is off)
      if (data.user) {
        await supabase.from('profiles').update({
          commercial_registration: formData.commercial_registration,
          vat_number: formData.vat_number,
          whatsapp_number: formData.whatsapp_number,
          national_address: formData.national_address,
        }).eq('id', data.user.id)
      }

      toast.success('تم إنشاء الحساب بنجاح!')
      router.push('/auth/login')
    }

    setLoading(false)
  }

  const fields = [
    {
      name: 'company_name',
      label: 'اسم الشركة',
      icon: Building2,
      type: 'text',
      required: true,
      placeholder: 'شركة المثال للمقاولات',
    },
    {
      name: 'commercial_registration',
      label: 'السجل التجاري',
      icon: FileText,
      type: 'text',
      required: false,
      placeholder: '1010XXXXXX',
      dir: 'ltr',
    },
    {
      name: 'vat_number',
      label: 'الرقم الضريبي',
      icon: Receipt,
      type: 'text',
      required: false,
      placeholder: '3XXXXXXXXXXXXXXX',
      dir: 'ltr',
    },
    {
      name: 'whatsapp_number',
      label: 'رقم الواتساب',
      icon: Phone,
      type: 'tel',
      required: true,
      placeholder: '+966 5X XXX XXXX',
      dir: 'ltr',
    },
    {
      name: 'email',
      label: 'البريد الإلكتروني',
      icon: Mail,
      type: 'email',
      required: true,
      placeholder: 'example@company.com',
      dir: 'ltr',
    },
    {
      name: 'national_address',
      label: 'العنوان الوطني',
      icon: MapPin,
      type: 'text',
      required: false,
      placeholder: 'العنوان الوطني الكامل',
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="EAST PLUS" width={64} height={78} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold gold-text">EAST PLUS</h1>
          </Link>
          <p className="text-gray-400 mt-2">إنشاء حساب جديد</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="bg-white/5 backdrop-blur-lg border border-[#DCBE81]/10 rounded-2xl p-8 space-y-5"
        >
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-gray-300 text-sm mb-2">
                {field.label}
                {field.required && (
                  <span className="text-[#DCBE81] mr-1">*</span>
                )}
              </label>
              <div className="relative">
                <field.icon
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-gray-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#DCBE81] transition-colors"
                  placeholder={field.placeholder}
                  required={field.required}
                  dir={field.dir || 'rtl'}
                />
              </div>
            </div>
          ))}

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              كلمة المرور <span className="text-[#DCBE81] mr-1">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              تأكيد كلمة المرور <span className="text-[#DCBE81] mr-1">*</span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-white/5 border border-gray-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#DCBE81] transition-colors"
                placeholder="••••••••"
                required
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            لديك حساب بالفعل؟{' '}
            <Link
              href="/auth/login"
              className="text-[#DCBE81] hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
