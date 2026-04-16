interface Props {
  currentLetter: number
  totalLetters: number
  onPrev: () => void
  onNext: () => void
  isRead: boolean
  onToggleRead: () => void
}

export default function NavigationArrows({ currentLetter, totalLetters, onPrev, onNext, isRead, onToggleRead }: Props) {
  const isFirst = currentLetter === 1
  const isLast = currentLetter === totalLetters

  return (
    <div className="flex items-center justify-between py-8 mt-4 border-t border-[var(--color-border)]">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="p-2 text-[var(--color-muted)] disabled:opacity-25 transition-opacity"
        aria-label="Previous letter"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={onToggleRead}
        className="flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors"
        aria-label={isRead ? 'Mark as unread' : 'Mark as read'}
      >
        <span
          className={`inline-block w-3 h-3 rounded-full border border-[var(--color-muted)] transition-colors ${
            isRead ? 'bg-[var(--color-muted)]' : ''
          }`}
        />
        <span>{isRead ? 'Read' : 'Mark as read'}</span>
      </button>

      <button
        onClick={onNext}
        disabled={isLast}
        className="p-2 text-[var(--color-muted)] disabled:opacity-25 transition-opacity"
        aria-label="Next letter"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
