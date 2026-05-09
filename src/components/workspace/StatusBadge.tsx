const labels: Record<string, string> = {
  new: 'جديد',
  in_progress: 'جار',
  quote_sent: 'تم إرسال عرض السعر',
  closed: 'مغلق',
}

const classes: Record<string, string> = {
  new: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  in_progress: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  quote_sent: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  closed: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes[status] || classes.new}`}>
      {labels[status] || status}
    </span>
  )
}