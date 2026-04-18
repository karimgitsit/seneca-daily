import { useRef } from 'react'

interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
}

const TAP_MAX_MS = 350
const TAP_MAX_PX = 10
const FIRE_LOCKOUT_MS = 500

export default function Sentence({ text, isHighlighted, onTap }: Props) {
  const start = useRef<{ t: number; x: number; y: number } | null>(null)
  const lastFire = useRef(0)

  const fireTap = () => {
    const now = Date.now()
    if (now - lastFire.current < FIRE_LOCKOUT_MS) return
    lastFire.current = now
    onTap()
  }

  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { t: Date.now(), x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current
    start.current = null
    if (!s) return
    const dt = Date.now() - s.t
    const dx = Math.abs(e.clientX - s.x)
    const dy = Math.abs(e.clientY - s.y)
    if (dt <= TAP_MAX_MS && dx <= TAP_MAX_PX && dy <= TAP_MAX_PX) {
      fireTap()
    }
    // Otherwise: long-press or drag → let iOS handle native selection.
  }

  const onPointerCancel = () => {
    start.current = null
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={fireTap}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      className={`transition-colors duration-200 cursor-pointer rounded-sm ${
        isHighlighted ? 'bg-[var(--color-highlight)]' : ''
      }`}
    >
      {text}
    </span>
  )
}
