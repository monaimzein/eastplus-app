'use client'

import { motion } from 'framer-motion'
import { Building, HardHat, Landmark, Factory } from 'lucide-react'

const clients = [
  {
    icon: HardHat,
    title: 'المقاولون',
    description: 'مقاولو البناء والتشطيب الذين يبحثون عن مورد موثوق وأسعار تنافسية.',
  },
  {
    icon: Building,
    title: 'المطورون العقاريون',
    description: 'شركات التطوير العقاري التي تحتاج توريد بكميات كبيرة ومتنوعة.',
  },
  {
    icon: Landmark,
    title: 'الجهات الحكومية',
    description: 'المشاريع الحكومية التي تتطلب مواصفات معتمدة وجودة عالية.',
  },
  {
    icon: Factory,
    title: 'المصانع والمنشآت',
    description: 'المنشآت الصناعية التي تحتاج مواد كهربائية وسباكة بكميات كبيرة.',
  },
]

export default function TargetClientsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#DCBE81] text-sm font-semibold">عملاؤنا</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-3">
            نخدم <span className="gold-text">جميع القطاعات</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-[#FAFAFA] border border-gray-100 hover:bg-[#1A1A1A] transition-all duration-500 cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-[#DCBE81]/10 group-hover:gold-gradient flex items-center justify-center mb-6 transition-all duration-500">
                <client.icon
                  size={28}
                  className="text-[#DCBE81] group-hover:text-white transition-colors duration-500"
                />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-white mb-3 transition-colors duration-500">
                {client.title}
              </h3>
              <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed transition-colors duration-500">
                {client.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
