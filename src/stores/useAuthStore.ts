import { create } from 'zustand'
import type { UserInfo } from '../types'
import * as authApi from '../api/auth'

interface AuthState {
  user: UserInfo | null
  accessToken: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  showLoginModal: boolean

  login: (phone: string, code: string) => Promise<void>
  logout: () => void
  setShowLoginModal: (show: boolean) => void
  restoreSession: () => void
  setAccessToken: (token: string) => void
}

// 同步从 localStorage 恢复初始状态
function getInitialState() {
  try {
    const token = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      const user = JSON.parse(userStr) as UserInfo
      return { user, accessToken: token, refreshToken, isLoggedIn: true }
    }
  } catch {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
  return { user: null, accessToken: null, refreshToken: null, isLoggedIn: false }
}

const initialState = getInitialState()

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  accessToken: initialState.accessToken,
  refreshToken: initialState.refreshToken,
  isLoggedIn: initialState.isLoggedIn,
  showLoginModal: false,

  login: async (phone, code) => {
    const res = await authApi.phoneLogin(phone, code)
    localStorage.setItem('accessToken', res.access_token)
    localStorage.setItem('refreshToken', res.refresh_token)
    localStorage.setItem('user', JSON.stringify(res.user))
    set({
      user: res.user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      isLoggedIn: true,
      showLoginModal: false,
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    })
  },

  setShowLoginModal: (show) => set({ showLoginModal: show }),

  // 页面刷新时恢复登录态
  restoreSession: () => {
    const token = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserInfo
        set({ user, accessToken: token, refreshToken, isLoggedIn: true })
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    }
  },

  // 刷新 token 后更新 store
  setAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token)
    set({ accessToken: token })
  },
}))
