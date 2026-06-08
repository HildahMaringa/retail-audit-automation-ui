import { Database, FolderCog, RefreshCcw, Save, ShieldCheck, Trash2 } from 'lucide-react'
import { dataQueryProjects } from '../data'

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-kantar-blue">Configuration</p>
        <h1 className="mt-2 text-3xl font-black text-kantar-ink">Retail Audit automation settings</h1>
        <p className="mt-2 text-slate-500">Set defaults for new runs and review project configuration options.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-kantar-blue"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <h2 className="text-xl font-black text-kantar-ink">User Defaults</h2>
              <p className="text-sm text-slate-500">Used when starting a new run.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-600">Default Project</span>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100">
                {dataQueryProjects.map((project) => <option key={project}>{project}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2"><span className="text-sm font-bold text-slate-600">Default Month</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold"><option>May</option><option>June</option></select></label>
              <label className="space-y-2"><span className="text-sm font-bold text-slate-600">Default Year</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold"><option>2026</option><option>2025</option></select></label>
            </div>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-600">Default Batch</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold"><option>Batch 3</option><option>Batch 2</option><option>Batch 1</option></select></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-600">Output Naming Format</span><input value="{project}-{action}-{month}{year}.xlsx" readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-600" /></label>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><FolderCog className="h-6 w-6" /></div>
            <div>
              <h2 className="text-xl font-black text-kantar-ink">Script Configuration</h2>
              <p className="text-sm text-slate-500">Prepared for backend integration.</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Project Configuration Overview</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500">Data Projects</p><p className="text-2xl font-black text-kantar-ink">8</p></div>
                <div><p className="text-slate-500">POS & Cooler Projects</p><p className="text-2xl font-black text-kantar-ink">5</p></div>
                <div><p className="text-slate-500">Actions</p><p className="text-2xl font-black text-kantar-ink">3</p></div>
                <div><p className="text-slate-500">File Types</p><p className="text-2xl font-black text-kantar-ink">3</p></div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center gap-3"><Database className="h-5 w-5 text-kantar-blue" /><p className="font-black text-kantar-ink">Backend status</p></div>
              <p className="mt-2 text-sm text-slate-500">Frontend is currently using mock data. API connection will be added later.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-kantar-blue px-6 py-4 font-black text-white shadow-card hover:bg-blue-700"><Save className="h-5 w-5" />Save Configuration</button>
        <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-700 hover:border-kantar-blue hover:text-kantar-blue"><RefreshCcw className="h-5 w-5" />Reset Defaults</button>
        <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-6 py-4 font-black text-red-600 hover:bg-red-50"><Trash2 className="h-5 w-5" />Clear Cache and Session</button>
      </div>
    </div>
  )
}
