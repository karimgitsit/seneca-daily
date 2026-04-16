import { useState, useCallback, useEffect } from 'react'
import type { AppSettings } from '../types'
import { getSettings, setSettings as persistSettings, applyTheme, applyFontSize } from '../lib/storage'

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(getSettings)

  // Apply theme and font size on mount and changes
  useEffect(() => {
    applyTheme(settings.theme)
    applyFontSize(settings.fontSize)
  }, [settings])

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const next = { ...prev, ...partial }
      persistSettings(next)
      return next
    })
  }, [])

  return { settings, updateSettings }
}
