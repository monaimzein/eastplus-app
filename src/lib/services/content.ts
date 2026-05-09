// Centralised, structured content for all service pages.
// Bilingual (AR/EN) — drives deep, SEO-rich pages.

import type { ServiceKey } from '@/lib/siteConfig'

type Bi = { ar: string; en: string }
type BiList = { ar: string[]; en: string[] }

export interface ServiceContent {
  key: ServiceKey
  hero: { eyebrow: Bi; title: Bi; subtitle: Bi; image: string }
  intro: Bi
  problemSolution: { problems: BiList; solutions: BiList }
  process: { title: Bi; description: Bi }[]
  materials: { name: Bi; brands?: string[] }[]
  pricingTiers: {
    name: Bi
    priceLabel: Bi
    description: Bi
    features: BiList
    highlighted?: boolean
  }[]
  faq: { q: Bi; a: Bi }[]
  related: ServiceKey[]
  metadata: { title: Bi; description: Bi; keywords: Bi }
}

const plumbing: ServiceContent = {
  key: 'plumbing',
  hero: {
    eyebrow: { ar: 'مواد السباكة', en: 'Plumbing Materials' },
    title: {
      ar: 'مواد سباكة متكاملة\nبأعلى المعايير السعودية',
      en: 'Complete plumbing materials\nbuilt to Saudi standards',
    },
    subtitle: {
      ar: 'كل ما تحتاجه لمشاريع السباكة السكنية والتجارية والصناعية، من موردين معتمدين بضمان مصنع وشهادات مطابقة سعودية.',
      en: 'Everything you need for residential, commercial and industrial plumbing — from authorised suppliers with manufacturer warranty and Saudi compliance.',
    },
    image: '/images/services/plumbing.jpg',
  },
  intro: {
    ar: 'نوفّر في EAST PLUS منظومة سباكة كاملة تخدم المقاولين والاستشاريين وأصحاب المشاريع في جميع مدن المملكة. تشمل خطوطنا مواسير PPR و PVC الأصلية، ومحابس بضمان عمر طويل، ومضخات مياه عالية الكفاءة، إضافة إلى السخانات والخلاطات والفلاتر، وكل قطع الغيار اللازمة لتشغيل صحي وآمن لشبكات المياه. الالتزام بالمواصفة السعودية في كل قطعة، والتسليم السريع لمواقع المشاريع.',
    en: 'EAST PLUS supplies a complete plumbing ecosystem for contractors, consultants and project owners across Saudi Arabia. Our portfolio includes original PPR and PVC pipes, long-life valves, high-efficiency water pumps, water heaters, mixers, filters and the spare parts that keep water networks safe and healthy. Saudi standard compliance on every part, with rapid delivery to project sites.',
  },
  problemSolution: {
    problems: {
      ar: ['تأخر التوريد يُعطّل جدول المشروع', 'مواد مقلّدة تُسبّب تسريبات مبكرة', 'صعوبة المقارنة بين الموردين', 'فواتير غير معتمدة من ZATCA'],
      en: ['Late deliveries delay project schedules', 'Counterfeit materials cause early leaks', 'Hard to compare suppliers and pricing', 'Non-ZATCA-compliant invoicing'],
    },
    solutions: {
      ar: ['تسليم خلال 24-72 ساعة لكل مدن المملكة', 'مواد أصلية فقط بشهادة منشأ ومطابقة', 'عرض سعر تفصيلي خلال دقائق', 'فواتير ضريبية معتمدة لكل عملية'],
      en: ['Delivery in 24-72 hours across the Kingdom', 'Original materials only with origin & compliance certificates', 'Detailed quotation in minutes', 'ZATCA-compliant tax invoices for every transaction'],
    },
  },
  process: [
    { title: { ar: 'الطلب', en: 'Request' }, description: { ar: 'أرسل قائمة بنودك أو ارفع BOQ المشروع.', en: 'Send your line items or upload the project BOQ.' } },
    { title: { ar: 'التسعير', en: 'Pricing' }, description: { ar: 'فريقنا يدرس البنود ويختار أفضل الموردين والأسعار.', en: 'Our team reviews items and sources best supplier pricing.' } },
    { title: { ar: 'العرض', en: 'Quote' }, description: { ar: 'تستلم عرضاً تفصيلياً مع المواصفات وأوقات التسليم.', en: 'Receive a detailed quote with specs and delivery windows.' } },
    { title: { ar: 'التوريد', en: 'Supply' }, description: { ar: 'بعد الموافقة يبدأ التوريد للموقع مباشرة.', en: 'On approval, supply ships directly to your site.' } },
    { title: { ar: 'الدعم', en: 'Support' }, description: { ar: 'دعم فني ومتابعة بعد البيع وضمانات معتمدة.', en: 'After-sales technical support and certified warranties.' } },
  ],
  materials: [
    { name: { ar: 'مواسير PPR', en: 'PPR Pipes' }, brands: ['Aquatherm', 'Wefatherm', 'Ipex'] },
    { name: { ar: 'مواسير PVC', en: 'PVC Pipes' }, brands: ['Astral', 'Saudi Plastics'] },
    { name: { ar: 'محابس نحاسية', en: 'Brass Valves' } },
    { name: { ar: 'محابس كروية', en: 'Ball Valves' } },
    { name: { ar: 'مضخات مياه', en: 'Water Pumps' }, brands: ['Grundfos', 'Pedrollo'] },
    { name: { ar: 'سخانات مياه', en: 'Water Heaters' }, brands: ['Ariston', 'AO Smith'] },
    { name: { ar: 'خلاطات', en: 'Mixers' }, brands: ['Grohe', 'Hansgrohe'] },
    { name: { ar: 'فلاتر مياه', en: 'Water Filters' } },
    { name: { ar: 'وصلات وأكواع', en: 'Fittings & Elbows' } },
    { name: { ar: 'لاصق مواسير', en: 'Pipe Adhesives' } },
    { name: { ar: 'عوازل أنابيب', en: 'Pipe Insulation' } },
    { name: { ar: 'عدادات مياه', en: 'Water Meters' } },
  ],
  pricingTiers: [
    { name: { ar: 'أساسي', en: 'Basic' }, priceLabel: { ar: 'حسب الكمية', en: 'Volume-based' }, description: { ar: 'مناسب للمشاريع السكنية الصغيرة', en: 'Ideal for small residential projects' }, features: { ar: ['مواد محلية معتمدة', 'تسليم 3-5 أيام', 'فاتورة ضريبية', 'دعم أساسي'], en: ['Approved local brands', '3-5 day delivery', 'Tax invoice', 'Basic support'] } },
    { name: { ar: 'احترافي', en: 'Pro' }, priceLabel: { ar: 'حسب الكمية', en: 'Volume-based' }, description: { ar: 'مناسب لمشاريع المقاولات المتوسطة', en: 'For mid-sized contracting projects' }, features: { ar: ['مواد عالمية وأصلية', 'تسليم 24-48 ساعة', 'تركيب اختياري', 'مدير حساب', 'دعم فني مباشر'], en: ['Original global brands', '24-48h delivery', 'Optional installation', 'Account manager', 'Direct technical support'] }, highlighted: true },
    { name: { ar: 'مشاريع', en: 'Enterprise' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'مشاريع كبيرة وعقود سنوية', en: 'Large projects and annual contracts' }, features: { ar: ['أسعار تفضيلية', 'مخزون مخصص للمشروع', 'تسليم على مراحل', 'فريق مشروع مخصص', 'تقارير دورية'], en: ['Preferred pricing', 'Project-dedicated stock', 'Phased delivery', 'Dedicated project team', 'Periodic reports'] } },
  ],
  faq: [
    { q: { ar: 'هل تقدمون شهادة منشأ ومطابقة؟', en: 'Do you provide origin & compliance certificates?' }, a: { ar: 'نعم، كل المواد تأتي بشهادات مطابقة معتمدة من الجهات السعودية المختصة.', en: 'Yes — every material ships with origin and compliance certificates from authorised Saudi bodies.' } },
    { q: { ar: 'ما هو زمن التسليم؟', en: 'What is the delivery time?' }, a: { ar: 'من 24 ساعة لطلبات الرياض إلى 72 ساعة كحد أقصى لباقي المدن، حسب الكمية.', en: 'From 24 hours within Riyadh up to 72 hours for other cities, depending on volume.' } },
    { q: { ar: 'هل يمكن تنفيذ التركيب؟', en: 'Do you handle installation?' }, a: { ar: 'نعم، نوفر فرق فنية متخصصة للتركيب والصيانة عند الطلب.', en: 'Yes, we provide specialised technical crews for installation and servicing on request.' } },
    { q: { ar: 'هل الفواتير معتمدة من ZATCA؟', en: 'Are invoices ZATCA-compliant?' }, a: { ar: 'نعم، جميع فواتيرنا متوافقة مع متطلبات الفوترة الإلكترونية السعودية.', en: 'Yes, all invoices comply with Saudi e-invoicing requirements.' } },
    { q: { ar: 'هل تقدمون ضمان على المواد؟', en: 'Do you provide warranty?' }, a: { ar: 'نعم، ضمان المصنع كامل بالإضافة إلى ضمان منشأة EAST PLUS.', en: 'Yes — full manufacturer warranty plus an EAST PLUS facility warranty.' } },
    { q: { ar: 'كيف أحصل على عرض سعر؟', en: 'How do I request a quote?' }, a: { ar: 'عبر منصتنا الإلكترونية أو واتساب، خلال دقائق فقط.', en: 'Through our online platform or WhatsApp — in minutes.' } },
  ],
  related: ['sanitary', 'maintenance', 'insulation'],
  metadata: {
    title: { ar: 'مواد السباكة', en: 'Plumbing Materials' },
    description: { ar: 'مواسير PPR و PVC، محابس، مضخات، سخانات، خلاطات وكل مستلزمات السباكة من موردين معتمدين. عرض سعر خلال دقائق.', en: 'PPR & PVC pipes, valves, pumps, heaters, mixers and every plumbing material from certified suppliers. Quote in minutes.' },
    keywords: { ar: 'سباكة, مواسير, PPR, PVC, مضخات, خلاطات, السعودية', en: 'plumbing, pipes, PPR, PVC, pumps, mixers, Saudi Arabia' },
  },
}

