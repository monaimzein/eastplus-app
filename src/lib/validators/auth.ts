import { z } from 'zod'

export const whatsappSchema = z
  .string()
  .regex(/^05\d{8}$/, 'رقم الواتساب يجب أن يكون بصيغة 05XXXXXXXX')

export const customerRegisterSchema = z.object({
  company_name: z.string().trim().min(2, 'اسم الشركة مطلوب'),
  commercial_registration: z.string().trim().min(3, 'السجل التجاري مطلوب'),
  vat_number: z.string().trim().min(3, 'الرقم الضريبي مطلوب'),
  whatsapp_number: whatsappSchema,
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  national_address: z.string().trim().min(5, 'العنوان الوطني مطلوب'),
  password: z.string().min(8, 'كلمة السر يجب أن تكون 8 أحرف على الأقل'),
})

export const loginSchema = z.object({
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'كلمة السر مطلوبة'),
})

export const employeeSchema = z.object({
  full_name: z.string().trim().min(2, 'اسم الموظف مطلوب'),
  email: z.string().trim().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة السر يجب أن تكون 8 أحرف على الأقل').optional(),
  job_title: z.string().trim().min(2, 'التايتل الوظيفي مطلوب'),
  role: z.enum(['staff', 'admin']).default('staff'),
})