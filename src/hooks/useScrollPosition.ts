import { useEffect, useRef, useCallback } from 'react'
import { getScrollPosition, setScrollPosition } from '../lib/storage'

export function useScrollPosition(letterNumber: number, contentRef: React.RefObject<HTMLElement | null>) {
  const savedLetterRef = useRef(letterNumber)
  const restoredRef = useRef(false)

  // Save scroll position for the previous letter when navigating away
  const saveCurrentScroll = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    const pct = maxScroll > 0 ? el.scrollTop / maxScroll : 0
    setScrollPosition(savedLetterRef.current, pct)
  }, [contentRef])

  // Restore scroll position when letter changes
  useEffect(() => {
    if (savedLetterRef.current !== letterNumber) {
      // Save old position before switching
      saveCurrentScroll()
      savedLetterRef.current = letterNumber
      restoredRef.current = false
    }

    const el = contentRef.current
    if (!el || restoredRef.current) return

    // Restore after a frame so DOM has rendered
    requestAnimationFrame(() => {
      const pct = getScrollPosition(letterNumber)
      const maxScroll = el.scrollHeight - el.clientHeight
      if (maxScroll > 0) {
        el.scrollTop = pct * maxScroll
      }
      restoredRef.current = true
    })
  }, [letterNumber, contentRef, saveCurrentScroll])

  // Debounced scroll save
  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    let timer: number
    const handleScroll = () => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        const maxScroll = el.scrollHeight - el.clientHeight
        const pct = maxScroll > 0 ? el.scrollTop / maxScroll : 0
        setScrollPosition(letterNumber, pct)
      }, 300)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      el.removeEventListener('scroll', handleScroll)
    }
  }, [letterNumber, contentRef])

  return { saveCurrentScroll }
}
