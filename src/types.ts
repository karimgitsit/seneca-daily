export interface Letter {
  number: number
  title: string
  paragraphs: string[]
}

export interface Highlight {
  id: string
  letterNumber: number
  letterTitle: string
  text: string
  paragraphIndex: number
  startOffset: number
  endOffset: number
  timestamp: number
}

export type FontSize = 'S' | 'M' | 'L'
export type Theme = 'light' | 'dark'

export interface AppSettings {
  fontSize: FontSize
  theme: Theme
}