const electrical: ServiceContent = {
  key: 'electrical',
  hero: {
    eyebrow: { ar: 'المواد الكهربائية', en: 'Electrical Materials' },
    title: { ar: 'كهرباء آمنة وموثوقة\nبأعلى معايير السلامة', en: 'Safe, reliable electrical\nat top safety standards' },
    subtitle: { ar: 'كابلات، إنارة LED، لوحات توزيع، قواطع، ومفاتيح بأفضل العلامات العالمية وضمان أداء طويل الأمد.', en: 'Cables, LED lighting, distribution boards, breakers and switches from top global brands with long-term performance warranties.' },
    image: '/images/services/electrical.jpg',
  },
  intro: { ar: 'منظومة كهربائية متكاملة لمشاريعك من EAST PLUS: كابلات وأسلاك ذات نحاس خالص، إنارة LED موفرة للطاقة، لوحات توزيع وقواطع بمعايير CE و SASO، ومفاتيح وأفياش بتصاميم عصرية. كل شيء بضمان مصنع، شهادات مطابقة، ودعم فني متخصص قبل وبعد التركيب.', en: 'A complete electrical system for your projects: pure-copper cables and wires, energy-saving LED lighting, CE/SASO-compliant distribution boards and breakers, and modern switches and outlets. Manufacturer warranty, compliance certificates and specialist technical support before and after installation.' },
  problemSolution: {
    problems: { ar: ['أسلاك بمعدن مخلوط تسبب الحرائق', 'إنارة سريعة الاحتراق', 'تكلفة طاقة مرتفعة', 'تواريخ تسليم غير واضحة'], en: ['Mixed-metal wires causing fire risk', 'Short-life lighting fixtures', 'High energy bills', 'Unclear delivery timelines'] },
    solutions: { ar: ['كابلات نحاس خالص بشهادة', 'إنارة LED بضمان 5 سنوات', 'حلول توفير طاقة مدروسة', 'جدول تسليم ملزم بالعقد'], en: ['Certified pure-copper cables', 'LED lighting with 5-year warranty', 'Engineered energy-saving solutions', 'Contract-bound delivery schedule'] },
  },
  process: [
    { title: { ar: 'الدراسة', en: 'Study' }, description: { ar: 'مراجعة الـBOQ والمخططات الكهربائية.', en: 'BOQ and electrical drawings review.' } },
    { title: { ar: 'الاختيار', en: 'Selection' }, description: { ar: 'اختيار المواد المناسبة من علامات معتمدة.', en: 'Selecting suitable materials from approved brands.' } },
    { title: { ar: 'العرض', en: 'Quote' }, description: { ar: 'تسعير تفصيلي بالكمية والمواصفات.', en: 'Detailed quote with quantity and specs.' } },
    { title: { ar: 'التوريد', en: 'Supply' }, description: { ar: 'تسليم منظم لموقع المشروع.', en: 'Organised on-site delivery.' } },
    { title: { ar: 'الدعم', en: 'Support' }, description: { ar: 'استشارة فنية ودعم تركيب عند الحاجة.', en: 'Technical consulting and installation support.' } },
  ],
  materials: [
    { name: { ar: 'كابلات نحاس', en: 'Copper Cables' }, brands: ['Riyadh Cables', 'Saudi Cables'] },
    { name: { ar: 'أسلاك مرنة', en: 'Flexible Wires' } },
    { name: { ar: 'إنارة LED', en: 'LED Lighting' }, brands: ['Philips', 'Osram'] },
    { name: { ar: 'سبوت لايت', en: 'Spotlights' } },
    { name: { ar: 'لوحات توزيع', en: 'Distribution Boards' }, brands: ['Schneider', 'ABB'] },
    { name: { ar: 'قواطع كهربائية', en: 'Circuit Breakers' } },
    { name: { ar: 'مفاتيح وأفياش', en: 'Switches & Sockets' }, brands: ['Legrand', 'Schneider'] },
    { name: { ar: 'مواسير كهرباء', en: 'Conduits' } },
    { name: { ar: 'علب توزيع', en: 'Junction Boxes' } },
    { name: { ar: 'عدادات كهرباء', en: 'Electrical Meters' } },
    { name: { ar: 'مولدات احتياطية', en: 'Backup Generators' } },
    { name: { ar: 'إكسسوارات تركيب', en: 'Installation Accessories' } },
  ],
  pricingTiers: [
    { name: { ar: 'أساسي', en: 'Basic' }, priceLabel: { ar: 'حسب الكمية', en: 'Volume-based' }, description: { ar: 'فلل صغيرة ومحلات تجارية', en: 'Small villas and shops' }, features: { ar: ['علامات محلية معتمدة', 'ضمان 1 سنة', 'تسليم 3-5 أيام'], en: ['Approved local brands', '1-year warranty', '3-5 day delivery'] } },
    { name: { ar: 'احترافي', en: 'Pro' }, priceLabel: { ar: 'حسب الكمية', en: 'Volume-based' }, description: { ar: 'مباني سكنية ومنشآت تجارية', en: 'Residential & commercial buildings' }, features: { ar: ['علامات عالمية', 'ضمان 5 سنوات', 'تركيب اختياري', 'مدير حساب'], en: ['Global brands', '5-year warranty', 'Optional installation', 'Account manager'] }, highlighted: true },
    { name: { ar: 'مشاريع', en: 'Enterprise' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'مشاريع صناعية وحكومية', en: 'Industrial & government projects' }, features: { ar: ['أسعار تفضيلية', 'فريق مخصص', 'تسليم على مراحل', 'تقارير أداء'], en: ['Preferred pricing', 'Dedicated team', 'Phased delivery', 'Performance reports'] } },
  ],
  faq: [
    { q: { ar: 'هل المواد متوافقة مع SASO؟', en: 'Are materials SASO-compliant?' }, a: { ar: 'نعم، جميع منتجاتنا تحمل شهادات SASO و CE.', en: 'Yes — all our products carry SASO and CE certificates.' } },
    { q: { ar: 'هل تقدمون استشارة هندسية؟', en: 'Do you offer engineering consultation?' }, a: { ar: 'نعم، فريقنا الهندسي متاح للاستشارة قبل وأثناء المشروع.', en: 'Yes — our engineering team is available for consultation before and during the project.' } },
    { q: { ar: 'هل الكابلات نحاس خالص؟', en: 'Are cables pure copper?' }, a: { ar: 'نعم 100%، مع شهادة فحص لكل كرتون.', en: 'Yes 100% — with an inspection certificate per carton.' } },
    { q: { ar: 'ضمان الإنارة كم سنة؟', en: 'How many years on lighting warranty?' }, a: { ar: 'من 2 إلى 5 سنوات حسب الفئة والعلامة.', en: '2 to 5 years depending on tier and brand.' } },
    { q: { ar: 'هل توفرون إنارة شمسية؟', en: 'Do you supply solar lighting?' }, a: { ar: 'نعم، حلول إنارة شمسية للحدائق والشوارع.', en: 'Yes — solar lighting solutions for gardens and streets.' } },
    { q: { ar: 'كيف أحصل على عرض سعر؟', en: 'How to request a quote?' }, a: { ar: 'عبر المنصة الإلكترونية أو واتساب خلال دقائق.', en: 'Via our online platform or WhatsApp in minutes.' } },
  ],
  related: ['construction', 'maintenance', 'projects'],
  metadata: {
    title: { ar: 'المواد الكهربائية', en: 'Electrical Materials' },
    description: { ar: 'كابلات نحاس، إنارة LED، لوحات توزيع وقواطع بمعايير SASO وضمان طويل الأمد.', en: 'Copper cables, LED lighting, distribution boards & breakers — SASO compliant with long-term warranty.' },
    keywords: { ar: 'كهرباء, كابلات, إنارة LED, لوحات توزيع, قواطع', en: 'electrical, cables, LED lighting, distribution boards, breakers' },
  },
}

