export interface SentenceSpan {
  text: string
  startOffset: number
  endOffset: number
}

// Abbreviations that shouldn't trigger sentence splits
const ABBREVS = /(?:i\.e|e\.g|etc|viz|cf|vs|Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vol|no|ch|pp|ed|trans|rev|approx)\./gi

export function splitIntoSentences(text: string): SentenceSpan[] {
  if (!text.trim()) return []

  // Replace abbreviations with placeholders to avoid false splits
  const placeholders: string[] = []
  let processed = text.replace(ABBREVS, (match) => {
    placeholders.push(match)
    return `\x00ABBR${placeholders.length - 1}\x00`
  })

  // Split on sentence-ending punctuation followed by space or end-of-string
  const parts = processed.split(/(?<=[.!?])\s+/)

  const sentences: SentenceSpan[] = []
  let offset = 0

  for (const part of parts) {
    // Restore abbreviations
    let restored = part.replace(/\x00ABBR(\d+)\x00/g, (_, i) => placeholders[parseInt(i)])

    // Find the actual position in the original text
    const startOffset = text.indexOf(restored, offset)
    if (startOffset === -1) {
      // Fallback: use running offset
      sentences.push({
        text: restored,
        startOffset: offset,
        endOffset: offset + restored.length,
      })
      offset += restored.length + 1
    } else {
      sentences.push({
        text: restored,
        startOffset,
        endOffset: startOffset + restored.length,
      })
      offset = startOffset + restored.length + 1
    }
  }

  return sentences
}
