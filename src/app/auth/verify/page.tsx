import Link from 'next/link'
import { MailCheck } from 'lucide-react'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/5 backdrop-blur-lg border border-[#DCBE81]/10 rounded-2xl p-10">
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
            <MailCheck size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            تحقق من بريدك الإلكتروني
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            تم إرسال رابط التفعيل إلى بريدك الإلكتروني. يرجى فتح الرابط لتفعيل
            حسابك والبدء في استخدام المنصة.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}
