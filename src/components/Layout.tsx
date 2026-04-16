import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import { useSettings } from '../hooks/useSettings'

export default function Layout() {
  // Initialize theme and font size on mount
  useSettings()

  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text)]">
      <main className="flex-1 overflow-y-auto" id="main-scroll">
        <Outlet />
      </main>
      <NavBar />
    </div>
  )
}
