import { useCallback, useRef } from 'react'
import { useLetters } from '../hooks/useLetters'
import { useCurrentLetter } from '../hooks/useCurrentLetter'
import { useHighlights } from '../hooks/useHighlights'
import { useScrollPosition } from '../hooks/useScrollPosition'
import { getReadLetters, setReadLetters } from '../lib/storage'
import LetterHeader from '../components/LetterHeader'
import LetterBody from '../components/LetterBody'
import NavigationArrows from '../components/NavigationArrows'
import type { Highlight } from '../types'

export default function ReadingView() {
  const { letters, loading } = useLetters()
  const { currentLetter, setCurrentLetter } = useCurrentLetter()
  const { highlights, addHighlight, removeHighlight } = useHighlights(currentLetter)
  const scrollRef = useRef<HTMLElement | null>(null)

  // Get the main scroll container from the Layout
  const setScrollRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      scrollRef.current = node.closest('#main-scroll') as HTMLElement
    }
  }, [])

  const { saveCurrentScroll } = useScrollPosition(currentLetter, scrollRef)

  const letter = letters.find(l => l.number === currentLetter)
  const readLetters = getReadLetters()
  const isRead = readLetters.has(currentLetter)

  const navigate = useCallback((n: number) => {
    saveCurrentScroll()
    setCurrentLetter(n)
    // Scroll to top for new letter
    const el = scrollRef.current
    if (el) el.scrollTop = 0
  }, [setCurrentLetter, saveCurrentScroll])

  const toggleRead = useCallback(() => {
    const read = getReadLetters()
    if (read.has(currentLetter)) {
      read.delete(currentLetter)
    } else {
      read.add(currentLetter)
    }
    setReadLetters(read)
    // Force re-render by touching state — since readLetters is external,
    // we use a small trick: set the same letter to trigger re-render
    setCurrentLetter(currentLetter)
  }, [currentLetter, setCurrentLetter])

  const handleToggleHighlight = useCallback(async (
    sentenceText: string,
    paragraphIndex: number,
    startOffset: number,
    endOffset: number,
  ) => {
    // Check if this sentence is already highlighted
    const existing = highlights.find(h =>
      h.paragraphIndex === paragraphIndex &&
      h.startOffset === startOffset &&
      h.endOffset === endOffset
    )

    if (existing) {
      await removeHighlight(existing.id)
    } else {
      const h: Highlight = {
        id: crypto.randomUUID(),
        letterNumber: currentLetter,
        letterTitle: letter?.title ?? '',
        text: sentenceText,
        paragraphIndex,
        startOffset,
        endOffset,
        timestamp: Date.now(),
      }
      await addHighlight(h)
    }
  }, [highlights, currentLetter, letter, addHighlight, removeHighlight])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!letter) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
        <p>Letter not found.</p>
      </div>
    )
  }

  return (
    <div ref={setScrollRef} className="max-w-prose mx-auto px-6 py-10">
      <LetterHeader letterNumber={letter.number} title={letter.title} />
      <LetterBody
        paragraphs={letter.paragraphs}
        letterNumber={letter.number}
        highlights={highlights}
        onToggleHighlight={handleToggleHighlight}
      />
      <NavigationArrows
        currentLetter={currentLetter}
        totalLetters={letters.length}
        onPrev={() => navigate(currentLetter - 1)}
        onNext={() => navigate(currentLetter + 1)}
        isRead={isRead}
        onToggleRead={toggleRead}
      />
    </div>
  )
}
