import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import {
  AlertCircle,
  Check,
  Database,
  Download,
  FileCheck2,
  Loader2,
  Merge,
  Play,
  Refrigerator,
  RotateCcw,
  UploadCloud,
  X,
} from 'lucide-react'
import { ActionType, QueryFamily } from '../types'
import { dataQueryProjects, posCoolerProjects } from '../data'

const steps = ['Query Family', 'Project', 'Action', 'Files & Settings', 'Review', 'Results']
const actions: ActionType[] = ['Run Queries', 'Correct Feedback', 'Merge Feedback']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const DEFAULT_API_BASE_URL = 'https://retail-audit-automation-ui.vercel.app'
const CHUNK_SIZE_BYTES = 512 * 1024

const API_BASE_URL = DEFAULT_API_BASE_URL.replace(/\/$/, '')

type RunResult = {
  run_id: string
  status: string
  message: string
  output_file?: string
  download_url?: string
  status_url?: string
  error?: string
}

type UploadStartResult = {
  upload_id: string
  filename: string
  total_chunks: number
  status: string
}

type UploadCompleteResult = {
  upload_id: string
  filename: string
  status: string
  file_size: number
}

type FilePickerProps = {
  label: string
  description: string
  file?: File | null
  files?: File[]
  multiple?: boolean
  onChange?: (file: File | null) => void
  onMultipleChange?: (files: File[]) => void
}

function buildApiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function FilePicker({
  label,
  description,
  file,
  files = [],
  multiple = false,
  onChange,
  onMultipleChange,
}: FilePickerProps) {
  const selectedFiles = multiple ? files : file ? [file] : []

  function clearFiles(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    if (multiple) {
      onMultipleChange?.([])
    } else {
      onChange?.(null)
    }
  }

  return (
    <label className="block cursor-pointer rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-kantar-blue hover:bg-blue-50/40">
      <input
        type="file"
        accept=".xlsx,.xlsm,.xls"
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          const selected = Array.from(event.target.files || [])

          if (multiple) {
            onMultipleChange?.(selected)
          } else {
            onChange?.(selected[0] || null)
          }
        }}
      />

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-kantar-blue ring-1 ring-slate-200">
          <UploadCloud className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-black text-kantar-ink">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Accepts .xlsx, .xlsm, .xls
          </p>

          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedFiles.map((selectedFile) => (
                <div
                  key={selectedFile.name}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200"
                >
                  <span className="truncate text-sm font-bold text-slate-700">{selectedFile.name}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={clearFiles}
                className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Remove selected file{selectedFiles.length > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </label>
  )
}

export function NewRunPage() {
  const [step, setStep] = useState(1)
  const [family, setFamily] = useState<QueryFamily>('Data Queries')
  const [project, setProject] = useState('NG-MRA')
  const [action, setAction] = useState<ActionType>('Run Queries')
  const [month, setMonth] = useState('May')
  const [year, setYear] = useState('2026')
  const [batch, setBatch] = useState('Batch 3')

  const [dataFile, setDataFile] = useState<File | null>(null)
  const [previousFeedbackFile, setPreviousFeedbackFile] = useState<File | null>(null)
  const [feedbackFile, setFeedbackFile] = useState<File | null>(null)
  const [queryFiles, setQueryFiles] = useState<File[]>([])
  const [feedbackFiles, setFeedbackFiles] = useState<File[]>([])

  const [isRunning, setIsRunning] = useState(false)
  const [runError, setRunError] = useState('')
  const [uploadProgress, setUploadProgress] = useState('')
  const [runResult, setRunResult] = useState<RunResult | null>(null)

  const projects = useMemo(() => (family === 'Data Queries' ? dataQueryProjects : posCoolerProjects), [family])

  const outputFileName = `${project}-${action.replace(/\s+/g, '-')}-${month}${year}.xlsx`

  function next() {
    setStep((current) => Math.min(6, current + 1))
  }

  function back() {
    setStep((current) => Math.max(1, current - 1))
  }

  async function readResponseJson(response: Response) {
    const text = await response.text()

    if (!text) {
      return {}
    }

    try {
      return JSON.parse(text)
    } catch {
      return {
        message: text,
      }
    }
  }

  async function uploadFileInChunks(file: File, label: string) {
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE_BYTES))

    setUploadProgress(`Starting upload for ${label}: ${file.name}`)

    const startFormData = new FormData()
    startFormData.append('filename', file.name)
    startFormData.append('total_chunks', String(totalChunks))

    const startResponse = await fetch(buildApiUrl('/api/uploads/start'), {
      method: 'POST',
      body: startFormData,
    })

    const startResult = (await readResponseJson(startResponse)) as UploadStartResult

    if (!startResponse.ok || !startResult.upload_id) {
      throw new Error(
        startResult.status || `Could not start upload for ${file.name}. HTTP ${startResponse.status}`,
      )
    }

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
      const chunkStart = chunkIndex * CHUNK_SIZE_BYTES
      const chunkEnd = Math.min(file.size, chunkStart + CHUNK_SIZE_BYTES)
      const chunkBlob = file.slice(chunkStart, chunkEnd)

      setUploadProgress(
        `Uploading ${label}: ${file.name} (${chunkIndex + 1}/${totalChunks})`,
      )

      const chunkFormData = new FormData()
      chunkFormData.append('chunk_index', String(chunkIndex))
      chunkFormData.append('chunk', chunkBlob, file.name)

      let chunkUploaded = false
      let lastChunkError = ''

      for (let attempt = 1; attempt <= 4; attempt += 1) {
        try {
          if (attempt > 1) {
            setUploadProgress(
              `Retrying ${label}: ${file.name} chunk ${chunkIndex + 1}/${totalChunks} - attempt ${attempt}/4`,
            )

            await new Promise((resolve) => setTimeout(resolve, attempt * 2500))
          }

          const chunkResponse = await fetch(buildApiUrl(`/api/uploads/${startResult.upload_id}/chunk`), {
            method: 'POST',
            body: chunkFormData,
          })

          const chunkResult = await readResponseJson(chunkResponse)

          if (!chunkResponse.ok) {
            lastChunkError =
              chunkResult.message ||
              chunkResult.detail ||
              `Could not upload chunk ${chunkIndex + 1} for ${file.name}. HTTP ${chunkResponse.status}`

            continue
          }

          chunkUploaded = true
          break
        } catch (error) {
          lastChunkError =
            error instanceof Error
              ? error.message
              : `Could not upload chunk ${chunkIndex + 1} for ${file.name}.`
        }
      }

      if (!chunkUploaded) {
        throw new Error(lastChunkError || `Could not upload chunk ${chunkIndex + 1} for ${file.name}.`)
      }
    }

    setUploadProgress(`Finalizing upload for ${label}: ${file.name}`)

    const completeResponse = await fetch(buildApiUrl(`/api/uploads/${startResult.upload_id}/complete`), {
      method: 'POST',
    })

    const completeResult = (await readResponseJson(completeResponse)) as UploadCompleteResult

    if (!completeResponse.ok || completeResult.status !== 'complete') {
      throw new Error(
        completeResult.status || `Could not complete upload for ${file.name}. HTTP ${completeResponse.status}`,
      )
    }

    return completeResult.upload_id
  }

  async function uploadFilesInChunks(files: File[], label: string) {
    const uploadIds: string[] = []

    for (let index = 0; index < files.length; index += 1) {
      const uploadId = await uploadFileInChunks(files[index], `${label} ${index + 1}`)
      uploadIds.push(uploadId)
    }

    return uploadIds
  }

  async function handleRunProcess() {
    setRunError('')
    setUploadProgress('')
    setRunResult(null)

    if (action === 'Merge Feedback') {
      if (queryFiles.length === 0) {
        setRunError('Please upload at least one query file before running merge feedback.')
        return
      }

      if (feedbackFiles.length === 0) {
        setRunError('Please upload at least one feedback file before running merge feedback.')
        return
      }
    } else {
      if (!dataFile) {
        setRunError('Please upload the data workbook before running.')
        return
      }

      if (action === 'Correct Feedback' && !feedbackFile) {
        setRunError('Please upload the feedback workbook before running correction.')
        return
      }
    }

    try {
      setIsRunning(true)

      let uploadedDataFileId = ''
      let uploadedFeedbackFileId = ''
      let uploadedQueryFileIds: string[] = []
      let uploadedFeedbackFileIds: string[] = []

      if (action === 'Merge Feedback') {
        uploadedQueryFileIds = await uploadFilesInChunks(queryFiles, 'query file')
        uploadedFeedbackFileIds = await uploadFilesInChunks(feedbackFiles, 'feedback file')
      } else {
        if (dataFile) {
          uploadedDataFileId = await uploadFileInChunks(dataFile, 'data workbook')
        }

        const optionalFeedbackFile = action === 'Correct Feedback' ? feedbackFile : previousFeedbackFile

        if (optionalFeedbackFile) {
          uploadedFeedbackFileId = await uploadFileInChunks(optionalFeedbackFile, 'feedback workbook')
        }
      }

      setUploadProgress('Starting backend processing...')

      const formData = new FormData()
      formData.append('query_family', family)
      formData.append('project', project)
      formData.append('action', action)
      formData.append('month', month)
      formData.append('year', year)
      formData.append('batch', batch.replace(/batch/i, '').trim() || batch)

      if (action === 'Merge Feedback') {
        formData.append('query_file_ids', JSON.stringify(uploadedQueryFileIds))
        formData.append('feedback_file_ids', JSON.stringify(uploadedFeedbackFileIds))
      } else {
        formData.append('data_file_id', uploadedDataFileId)

        if (uploadedFeedbackFileId) {
          formData.append('feedback_file_id', uploadedFeedbackFileId)
        }
      }

      const response = await fetch(buildApiUrl('/api/runs'), {
        method: 'POST',
        body: formData,
      })

      const initialResult = (await readResponseJson(response)) as RunResult

      if (!response.ok || initialResult.status === 'error' || initialResult.status === 'failed') {
        throw new Error(initialResult.message || initialResult.error || `The backend failed to start this run. HTTP ${response.status}`)
      }

      if (!initialResult.run_id) {
        throw new Error('The backend did not return a run ID.')
      }

      const statusUrl = initialResult.status_url || `/api/runs/${initialResult.run_id}/status`
      const maxAttempts = 720 // 60 minutes total because 720 * 5 seconds = 60 minutes

      let completedResult: RunResult | null = null

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 5000))

        const statusResponse = await fetch(buildApiUrl(statusUrl))
        const statusResult = (await readResponseJson(statusResponse)) as RunResult

        if (!statusResponse.ok) {
          throw new Error(statusResult.message || `Could not check run status. HTTP ${statusResponse.status}`)
        }

        if (statusResult.status === 'success') {
          completedResult = statusResult
          break
        }

        if (statusResult.status === 'failed' || statusResult.status === 'error') {
          throw new Error(statusResult.error || statusResult.message || 'The backend failed to process this run.')
        }
      }

      if (!completedResult) {
        throw new Error('The run is taking too long. Please check the backend logs or try again later.')
      }

      setRunResult(completedResult)
      setStep(6)
    } catch (error) {
      const message =
        error instanceof TypeError
          ? `Failed to connect to the backend. The app tried to use: ${API_BASE_URL}. Please confirm the backend is reachable.`
          : error instanceof Error
            ? error.message
            : 'Something went wrong while running the process.'

      setRunError(message)
    } finally {
      setIsRunning(false)
      setUploadProgress('')
    }
  }

  function handleDownload() {
    if (!runResult?.download_url) return
    window.location.href = buildApiUrl(runResult.download_url)
  }

  function startNewRun() {
    setStep(1)
    setRunError('')
    setUploadProgress('')
    setRunResult(null)
    setDataFile(null)
    setPreviousFeedbackFile(null)
    setFeedbackFile(null)
    setQueryFiles([])
    setFeedbackFiles([])
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
              {[
                {
                  title: 'Data Queries' as QueryFamily,
                  icon: Database,
                  description: 'Run monthly checks for stock, purchases, prices, negative sales, profit checks, and project-specific rules.',
                },
                {
                  title: 'POS and Cooler Queries' as QueryFamily,
                  icon: Refrigerator,
                  description: 'Run POS and cooler validation for outlet assets, branded coolers, signage, shop signs, chairs, and tables.',
                },
              ].map((item) => {
                const Icon = item.icon
                const selected = family === item.title
                return (
                  <button
                    key={item.title}
                    onClick={() => {
                      setFamily(item.title)
                      setProject(item.title === 'Data Queries' ? dataQueryProjects[0] : posCoolerProjects[0])
                    }}
                    className={`rounded-3xl border p-6 text-left transition hover:-translate-y-0.5 ${
                      selected ? 'border-kantar-blue bg-blue-50/70 shadow-card ring-4 ring-blue-100' : 'border-slate-200 bg-white hover:border-kantar-blue'
                    }`}
                  >
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
                <button
                  key={item}
                  onClick={() => setProject(item)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    project === item ? 'border-kantar-blue bg-blue-50 text-kantar-blue ring-4 ring-blue-100' : 'border-slate-200 bg-white text-kantar-ink hover:border-kantar-blue'
                  }`}
                >
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
                const desc =
                  item === 'Run Queries'
                    ? 'Generate query files from the selected data workbook.'
                    : item === 'Correct Feedback'
                      ? 'Apply field feedback corrections and create corrected outputs.'
                      : 'Merge multiple batch feedback files into one final workbook.'
                return (
                  <button
                    key={item}
                    onClick={() => setAction(item)}
                    className={`rounded-3xl border p-6 text-left transition ${
                      selected ? 'border-kantar-blue bg-blue-50 ring-4 ring-blue-100' : 'border-slate-200 bg-white hover:border-kantar-blue'
                    }`}
                  >
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
                <select
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100"
                >
                  {months.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-600">Year</span>
                <select
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100"
                >
                  {['2026', '2025', '2024'].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-600">Batch Number</span>
                <input
                  value={batch}
                  onChange={(event) => setBatch(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-kantar-blue focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {action === 'Run Queries' && (
                <>
                  <FilePicker
                    label="Upload Data Workbook"
                    description="Main multi-month data file used to generate query outputs."
                    file={dataFile}
                    onChange={setDataFile}
                  />
                  <FilePicker
                    label="Optional Previous Feedback File"
                    description="Used for false-alarm suppression where applicable."
                    file={previousFeedbackFile}
                    onChange={setPreviousFeedbackFile}
                  />
                </>
              )}

              {action === 'Correct Feedback' && (
                <>
                  <FilePicker
                    label="Upload Data Workbook"
                    description="Original data workbook to receive tracked corrections in output."
                    file={dataFile}
                    onChange={setDataFile}
                  />
                  <FilePicker
                    label="Upload Feedback Workbook"
                    description="Field feedback workbook used to drive correction decisions."
                    file={feedbackFile}
                    onChange={setFeedbackFile}
                  />
                </>
              )}

              {action === 'Merge Feedback' && (
                <>
                  <FilePicker
                    label="Upload Query Files"
                    description="Upload all query files for the selected batches. Example: Batch 1, Batch 2, Batch 3."
                    multiple
                    files={queryFiles}
                    onMultipleChange={setQueryFiles}
                  />
                  <FilePicker
                    label="Upload Feedback Files"
                    description="Upload all feedback files for the selected batches. Example: Batch 1, Batch 2, Batch 3."
                    multiple
                    files={feedbackFiles}
                    onMultipleChange={setFeedbackFiles}
                  />
                </>
              )}
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-slate-600">Output File Name</span>
              <input value={outputFileName} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-600" />
            </label>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="text-2xl font-black text-kantar-ink">Review settings</h2>
            <p className="mt-2 text-slate-500">Please confirm the configuration before running. Original uploaded files will not be overwritten.</p>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['Query Family', family],
                  ['Project', project],
                  ['Action', action],
                  ['Month', month],
                  ['Year', year],
                  ['Batch', batch],
                  ['Output File', outputFileName],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
                    <p className="mt-2 text-lg font-black text-kantar-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {runError && (
              <div className="mt-5 flex gap-3 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-semibold">{runError}</p>
              </div>
            )}

            <button
              onClick={handleRunProcess}
              disabled={isRunning}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-3xl bg-kantar-blue px-6 py-5 text-lg font-black text-white shadow-card hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRunning ? <Loader2 className="h-6 w-6 animate-spin" /> : <Play className="h-6 w-6" />}
              {isRunning ? uploadProgress || 'Processing... This may take several minutes. Please keep this page open.' : 'Run Process'}
            </button>
          </section>
        )}

        {step === 6 && (
          <section className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600 ring-8 ring-emerald-100">
              <Check className="h-10 w-10" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-kantar-ink">Process completed successfully</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              {runResult?.message || `${project} ${action} has finished. The generated output workbook is ready for download through the browser.`}
            </p>

            <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Run ID</p>
                <p className="mt-2 truncate text-sm font-black">{runResult?.run_id || 'Local test'}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-2 text-2xl font-black capitalize">{runResult?.status || 'Success'}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">File Generated</p>
                <p className="mt-2 truncate text-sm font-black">{runResult?.output_file || outputFileName}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={handleDownload}
                disabled={!runResult?.download_url}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-kantar-blue px-6 py-4 font-black text-white shadow-card hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-5 w-5" />
                Download Output
              </button>

              <button
                onClick={startNewRun}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-kantar-ink hover:border-kantar-blue hover:text-kantar-blue"
              >
                <RotateCcw className="h-5 w-5" />
                Start New Run
              </button>
            </div>

            <div className="mx-auto mt-7 max-w-3xl rounded-3xl bg-slate-950 p-5 text-left text-sm text-slate-200">
              <p className="font-mono">
                <Loader2 className="mr-2 inline h-4 w-4" />
                Completed: backend generated output workbook and download link is ready.
              </p>
            </div>
          </section>
        )}
      </div>

      {step < 5 && (
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={back}
            disabled={step === 1}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>
          <button onClick={next} className="rounded-2xl bg-kantar-blue px-6 py-3 font-bold text-white shadow-card hover:bg-blue-700">
            Next Step
          </button>
        </div>
      )}
    </div>
  )
}