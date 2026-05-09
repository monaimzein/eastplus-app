import AccountShell from '@/components/account/AccountShell'
import { requireCustomer } from '@/lib/auth/guards'

export default async function AccountAppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireCustomer()
  return <AccountShell profile={profile}>{children}</AccountShell>
}