import { useEffect, useRef } from 'react'

interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
}

const TAP_MAX_MS = 350
const TAP_MAX_PX = 10
const FIRE_LOCKOUT_MS = 500

export default function Sentence({ text, isHighlighted, onTap }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const onTapRef = useRef(onTap)
  onTapRef.current = onTap

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    let start: { t: number; x: number; y: number } | null = null
    let lastFire = 0

    const fireTap = () => {
      const now = Date.now()
      if (now - lastFire < FIRE_LOCKOUT_MS) return
      lastFire = now
      onTapRef.current()
    }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      start = { t: Date.now(), x: t.clientX, y: t.clientY }
    }

    const onTouchEnd = (e: TouchEvent) => {
      const s = start
      start = null
      if (!s) return
      const t = e.changedTouches[0]
      if (!t) return
      const dt = Date.now() - s.t
      const dx = Math.abs(t.clientX - s.x)
      const dy = Math.abs(t.clientY - s.y)
      if (dt <= TAP_MAX_MS && dx <= TAP_MAX_PX && dy <= TAP_MAX_PX) {
        e.preventDefault()
        fireTap()
      }
    }

    const onClick = () => {
      fireTap()
    }

    // Native listeners bypass React's synthetic event delegation. iOS
    // Safari doesn't reliably dispatch synthetic click/touch events
    // through the document root for tapped spans inside a <p>, so we
    // attach directly to the element.
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: false })
    el.addEventListener('click', onClick)

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <span
      ref={spanRef}
      role="button"
      tabIndex={0}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      className={`transition-colors duration-200 cursor-pointer rounded-sm ${
        isHighlighted ? 'bg-[var(--color-highlight)]' : ''
      }`}
    >
      {text}
    </span>
  )
}
