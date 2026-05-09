import EmployeeForm from '@/components/console/EmployeeForm'
import EmployeeStatusButton from '@/components/console/EmployeeStatusButton'
import { requireAdmin } from '@/lib/auth/guards'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
  await requireAdmin()
  const supabase = await createClient()
  const { data: employeeRows } = await supabase
    .from('profiles')
    .select('id,full_name,email,job_title,role,is_active,created_at')
    .in('role', ['staff', 'admin'])
    .order('created_at', { ascending: false })
  const employees = employeeRows ?? []
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold">إدارة الموظفين</h1>
      <EmployeeForm />
      <div className="surface-card overflow-hidden">
        {employees.map((employee) => (
          <div key={employee.id} className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 px-5 py-4 border-b border-[var(--border)] last:border-0 items-center">
            <div>
              <p className="font-medium">{employee.full_name || employee.email}</p>
              <p className="text-sm text-[var(--fg-muted)]">{employee.job_title || '-'}</p>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">{employee.email}</p>
            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs">{employee.role === 'admin' ? 'مدير' : 'موظف'} · {employee.is_active ? 'نشط' : 'معطل'}</span>
            <EmployeeStatusButton id={employee.id} isActive={employee.is_active} />
          </div>
        ))}
      </div>
    </div>
  )
}