const construction: ServiceContent = {
  key: 'construction',
  hero: {
    eyebrow: { ar: 'مواد البناء', en: 'Construction Materials' },
    title: { ar: 'مواد بناء وتشطيب\nبجودة عالية', en: 'High-quality construction\n& finishing materials' },
    subtitle: { ar: 'أسمنت، جبس، مواد لاصقة، سيليكون، ومواد ترميم لكل مراحل المشروع من الأساسات إلى التشطيب النهائي.', en: 'Cement, gypsum, adhesives, silicone and restoration materials for every stage from foundation to final finish.' },
    image: '/images/services/construction.jpg',
  },
  intro: { ar: 'تدعم EAST PLUS مقاوليك ومشاريعك بمواد بناء وتشطيب أصلية تلتزم بالكود السعودي للبناء. أسمنت بمصدر معتمد، ألواح جبس عازلة للحريق، مواد لاصقة عالية القوة، سيليكون مقاوم للعوامل الجوية، ومجموعة كاملة من مواد الترميم والتشطيب الفاخرة.', en: 'EAST PLUS supports your contractors and projects with original construction materials compliant with the Saudi Building Code. Certified-source cement, fire-rated gypsum boards, high-strength adhesives, weather-resistant silicone, and a full range of premium finishing and restoration materials.' },
  problemSolution: {
    problems: { ar: ['تأخر توريد الأسمنت والجبس', 'مواد تشطيب رديئة الجودة', 'عدم توفر كميات كبيرة', 'صعوبة الحصول على مواد ترميم'], en: ['Late cement & gypsum delivery', 'Poor-quality finishing materials', 'Bulk quantities unavailable', 'Hard-to-find restoration items'] },
    solutions: { ar: ['مخزون دائم وتوريد فوري', 'علامات معتمدة فقط', 'تسليم بكميات كبيرة', 'كتالوج كامل من مواد الترميم'], en: ['Always-in-stock with rapid supply', 'Approved brands only', 'Bulk delivery available', 'Full restoration catalogue'] },
  },
  process: [
    { title: { ar: 'الطلب', en: 'Request' }, description: { ar: 'أرسل بنود المشروع بالتفصيل.', en: 'Send detailed project items.' } },
    { title: { ar: 'الدراسة', en: 'Review' }, description: { ar: 'نراجع المواصفات والكميات.', en: 'We review specs and quantities.' } },
    { title: { ar: 'العرض', en: 'Quote' }, description: { ar: 'عرض سعر تفصيلي خلال دقائق.', en: 'Detailed quote in minutes.' } },
    { title: { ar: 'التوريد', en: 'Supply' }, description: { ar: 'توصيل مباشر للموقع.', en: 'Direct site delivery.' } },
    { title: { ar: 'المتابعة', en: 'Follow-up' }, description: { ar: 'متابعة استهلاك المشروع وإعادة الطلب.', en: 'Project consumption tracking and re-order.' } },
  ],
  materials: [
    { name: { ar: 'أسمنت بورتلاندي', en: 'Portland Cement' }, brands: ['Yamama', 'Saudi Cement'] },
    { name: { ar: 'أسمنت أبيض', en: 'White Cement' } },
    { name: { ar: 'ألواح جبس بورد', en: 'Gypsum Boards' }, brands: ['Knauf', 'Gyproc'] },
    { name: { ar: 'مواد لاصقة', en: 'Adhesives' }, brands: ['Sika', 'Mapei'] },
    { name: { ar: 'سيليكون', en: 'Silicone' }, brands: ['Dow', 'Henkel'] },
    { name: { ar: 'مواد ترميم', en: 'Restoration Materials' } },
    { name: { ar: 'مواد عزل', en: 'Insulation Materials' } },
    { name: { ar: 'دهانات بلاستيك', en: 'Plastic Paints' }, brands: ['Jotun', 'National Paints'] },
    { name: { ar: 'دهانات زيتية', en: 'Oil Paints' } },
    { name: { ar: 'بلاط وسيراميك', en: 'Tiles & Ceramics' } },
    { name: { ar: 'رخام وجرانيت', en: 'Marble & Granite' } },
    { name: { ar: 'أدوات بناء يدوية', en: 'Hand Tools' } },
  ],
  pricingTiers: [
    { name: { ar: 'أساسي', en: 'Basic' }, priceLabel: { ar: 'حسب الكمية', en: 'Volume-based' }, description: { ar: 'مشاريع صغيرة', en: 'Small projects' }, features: { ar: ['علامات محلية', 'تسليم 3-5 أيام', 'فاتورة ضريبية'], en: ['Local brands', '3-5 day delivery', 'Tax invoice'] } },
    { name: { ar: 'احترافي', en: 'Pro' }, priceLabel: { ar: 'حسب الكمية', en: 'Volume-based' }, description: { ar: 'مشاريع متوسطة وكبيرة', en: 'Medium to large projects' }, features: { ar: ['علامات عالمية', 'تسليم 24-48 ساعة', 'مدير حساب', 'دعم فني'], en: ['Global brands', '24-48h delivery', 'Account manager', 'Technical support'] }, highlighted: true },
    { name: { ar: 'مشاريع', en: 'Enterprise' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'عقود سنوية ومشاريع ضخمة', en: 'Annual contracts & mega projects' }, features: { ar: ['أسعار خاصة', 'تخزين مخصص', 'تسليم مرحلي'], en: ['Special pricing', 'Dedicated stock', 'Phased delivery'] } },
  ],
  faq: [
    { q: { ar: 'هل توردون كميات صغيرة؟', en: 'Do you supply small quantities?' }, a: { ar: 'نعم، نخدم المشاريع الصغيرة والكبيرة بنفس الجودة.', en: 'Yes — we serve small and large projects with the same quality.' } },
    { q: { ar: 'هل المواد متوافقة مع كود البناء السعودي؟', en: 'Are materials SBC-compliant?' }, a: { ar: 'نعم، جميع المواد متوافقة مع كود البناء السعودي SBC.', en: 'Yes — all materials comply with the Saudi Building Code (SBC).' } },
    { q: { ar: 'كم زمن التسليم لمشروع كبير؟', en: 'Delivery time for a large project?' }, a: { ar: 'نضع جدولاً زمنياً بالاتفاق، عادة على دفعات أسبوعية.', en: 'We agree a delivery schedule — typically in weekly batches.' } },
    { q: { ar: 'هل تقدمون عينات قبل الشراء؟', en: 'Do you provide samples before purchase?' }, a: { ar: 'نعم، عينات لمواد التشطيب متاحة بطلب.', en: 'Yes — finishing-material samples are available on request.' } },
    { q: { ar: 'هل تقدمون استشارة في اختيار المواد؟', en: 'Do you offer material-selection advice?' }, a: { ar: 'نعم، فريقنا الفني يدعمك في اختيار الأنسب.', en: 'Yes — our technical team supports you in choosing the right fit.' } },
    { q: { ar: 'كيف أبدأ؟', en: 'How do I start?' }, a: { ar: 'عبر منصتنا أو واتساب وستحصل على عرضك خلال دقائق.', en: 'Via our platform or WhatsApp — you get your quote in minutes.' } },
  ],
  related: ['insulation', 'projects', 'maintenance'],
  metadata: {
    title: { ar: 'مواد البناء', en: 'Construction Materials' },
    description: { ar: 'أسمنت، جبس، مواد لاصقة، سيليكون، ومواد ترميم لكل مراحل المشروع. متوافقة مع كود البناء السعودي.', en: 'Cement, gypsum, adhesives, silicone and restoration — every project stage. SBC-compliant.' },
    keywords: { ar: 'بناء, أسمنت, جبس, سيليكون, تشطيبات, ترميم', en: 'construction, cement, gypsum, silicone, finishing, restoration' },
  },
}

