import { useCallback } from 'react'
import Sentence from './Sentence'
import { splitIntoSentences } from '../lib/sentences'
import type { Highlight } from '../types'

interface Props {
  text: string
  paragraphIndex: number
  highlights: Highlight[]
  highlightMode: boolean
  onToggleHighlight: (sentenceText: string, paragraphIndex: number, startOffset: number, endOffset: number) => void
}

export default function Paragraph({ text, paragraphIndex, highlights, highlightMode, onToggleHighlight }: Props) {
  const sentences = splitIntoSentences(text)

  const isSentenceHighlighted = useCallback((startOffset: number, endOffset: number) => {
    return highlights.some(h =>
      h.paragraphIndex === paragraphIndex &&
      h.startOffset === startOffset &&
      h.endOffset === endOffset
    )
  }, [highlights, paragraphIndex])

  const Tag = highlightMode ? 'div' : 'p'

  return (
    <Tag className={highlightMode ? 'mb-4' : 'mb-6 leading-[1.75]'}>
      {sentences.map((sentence, i) => (
        <Sentence
          key={i}
          text={sentence.text + (highlightMode || i === sentences.length - 1 ? '' : ' ')}
          isHighlighted={isSentenceHighlighted(sentence.startOffset, sentence.endOffset)}
          highlightMode={highlightMode}
          onTap={() => onToggleHighlight(
            sentence.text,
            paragraphIndex,
            sentence.startOffset,
            sentence.endOffset
          )}
        />
      ))}
    </Tag>
  )
}
