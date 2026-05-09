import ConsoleShell from '@/components/console/ConsoleShell'
import { requireStaff } from '@/lib/auth/guards'

export default async function StaffConsoleLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff()
  return <ConsoleShell profile={profile}>{children}</ConsoleShell>
}