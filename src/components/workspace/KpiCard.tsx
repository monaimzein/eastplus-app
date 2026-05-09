export default function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs text-[var(--fg-muted)] mb-2">{label}</p>
      <p className="text-3xl font-semibold text-[var(--fg)]">{value}</p>
    </div>
  )
}