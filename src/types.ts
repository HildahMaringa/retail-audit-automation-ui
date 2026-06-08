export type Page = 'dashboard' | 'new-run' | 'history' | 'settings'
export type QueryFamily = 'Data Queries' | 'POS and Cooler Queries'
export type ActionType = 'Run Queries' | 'Correct Feedback' | 'Merge Feedback'
export type RunStatus = 'Success' | 'Failed' | 'Running' | 'Pending'

export interface RunRecord {
  id: string
  title: string
  family: QueryFamily
  project: string
  action: ActionType
  batch: string
  status: RunStatus
  duration: string
  files: number
  date: string
}
