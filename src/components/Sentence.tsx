import { useRef } from 'react'

interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
}

const TAP_MAX_MS = 300
const TAP_MAX_PX = 10

export default function Sentence({ text, isHighlighted, onTap }: Props) {
  const start = useRef<{ t: number; x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    start.current = { t: Date.now(), x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const s = start.current
    start.current = null
    if (!s) return
    const t = e.changedTouches[0]
    const dt = Date.now() - s.t
    const dx = Math.abs(t.clientX - s.x)
    const dy = Math.abs(t.clientY - s.y)
    if (dt <= TAP_MAX_MS && dx <= TAP_MAX_PX && dy <= TAP_MAX_PX) {
      // Treat as a tap: fire the handler and suppress the synthesized click
      // so iOS doesn't also initiate a selection/second action.
      e.preventDefault()
      onTap()
    }
    // Otherwise: long-press or drag → let iOS handle native selection.
  }

  const onClick = (e: React.MouseEvent) => {
    // Desktop / non-touch fallback. On touch devices the touchend path
    // preventDefaults, so this won't double-fire.
    if (e.detail === 0) return
    onTap()
  }

  return (
    <span
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
      className={`transition-colors duration-200 cursor-pointer rounded-sm ${
        isHighlighted ? 'bg-[var(--color-highlight)]' : ''
      }`}
    >
      {text}
    </span>
  )
}
