import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: string
  helper: string
  icon: LucideIcon
  tone?: 'blue' | 'green' | 'red' | 'purple'
}

const tones = {
  blue: 'bg-blue-50 text-kantar-blue',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-violet-50 text-violet-600',
}

export function SummaryCard({ title, value, helper, icon: Icon, tone = 'blue' }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-5 text-4xl font-black tracking-tight text-kantar-ink">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-500">{helper}</p>
    </div>
  )
}
