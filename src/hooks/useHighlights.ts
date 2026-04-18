import { useState, useEffect, useCallback } from 'react'
import type { Highlight } from '../types'
import * as db from '../lib/db'

export function useHighlights(letterNumber?: number) {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const data = letterNumber != null
      ? await db.getHighlightsForLetter(letterNumber)
      : await db.getAllHighlights()
    setHighlights(data)
    setLoading(false)
  }, [letterNumber])

  useEffect(() => {
    load()
  }, [load])

  const addHighlight = useCallback(async (h: Highlight) => {
    setHighlights(prev => [...prev, h])
    await db.addHighlight(h)
  }, [])

  const removeHighlight = useCallback(async (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id))
    await db.deleteHighlight(id)
  }, [])

  const clearAll = useCallback(async () => {
    setHighlights([])
    await db.clearAllHighlights()
  }, [])

  return { highlights, loading, addHighlight, removeHighlight, clearAll, reload: load }
}
