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
    <label
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '8px 0',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <input
        type="checkbox"
        checked={isHighlighted}
        onChange={onTap}
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 12,
          height: 12,
          borderRadius: '50%',
          border: '1.5px solid var(--color-muted)',
          background: isHighlighted ? 'var(--color-text)' : 'transparent',
          alignSelf: 'center',
          transition: 'background-color 150ms',
        }}
      />
      <span
        style={{
          lineHeight: 1.6,
          flex: 1,
          background: isHighlighted ? 'var(--color-highlight)' : 'transparent',
          borderRadius: 2,
          padding: '2px 4px',
          transition: 'background-color 150ms',
        }}
      >
        {text}
      </span>
    </label>
  )
}
