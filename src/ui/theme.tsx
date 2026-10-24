import { createContext, ReactNode, useContext } from 'react'
import { usePrefs } from '../store/prefsStore'

export const lightColors = {
  navy: '#172554',
  accent: '#2563EB',
  accentSoft: '#EFF4FF',
  cyan: '#38BDF8',
  canvas: '#F8FAFC',
  surface: '#FFFFFF',
  subtle: '#F1F5F9',
  border: '#E2E8F0',
  text: '#111827',
  secondary: '#64748B',
  inverse: '#FFFFFF',
  success: '#15966A',
  successSoft: '#E7F6F0',
  warning: '#D99A28',
  warningSoft: '#FBF3E4',
  error: '#DC5252',
  errorSoft: '#FCEBEB',
  eco: '#16A34A',
  map: '#EEF1F5',
  mapInk: '#94A3B8',
}

export const darkColors: typeof lightColors = {
  navy: '#E0E7FF',
  accent: '#3B82F6',
  accentSoft: '#1E2A4A',
  cyan: '#38BDF8',
  canvas: '#0B1220',
  surface: '#121A2B',
  subtle: '#1A2336',
  border: '#26324A',
  text: '#F1F5F9',
  secondary: '#94A3B8',
  inverse: '#0B1220',
  success: '#22C38A',
  successSoft: '#123326',
  warning: '#F0B44A',
  warningSoft: '#3A2C12',
  error: '#F07171',
  errorSoft: '#3A1717',
  eco: '#4ADE80',
  map: '#0E1626',
  mapInk: '#64748B',
}

export type Colors = typeof lightColors

const ThemeContext = createContext<{ colors: Colors; dark: boolean }>({
  colors: lightColors,
  dark: false,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const dark = usePrefs((s) => s.dark)
  return (
    <ThemeContext.Provider value={{ colors: dark ? darkColors : lightColors, dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function som(value: number) {
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`
}
