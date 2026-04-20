'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks'
import DashboardLayout from '@/components/DashboardLayout'
import { Users, Trash2, Plus, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/lib/types'

export default function AdminStaffPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [staff, setStaff] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company_name: '',
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStaff = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['staff', 'admin'])
      .order('created_at', { ascending: false })

    if (data) setStaff(data as Profile[])
    setLoading(false)
  }

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    // Create user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          company_name: formData.company_name,
          role: 'staff',
        },
      },
    })

    if (error) {
      toast.error(error.message)
      setCreating(false)
      return
    }

    // Update role to staff
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ role: 'staff', company_name: formData.company_name })
        .eq('id', data.user.id)
    }

    toast.success('تم إنشاء حساب الموظف بنجاح')
    setFormData({ email: '', password: '', company_name: '' })
    setShowForm(false)
    setCreating(false)
    fetchStaff()
  }

  const deleteStaff = async (staffId: string) => {
    if (staffId === user?.id) {
      toast.error('لا يمكنك حذف حسابك الخاص')
      return
    }

    const confirmed = window.confirm('هل أنت متأكد من حذف هذا الموظف؟')
    if (!confirmed) return

    const { error, data } = await supabase
      .from('profiles')
      .update({ role: 'user' })
      .eq('id', staffId)
      .select('id, role')

    if (error) {
      toast.error('خطأ في تغيير الصلاحيات: ' + error.message)
      return
    }

    // RLS may silently block the update (0 rows affected, no error)
    if (!data || data.length === 0 || data[0].role !== 'user') {
      toast.error('فشل تغيير الصلاحيات - تأكد من تشغيل سياسة "Admin can update any profile" في Supabase SQL Editor')
      return
    }

    toast.success('تم إزالة صلاحيات الموظف')
    setStaff((prev) => prev.filter((s) => s.id !== staffId))
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">إدارة الموظفين</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            إضافة موظف
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <form
            onSubmit={createStaff}
            className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
          >
            <h3 className="font-semibold text-[#1A1A1A]">إضافة موظف جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="اسم الموظف"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                }
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81]"
                required
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81]"
                required
                dir="ltr"
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#DCBE81]"
                required
                dir="ltr"
                minLength={6}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 gold-gradient text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {creating ? 'جاري الإنشاء...' : 'إنشاء'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Staff List */}
        <div className="bg-white rounded-2xl border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : staff.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">لا يوجد موظفون</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-white font-bold shrink-0">
                    {member.company_name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A]">{member.company_name}</p>
                    <p className="text-xs text-gray-400" dir="ltr">{member.email}</p>
                  </div>
                  <span
                    className={`status-badge ${
                      member.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    <Shield size={12} className="ml-1" />
                    {member.role === 'admin' ? 'مدير' : 'موظف'}
                  </span>
                  {member.id !== user?.id && (
                    <button
                      onClick={() => deleteStaff(member.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="إزالة"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
