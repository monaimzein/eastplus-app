import ConsoleLoginForm from '@/components/auth/ConsoleLoginForm'
import { Suspense } from 'react'

export default function ConsoleLoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4 py-16 bg-[var(--bg)]" dir="rtl">
      <Suspense fallback={<div className="surface-card p-8 text-sm text-[var(--fg-muted)]">جاري التحميل...</div>}>
        <ConsoleLoginForm />
      </Suspense>
    </main>
  )
}