interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
}

export default function Sentence({ text, isHighlighted, onTap }: Props) {
  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        font: 'inherit',
        color: 'inherit',
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'none',
        display: 'inline',
        textAlign: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit',
        cursor: 'pointer',
        touchAction: 'manipulation',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      className={`transition-colors duration-200 rounded-sm ${
        isHighlighted ? 'bg-[var(--color-highlight)]' : ''
      }`}
    >
      {text}
    </button>
  )
}
