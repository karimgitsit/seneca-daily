interface Props {
  enabled: boolean
  onToggle: () => void
}

export default function HighlightModeToggle({ enabled, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={enabled ? 'Exit highlight mode' : 'Enter highlight mode'}
      style={{
        position: 'fixed',
        right: 16,
        bottom: `calc(60px + env(safe-area-inset-bottom))`,
        zIndex: 50,
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors ${
        enabled
          ? 'bg-[var(--color-text)] text-[var(--color-bg)]'
          : 'bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]'
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
      <span className="text-sm">{enabled ? 'Done' : 'Highlight'}</span>
    </button>
  )
}