const sanitary: ServiceContent = {
  key: 'sanitary',
  hero: {
    eyebrow: { ar: 'الأدوات الصحية', en: 'Sanitary Ware' },
    title: { ar: 'أدوات صحية فاخرة\nبأسعار تنافسية', en: 'Premium sanitary ware\nat competitive prices' },
    subtitle: { ar: 'مراحيض، مغاسل، خلاطات، شاور بوكس، بانيو، وأطقم حمامات كاملة من أرقى الماركات العالمية.', en: 'Toilets, basins, mixers, shower boxes, bathtubs and complete bathroom sets from premium global brands.' },
    image: '/images/services/sanitary.jpg',
  },
  intro: { ar: 'مجموعتنا من الأدوات الصحية تجمع الفخامة والجودة في تصاميم عصرية وكلاسيكية. أطقم حمامات كاملة بضمان مصنع، خلاطات بكروم لا يصدأ، شاور بوكس بزجاج مقاوم للماء، ومراحيض موفرة للمياه. كل المنتجات بشهادات WaterSense ومطابقة لمعايير SASO.', en: 'Our sanitary collection blends luxury and quality in modern and classic designs. Complete bathroom sets with manufacturer warranty, rust-free chrome mixers, water-resistant shower-glass boxes, and water-saving toilets. All products carry WaterSense and SASO compliance.' },
  problemSolution: {
    problems: { ar: ['أدوات صحية تتلف بسرعة', 'تنسيق ضعيف بين القطع', 'صعوبة العثور على قطع غيار', 'أسعار مرتفعة من الموزعين'], en: ['Sanitary ware that wears quickly', 'Poor coordination between pieces', 'Hard to find spare parts', 'High prices from distributors'] },
    solutions: { ar: ['ماركات معتمدة بضمان طويل', 'أطقم متناسقة جاهزة', 'مخزون قطع غيار', 'أسعار مباشرة من المصنع'], en: ['Approved brands with extended warranty', 'Ready coordinated sets', 'Spare-parts stock', 'Direct factory pricing'] },
  },
  process: [
    { title: { ar: 'التصميم', en: 'Design' }, description: { ar: 'استشارة لاختيار التصميم الأنسب.', en: 'Consultation to pick the right design.' } },
    { title: { ar: 'الاختيار', en: 'Selection' }, description: { ar: 'اختيار القطع من كتالوج موسّع.', en: 'Choosing pieces from a wide catalogue.' } },
    { title: { ar: 'العرض', en: 'Quote' }, description: { ar: 'عرض سعر شامل لكل القطع.', en: 'Comprehensive quote for the whole set.' } },
    { title: { ar: 'التوريد', en: 'Supply' }, description: { ar: 'تسليم آمن مع تغليف خاص.', en: 'Safe delivery with protective packaging.' } },
    { title: { ar: 'التركيب', en: 'Install' }, description: { ar: 'تركيب احترافي عند الطلب.', en: 'Professional installation on request.' } },
  ],
  materials: [
    { name: { ar: 'مراحيض معلّقة', en: 'Wall-hung Toilets' }, brands: ['Geberit', 'Roca'] },
    { name: { ar: 'مراحيض أرضية', en: 'Floor Toilets' }, brands: ['Toto', 'Duravit'] },
    { name: { ar: 'مغاسل', en: 'Basins' }, brands: ['Villeroy & Boch', 'Roca'] },
    { name: { ar: 'خلاطات', en: 'Mixers' }, brands: ['Grohe', 'Hansgrohe'] },
    { name: { ar: 'شاور بوكس', en: 'Shower Boxes' } },
    { name: { ar: 'بانيو', en: 'Bathtubs' }, brands: ['Kohler', 'Jacuzzi'] },
    { name: { ar: 'رشاشات استحمام', en: 'Shower Heads' } },
    { name: { ar: 'أطقم كاملة', en: 'Complete Sets' } },
    { name: { ar: 'إكسسوارات حمام', en: 'Bath Accessories' } },
    { name: { ar: 'صفايات', en: 'Drains' } },
    { name: { ar: 'مرايا حمام', en: 'Bathroom Mirrors' } },
    { name: { ar: 'دواليب حمام', en: 'Bath Vanities' } },
  ],
  pricingTiers: [
    { name: { ar: 'أساسي', en: 'Basic' }, priceLabel: { ar: 'حسب الطقم', en: 'Set-based' }, description: { ar: 'حمامات اقتصادية', en: 'Economy bathrooms' }, features: { ar: ['ماركات معتمدة', 'تسليم 5 أيام', 'ضمان 2 سنة'], en: ['Approved brands', '5-day delivery', '2-year warranty'] } },
    { name: { ar: 'احترافي', en: 'Pro' }, priceLabel: { ar: 'حسب الطقم', en: 'Set-based' }, description: { ar: 'فلل ومنازل عصرية', en: 'Modern villas & homes' }, features: { ar: ['ماركات عالمية', 'تنسيق كامل', 'تركيب اختياري', 'ضمان 5 سنوات'], en: ['Global brands', 'Full coordination', 'Optional installation', '5-year warranty'] }, highlighted: true },
    { name: { ar: 'فاخر', en: 'Luxury' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'فلل وقصور فاخرة', en: 'Luxury villas & palaces' }, features: { ar: ['ماركات راقية', 'تصميم مخصص', 'تركيب احترافي', 'ضمان موسع'], en: ['Premium brands', 'Custom design', 'Pro installation', 'Extended warranty'] } },
  ],
  faq: [
    { q: { ar: 'هل تقدمون أطقم متناسقة؟', en: 'Do you offer matching sets?' }, a: { ar: 'نعم، أطقم كاملة بتصميم موحد.', en: 'Yes — complete sets with unified design.' } },
    { q: { ar: 'هل الماركات أصلية؟', en: 'Are brands original?' }, a: { ar: 'نعم 100%، بشهادة وكالة من المصنع.', en: 'Yes 100% — with manufacturer agency certificate.' } },
    { q: { ar: 'هل توفرون قطع غيار؟', en: 'Do you stock spare parts?' }, a: { ar: 'نعم، مخزون دائم لكل الماركات.', en: 'Yes — permanent stock for all brands.' } },
    { q: { ar: 'هل تقدمون التركيب؟', en: 'Do you handle installation?' }, a: { ar: 'نعم، فرق فنية متخصصة.', en: 'Yes — specialised technical crews.' } },
    { q: { ar: 'هل توردون لجميع المدن؟', en: 'Do you deliver to all cities?' }, a: { ar: 'نعم، تغطية كاملة للمملكة.', en: 'Yes — full Kingdom coverage.' } },
    { q: { ar: 'كم زمن تسليم الطلب؟', en: 'How long is delivery?' }, a: { ar: 'من 3 إلى 7 أيام حسب الطقم والمدينة.', en: '3 to 7 days depending on set and city.' } },
  ],
  related: ['plumbing', 'maintenance', 'projects'],
  metadata: {
    title: { ar: 'الأدوات الصحية', en: 'Sanitary Ware' },
    description: { ar: 'أدوات صحية فاخرة، أطقم حمامات كاملة، خلاطات وبانيو من أرقى الماركات العالمية.', en: 'Premium sanitary ware, complete bath sets, mixers and tubs from top global brands.' },
    keywords: { ar: 'أدوات صحية, مراحيض, مغاسل, خلاطات, حمامات', en: 'sanitary ware, toilets, basins, mixers, bathrooms' },
  },
}

