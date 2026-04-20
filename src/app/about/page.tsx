import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Image from 'next/image'
import Link from 'next/link'
import { Target, Award, Users, TrendingUp, ArrowLeft, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'من نحن | EAST PLUS',
  description: 'تعرف على EAST PLUS - المنصة الرائدة في توريد مواد البناء والتشطيب في المملكة العربية السعودية',
}

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'مهمتنا',
      description: 'تسهيل عملية توريد مواد البناء وتقديم أفضل الأسعار التنافسية لعملائنا مع ضمان أعلى معايير الجودة.',
    },
    {
      icon: Award,
      title: 'رؤيتنا',
      description: 'أن نكون المنصة الأولى والمرجع الموثوق لتوريد مواد البناء في المملكة العربية السعودية.',
    },
    {
      icon: Users,
      title: 'فريقنا',
      description: 'فريق متخصص من ذوي الخبرة في قطاع البناء والتوريد يعمل على تلبية احتياجاتكم على مدار الساعة.',
    },
    {
      icon: TrendingUp,
      title: 'نمونا',
      description: 'نسعى دائماً للتطور والنمو من خلال بناء شراكات قوية مع أكبر الموردين والمصنعين.',
    },
  ]

  const stats = [
    { value: '+500', label: 'عميل راضٍ' },
    { value: '+1000', label: 'طلب تسعير منجز' },
    { value: '+50', label: 'مورد شريك' },
    { value: '24h', label: 'متوسط وقت الرد' },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-[#1A1A1A] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#DCBE81]/5 to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#DCBE81]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#DCBE81]/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DCBE81]/10 border border-[#DCBE81]/20 text-[#DCBE81] text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-[#DCBE81] animate-pulse" />
                تعرف علينا أكثر
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                شريكك الموثوق في
                <span className="block gold-text mt-2">توريد مواد البناء</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                EAST PLUS منصة سعودية متخصصة في توريد مواد البناء والتشطيب، نربط بين
                المقاولين والموردين لتوفير أفضل الأسعار وأعلى جودة.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative -mt-10 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-lg shadow-black/5"
                >
                  <p className="text-3xl font-bold gold-text">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                قيمنا <span className="gold-text">ومبادئنا</span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-lg mx-auto">
                نلتزم بمجموعة من القيم التي تميزنا في سوق توريد مواد البناء
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group p-8 bg-white rounded-2xl border border-gray-100 hover:border-[#DCBE81]/20 hover:shadow-xl hover:shadow-[#DCBE81]/5 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <value.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{value.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-12">
                لماذا <span className="gold-text">EAST PLUS؟</span>
              </h2>
              <div className="space-y-5">
                {[
                  'أسعار تنافسية من خلال شبكة واسعة من الموردين',
                  'سرعة في الاستجابة والتسعير خلال 24 ساعة',
                  'جودة مضمونة من أفضل العلامات التجارية',
                  'خدمة عملاء متخصصة على مدار الساعة',
                  'شفافية كاملة في التسعير والتوريد',
                  'تغطية شاملة لجميع مناطق المملكة',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#DCBE81]/10 flex items-center justify-center shrink-0">
                      <CheckCircle size={18} className="text-[#DCBE81]" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-gray-500 mb-10 max-w-lg mx-auto">
              أرسل طلب عرض سعر الآن واحصل على أفضل الأسعار من موردينا المعتمدين
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/rfq/new"
                className="flex items-center gap-2 px-8 py-4 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#DCBE81]/25"
              >
                طلب عرض سعر
                <ArrowLeft size={18} />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#DCBE81] hover:text-[#DCBE81] transition-colors"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
