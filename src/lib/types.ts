export type UserRole = 'user' | 'contractor' | 'staff' | 'admin'

export type RFQStatus =
  | 'new'
  | 'assigned'
  | 'in_progress'
  | 'quoted'
  | 'negotiation'
  | 'closed'

export type RFQPriority = 'fast' | 'normal' | 'project'

export interface Profile {
  id: string
  email: string
  company_name: string
  commercial_registration: string
  vat_number: string
  whatsapp_number: string
  national_address: string
  role: UserRole
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
  images: string[]
  attachments: string[]
  quotation_pdf: string | null
  rating: number | null
  rating_comment: string | null
  created_at: string
  updated_at: string
  // Joined
  user?: Profile
  staff?: Profile
  timeline?: RFQTimeline[]
  messages?: ChatMessage[]
}

export interface RFQTimeline {
  id: string
  rfq_id: string
  action: string
  details: string | null
  created_by: string
  created_at: string
  profile?: Profile
}

export interface ChatMessage {
  id: string
  rfq_id: string
  sender_id: string
  content: string
  file_url: string | null
  is_read: boolean
  created_at: string
  sender?: Profile
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string | null
  category: string
  seo_title: string | null
  seo_description: string | null
  published: boolean
  author_id: string
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'rfq_update' | 'new_message' | 'quotation' | 'system'
  is_read: boolean
  link: string | null
  created_at: string
}

export const RFQ_STATUS_LABELS: Record<RFQStatus, string> = {
  new: 'جديد',
  assigned: 'تم التعيين',
  in_progress: 'قيد التنفيذ',
  quoted: 'تم التسعير',
  negotiation: 'مفاوضة',
  closed: 'مغلق',
}

export const RFQ_STATUS_COLORS: Record<RFQStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-green-100 text-green-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed: 'bg-gray-100 text-gray-800',
}

export const RFQ_PRIORITY_LABELS: Record<RFQPriority, string> = {
  fast: 'سريع (1 يوم)',
  normal: 'عادي (2 يوم)',
  project: 'مشروع (3 أيام)',
}
