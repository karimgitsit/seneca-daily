interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
}

export default function Sentence({ text, isHighlighted, onTap }: Props) {
  return (
    <span
      onClick={onTap}
      className={`transition-colors duration-200 cursor-pointer rounded-sm ${
        isHighlighted ? 'bg-[var(--color-highlight)]' : ''
      }`}
    >
      {text}
    </span>
  )
}
