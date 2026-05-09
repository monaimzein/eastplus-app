import ProfileForm from '@/components/account/ProfileForm'
import { requireCustomer } from '@/lib/auth/guards'

export default async function AccountProfilePage() {
  const profile = await requireCustomer()
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">الملف الشخصي</h1>
        <p className="text-[var(--fg-muted)] mt-2">حدّث بيانات الشركة والتواصل.</p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  )
}