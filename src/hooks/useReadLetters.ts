import { useState, useEffect, useCallback } from 'react'
import { getReadLetters, setReadLetters } from '../lib/storage'

const listeners = new Set<(s: Set<number>) => void>()

function notify(next: Set<number>) {
  for (const l of listeners) l(next)
}

export function useReadLetters() {
  const [readLetters, setReadLettersState] = useState<Set<number>>(getReadLetters)

  useEffect(() => {
    const listener = (s: Set<number>) => setReadLettersState(new Set(s))
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const toggle = useCallback((n: number) => {
    setReadLettersState(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      setReadLetters(next)
      notify(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const empty = new Set<number>()
    setReadLettersState(empty)
    setReadLetters(empty)
    notify(empty)
  }, [])

  return { readLetters, toggle, reset }
}
