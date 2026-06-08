import { AlertCircle, CheckCircle2, Files, PlayCircle, Plus, RefreshCcw, TrendingUp } from 'lucide-react'
import { SummaryCard } from '../components/SummaryCard'
import { StatusBadge } from '../components/StatusBadge'
import { runHistory } from '../data'
import { Page } from '../types'

interface Props {
  onNavigate: (page: Page) => void
}

export function DashboardPage({ onNavigate }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-[2rem] kantar-gradient p-6 text-white shadow-soft lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-white/65">KANTAR Retail Audit Automation</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Automate retail audit queries, feedback correction, and batch merging.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">Run project-specific Excel workflows safely, review settings before execution, and download clean output workbooks from one internal dashboard.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => onNavigate('new-run')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-kantar-navy shadow-card hover:bg-blue-50">
                <Plus className="h-5 w-5" />
                Start New Run
              </button>
              <button onClick={() => onNavigate('history')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/18 px-5 py-3 font-bold text-white hover:bg-white/10">
                View History
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-sm text-white/62">Success Rate</p>
              <p className="mt-3 text-4xl font-black">95.3%</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-sm text-white/62">Avg Runtime</p>
              <p className="mt-3 text-4xl font-black">2.4m</p>
            </div>
            <div className="col-span-2 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-sm text-white/62">System Health</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[98%] rounded-full bg-white" />
              </div>
              <p className="mt-3 text-sm font-semibold text-white/76">All automation services operational</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Runs" value="128" helper="+12% vs last month" icon={TrendingUp} tone="blue" />
        <SummaryCard title="Successful" value="122" helper="95.3% success rate" icon={CheckCircle2} tone="green" />
        <SummaryCard title="Failed" value="6" helper="Requires attention" icon={AlertCircle} tone="red" />
        <SummaryCard title="Files Generated" value="450" helper="3.5 avg files per run" icon={Files} tone="purple" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-xl font-black text-kantar-ink">Recent Activity</h2>
              <p className="text-sm text-slate-500">Latest Retail Audit automation runs</p>
            </div>
            <button onClick={() => onNavigate('history')} className="rounded-xl px-3 py-2 text-sm font-bold text-kantar-blue hover:bg-blue-50">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Run ID</th>
                  <th className="px-5 py-4">Project</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {runHistory.slice(0, 5).map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-bold text-kantar-blue">{run.id}</td>
                    <td className="px-5 py-4 font-semibold text-kantar-ink">{run.title}</td>
                    <td className="px-5 py-4 text-slate-600">{run.action}</td>
                    <td className="px-5 py-4"><StatusBadge status={run.status} /></td>
                    <td className="px-5 py-4 text-slate-600">{run.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-xl font-black text-kantar-ink">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              {['New Data Query', 'New POS & Cooler Query', 'Correct Feedback', 'Merge Feedback'].map((label, index) => (
                <button key={label} onClick={() => onNavigate('new-run')} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left font-bold transition ${index === 0 ? 'border-kantar-blue bg-kantar-blue text-white shadow-card' : 'border-slate-200 bg-white text-kantar-ink hover:border-kantar-blue hover:text-kantar-blue'}`}>
                  <span>{label}</span>
                  {index < 2 ? <PlayCircle className="h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Output Safety</p>
            <h3 className="mt-3 text-lg font-black text-kantar-ink">Original files are protected</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Runs are designed to create downloadable output workbooks instead of overwriting source uploads.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
