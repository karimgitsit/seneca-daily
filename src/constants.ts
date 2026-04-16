export const STORAGE_KEYS = {
  currentLetter: 'seneca-current-letter',
  readLetters: 'seneca-read-letters',
  scrollPositions: 'seneca-scroll-positions',
  settings: 'seneca-settings',
} as const

export const DB_NAME = 'seneca-daily'
export const DB_STORE = 'highlights'
export const DB_VERSION = 1

export const FONT_SIZE_MAP: Record<string, string> = {
  S: '1rem',
  M: '1.175rem',
  L: '1.35rem',
}
