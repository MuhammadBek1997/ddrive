import { create } from 'zustand'

type Lang = 'UZ' | 'RU'

interface PrefsState {
  dark: boolean
  lang: Lang
  toggleDark: () => void
  setLang: (lang: Lang) => void
}

export const usePrefs = create<PrefsState>()((set) => ({
  dark: false,
  lang: 'UZ',
  toggleDark: () => set((s) => ({ dark: !s.dark })),
  setLang: (lang) => set({ lang }),
}))
