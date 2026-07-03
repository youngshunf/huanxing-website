import { create } from 'zustand'

type ThemeMode = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeState {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggle: () => void
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// 初始化：从 localStorage 读取，默认 system（跟随系统切换；无系统深色偏好即 light）
// 2026-07-03 新视觉规范：默认 light（多数系统无深色偏好即浅色）、支持 dark、跟随系统自动切换。
const stored = (localStorage.getItem('theme') as ThemeMode) || 'system'
const initialResolved = resolveTheme(stored)
applyTheme(initialResolved)

export const useThemeStore = create<ThemeState>((set) => ({
  theme: stored,
  resolvedTheme: initialResolved,

  setTheme: (theme) => {
    const resolved = resolveTheme(theme)
    localStorage.setItem('theme', theme)
    applyTheme(resolved)
    set({ theme, resolvedTheme: resolved })
  },

  toggle: () => {
    set((state) => {
      const next: ThemeMode = state.resolvedTheme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      applyTheme(next)
      return { theme: next, resolvedTheme: next }
    })
  },
}))

// 监听系统主题变化
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useThemeStore.getState()
    if (state.theme === 'system') {
      const resolved = getSystemTheme()
      applyTheme(resolved)
      useThemeStore.setState({ resolvedTheme: resolved })
    }
  })
}
