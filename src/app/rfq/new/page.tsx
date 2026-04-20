'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks'
import { useDropzone } from 'react-dropzone'
import {
  Upload,
  X,
  Image as ImageIcon,
  FileSpreadsheet,
  Send,
  Clock,
  Zap,
  Building2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import * as XLSX from 'xlsx'
import type { RFQPriority } from '@/lib/types'

const priorities: {
  value: RFQPriority
  label: string
  desc: string
  icon: typeof Zap
  time: string
}[] = [
  {
    value: 'fast',
    label: 'سريع',
    desc: 'أولوية قصوى',
    icon: Zap,
    time: '1 يوم',
  },
  {
    value: 'normal',
    label: 'عادي',
    desc: 'الخيار الأكثر شيوعاً',
    icon: Clock,
    time: '2 يوم',
  },
  {
    value: 'project',
    label: 'مشروع',
    desc: 'للكميات الكبيرة',
    icon: Building2,
    time: '3 أيام',
  },
]

export default function NewRFQPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<RFQPriority>('normal')
  const [files, setFiles] = useState<File[]>([])
  const [boqData, setBoqData] = useState<string[][] | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter((f) =>
      f.type.startsWith('image/')
    )
    setFiles((prev) => [...prev, ...imageFiles].slice(0, 10))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
  })

  const handleBOQUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })
      setBoqData(jsonData)
      toast.success('تم رفع ملف BOQ بنجاح')
    }
    reader.readAsArrayBuffer(file)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً')
      router.push('/auth/login')
      return
    }

    if (!title.trim()) {
      toast.error('يرجى إدخال عنوان الطلب')
      return
    }

    setSubmitting(true)

    try {
      // Check active RFQ limit
      const { data: activeRFQs } = await supabase
        .from('rfqs')
        .select('id')
        .eq('user_id', user.id)
        .not('status', 'eq', 'closed')

      const maxRFQs = user.role === 'contractor' ? 5 : 3
      if (activeRFQs && activeRFQs.length >= maxRFQs) {
        toast.error(
          `لقد وصلت للحد الأقصى من الطلبات النشطة (${maxRFQs} طلبات)`
        )
        setSubmitting(false)
        return
      }

      // Upload images
      const imageUrls: string[] = []
      for (const file of files) {
        const ext = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('rfq-files')
          .upload(fileName, file)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('rfq-files')
            .getPublicUrl(fileName)
          imageUrls.push(urlData.publicUrl)
        }
      }

      // Build description with BOQ data
      let fullDescription = description
      if (boqData) {
        fullDescription += '\n\n--- BOQ Data ---\n'
        fullDescription += boqData
          .map((row) => row.join(' | '))
          .join('\n')
      }

      // Create RFQ
      const { data: newRfq, error } = await supabase.from('rfqs').insert({
        user_id: user.id,
        title,
        description: fullDescription,
        priority,
        images: imageUrls,
        status: 'new',
      }).select('id').single()

      if (error) throw error

      // Notify all staff and admins about new RFQ
      const { data: staffUsers } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['staff', 'admin'])

      if (staffUsers && staffUsers.length > 0) {
        await supabase.from('notifications').insert(
          staffUsers.map((s) => ({
            user_id: s.id,
            title: 'طلب عرض سعر جديد',
            message: `طلب جديد: "${title}" - ${user.company_name}`,
            type: 'rfq_update' as const,
            link: `/staff/rfqs/${newRfq?.id}`,
          }))
        )
      }

      toast.success('تم إرسال طلب عرض السعر بنجاح!')
      router.push('/dashboard')
    } catch {
      toast.error('حدث خطأ أثناء إرسال الطلب')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-[#DCBE81] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A1A1A]">
              طلب عرض سعر جديد
            </h1>
            <p className="text-gray-500 mt-2">
              أرسل تفاصيل المواد المطلوبة وسنرد عليك خلال 24 ساعة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                عنوان الطلب <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#DCBE81] transition-colors"
                placeholder="مثال: مواد سباكة لمشروع سكني - 50 وحدة"
                required
              />
            </div>

            {/* Priority */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-4">
                نوع الطلب
              </label>
              <div className="grid grid-cols-3 gap-3">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      priority === p.value
                        ? 'border-[#DCBE81] bg-[#DCBE81]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <p.icon
                      size={24}
                      className={`mx-auto mb-2 ${
                        priority === p.value
                          ? 'text-[#DCBE81]'
                          : 'text-gray-400'
                      }`}
                    />
                    <div className="font-semibold text-sm text-[#1A1A1A]">
                      {p.label}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{p.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Images Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-4">
                صور المواد المطلوبة
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-[#DCBE81] bg-[#DCBE81]/5'
                    : 'border-gray-200 hover:border-[#DCBE81]/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload
                  size={32}
                  className="mx-auto mb-3 text-gray-400"
                />
                <p className="text-gray-500 text-sm">
                  اسحب الصور هنا أو اضغط للاختيار
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  PNG, JPG, WEBP (حد أقصى 5MB لكل صورة, 10 صور)
                </p>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`upload-${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOQ Upload */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                رفع ملف BOQ (اختياري)
              </label>
              <p className="text-gray-400 text-xs mb-4">
                ارفع ملف Excel يحتوي على جدول الكميات
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#DCBE81] transition-colors cursor-pointer">
                <FileSpreadsheet size={18} />
                اختر ملف Excel
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleBOQUpload}
                  className="hidden"
                />
              </label>
              {boqData && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ تم رفع BOQ ({boqData.length} صف)
                </p>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                وصف إضافي (اختياري)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#DCBE81] transition-colors resize-none"
                placeholder="أضف أي تفاصيل إضافية عن المواد المطلوبة، الكميات، المواصفات..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 gold-gradient text-white font-semibold rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send size={20} className="rotate-180" />
                  إرسال طلب عرض السعر
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
