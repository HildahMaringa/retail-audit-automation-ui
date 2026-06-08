import { BarChart3, History, PlayCircle, Settings, LayoutDashboard, Bell, Search } from 'lucide-react'
import { Page } from '../types'

interface Props {
  activePage: Page
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new-run' as Page, label: 'New Run', icon: PlayCircle },
  { id: 'history' as Page, label: 'History', icon: History },
  { id: 'settings' as Page, label: 'Settings', icon: Settings },
]

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  'new-run': 'New Run',
  history: 'Run History',
  settings: 'Settings',
}

export function AppLayout({ activePage, onNavigate, children }: Props) {
  return (
    <div className="min-h-screen lg:flex">
      <aside className="kantar-gradient fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-white/10 p-6 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">KANTAR</p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/65">Retail Audit</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl p-5 glass-card">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Automation Suite</p>
          <h1 className="mt-3 text-2xl font-black leading-tight">Retail Audit Automation</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">Run queries, correct feedback, merge batches, and download clean output workbooks.</p>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  active ? 'bg-white text-kantar-navy shadow-soft' : 'text-white/72 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">Powered by</p>
          <p className="mt-1 text-lg font-bold">DataQual</p>
        </div>
      </aside>

      <div className="min-h-screen flex-1 lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/82 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kantar-blue text-white">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-kantar-navy">KANTAR</p>
                <p className="text-xs font-semibold text-slate-500">Retail Audit Automation</p>
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">KANTAR Retail Audit Automation</p>
              <h2 className="text-2xl font-black text-kantar-ink">{pageTitles[activePage]}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:border-kantar-blue hover:text-kantar-blue sm:block">
                <Search className="h-5 w-5" />
              </button>
              <button className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm hover:border-kantar-blue hover:text-kantar-blue">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-kantar-blue to-kantar-purple text-sm font-black text-white shadow-card">PO</div>
            </div>
          </div>
        </header>

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/94 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold transition ${
                  active ? 'bg-blue-50 text-kantar-blue' : 'text-slate-500'
                }`}
              >
                <Icon className="mb-1 h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
