'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 gold-gradient" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%2020h40v1H0zM20%200v40h1V0z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] " />

          <div className="relative z-10 text-center py-16 px-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              جاهز تبدأ مشروعك؟
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-lg mx-auto">
              احصل على عرض سعر شامل لجميع المواد التي تحتاجها خلال 24 ساعة فقط
            </p>
            <Link
              href="/rfq/new"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white font-semibold rounded-2xl hover:bg-[#2A2A2A] transition-colors text-lg"
            >
              اطلب عرض سعر الآن
              <ArrowLeft size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
