import { create } from 'zustand'

interface AuthState {
  isLoggedIn: boolean
  bidderNumber: string | null
  setLoggedIn: (loggedIn: boolean, bidderNumber?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  bidderNumber: null,
  setLoggedIn: (loggedIn, bidderNumber) =>
    set({ isLoggedIn: loggedIn, bidderNumber: bidderNumber ?? null }),
  logout: () => set({ isLoggedIn: false, bidderNumber: null }),
}))
