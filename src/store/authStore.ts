import { create } from 'zustand'

interface User {
  id: string
  name: string
  phone: string
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

// TODO: backend tayyor bo'lganda persist + AsyncStorage qo'shish
export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}))
