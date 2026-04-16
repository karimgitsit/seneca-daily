import { useState, useCallback } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useHighlights } from '../hooks/useHighlights'
import { clearProgress } from '../lib/storage'
import ConfirmDialog from '../components/ConfirmDialog'
import type { FontSize, Theme } from '../types'

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const { clearAll } = useHighlights()
  const [dialog, setDialog] = useState<'progress' | 'highlights' | null>(null)

  const handleResetProgress = useCallback(() => {
    clearProgress()
    setDialog(null)
    window.location.reload()
  }, [])

  const handleClearHighlights = useCallback(() => {
    clearAll()
    setDialog(null)
  }, [clearAll])

  return (
    <div className="max-w-prose mx-auto px-6 py-8">
      <h1 className="text-xl mb-8">Settings</h1>

      <section className="mb-8">
        <h2 className="text-sm text-[var(--color-muted)] tracking-wider uppercase mb-3">Font Size</h2>
        <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden">
          {(['S', 'M', 'L'] as FontSize[]).map(size => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              className={`px-5 py-2 text-sm transition-colors ${
                settings.fontSize === size
                  ? 'bg-[var(--color-text)] text-[var(--color-bg)]'
                  : 'text-[var(--color-muted)] active:bg-[var(--color-border)]/30'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm text-[var(--color-muted)] tracking-wider uppercase mb-3">Theme</h2>
        <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden">
          {(['light', 'dark'] as Theme[]).map(theme => (
            <button
              key={theme}
              onClick={() => updateSettings({ theme })}
              className={`px-5 py-2 text-sm capitalize transition-colors ${
                settings.theme === theme
                  ? 'bg-[var(--color-text)] text-[var(--color-bg)]'
                  : 'text-[var(--color-muted)] active:bg-[var(--color-border)]/30'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3 pt-4 border-t border-[var(--color-border)]">
        <button
          onClick={() => setDialog('progress')}
          className="block w-full text-left px-4 py-3 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] active:bg-[var(--color-border)]/30 transition-colors"
        >
          Reset reading progress
        </button>
        <button
          onClick={() => setDialog('highlights')}
          className="block w-full text-left px-4 py-3 text-sm rounded-lg border border-red-300 text-red-500 active:bg-red-50 transition-colors"
        >
          Clear all highlights
        </button>
      </section>

      <ConfirmDialog
        open={dialog === 'progress'}
        title="Reset Progress"
        message="This will reset your reading progress and current position. Your highlights will be kept."
        onConfirm={handleResetProgress}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === 'highlights'}
        title="Clear Highlights"
        message="This will permanently delete all your saved highlights. This cannot be undone."
        onConfirm={handleClearHighlights}
        onCancel={() => setDialog(null)}
      />
    </div>
  )
}
