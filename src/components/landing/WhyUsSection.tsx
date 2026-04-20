'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, BadgePercent, Headphones } from 'lucide-react'

const reasons = [
  {
    icon: BadgePercent,
    title: 'أسعار تنافسية',
    description: 'نتعامل مع شبكة واسعة من الموردين لنوفر لك أفضل الأسعار في السوق.',
  },
  {
    icon: Clock,
    title: 'سرعة في التنفيذ',
    description: 'نلتزم بتقديم عروض الأسعار خلال 24 ساعة كحد أقصى.',
  },
  {
    icon: Shield,
    title: 'ضمان الجودة',
    description: 'جميع المواد من ماركات عالمية معتمدة ومطابقة للمواصفات السعودية.',
  },
  {
    icon: Headphones,
    title: 'دعم متواصل',
    description: 'فريق متخصص جاهز لخدمتك من تقديم الطلب وحتى التوريد.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#DCBE81] text-sm font-semibold">لماذا إيست بلس؟</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-3">
            شريكك <span className="gold-text">الموثوق</span> في التوريد
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#DCBE81]/30 hover:shadow-lg hover:shadow-[#DCBE81]/5 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-6">
                <reason.icon size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
