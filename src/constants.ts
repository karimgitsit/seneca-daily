export const STORAGE_KEYS = {
  currentLetter: 'seneca-current-letter',
  readLetters: 'seneca-read-letters',
  scrollPositions: 'seneca-scroll-positions',
  settings: 'seneca-settings',
  highlights: 'seneca-highlights',
} as const

export const FONT_SIZE_MAP: Record<string, string> = {
  S: '1rem',
  M: '1.175rem',
  L: '1.35rem',
}
