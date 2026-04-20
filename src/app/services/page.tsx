import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Link from 'next/link'
import {
  Wrench,
  Zap,
  Building,
  Droplets,
  ShieldCheck,
  Paintbrush,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'خدماتنا | EAST PLUS',
  description: 'تعرف على خدمات EAST PLUS في توريد مواد السباكة والكهرباء ومواد البناء والتشييد والأدوات الصحية',
}

const services = [
  {
    icon: Wrench,
    title: 'مواد السباكة',
    description: 'توريد جميع مواد السباكة من أنابيب ومحابس وخلاطات وسخانات من أفضل العلامات التجارية.',
    features: ['أنابيب PPR و PVC', 'محابس وصمامات', 'خلاطات وحنفيات', 'سخانات مياه', 'مضخات مياه', 'ملحقات السباكة'],
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop',
  },
  {
    icon: Zap,
    title: 'مواد الكهرباء',
    description: 'توفير كافة مستلزمات التمديدات الكهربائية والإنارة بمواصفات عالية.',
    features: ['كابلات وأسلاك', 'لوحات توزيع', 'قواطع كهربائية', 'مفاتيح وأفياش', 'إنارة داخلية وخارجية', 'أنظمة حماية'],
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop',
  },
  {
    icon: Building,
    title: 'مواد البناء والتشييد',
    description: 'توريد مواد البناء الأساسية من إسمنت وحديد وبلوك وغيرها.',
    features: ['إسمنت بأنواعه', 'حديد تسليح', 'بلوك وطوب', 'خرسانة جاهزة', 'رمل ومواد ردم', 'مواد لياسة'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
  },
  {
    icon: Droplets,
    title: 'الأدوات الصحية',
    description: 'تشكيلة واسعة من الأدوات الصحية الحديثة من ماركات عالمية.',
    features: ['أطقم حمامات', 'مغاسل وأحواض', 'مراحيض ومباول', 'بانيو وشاور', 'إكسسوارات حمامات', 'خزانات مياه'],
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
  },
  {
    icon: ShieldCheck,
    title: 'مواد العزل',
    description: 'حلول عزل متكاملة للحماية من الحرارة والرطوبة والصوت.',
    features: ['عزل حراري', 'عزل مائي', 'عزل صوتي', 'ألواح عزل', 'أغشية عازلة', 'مواد لاصقة'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop',
  },
  {
    icon: Paintbrush,
    title: 'مواد التشطيب',
    description: 'كل ما تحتاجه لتشطيب مشروعك بأعلى جودة وأفضل المواد.',
    features: ['دهانات وبويات', 'بلاط وسيراميك', 'رخام وجرانيت', 'جبس وأسقف', 'أبواب ونوافذ', 'أرضيات خشبية'],
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop',
  },
]

export default function ServicesPage() {
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
                <span className="w-2 h-2 rounded-full bg-[#DCBE81] animate-pulse" />
                خدمات متكاملة
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                خدماتنا
                <span className="block gold-text mt-2">المتخصصة</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                نوفر لك تشكيلة شاملة من مواد البناء والتشطيب بأسعار تنافسية وجودة مضمونة
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-20">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="lg:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-80 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 to-transparent" />
                      <div className="absolute bottom-6 right-6">
                        <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                          <service.icon size={24} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <CheckCircle size={14} className="text-[#DCBE81] shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/rfq/new"
                      className="inline-flex items-center gap-2 text-[#DCBE81] font-semibold hover:gap-3 transition-all"
                    >
                      طلب عرض سعر
                      <ArrowLeft size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1A1A1A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              لم تجد ما تبحث عنه؟
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              تواصل معنا وأخبرنا بما تحتاجه وسنوفره لك بأفضل الأسعار
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/rfq/new"
                className="flex items-center gap-2 px-8 py-4 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                طلب عرض سعر
                <ArrowLeft size={18} />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:border-[#DCBE81] hover:text-[#DCBE81] transition-colors"
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
