import { FileSpreadsheet, UploadCloud, X } from 'lucide-react'

interface Props {
  label: string
  description?: string
  multiple?: boolean
}

export function FileUploadCard({ label, description, multiple = false }: Props) {
  const exampleFiles = multiple ? ['Batch_1_Feedback.xlsx', 'Batch_2_Feedback.xlsx'] : ['May2026_Data_Workbook.xlsx']
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-4">
        <p className="font-bold text-kantar-ink">{label}</p>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      <div className="flex min-h-44 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-kantar-blue">
          <UploadCloud className="h-7 w-7" />
        </div>
        <p className="mt-4 font-bold text-kantar-ink">Drop Excel files here or browse</p>
        <p className="mt-1 text-sm text-slate-500">Accepted formats: .xlsx, .xlsm, .xls</p>
      </div>
      <div className="mt-4 space-y-2">
        {exampleFiles.map((file) => (
          <div key={file} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-kantar-blue" />
              <span className="text-sm font-semibold text-slate-700">{file}</span>
            </div>
            <button className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
