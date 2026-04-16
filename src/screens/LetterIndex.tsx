import { useNavigate } from 'react-router-dom'
import { useLetters } from '../hooks/useLetters'
import { useCurrentLetter } from '../hooks/useCurrentLetter'
import { getReadLetters } from '../lib/storage'
import { toRoman } from '../lib/roman'

export default function LetterIndex() {
  const { letters, loading } = useLetters()
  const { setCurrentLetter } = useCurrentLetter()
  const navigate = useNavigate()
  const readLetters = getReadLetters()

  const handleSelect = (letterNumber: number) => {
    setCurrentLetter(letterNumber)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-prose mx-auto px-6 py-8">
      <h1 className="text-xl mb-6">Letters</h1>
      <ul className="divide-y divide-[var(--color-border)]">
        {letters.map(letter => {
          const isRead = readLetters.has(letter.number)
          return (
            <li key={letter.number}>
              <button
                onClick={() => handleSelect(letter.number)}
                className="w-full text-left py-4 flex items-center gap-4 transition-colors active:bg-[var(--color-border)]/30"
              >
                <span
                  className={`flex-none w-2.5 h-2.5 rounded-full border border-[var(--color-muted)] ${
                    isRead ? 'bg-[var(--color-muted)]' : ''
                  }`}
                />
                <div className="min-w-0">
                  <span className="text-xs text-[var(--color-muted)] tracking-wider">
                    {toRoman(letter.number)}
                  </span>
                  <p className="truncate">{letter.title}</p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
