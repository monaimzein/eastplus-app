'use client'

import { motion } from 'framer-motion'
import { Upload, FileSearch, FileCheck } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    number: '01',
    title: 'ارفع طلبك',
    description: 'سجّل حسابك وارفع تفاصيل المواد المطلوبة مع الصور والمواصفات.',
  },
  {
    icon: FileSearch,
    number: '02',
    title: 'نراجع ونجهز العرض',
    description: 'فريقنا يراجع طلبك ويتواصل مع شبكة الموردين لتجهيز أفضل عرض.',
  },
  {
    icon: FileCheck,
    number: '03',
    title: 'تستلم عرض السعر خلال 24 ساعة',
    description: 'تحصل على عرض سعر تفصيلي شامل التوريد والتوصيل.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#1A1A1A] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#DCBE81]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DCBE81]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#DCBE81] text-sm font-semibold">كيف نعمل</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            ثلاث خطوات <span className="gold-text">بسيطة</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            عملية سهلة وسريعة للحصول على عرض سعر لجميع احتياجاتك
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 -left-4 w-8 h-0.5 bg-[#DCBE81]/30" />
              )}

              <div className="p-8 rounded-2xl bg-white/5 border border-[#DCBE81]/10 backdrop-blur-sm hover:border-[#DCBE81]/30 transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl gold-gradient flex items-center justify-center shrink-0">
                    <step.icon size={24} className="text-white" />
                  </div>
                  <span className="text-5xl font-bold text-[#DCBE81]/10">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
