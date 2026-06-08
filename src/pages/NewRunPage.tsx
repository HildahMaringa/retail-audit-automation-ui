import { useMemo, useState } from 'react'
import { Check, Database, Download, FileCheck2, FolderGit2, Loader2, Merge, Play, Refrigerator, RotateCcw } from 'lucide-react'
import { ActionType, QueryFamily } from '../types'
import { dataQueryProjects, posCoolerProjects } from '../data'
import { FileUploadCard } from '../components/FileUploadCard'

const steps = ['Query Family', 'Project', 'Action', 'Files & Settings', 'Review', 'Results']
const actions: ActionType[] = ['Run Queries', 'Correct Feedback', 'Merge Feedback']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function NewRunPage() {
  const [step, setStep] = useState(1)
  const [family, setFamily] = useState<QueryFamily>('Data Queries')
  const [project, setProject] = useState('NG-MRA')
  const [action, setAction] = useState<ActionType>('Run Queries')
  const [month, setMonth] = useState('May')
  const [year, setYear] = useState('2026')
  const [batch, setBatch] = useState('Batch 3')

  const projects = useMemo(() => (family === 'Data Queries' ? dataQueryProjects : posCoolerProjects), [family])

  function next() {
    setStep((current) => Math.min(6, current + 1))
  }

  function back() {
    setStep((current) => Math.max(1, current - 1))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-kantar-blue">New run configuration</p>
            <h1 className="mt-2 text-3xl font-black text-kantar-ink">Configure Retail Audit process</h1>
            <p className="mt-2 text-slate-500">Select workflow, upload Excel workbooks, review settings, then run the process.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">Step {step} of 6</div>
        </div>

        <div className="mt-6 grid grid-cols-6 gap-2">
          {steps.map((item, index) => {
            const active = index + 1 <= step
            return (
              <div key={item} className="space-y-2">
                <div className={`h-2 rounded-full ${active ? 'bg-kantar-blue' : 'bg-slate-200'}`} />
                <p className={`hidden text-xs font-bold lg:block ${active ? 'text-kantar-blue' : 'text-slate-400'}`}>{item}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-card lg:p-8">
        {step === 1 && (
          <section>
            <h2 className="text-2xl font-black text-kantar-ink">What do you want to run?</h2>
            <p className="mt-2 text-slate-500">Choose the query family first. The next steps will adapt based on your selection.</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {([
                { title: 'Data Queries' as QueryFamily, icon: Database, description: 'Run monthly checks for stock, purchases, prices, negative sales, profit checks, and project-specific rules.' },
                { title: 'POS and Cooler Queries' as QueryFamily, icon: Refrigerator, description: 'Run POS and cooler validation for outlet assets, branded coolers, signage, shop signs, chairs, and tables.' },
              ]).map((item) => {
                const Icon = item.icon
                const selected = family === item.title
                return (
                  <button key={item.title} onClick={() => { setFamily(item.title); setProject(item.title === 'Data Queries' ? dataQueryProjects[0] : posCoolerProjects[0]) }} className={`rounded-3xl border p-6 text-left transition hover:-translate-y-0.5 ${selected ? 'border-kantar-blue bg-blue-50/70 shadow-card ring-4 ring-blue-100' : 'border-slate-200 bg-white hover:border-kantar-blue'}`}>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${selected ? 'bg-kantar-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-black text-kantar-ink">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-500">{item.description}</p>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="text-2xl font-black text-kantar-ink">Select project</h2>
            <p className="mt-2 text-slate-500">Available projects are filtered based on the selected query family.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((item) => (
                <button key={item} onClick={() => setProject(item)} className={`rounded-3xl border p-5 text-left transition ${project === item ? 'border-kantar-blue bg-blue-50 text-kantar-blue ring-4 ring-blue-100' : 'border-slate-200 bg-white text-kantar-ink hover:border-kantar-blue'}`}>
                  <p className="text-lg font-black">{item}</p>
                  <p className="mt-2 text-sm text-slate-500">Project-specific configuration</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="text-2xl font-black text-kantar-ink">Choose action</h2>
            <p className="mt-2 text-slate-500">Select the type of process to run for {project}.</p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {actions.map((item) => {
                const selected = action === item
                const Icon = item === 'Run Queries' ? Play : item === 'Correct Feedback' ? FileCheck2 : Merge
                const desc = item === 'Run Queries' ? 'Generate query files from the selected data workbook.' : item === 'Correct Feedback' ? 'Apply field feedback corrections and create corrected outputs.' : 'Merge multiple batch feedback files into one final workbook.'
                return (
                  <button key={item} onClick={() => setAction(item)} className={`rounded-3xl border p-6 text-left transition ${selected ? 'border-kantar-blue bg-blue-50 ring-4 ring-blue-100' : 'border-slate-200 bg-white hover:border-kantar-blue'}`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${selected ? 'bg-kantar-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-xl font-black text-kantar-ink">{item}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-kantar-ink">Upload files and settings</h2>
              <p className="mt-2 text-slate-500">Provide the required Excel files and processing details.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-600">Month</span>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100">
                  {months.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-600">Year</span>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100">
                  {['2026', '2025', '2024'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-600">Batch Number</span>
                <input value={batch} onChange={(e) => setBatch(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100" />
              </label>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {action === 'Run Queries' && (
                <>
                  <FileUploadCard label="Upload Data Workbook" description="Main multi-month data file used to generate query outputs." />
                  <FileUploadCard label="Optional Previous Feedback File" description="Used for false-alarm suppression where applicable." />
                </>
              )}
              {action === 'Correct Feedback' && (
                <>
                  <FileUploadCard label="Upload Data Workbook" description="Original data workbook to receive tracked corrections in output." />
                  <FileUploadCard label="Upload Feedback Workbook" description="Field feedback workbook used to drive correction decisions." />
                </>
              )}
              {action === 'Merge Feedback' && (
                <>
                  <FileUploadCard label="Upload Query Files" description="Query files for selected batches." multiple />
                  <FileUploadCard label="Upload Feedback Files" description="Feedback files for selected batches." multiple />
                </>
              )}
            </div>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-600">Output File Name</span>
              <input value={`${project}-${action.replace(/\s+/g, '-')}-${month}${year}.xlsx`} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-600" />
            </label>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="text-2xl font-black text-kantar-ink">Review settings</h2>
            <p className="mt-2 text-slate-500">Please confirm the configuration before running. Original uploaded files will not be overwritten.</p>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[['Query Family', family], ['Project', project], ['Action', action], ['Month', month], ['Year', year], ['Batch', batch], ['Output File', `${project}-${month}${year}.xlsx`]].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                    <p className="mt-2 text-lg font-black text-kantar-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={next} className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-kantar-blue px-6 py-5 text-lg font-black text-white shadow-card hover:bg-blue-700">
              <Play className="h-6 w-6" />
              Run Process
            </button>
          </section>
        )}

        {step === 6 && (
          <section className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600 ring-8 ring-emerald-100">
              <Check className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-3xl font-black text-kantar-ink">Process completed successfully</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">{project} {action} has finished. The generated output workbook is ready for download through the browser.</p>
            <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Runtime</p><p className="mt-2 text-2xl font-black">2m 18s</p></div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Records Processed</p><p className="mt-2 text-2xl font-black">12,840</p></div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Files Generated</p><p className="mt-2 text-2xl font-black">2</p></div>
            </div>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-kantar-blue px-6 py-4 font-black text-white shadow-card hover:bg-blue-700">
                <Download className="h-5 w-5" />
                Download Output
              </button>
              <button onClick={() => setStep(1)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-kantar-ink hover:border-kantar-blue hover:text-kantar-blue">
                <RotateCcw className="h-5 w-5" />
                Start New Run
              </button>
            </div>
            <div className="mx-auto mt-7 max-w-3xl rounded-3xl bg-slate-950 p-5 text-left text-sm text-slate-200">
              <p className="font-mono"><Loader2 className="mr-2 inline h-4 w-4" /> Completed: output workbook generated and ready for download.</p>
            </div>
          </section>
        )}
      </div>

      {step < 5 && (
        <div className="flex items-center justify-between gap-3">
          <button onClick={back} disabled={step === 1} className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">Back</button>
          <button onClick={next} className="rounded-2xl bg-kantar-blue px-6 py-3 font-bold text-white shadow-card hover:bg-blue-700">Next Step</button>
        </div>
      )}
    </div>
  )
}
