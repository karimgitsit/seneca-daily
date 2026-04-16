import { useState, useCallback } from 'react'
import { getCurrentLetter, setCurrentLetter as persistCurrentLetter } from '../lib/storage'

export function useCurrentLetter() {
  const [currentLetter, setCurrentLetterState] = useState(getCurrentLetter)

  const setCurrentLetter = useCallback((n: number) => {
    setCurrentLetterState(n)
    persistCurrentLetter(n)
  }, [])

  return { currentLetter, setCurrentLetter }
}
