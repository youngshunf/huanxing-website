import { create } from 'zustand'
import type { UserInfo } from '../types'
import * as authApi from '../api/auth'

interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  isLoggedIn: boolean
  showLoginModal: boolean

  login: (phone: string, code: string) => Promise<void>
  logout: () => void
  setShowLoginModal: (show: boolean) => void
  restoreSession: () => void
}

// 同步从 localStorage 恢复初始状态
function getInitialState() {
  try {
    const token = localStorage.getItem('accessToken')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      const user = JSON.parse(userStr) as UserInfo
      return { user, accessToken: token, isLoggedIn: true }
    }
  } catch {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }
  return { user: null, accessToken: null, isLoggedIn: false }
}

const initialState = getInitialState()

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  accessToken: initialState.accessToken,
  isLoggedIn: initialState.isLoggedIn,
  showLoginModal: false,

  login: async (phone, code) => {
    const res = await authApi.phoneLogin(phone, code)
    const token = res.access_token
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(res.user))
    set({
      user: res.user,
      accessToken: token,
      isLoggedIn: true,
      showLoginModal: false,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    set({
      user: null,
      accessToken: null,
      isLoggedIn: false,
    })
  },

  setShowLoginModal: (show) => set({ showLoginModal: show }),

  // 页面刷新时恢复登录态
  restoreSession: () => {
    const token = localStorage.getItem('accessToken')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo
        set({ user, accessToken: token, isLoggedIn: true })
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    }
  },
}))
