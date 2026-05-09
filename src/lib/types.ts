export type UserRole = 'user' | 'staff' | 'admin'

export type RFQStatus =
  | 'new'
  | 'in_progress'
  | 'quote_sent'
  | 'closed'

export type RFQPriority = 'fast' | 'normal' | 'project'

export type ServiceKey =
  | 'plumbing'
  | 'electrical'
  | 'construction'
  | 'sanitary'
  | 'insulation'
  | 'maintenance'
  | 'projects'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string
  commercial_registration: string | null
  vat_number: string | null
  phone?: string | null
  whatsapp_number: string | null
  national_address: string | null
  address?: string | null
  tax_number?: string | null
  avatar_url?: string | null
  job_title: string | null
  role: UserRole
  is_active: boolean
  notification_prefs: { in_app: boolean; email: boolean; whatsapp: boolean }
  language: 'ar' | 'en'
  theme: 'dark' | 'light' | 'system'
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

export interface RFQ {
  id: string
  user_id: string
  assigned_to: string | null
  title: string
  description: string | null
  priority: RFQPriority
  status: RFQStatus
  closed_at: string | null
  created_at: string
  updated_at: string
  // Joined
  user?: Profile
  staff?: Profile
  timeline?: RFQTimeline[]
  messages?: ChatMessage[]
  quotations?: Quotation[]
}

export interface RFQTimeline {
  id: string
  rfq_id: string
  created_by: string | null
  status: RFQStatus | null
  message: string
  is_internal: boolean
  created_at: string
  profile?: Profile
}

export interface RFQFile {
  id: string
  rfq_id: string
  uploaded_by: string | null
  owner_type: 'customer' | 'company'
  bucket: string
  path: string
  file_name: string
  mime_type: string | null
  file_size: number | null
  created_at: string
}

export interface ChatMessage {
  id: string
  rfq_id: string
  sender_id: string
  content: string
  file_id: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  sender?: Profile
}

export interface Quotation {
  id: string
  rfq_id: string
  staff_id: string | null
  number: string | null
  file_id: string | null
  subtotal?: number | null
  vat_rate?: number | null
  vat_amount?: number | null
  total?: number | null
  currency?: string | null
  pdf_url?: string | null
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  notes: string | null
  sent_at: string | null
  valid_until?: string | null
  created_at: string
  updated_at: string
  rfq?: RFQ
  staff?: Profile
}

export interface QuotationItem {
  id: string
  quotation_id: string
  item_name: string
  description: string | null
  quantity: number
  unit: string
  unit_cost: number
  margin_pct: number
  unit_price: number  // generated
  line_total: number  // generated
  supplier_id: string | null
  sort_order: number
  supplier?: Supplier
}

export interface Invoice {
  id: string
  quotation_id: string
  number: string | null
  zatca_uuid: string | null
  total: number
  paid_at: string | null
  pdf_url: string | null
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  /** alias for contact_phone */
  phone: string | null
  /** alias for contact_email */
  email: string | null
  /** alias for notes */
  specialty: string | null
  lead_time_days: number
  notes: string | null
  active: boolean
  is_active: boolean
  created_at: string
}

export interface SupplierPrice {
  id: string
  supplier_id: string
  item_name: string
  description: string | null
  unit: string
  price: number
  currency: string
  updated_at: string
  supplier?: Supplier
}

