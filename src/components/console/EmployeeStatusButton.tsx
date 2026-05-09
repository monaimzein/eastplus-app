'use client'

import { useRouter } from 'next/navigation'

export default function EmployeeStatusButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter()
  const submit = async () => {
    await fetch('/api/admin/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !isActive }),
    })
    router.refresh()
  }
  return (
    <button type="button" onClick={submit} className="btn-outline !py-2 !px-3 text-xs">
      {isActive ? 'تعطيل' : 'تفعيل'}
    </button>
  )
}