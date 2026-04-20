'use client'

import { motion } from 'framer-motion'
import { Droplets, Zap, Building2, Bath } from 'lucide-react'

const services = [
  {
    icon: Droplets,
    title: 'توريد مواد السباكة',
    description:
      'مواسير، وصلات، خلاطات، ومحابس بجميع الأنواع والمقاسات للمشاريع السكنية والتجارية.',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop',
  },
  {
    icon: Zap,
    title: 'توريد مواد الكهرباء',
    description:
      'كابلات، قواطع، لوحات كهربائية، وأنظمة إنارة من أفضل الماركات العالمية.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
  },
  {
    icon: Building2,
    title: 'مواد البناء والتشييد',
    description:
      'إسمنت، حديد تسليح، طابوق، خرسانة جاهزة، وجميع مستلزمات البناء.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
  },
  {
    icon: Bath,
    title: 'الأدوات الصحية',
    description:
      'أطقم حمامات، مغاسل، بانيوهات، وإكسسوارات صحية بتصاميم عصرية وفاخرة.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#DCBE81] text-sm font-semibold tracking-wide">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mt-3">
            حلول توريد <span className="gold-text">متكاملة</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            نوفر لك جميع مواد البناء والتشطيب من أفضل الموردين بأسعار تنافسية
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#DCBE81]/10 transition-all duration-500"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 -mt-12 relative z-10 shadow-lg">
                  <service.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