export interface AuditLog {
  id: string
  actor_id: string | null
  action: string
  target_type: string | null
  target_id: string | null
  /** alias used in audit page */
  table_name: string | null
  /** alias used in audit page */
  record_id: string | null
  metadata: Record<string, unknown>
  ip: string | null
  created_at: string
  actor?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'rfq_update' | 'new_message' | 'quotation' | 'system' | 'contact_message'
  priority: 'low' | 'normal' | 'high'
  is_read: boolean
  read_at: string | null
  link: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  company: string | null
  email: string
  phone: string | null
  message: string
  is_read: boolean
  read_at: string | null
  replied_at: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  title_en: string | null
  excerpt_en: string | null
  content_en: string | null
  cover_image: string | null
  /** alias for cover_image */
  cover_url: string | null
  category: string
  category_en: string | null
  seo_title: string | null
  seo_title_en: string | null
  seo_description: string | null
  seo_description_en: string | null
  published: boolean
  /** alias for published */
  is_published: boolean
  published_at: string | null
  author_id: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Testimonial {
  id: string
  name: string
  /** alias for name used in CMS page */
  author_name: string | null
  company: string | null
  /** alias for company used in CMS page */
  author_company: string | null
  role_title: string | null
  content_ar: string
  /** alias for content_ar used in CMS page */
  content: string | null
  content_en: string | null
  image_url: string | null
  rating: number
  published: boolean
  /** alias for published */
  is_published: boolean
  sort_order: number
  created_at: string
}

export interface CaseStudy {
  id: string
  slug: string
  title_ar: string
  title_en: string | null
  excerpt_ar: string
  excerpt_en: string | null
  content_ar: string
  content_en: string | null
  cover_image: string | null
  images: string[]
  stats: Array<{ label_ar: string; label_en: string; value: string }>
  service_key: ServiceKey | null
  published: boolean
  published_at: string | null
  created_at: string
}

export interface FAQ {
  id: string
  question_ar: string
  question_en: string | null
  answer_ar: string
  answer_en: string | null
  /** alias for question_ar used in CMS page */
  question: string | null
  /** alias for answer_ar used in CMS page */
  answer: string | null
  category: string
  sort_order: number
  published: boolean
  /** alias for published */
  is_published: boolean
  created_at: string
}

export interface ClientLogo {
  id: string
  name: string
  logo_url: string | null
  link_url: string | null
  sort_order: number
  published: boolean
  created_at: string
}

export interface GalleryItem {
  id: string
  title_ar: string
  title_en: string | null
  /** alias for title_ar */
  title: string | null
  image_url: string
  category: string
  project_url: string | null
  sort_order: number
  published: boolean
  /** alias for published */
  is_published: boolean
  created_at: string
}

export interface EmailTemplate {
  id: string
  key: string
  subject_ar: string
  subject_en: string
  body_ar: string
  body_en: string
  variables: string[]
  created_at: string
  updated_at: string
}

export interface Setting {
  key: string
  value: Record<string, unknown>
  updated_at: string
}

// ── Labels & colors ────────────────────────────────────────────

export const RFQ_STATUS_LABELS: Record<RFQStatus, string> = {
  new: 'جديد',
  in_progress: 'قيد التنفيذ',
  quote_sent: 'تم إرسال عرض السعر',
  closed: 'مغلق',
}

export const RFQ_STATUS_LABELS_EN: Record<RFQStatus, string> = {
  new: 'New',
  in_progress: 'In Progress',
  quote_sent: 'Quote Sent',
  closed: 'Closed',
}

export const RFQ_STATUS_COLORS: Record<RFQStatus, string> = {
  new: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  in_progress: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  quote_sent: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  closed: 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30',
}

export const RFQ_PRIORITY_LABELS: Record<RFQPriority, string> = {
  fast: 'سريع (24 ساعة)',
  normal: 'عادي (48 ساعة)',
  project: 'مشروع (72 ساعة)',
}

export const RFQ_PRIORITY_COLORS: Record<RFQPriority, string> = {
  fast: 'bg-red-500/15 text-red-300 border border-red-500/30',
  normal: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  project: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
}

export const SERVICE_LABELS: Record<ServiceKey, string> = {
  plumbing: 'السباكة',
  electrical: 'الكهرباء',
  construction: 'مواد البناء',
  sanitary: 'الأدوات الصحية',
  insulation: 'العزل',
  maintenance: 'الصيانة',
  projects: 'الإنشاءات',
}

export const QUOTATION_STATUS_LABELS = {
  draft: 'مسودة',
  sent: 'تم الإرسال',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  expired: 'منتهي',
}

export const QUOTATION_STATUS_COLORS = {
  draft: 'bg-zinc-500/15 text-zinc-400',
  sent: 'bg-blue-500/15 text-blue-300',
  accepted: 'bg-emerald-500/15 text-emerald-300',
  rejected: 'bg-red-500/15 text-red-300',
  expired: 'bg-orange-500/15 text-orange-300',
}
