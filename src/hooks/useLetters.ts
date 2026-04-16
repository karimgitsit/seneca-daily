import { useState, useEffect, useRef } from 'react'
import type { Letter } from '../types'

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    fetch(import.meta.env.BASE_URL + 'data/letters.json')
      .then(r => r.json())
      .then((data: Letter[]) => {
        setLetters(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { letters, loading }
}