const insulation: ServiceContent = {
  key: 'insulation',
  hero: {
    eyebrow: { ar: 'مواد العزل', en: 'Insulation Materials' },
    title: { ar: 'عزل احترافي\nيحمي مشروعك', en: 'Professional insulation\nthat protects your project' },
    subtitle: { ar: 'عزل مائي وحراري للأسطح والخزانات والحمامات بأفضل المواد العالمية وضمان طويل الأمد.', en: 'Waterproofing and thermal insulation for roofs, tanks and bathrooms with top global materials and long warranties.' },
    image: '/images/services/insulation.jpg',
  },
  intro: { ar: 'العزل الجيد يحمي مشروعك من الحرارة والرطوبة ويوفر تكاليف الطاقة. نوفر في EAST PLUS عزل بيتومين، رولات حرارية، رغوة بولي يوريثان، عوازل تحت البلاط، وعوازل خاصة للحمامات والمسابح. كل المواد بشهادات أداء معتمدة وفرق تطبيق متخصصة لضمان نتيجة طويلة الأمد.', en: 'Quality insulation protects your project from heat and moisture and saves energy costs. EAST PLUS supplies bituminous waterproofing, thermal rolls, polyurethane foam, under-tile waterproofing and specialist insulation for bathrooms and pools. All materials carry certified performance ratings, with specialist application crews ensuring long-term results.' },
  problemSolution: {
    problems: { ar: ['تسربات الأسطح المتكررة', 'فاتورة كهرباء مرتفعة', 'تشقق الجدران', 'عزل لا يتجاوز سنتين'], en: ['Recurring roof leaks', 'High electricity bills', 'Wall cracking', 'Insulation lasting under 2 years'] },
    solutions: { ar: ['عزل ضمان 10-15 سنة', 'توفير حتى 30% من الطاقة', 'حلول معتمدة وموثقة', 'تطبيق احترافي'], en: ['10-15 year warranty', 'Up to 30% energy savings', 'Certified, documented solutions', 'Professional application'] },
  },
  process: [
    { title: { ar: 'الفحص', en: 'Inspection' }, description: { ar: 'فحص الموقع وتحديد المشكلة.', en: 'Site inspection and problem identification.' } },
    { title: { ar: 'التوصية', en: 'Recommendation' }, description: { ar: 'اختيار النظام المناسب.', en: 'Selecting the right system.' } },
    { title: { ar: 'العرض', en: 'Quote' }, description: { ar: 'عرض سعر يشمل المواد والتطبيق.', en: 'Quote covering materials and application.' } },
    { title: { ar: 'التطبيق', en: 'Application' }, description: { ar: 'تطبيق احترافي بفرق متخصصة.', en: 'Professional application by specialists.' } },
    { title: { ar: 'الضمان', en: 'Warranty' }, description: { ar: 'ضمان موثق بشهادة رسمية.', en: 'Documented warranty with official certificate.' } },
  ],
  materials: [
    { name: { ar: 'بيتومين', en: 'Bitumen' }, brands: ['Sika', 'BASF'] },
    { name: { ar: 'رولات حرارية', en: 'Thermal Rolls' } },
    { name: { ar: 'رغوة بولي يوريثان', en: 'Polyurethane Foam' } },
    { name: { ar: 'عزل تحت البلاط', en: 'Under-tile Insulation' } },
    { name: { ar: 'عزل أسطح', en: 'Roof Insulation' } },
    { name: { ar: 'عزل خزانات', en: 'Tank Insulation' } },
    { name: { ar: 'عزل حمامات', en: 'Bathroom Insulation' } },
    { name: { ar: 'عزل مسابح', en: 'Pool Insulation' } },
    { name: { ar: 'صوف صخري', en: 'Rock Wool' } },
    { name: { ar: 'صوف زجاجي', en: 'Glass Wool' } },
    { name: { ar: 'ألواح عازلة', en: 'Insulation Panels' } },
    { name: { ar: 'مواد لاصقة عازلة', en: 'Insulating Adhesives' } },
  ],
  pricingTiers: [
    { name: { ar: 'أساسي', en: 'Basic' }, priceLabel: { ar: 'حسب المساحة', en: 'Area-based' }, description: { ar: 'منازل صغيرة', en: 'Small homes' }, features: { ar: ['عزل مائي أساسي', 'ضمان 5 سنوات', 'تطبيق سريع'], en: ['Basic waterproofing', '5-year warranty', 'Rapid application'] } },
    { name: { ar: 'احترافي', en: 'Pro' }, priceLabel: { ar: 'حسب المساحة', en: 'Area-based' }, description: { ar: 'فلل ومباني سكنية', en: 'Villas & residential buildings' }, features: { ar: ['عزل مائي وحراري', 'ضمان 10 سنوات', 'فحص دوري', 'مواد عالمية'], en: ['Water & thermal insulation', '10-year warranty', 'Periodic inspection', 'Global materials'] }, highlighted: true },
    { name: { ar: 'مشاريع', en: 'Enterprise' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'مشاريع كبيرة وصناعية', en: 'Large & industrial projects' }, features: { ar: ['أنظمة عزل متعددة الطبقات', 'ضمان 15 سنة', 'فريق مخصص', 'تقارير أداء'], en: ['Multi-layer insulation systems', '15-year warranty', 'Dedicated team', 'Performance reports'] } },
  ],
  faq: [
    { q: { ar: 'كم سنة يضمن العزل؟', en: 'How long is the warranty?' }, a: { ar: 'من 5 إلى 15 سنة حسب النظام المختار.', en: '5 to 15 years depending on the system.' } },
    { q: { ar: 'هل العزل يقلل فاتورة الكهرباء؟', en: 'Does insulation reduce electricity bills?' }, a: { ar: 'نعم، حتى 30% توفير في تكلفة التكييف.', en: 'Yes — up to 30% savings on cooling costs.' } },
    { q: { ar: 'هل تطبيقكم على الأسطح المسكونة؟', en: 'Can you apply on inhabited rooftops?' }, a: { ar: 'نعم، بدون إزعاج للسكان.', en: 'Yes — without disturbing residents.' } },
    { q: { ar: 'كم مدة التطبيق؟', en: 'Application duration?' }, a: { ar: 'من 1-3 أيام للمساحات المتوسطة.', en: '1-3 days for medium areas.' } },
    { q: { ar: 'هل تقدمون عزل المسابح؟', en: 'Do you insulate pools?' }, a: { ar: 'نعم، عزل متخصص للمسابح والخزانات.', en: 'Yes — specialised for pools and tanks.' } },
    { q: { ar: 'هل المواد آمنة بيئياً؟', en: 'Are materials environmentally safe?' }, a: { ar: 'نعم، معتمدة من الجهات البيئية.', en: 'Yes — certified by environmental authorities.' } },
  ],
  related: ['construction', 'maintenance', 'projects'],
  metadata: {
    title: { ar: 'مواد العزل', en: 'Insulation Materials' },
    description: { ar: 'عزل مائي وحراري للأسطح والخزانات بضمان طويل الأمد وتوفير في الطاقة.', en: 'Water and thermal insulation for roofs and tanks — extended warranty and energy savings.' },
    keywords: { ar: 'عزل, بيتومين, عزل مائي, عزل حراري, أسطح', en: 'insulation, bitumen, waterproofing, thermal, roofs' },
  },
}

