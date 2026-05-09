type AuthErrorLike = {
  message?: string
  name?: string
  status?: number
  code?: string
}

export function getAuthErrorMessage(error: AuthErrorLike | null | undefined) {
  const message = error?.message?.toLowerCase() ?? ''
  const code = error?.code?.toLowerCase() ?? ''

  if (!message && !code) {
    return 'تعذر تسجيل الدخول حاليًا. حاول مرة أخرى بعد قليل.'
  }

  if (
    code === 'invalid_credentials' ||
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials') ||
    message.includes('email or password')
  ) {
    return 'بيانات الدخول غير صحيحة'
  }

  if (message.includes('email not confirmed')) {
    return 'يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول'
  }

  if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('name_not_resolved') ||
    message.includes('fetch')
  ) {
    return 'تعذر الوصول إلى خدمة تسجيل الدخول. تحقق من إعدادات Supabase على الاستضافة.'
  }

  if ((error?.status ?? 0) >= 500) {
    return 'خدمة تسجيل الدخول غير متاحة حاليًا. حاول مرة أخرى بعد قليل.'
  }

  return error?.message ?? 'تعذر تسجيل الدخول حاليًا. حاول مرة أخرى بعد قليل.'
}