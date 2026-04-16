import { toRoman } from '../lib/roman'

interface Props {
  letterNumber: number
  title: string
}

export default function LetterHeader({ letterNumber, title }: Props) {
  return (
    <header className="mb-10">
      <p className="text-sm tracking-widest uppercase text-[var(--color-muted)] mb-2">
        Letter {toRoman(letterNumber)}
      </p>
      <h1 className="text-2xl leading-snug font-normal">
        {title}
      </h1>
    </header>
  )
}
