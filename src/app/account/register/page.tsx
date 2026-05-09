import CustomerRegisterForm from '@/components/auth/CustomerRegisterForm'

export default function AccountRegisterPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4 py-16 bg-[var(--bg)]" dir="rtl">
      <CustomerRegisterForm />
    </main>
  )
}