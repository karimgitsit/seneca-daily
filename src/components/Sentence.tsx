interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
  highlightMode: boolean
}

export default function Sentence({ text, isHighlighted, onTap, highlightMode }: Props) {
  if (!highlightMode) {
    return (
      <span
        className={`rounded-sm ${isHighlighted ? 'bg-[var(--color-highlight)]' : ''}`}
      >
        {text}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onTap}
      style={{
        font: 'inherit',
        color: 'inherit',
        textAlign: 'left',
        display: 'block',
        width: '100%',
        padding: '10px 12px',
        margin: '4px 0',
        cursor: 'pointer',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
      className={`rounded transition-colors leading-[1.6] ${
        isHighlighted ? 'bg-[var(--color-highlight)]' : ''
      }`}
    >
      {text}
    </button>
  )
}
