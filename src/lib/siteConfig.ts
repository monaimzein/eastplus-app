// Central site configuration — easy single source for contact info,
// service definitions, gallery categories, supplier logos, etc.

export const SITE = {
  name: 'EAST PLUS',
  tagline: { ar: 'للتجارة', en: 'Trading' },
  whatsapp: '966594044446',
  whatsappDisplay: '+966 59 404 4446',
  phone: '+966594044446',
  email: 'info@eastplus.sa',
  addressMap: 'https://maps.app.goo.gl/62dZ9w2RUFKmCyCJ8',
  addressEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.5!2d46.6351132!3d24.8322453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee5b500d5a8c9%3A0x6a9ad7f8f4da9f92!2sEast%20Plus!5e0!3m2!1sen!2ssa!4v1700000000000',
  address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
  profileUrl: 'https://drive.google.com/file/d/1cYQU1Aki5wPpAm62Q-4GR2dFBqtrjRgl/view?usp=sharing',
  social: {
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },
} as const

export type ServiceKey =
  | 'plumbing'
  | 'electrical'
  | 'construction'
  | 'sanitary'
  | 'insulation'
  | 'maintenance'
  | 'projects'

export const SERVICES: {
  key: ServiceKey
  href: string
  icon: string // lucide name
  image: string
  features: { ar: string[]; en: string[] }
}[] = [
  {
    key: 'plumbing',
    href: '/services/plumbing',
    icon: 'Droplets',
    image: '/images/services/plumbing.jpg',
    features: {
      ar: ['مواسير PPR', 'مواسير PVC', 'محابس', 'مضخات مياه', 'سخانات', 'خلاطات', 'فلاتر مياه', 'وصلات وقطع غيار'],
      en: ['PPR pipes', 'PVC pipes', 'Valves', 'Water pumps', 'Water heaters', 'Mixers', 'Water filters', 'Fittings & spares'],
    },
  },
  {
    key: 'electrical',
    href: '/services/electrical',
    icon: 'Zap',
    image: '/images/services/electrical.jpg',
    features: {
      ar: ['كابلات وأسلاك', 'إنارة LED', 'لوحات توزيع', 'قواطع كهربائية', 'مفاتيح وأفياش', 'مواسير كهرباء', 'إكسسوارات'],
      en: ['Cables & wires', 'LED lighting', 'Distribution boards', 'Breakers', 'Switches & sockets', 'Conduits', 'Accessories'],
    },
  },
  {
    key: 'construction',
    href: '/services/construction',
    icon: 'HardHat',
    image: '/images/services/construction.jpg',
    features: {
      ar: ['شبك لياسة جداري', 'زوايا لياسة معدنية', 'فواصل تمدد', 'شريط فايبر جلاس', 'مسامير ووردات شبك', 'إكسسوارات لياسة متنوعة'],
      en: ['Plaster mesh', 'Metal corner beads', 'Expansion joints', 'Fiberglass tape', 'Mesh nails & washers', 'Various plaster accessories'],
    },
  },
  {
    key: 'sanitary',
    href: '/services/sanitary',
    icon: 'ShowerHead',
    image: '/images/services/sanitary.jpg',
    features: {
      ar: ['مراحيض', 'مغاسل', 'خلاطات', 'شاور بوكس', 'بانيو', 'إكسسوارات حمامات', 'أطقم كاملة', 'صفايات'],
      en: ['Toilets', 'Basins', 'Mixers', 'Shower boxes', 'Bathtubs', 'Bath accessories', 'Full sets', 'Drains'],
    },
  },
  {
    key: 'insulation',
    href: '/services/insulation',
    icon: 'Shield',
    image: '/images/services/insulation.jpg',
    features: {
      ar: ['عزل مائي', 'عزل حراري', 'بيتومين', 'عزل أسطح', 'عزل خزانات', 'عزل حمامات'],
      en: ['Waterproofing', 'Thermal insulation', 'Bitumen', 'Roof insulation', 'Tank insulation', 'Bathroom insulation'],
    },
  },
  {
    key: 'maintenance',
    href: '/services/maintenance',
    icon: 'Wrench',
    image: '/images/services/maintenance.jpg',
    features: {
      ar: ['صيانة سباكة', 'صيانة كهرباء', 'صيانة تكييف', 'صيانة تشطيبات', 'فنيون متخصصون', 'استجابة سريعة'],
      en: ['Plumbing repairs', 'Electrical repairs', 'AC servicing', 'Finishing fixes', 'Expert technicians', 'Rapid response'],
    },
  },
  {
    key: 'projects',
    href: '/services/projects',
    icon: 'Building2',
    image: '/images/services/projects.jpg',
    features: {
      ar: ['عمال بناء', 'نجارون', 'حدادون', 'فنيو تشطيب', 'إدارة تنفيذ', 'مشاريع تسليم مفتاح'],
      en: ['Builders', 'Carpenters', 'Blacksmiths', 'Finishing techs', 'Execution management', 'Turn-key projects'],
    },
  },
]

export const HERO_SLIDES = [
  { image: '/images/hero/hero-1.jpg', key: 'slide1' as const },
  { image: '/images/hero/hero-2.jpg', key: 'slide2' as const },
  { image: '/images/hero/hero-3.jpg', key: 'slide3' as const },
]

// Supplier logos — placed in /public/images/mowared
export const SUPPLIER_LOGOS = [
  '/images/mowared/download (92).png',
  '/images/mowared/download (93).png',
  '/images/mowared/download (94).png',
  '/images/mowared/download (95).png',
  '/images/mowared/download (96).png',
  '/images/mowared/download (97).png',
]

export const GALLERY_CATEGORIES = [
  { key: 'construction', folder: 'البناء',  href: '/gallery/construction' },
  { key: 'electrical',   folder: 'الكهرباء', href: '/gallery/electrical' },
  { key: 'plumbing',     folder: 'السباكة',  href: '/gallery/plumbing' },
  { key: 'sanitary',     folder: 'الأدوات الصحية', href: '/gallery/sanitary' },
  { key: 'insulation',   folder: 'العزل',      href: '/gallery/insulation' },
  { key: 'maintenance',  folder: 'الصيانة',    href: '/gallery/maintenance' },
  { key: 'projects',     folder: 'المشاريع',    href: '/gallery/projects' },
] as const

// Stats counters
export const STATS = [
  { value: 60, suffix: '+', key: 'clients' },
  { value: 5000, suffix: '+', key: 'brands' },
  { value: 50000, suffix: '+', key: 'products' },
  { value: 13, suffix: '+', key: 'regions' },
] as const
