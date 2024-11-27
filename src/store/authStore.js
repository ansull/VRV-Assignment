import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEMO_USERS } from '../constants/users'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username, password) => {
        const user = DEMO_USERS.find(
          u => u.username === username && u.password === password
        )
        
        if (user) {
          const { password, ...userWithoutPassword } = user
          set({ user: userWithoutPassword, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)

export default useAuthStore