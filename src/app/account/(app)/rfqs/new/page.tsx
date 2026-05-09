import NewRfqForm from '@/components/account/NewRfqForm'

export default function NewRfqPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">طلب عرض سعر جديد</h1>
        <p className="text-[var(--fg-muted)] mt-2">أرسل تفاصيل المشروع والملفات، وسيتابع الفريق معك من نفس الطلب.</p>
      </div>
      <NewRfqForm />
    </div>
  )
}