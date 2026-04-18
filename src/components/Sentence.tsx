import type { MouseEvent } from 'react'

interface Props {
  text: string
  isHighlighted: boolean
  onTap: () => void
}

export default function Sentence({ text, isHighlighted, onTap }: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onTap()
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      style={{
        color: 'inherit',
        textDecoration: 'none',
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
    </a>
  )
}
