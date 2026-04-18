import { STORAGE_KEYS } from '../constants'
import type { Highlight } from '../types'

function readAll(): Highlight[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.highlights)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(highlights: Highlight[]): void {
  localStorage.setItem(STORAGE_KEYS.highlights, JSON.stringify(highlights))
}

export async function getAllHighlights(): Promise<Highlight[]> {
  return readAll()
}

export async function getHighlightsForLetter(letterNumber: number): Promise<Highlight[]> {
  return readAll().filter(h => h.letterNumber === letterNumber)
}

export async function addHighlight(h: Highlight): Promise<void> {
  const all = readAll()
  const existing = all.findIndex(x => x.id === h.id)
  if (existing >= 0) {
    all[existing] = h
  } else {
    all.push(h)
  }
  writeAll(all)
}

export async function deleteHighlight(id: string): Promise<void> {
  writeAll(readAll().filter(h => h.id !== id))
}

export async function clearAllHighlights(): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.highlights)
}
