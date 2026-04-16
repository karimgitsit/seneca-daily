import type { Highlight } from '../types'
import { toRoman } from './roman'

export function highlightsToMarkdown(highlights: Highlight[]): string {
  // Group by letter number
  const groups = new Map<number, Highlight[]>()
  for (const h of highlights) {
    const group = groups.get(h.letterNumber) || []
    group.push(h)
    groups.set(h.letterNumber, group)
  }

  // Sort groups by most recent highlight timestamp (descending)
  const sortedGroups = [...groups.entries()].sort((a, b) => {
    const latestA = Math.max(...a[1].map(h => h.timestamp))
    const latestB = Math.max(...b[1].map(h => h.timestamp))
    return latestB - latestA
  })

  const sections: string[] = []
  for (const [letterNumber, group] of sortedGroups) {
    const title = group[0].letterTitle
    // Sort highlights within letter chronologically
    group.sort((a, b) => a.timestamp - b.timestamp)

    const latestDate = new Date(Math.max(...group.map(h => h.timestamp)))
    const dateStr = latestDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    let section = `## Letter ${toRoman(letterNumber)} — ${title}\n`
    section += `*Highlighted ${dateStr}*\n`
    for (const h of group) {
      section += `\n> ${h.text}\n`
    }
    sections.push(section)
  }

  return sections.join('\n')
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
