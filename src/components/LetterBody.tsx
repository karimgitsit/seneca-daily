import Paragraph from './Paragraph'
import type { Highlight } from '../types'

interface Props {
  paragraphs: string[]
  letterNumber: number
  highlights: Highlight[]
  highlightMode: boolean
  onToggleHighlight: (sentenceText: string, paragraphIndex: number, startOffset: number, endOffset: number) => void
}

export default function LetterBody({ paragraphs, highlights, highlightMode, onToggleHighlight }: Props) {
  return (
    <div className={`letter-body ${highlightMode ? '' : 'select-none'}`}>
      {paragraphs.map((text, i) => (
        <Paragraph
          key={i}
          text={text}
          paragraphIndex={i}
          highlights={highlights}
          highlightMode={highlightMode}
          onToggleHighlight={onToggleHighlight}
        />
      ))}
    </div>
  )
}