const maintenance: ServiceContent = {
  key: 'maintenance',
  hero: {
    eyebrow: { ar: 'الصيانة', en: 'Maintenance' },
    title: { ar: 'صيانة احترافية\nبأيدٍ خبيرة', en: 'Professional maintenance\nby expert hands' },
    subtitle: { ar: 'صيانة سباكة، كهرباء، تكييف، وتشطيبات بفنيين متخصصين واستجابة سريعة على مدار الساعة.', en: 'Plumbing, electrical, AC and finishing maintenance with specialist technicians and 24/7 rapid response.' },
    image: '/images/services/maintenance.jpg',
  },
  intro: { ar: 'فريق الصيانة في EAST PLUS يمتلك خبرة تتجاوز 15 عاماً في مختلف أنواع الصيانة المنزلية والتجارية. نعمل على مدار الساعة مع زمن استجابة لا يتجاوز ساعتين داخل الرياض، ومعدات تشخيص حديثة، وضمان على كل عملية صيانة. سواء كانت صيانة طارئة أو عقد سنوي، نحن جاهزون.', en: 'EAST PLUS maintenance team has over 15 years of experience across home and commercial maintenance. We work 24/7 with response time under 2 hours within Riyadh, modern diagnostic equipment, and warranty on every service. Whether emergency repair or annual contract — we are ready.' },
  problemSolution: {
    problems: { ar: ['أعطال متكررة', 'فنيون غير متخصصين', 'صيانة بدون ضمان', 'تأخر الاستجابة'], en: ['Recurring faults', 'Non-specialist technicians', 'No-warranty service', 'Slow response'] },
    solutions: { ar: ['تشخيص دقيق وحل جذري', 'فنيون معتمدون', 'ضمان 6 أشهر على كل صيانة', 'استجابة خلال ساعتين'], en: ['Accurate diagnosis and root-cause fixes', 'Certified technicians', '6-month warranty on every service', '2-hour response'] },
  },
  process: [
    { title: { ar: 'البلاغ', en: 'Report' }, description: { ar: 'اتصل أو أرسل بلاغك عبر المنصة.', en: 'Call or submit a report via the platform.' } },
    { title: { ar: 'التشخيص', en: 'Diagnosis' }, description: { ar: 'فني يصل ويشخص المشكلة.', en: 'A technician arrives and diagnoses.' } },
    { title: { ar: 'التسعير', en: 'Quote' }, description: { ar: 'عرض سعر شفاف قبل التنفيذ.', en: 'Transparent quote before work.' } },
    { title: { ar: 'الإصلاح', en: 'Fix' }, description: { ar: 'تنفيذ الصيانة بأحدث المعدات.', en: 'Repair using modern equipment.' } },
    { title: { ar: 'المتابعة', en: 'Follow-up' }, description: { ar: 'متابعة بعد العمل لضمان الجودة.', en: 'Post-service follow-up for quality assurance.' } },
  ],
  materials: [
    { name: { ar: 'صيانة سباكة', en: 'Plumbing Repairs' } },
    { name: { ar: 'صيانة كهرباء', en: 'Electrical Repairs' } },
    { name: { ar: 'صيانة تكييف', en: 'AC Servicing' } },
    { name: { ar: 'صيانة تشطيبات', en: 'Finishing Repairs' } },
    { name: { ar: 'صيانة دهانات', en: 'Painting Repairs' } },
    { name: { ar: 'صيانة جبس', en: 'Gypsum Repairs' } },
    { name: { ar: 'كشف تسربات', en: 'Leak Detection' } },
    { name: { ar: 'تنظيف خزانات', en: 'Tank Cleaning' } },
    { name: { ar: 'صيانة دورية', en: 'Periodic Maintenance' } },
    { name: { ar: 'صيانة طارئة', en: 'Emergency Maintenance' } },
    { name: { ar: 'عقود صيانة سنوية', en: 'Annual Contracts' } },
    { name: { ar: 'فحص شامل', en: 'Full Inspection' } },
  ],
  pricingTiers: [
    { name: { ar: 'استدعاء', en: 'Call-out' }, priceLabel: { ar: 'حسب الزيارة', en: 'Per visit' }, description: { ar: 'إصلاحات فورية', en: 'Immediate fixes' }, features: { ar: ['زيارة فني', 'تشخيص', 'إصلاح بسيط', 'ضمان 3 أشهر'], en: ['Technician visit', 'Diagnosis', 'Simple repair', '3-month warranty'] } },
    { name: { ar: 'عقد سنوي', en: 'Annual' }, priceLabel: { ar: 'باقة', en: 'Package' }, description: { ar: 'عقد شامل لمدة سنة', en: 'Full annual contract' }, features: { ar: ['زيارات دورية', 'استجابة 24/7', 'خصم على القطع', 'تقرير دوري', 'ضمان 12 شهر'], en: ['Periodic visits', '24/7 response', 'Parts discount', 'Periodic report', '12-month warranty'] }, highlighted: true },
    { name: { ar: 'منشآت', en: 'Facility' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'منشآت تجارية وفنادق', en: 'Commercial & hotels' }, features: { ar: ['فريق مقيم', 'تقنيات متقدمة', 'تقارير KPI', 'SLA معتمد'], en: ['On-site team', 'Advanced techniques', 'KPI reports', 'Defined SLA'] } },
  ],
  faq: [
    { q: { ar: 'كم زمن استجابتكم؟', en: 'What is your response time?' }, a: { ar: 'ساعتان داخل الرياض و4-6 ساعات للمدن الأخرى.', en: '2 hours within Riyadh, 4-6 hours for other cities.' } },
    { q: { ar: 'هل تعملون 24 ساعة؟', en: 'Do you work 24/7?' }, a: { ar: 'نعم، خط الطوارئ مفتوح على مدار الساعة.', en: 'Yes — emergency line open 24/7.' } },
    { q: { ar: 'هل تقدمون عقود صيانة سنوية؟', en: 'Annual maintenance contracts?' }, a: { ar: 'نعم، عقود مخصصة للمنازل والشركات.', en: 'Yes — tailored contracts for homes and businesses.' } },
    { q: { ar: 'ما الضمان على الصيانة؟', en: 'Maintenance warranty?' }, a: { ar: 'من 3 إلى 12 شهر حسب نوع الخدمة.', en: '3 to 12 months depending on service type.' } },
    { q: { ar: 'هل الفنيون معتمدون؟', en: 'Are technicians certified?' }, a: { ar: 'نعم، جميعهم بشهادات معتمدة وخبرة.', en: 'Yes — all certified with proven experience.' } },
    { q: { ar: 'كيف أحجز موعد صيانة؟', en: 'How to book maintenance?' }, a: { ar: 'عبر المنصة الإلكترونية أو واتساب أو الاتصال المباشر.', en: 'Via the online platform, WhatsApp or direct call.' } },
  ],
  related: ['plumbing', 'electrical', 'sanitary'],
  metadata: {
    title: { ar: 'الصيانة', en: 'Maintenance' },
    description: { ar: 'صيانة سباكة وكهرباء وتكييف بفنيين معتمدين، استجابة سريعة، وضمان على كل عملية.', en: 'Plumbing, electrical and AC maintenance — certified technicians, rapid response, and warranty.' },
    keywords: { ar: 'صيانة, سباكة, كهرباء, تكييف, طوارئ', en: 'maintenance, plumbing, electrical, AC, emergency' },
  },
}

