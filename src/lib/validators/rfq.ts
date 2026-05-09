import { z } from 'zod'

export const rfqSchema = z.object({
  title: z.string().trim().min(3, 'عنوان الطلب مطلوب'),
  description: z.string().trim().optional(),
})

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, 'اكتب الرسالة أولاً'),
})

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'الاسم مطلوب'),
  company: z.string().trim().optional(),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().trim().min(8, 'رقم الجوال مطلوب'),
  message: z.string().trim().min(5, 'الرسالة مطلوبة'),
})