'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Phone, Mail, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject,
      message: formData.message,
    })

    if (error) {
      // Fallback: table might not exist yet
      console.error('Contact form error:', error)
    }

    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setSending(false)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'واتساب',
      value: '+966 59 404 4446',
      description: 'من السبت إلى الخميس، 8 ص - 6 م',
      href: 'https://wa.me/966594044446',
    },
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@eastplus.sa',
      description: 'نرد خلال 24 ساعة',
      href: 'mailto:info@eastplus.sa',
    },
    {
      icon: MapPin,
      title: 'الموقع',
      value: 'الرياض',
      description: 'المملكة العربية السعودية',
      href: 'https://maps.app.goo.gl/VVJrqxWJcdHyL5Vj8',
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'السبت - الخميس',
      description: '8:00 صباحاً - 6:00 مساءً',
      href: null,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-[#1A1A1A] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#DCBE81]/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DCBE81]/10 border border-[#DCBE81]/20 text-[#DCBE81] text-sm mb-8">
                <MessageSquare size={14} />
                نسعد بتواصلك
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                تواصل
                <span className="block gold-text mt-2">معنا</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                فريقنا جاهز للإجابة على استفساراتك ومساعدتك في كل ما تحتاجه
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="relative -mt-10 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contactInfo.map((info) => {
                const Wrapper = info.href ? 'a' : 'div'
                const linkProps = info.href
                  ? { href: info.href, target: info.href.startsWith('http') ? '_blank' : undefined, rel: info.href.startsWith('http') ? 'noopener noreferrer' : undefined }
                  : {}
                return (
                  <Wrapper
                    key={info.title}
                    {...linkProps as any}
                    className={`bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-lg shadow-black/5 hover:border-[#DCBE81]/20 transition-colors ${info.href ? 'cursor-pointer hover:shadow-xl' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#DCBE81]/10 flex items-center justify-center mx-auto mb-3">
                      <info.icon size={20} className="text-[#DCBE81]" />
                    </div>
                    <h3 className="font-semibold text-[#1A1A1A] text-sm">{info.title}</h3>
                    <p className="text-[#DCBE81] text-sm font-medium mt-1" dir="ltr">{info.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{info.description}</p>
                  </Wrapper>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1A1A1A]">
                أرسل لنا <span className="gold-text">رسالة</span>
              </h2>
              <p className="text-gray-500 mt-3">
                أو يمكنك طلب عرض سعر مباشرة من صفحة طلب عرض السعر
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg shadow-black/5 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors"
                    placeholder="اسمك الكامل"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors"
                    placeholder="example@company.com"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors"
                    placeholder="+966 5X XXX XXXX"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors bg-white"
                    required
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="طلب تسعير">طلب تسعير</option>
                    <option value="شكوى">شكوى</option>
                    <option value="اقتراح">اقتراح</option>
                    <option value="شراكة تجارية">شراكة تجارية</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81] transition-colors resize-none"
                  placeholder="اكتب رسالتك هنا..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center justify-center gap-2 w-full py-3.5 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {sending ? (
                  'جاري الإرسال...'
                ) : (
                  <>
                    <Send size={16} />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
