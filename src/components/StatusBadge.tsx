import { RunStatus } from '../types'

const styles: Record<RunStatus, string> = {
  Success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Failed: 'bg-red-50 text-red-700 ring-red-200',
  Running: 'bg-blue-50 text-blue-700 ring-blue-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
}

export function StatusBadge({ status }: { status: RunStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${styles[status]}`}>{status}</span>
}
