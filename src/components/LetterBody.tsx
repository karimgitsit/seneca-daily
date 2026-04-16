import Paragraph from './Paragraph'
import type { Highlight } from '../types'

interface Props {
  paragraphs: string[]
  letterNumber: number
  highlights: Highlight[]
  onToggleHighlight: (sentenceText: string, paragraphIndex: number, startOffset: number, endOffset: number) => void
}

export default function LetterBody({ paragraphs, highlights, onToggleHighlight }: Props) {
  return (
    <div className="letter-body">
      {paragraphs.map((text, i) => (
        <Paragraph
          key={i}
          text={text}
          paragraphIndex={i}
          highlights={highlights}
          onToggleHighlight={onToggleHighlight}
        />
      ))}
    </div>
  )
}
