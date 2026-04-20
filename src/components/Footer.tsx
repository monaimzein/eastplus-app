import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ArrowLeft, ExternalLink } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A1A] text-white relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#DCBE81]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top CTA */}
        <div className="py-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">جاهز لطلب عرض سعر؟</h3>
              <p className="text-gray-400 mt-1">احصل على أفضل الأسعار خلال 24 ساعة</p>
            </div>
            <Link
              href="/rfq/new"
              className="flex items-center gap-2 px-8 py-3.5 gold-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#DCBE81]/20"
            >
              طلب عرض سعر
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="EAST PLUS"
                width={36}
                height={44}
                className="brightness-110"
              />
              <span className="text-xl font-bold gold-text tracking-wider">
                EAST PLUS
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              منصة متخصصة في توريد مواد البناء والتشطيب. نوفر لك أفضل الأسعار
              من أكبر الموردين في المملكة العربية السعودية.
            </p>
            {/* Social icons placeholder */}
            <div className="flex gap-3">
              {['X', 'In', 'IG'].map((social) => (
                <div
                  key={social}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-400 hover:bg-[#DCBE81]/20 hover:text-[#DCBE81] hover:border-[#DCBE81]/30 transition-all cursor-pointer"
                >
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#DCBE81] font-semibold mb-5 flex items-center gap-2">
              <div className="w-1 h-4 gold-gradient rounded-full" />
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/about', label: 'من نحن' },
                { href: '/services', label: 'خدماتنا' },
                { href: '/contact', label: 'تواصل معنا' },
                { href: '/blog', label: 'المدونة' },
                { href: '/rfq/new', label: 'طلب عرض سعر' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#DCBE81] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowLeft
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#DCBE81] font-semibold mb-5 flex items-center gap-2">
              <div className="w-1 h-4 gold-gradient rounded-full" />
              خدماتنا
            </h4>
            <ul className="space-y-3">
              {[
                'توريد مواد السباكة',
                'توريد مواد الكهرباء',
                'مواد البناء والتشييد',
                'الأدوات الصحية',
                'مواد العزل',
                'أدوات التشطيب',
              ].map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DCBE81]/50" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#DCBE81] font-semibold mb-5 flex items-center gap-2">
              <div className="w-1 h-4 gold-gradient rounded-full" />
              تواصل معنا
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/966594044446"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 text-sm hover:text-[#DCBE81] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#DCBE81]/30 transition-colors">
                    <Phone size={14} className="text-[#DCBE81]" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-0.5">واتساب</span>
                    <span dir="ltr">+966 59 404 4446</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@eastplus.sa"
                  className="flex items-start gap-3 text-gray-400 text-sm hover:text-[#DCBE81] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#DCBE81]/30 transition-colors">
                    <Mail size={14} className="text-[#DCBE81]" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-0.5">البريد الإلكتروني</span>
                    info@eastplus.sa
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/VVJrqxWJcdHyL5Vj8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 text-sm hover:text-[#DCBE81] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#DCBE81]/30 transition-colors">
                    <MapPin size={14} className="text-[#DCBE81]" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 mb-0.5">الموقع</span>
                    الرياض، المملكة العربية السعودية
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} EAST PLUS. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-500 text-xs hover:text-[#DCBE81] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/about" className="text-gray-500 text-xs hover:text-[#DCBE81] transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
