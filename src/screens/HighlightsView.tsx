import { useState, useCallback } from 'react'
import { useHighlights } from '../hooks/useHighlights'
import { toRoman } from '../lib/roman'
import { highlightsToMarkdown, downloadMarkdown } from '../lib/markdown'
import type { Highlight } from '../types'

export default function HighlightsView() {
  const { highlights, removeHighlight } = useHighlights()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  // Group by letter, sorted by most recent highlight
  const groups = groupByLetter(highlights)

  const copyToClipboard = useCallback(async (text: string, id?: string) => {
    await navigator.clipboard.writeText(text)
    if (id) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } else {
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 1500)
    }
  }, [])

  const handleCopyAll = useCallback(() => {
    const md = highlightsToMarkdown(highlights)
    copyToClipboard(md)
  }, [highlights, copyToClipboard])

  const handleExport = useCallback(() => {
    const md = highlightsToMarkdown(highlights)
    downloadMarkdown(md, 'seneca-highlights.md')
  }, [highlights])

  if (highlights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center text-[var(--color-muted)]">
        <p className="text-lg mb-2">No highlights yet</p>
        <p className="text-sm">Tap a sentence while reading to save it here.</p>
      </div>
    )
  }

  return (
    <div className="max-w-prose mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl">Highlights</h1>
        <div className="flex gap-2">
          <button
            onClick={handleCopyAll}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors active:bg-[var(--color-border)]/30"
          >
            {copiedAll ? 'Copied!' : 'Copy all'}
          </button>
          <button
            onClick={handleExport}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors active:bg-[var(--color-border)]/30"
          >
            Export .md
          </button>
        </div>
      </div>

      {groups.map(([letterNumber, letterTitle, group]) => (
        <div key={letterNumber} className="mb-8">
          <h2 className="text-sm tracking-wider text-[var(--color-muted)] mb-3">
            Letter {toRoman(letterNumber as number)} — {letterTitle}
          </h2>
          <div className="space-y-3">
            {(group as Highlight[]).map(h => (
              <div key={h.id} className="border-l-2 border-[var(--color-border)] pl-4 py-1">
                <p className="text-[0.95em] leading-relaxed mb-1">"{h.text}"</p>
                <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                  <span>{new Date(h.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button
                    onClick={() => copyToClipboard(h.text, h.id)}
                    className="hover:text-[var(--color-text)] transition-colors"
                  >
                    {copiedId === h.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => removeHighlight(h.id)}
                    className="hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function groupByLetter(highlights: Highlight[]): [number, string, Highlight[]][] {
  const map = new Map<number, { title: string; items: Highlight[] }>()
  for (const h of highlights) {
    const existing = map.get(h.letterNumber)
    if (existing) {
      existing.items.push(h)
    } else {
      map.set(h.letterNumber, { title: h.letterTitle, items: [h] })
    }
  }

  return [...map.entries()]
    .sort(([, a], [, b]) => {
      const latestA = Math.max(...a.items.map(h => h.timestamp))
      const latestB = Math.max(...b.items.map(h => h.timestamp))
      return latestB - latestA
    })
    .map(([num, { title, items }]) => {
      items.sort((a, b) => a.timestamp - b.timestamp)
      return [num, title, items]
    })
}
