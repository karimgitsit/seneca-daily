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
    await db.addHighlight(h)
    setHighlights(prev => [...prev, h])
  }, [])

  const removeHighlight = useCallback(async (id: string) => {
    await db.deleteHighlight(id)
    setHighlights(prev => prev.filter(h => h.id !== id))
  }, [])

  const clearAll = useCallback(async () => {
    await db.clearAllHighlights()
    setHighlights([])
  }, [])

  return { highlights, loading, addHighlight, removeHighlight, clearAll, reload: load }
}
