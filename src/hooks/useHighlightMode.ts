import { useCallback, useState } from 'react'

const KEY = 'seneca:highlightMode'

function getStoredMode(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function useHighlightMode() {
  const [highlightMode, setMode] = useState<boolean>(getStoredMode)

  const toggleHighlightMode = useCallback(() => {
    setMode(prev => {
      const next = !prev
      try {
        localStorage.setItem(KEY, next ? '1' : '0')
      } catch {
        // ignore storage failures
      }
      return next
    })
  }, [])

  return { highlightMode, toggleHighlightMode }
}
