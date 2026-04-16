import { STORAGE_KEYS, FONT_SIZE_MAP } from '../constants'
import type { AppSettings, FontSize, Theme } from '../types'

const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 'M',
  theme: 'light',
}

export function getCurrentLetter(): number {
  const val = localStorage.getItem(STORAGE_KEYS.currentLetter)
  return val ? parseInt(val, 10) : 1
}

export function setCurrentLetter(n: number): void {
  localStorage.setItem(STORAGE_KEYS.currentLetter, String(n))
}

export function getReadLetters(): Set<number> {
  const val = localStorage.getItem(STORAGE_KEYS.readLetters)
  if (!val) return new Set()
  return new Set(JSON.parse(val) as number[])
}

export function setReadLetters(s: Set<number>): void {
  localStorage.setItem(STORAGE_KEYS.readLetters, JSON.stringify([...s]))
}

export function getScrollPositions(): Record<number, number> {
  const val = localStorage.getItem(STORAGE_KEYS.scrollPositions)
  if (!val) return {}
  return JSON.parse(val)
}

export function setScrollPosition(letterNumber: number, pct: number): void {
  const positions = getScrollPositions()
  positions[letterNumber] = pct
  localStorage.setItem(STORAGE_KEYS.scrollPositions, JSON.stringify(positions))
}

export function getScrollPosition(letterNumber: number): number {
  return getScrollPositions()[letterNumber] ?? 0
}

export function getSettings(): AppSettings {
  const val = localStorage.getItem(STORAGE_KEYS.settings)
  if (!val) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...JSON.parse(val) }
}

export function setSettings(s: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(s))
}

export function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEYS.currentLetter)
  localStorage.removeItem(STORAGE_KEYS.readLetters)
  localStorage.removeItem(STORAGE_KEYS.scrollPositions)
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function applyFontSize(fontSize: FontSize): void {
  document.documentElement.style.setProperty('--font-size-body', FONT_SIZE_MAP[fontSize])
}
