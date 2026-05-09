import ConsoleShell from '@/components/console/ConsoleShell'
import { requireAdmin } from '@/lib/auth/guards'

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin()
  return <ConsoleShell profile={profile}>{children}</ConsoleShell>
}