const projects: ServiceContent = {
  key: 'projects',
  hero: {
    eyebrow: { ar: 'الإنشاءات والمشاريع', en: 'Construction & Projects' },
    title: { ar: 'مشاريع تسليم مفتاح\nمن البداية للنهاية', en: 'Turn-key projects\nfrom start to finish' },
    subtitle: { ar: 'تنفيذ متكامل لمشاريعك السكنية والتجارية والصناعية بفرق هندسية متخصصة وإدارة محترفة.', en: 'End-to-end execution of residential, commercial and industrial projects with specialised engineering teams and professional management.' },
    image: '/images/services/projects.jpg',
  },
  intro: { ar: 'EAST PLUS تنفّذ مشاريع تسليم مفتاح بكامل التفاصيل: من التصميم وتنفيذ الأساسات والهيكل، إلى التشطيبات الداخلية والخارجية، وحتى تسليم المشروع جاهزاً للسكن أو التشغيل. فرقنا الهندسية تتابع كل مرحلة بمعايير جودة صارمة، وإدارة مشروع شفافة مع تقارير دورية للعميل.', en: 'EAST PLUS executes full turn-key projects: from design through foundations and structure, to interior/exterior finishes, delivering a project ready for occupancy or operation. Our engineering teams follow every phase under strict quality standards with transparent project management and client reporting.' },
  problemSolution: {
    problems: { ar: ['تأخر تسليم المشاريع', 'تجاوز الميزانية', 'جودة تنفيذ ضعيفة', 'صعوبة التواصل مع المقاول'], en: ['Late project deliveries', 'Budget overruns', 'Poor execution quality', 'Hard contractor communication'] },
    solutions: { ar: ['عقود تسليم ملزمة', 'ميزانية واضحة بدون مفاجآت', 'إدارة جودة معتمدة', 'تقارير أسبوعية وتواصل مباشر'], en: ['Binding handover contracts', 'Clear no-surprise budget', 'Certified quality management', 'Weekly reports and direct line'] },
  },
  process: [
    { title: { ar: 'الاستشارة', en: 'Consultation' }, description: { ar: 'لقاء مع العميل لفهم المتطلبات.', en: 'Client meeting to understand requirements.' } },
    { title: { ar: 'التصميم', en: 'Design' }, description: { ar: 'تصاميم معمارية وهندسية معتمدة.', en: 'Approved architectural & engineering designs.' } },
    { title: { ar: 'العقد', en: 'Contract' }, description: { ar: 'عقد واضح بميزانية وجدول زمني.', en: 'Clear contract with budget and schedule.' } },
    { title: { ar: 'التنفيذ', en: 'Execution' }, description: { ar: 'تنفيذ على مراحل مع متابعة جودة.', en: 'Phased execution with quality follow-up.' } },
    { title: { ar: 'التسليم', en: 'Handover' }, description: { ar: 'تسليم نهائي بضمان وتدريب التشغيل.', en: 'Final handover with warranty and operation training.' } },
  ],
  materials: [
    { name: { ar: 'فلل سكنية', en: 'Residential Villas' } },
    { name: { ar: 'مباني تجارية', en: 'Commercial Buildings' } },
    { name: { ar: 'مستودعات', en: 'Warehouses' } },
    { name: { ar: 'مكاتب', en: 'Offices' } },
    { name: { ar: 'محلات تجارية', en: 'Retail Stores' } },
    { name: { ar: 'مطاعم وكافيهات', en: 'Restaurants & Cafés' } },
    { name: { ar: 'تجديد فلل', en: 'Villa Renovation' } },
    { name: { ar: 'تجديد شقق', en: 'Apartment Renovation' } },
    { name: { ar: 'إنشاء مسابح', en: 'Pool Construction' } },
    { name: { ar: 'تنسيق حدائق', en: 'Landscaping' } },
    { name: { ar: 'مشاريع صناعية', en: 'Industrial Projects' } },
    { name: { ar: 'إدارة مشاريع', en: 'Project Management' } },
  ],
  pricingTiers: [
    { name: { ar: 'تجديد', en: 'Renovation' }, priceLabel: { ar: 'حسب المساحة', en: 'Area-based' }, description: { ar: 'تجديد فلل وشقق', en: 'Villa & apartment renovation' }, features: { ar: ['تصميم داخلي', 'تنفيذ كامل', 'تسليم 30-60 يوم', 'ضمان سنة'], en: ['Interior design', 'Full execution', '30-60 day delivery', '1-year warranty'] } },
    { name: { ar: 'بناء جديد', en: 'New Build' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'فلل ومباني جديدة', en: 'New villas & buildings' }, features: { ar: ['تصميم معماري', 'تنفيذ تسليم مفتاح', 'إدارة مشروع', 'ضمان 5 سنوات'], en: ['Architectural design', 'Turn-key execution', 'Project management', '5-year warranty'] }, highlighted: true },
    { name: { ar: 'تطوير', en: 'Development' }, priceLabel: { ar: 'مخصّص', en: 'Custom' }, description: { ar: 'مشاريع تطوير عقاري', en: 'Real-estate development' }, features: { ar: ['دراسة جدوى', 'تطوير شامل', 'تسويق المشروع', 'إدارة عقود'], en: ['Feasibility study', 'Full development', 'Project marketing', 'Contract management'] } },
  ],
  faq: [
    { q: { ar: 'كم مدة التنفيذ لفيلا؟', en: 'Villa execution time?' }, a: { ar: 'من 8 إلى 14 شهر حسب المساحة والتصميم.', en: '8 to 14 months depending on area and design.' } },
    { q: { ar: 'هل تقدمون التصميم؟', en: 'Do you provide design?' }, a: { ar: 'نعم، تصميم معماري وداخلي معتمد.', en: 'Yes — approved architectural and interior design.' } },
    { q: { ar: 'ما الضمان على البناء؟', en: 'Construction warranty?' }, a: { ar: 'ضمان هيكلي 5 سنوات وتشطيبات سنة.', en: '5-year structural and 1-year finishing warranty.' } },
    { q: { ar: 'هل تتعاملون مع البلديات؟', en: 'Do you handle municipal approvals?' }, a: { ar: 'نعم، نتولى كل التصاريح والمتابعات.', en: 'Yes — we handle all permits and follow-ups.' } },
    { q: { ar: 'كيف تتم متابعة المشروع؟', en: 'How is the project tracked?' }, a: { ar: 'تقارير أسبوعية ومنصة إلكترونية للمتابعة.', en: 'Weekly reports and an online tracking platform.' } },
    { q: { ar: 'هل تنفذون مشاريع صناعية؟', en: 'Do you do industrial projects?' }, a: { ar: 'نعم، مستودعات ومصانع ومنشآت صناعية.', en: 'Yes — warehouses, factories and industrial facilities.' } },
  ],
  related: ['construction', 'electrical', 'plumbing'],
  metadata: {
    title: { ar: 'الإنشاءات والمشاريع', en: 'Construction & Projects' },
    description: { ar: 'تنفيذ مشاريع تسليم مفتاح من التصميم للتشطيب بفرق هندسية متخصصة.', en: 'Turn-key project execution from design to finish with specialist engineering teams.' },
    keywords: { ar: 'مشاريع, إنشاءات, تسليم مفتاح, فلل, مباني', en: 'projects, construction, turn-key, villas, buildings' },
  },
}

export const SERVICE_CONTENT: Record<ServiceKey, ServiceContent> = {
  plumbing,
  electrical,
  construction,
  sanitary,
  insulation,
  maintenance,
  projects,
}

export function getServiceContent(key: ServiceKey): ServiceContent {
  return SERVICE_CONTENT[key]
}
