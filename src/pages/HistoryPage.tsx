import { Download, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { runHistory } from '../data'
import { StatusBadge } from '../components/StatusBadge'

export function HistoryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-kantar-blue">Run history</p>
            <h1 className="mt-2 text-3xl font-black text-kantar-ink">Review previous automation runs</h1>
            <p className="mt-2 text-slate-500">Search, filter, download outputs, and inspect logs for completed Retail Audit processes.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 hover:border-kantar-blue hover:text-kantar-blue">
            <SlidersHorizontal className="h-5 w-5" />
            Export History
          </button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search by project, action, or run ID..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100" />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 hover:border-kantar-blue hover:text-kantar-blue">
            <Filter className="h-5 w-5" />
            Filters
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 hover:border-kantar-blue hover:text-kantar-blue">
            Date Range
          </button>
        </div>
      </div>

      <div className="hidden rounded-[2rem] border border-slate-200 bg-white shadow-card lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Run ID</th>
                <th className="px-5 py-4">Process</th>
                <th className="px-5 py-4">Family</th>
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Batch</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Duration</th>
                <th className="px-5 py-4 text-right">Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runHistory.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4 font-bold text-kantar-blue">{run.id}</td>
                  <td className="px-5 py-4 font-black text-kantar-ink">{run.title}</td>
                  <td className="px-5 py-4 text-slate-600">{run.family}</td>
                  <td className="px-5 py-4 text-slate-600">{run.project}</td>
                  <td className="px-5 py-4 text-slate-600">{run.batch}</td>
                  <td className="px-5 py-4 text-slate-600">{run.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={run.status} /></td>
                  <td className="px-5 py-4 text-slate-600">{run.duration}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="rounded-2xl border border-slate-200 p-3 text-kantar-blue hover:bg-blue-50 disabled:opacity-40" disabled={run.status !== 'Success'}>
                      <Download className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        {runHistory.map((run) => (
          <div key={run.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-400">{run.id} • {run.date}</p>
                <h3 className="mt-2 text-xl font-black text-kantar-ink">{run.title}</h3>
              </div>
              <StatusBadge status={run.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <p><span className="text-slate-400">Action:</span> <b>{run.action}</b></p>
              <p><span className="text-slate-400">Batch:</span> <b>{run.batch}</b></p>
              <p><span className="text-slate-400">Duration:</span> <b>{run.duration}</b></p>
              <p><span className="text-slate-400">Files:</span> <b>{run.files}</b></p>
            </div>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-bold text-kantar-blue disabled:opacity-40" disabled={run.status !== 'Success'}>
              <Download className="h-5 w-5" />
              Download Output
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
