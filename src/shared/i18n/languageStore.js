import { create } from 'zustand'
import { STORAGE_LANGUAGE } from '@/constants/storageKeys.js'
import { isSupportedLanguage } from '@/shared/i18n/index.js'

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_LANGUAGE)
    return isSupportedLanguage(value) ? value : null
  } catch {
    return null
  }
}

/** Visitor's explicit language choice (null = follow the brand default). */
export const useLanguageStore = create((set) => ({
  language: readStored(),
  setLanguage: (language) => {
    try {
      localStorage.setItem(STORAGE_LANGUAGE, language)
    } catch {
      // Storage may be unavailable (private mode); the choice then lasts for this tab only.
    }
    set({ language })
  },
}))
