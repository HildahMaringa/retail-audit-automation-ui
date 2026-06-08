import { useState } from 'react'
import { AppLayout } from './components/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { NewRunPage } from './pages/NewRunPage'
import { HistoryPage } from './pages/HistoryPage'
import { SettingsPage } from './pages/SettingsPage'
import { Page } from './types'

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard')

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' && <DashboardPage onNavigate={setActivePage} />}
      {activePage === 'new-run' && <NewRunPage />}
      {activePage === 'history' && <HistoryPage />}
      {activePage === 'settings' && <SettingsPage />}
    </AppLayout>
  )
}
