import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: '首页', to: '/' },
  { label: '产品', to: '/product' },
  { label: '技术', to: '/tech' },
  { label: '场景', to: '/scenes' },
  { label: '定价', to: '/pricing' },
  { label: '关于', to: '/about' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const { isLoggedIn, user, setShowLoginModal, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 路由变化时关闭移动菜单
  useEffect(() => {
    window.setTimeout(() => setIsMobileMenuOpen(false), 0)
  }, [location.pathname])

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  // 首页顶部（未滚动）时顶栏透明悬浮在深色 Hero 上 → 用浅色墨；滚动后底色跟随主题 → 用主题墨。
  const onDark = location.pathname === '/' && !isScrolled

  const inkPrimary = onDark ? 'text-white' : 'text-text-primary'
  const inkSecondary = onDark
    ? 'text-white/75 hover:text-white'
    : 'text-text-secondary hover:text-text-primary'

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-divider bg-space-black/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8">
        {/* Logo — V6 星仔图标 + CSS 文字 */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logos/icon-v6.png"
            alt="唤星 Astra"
            className="h-8 w-8 rounded-[10px]"
          />
          <span className={`text-lg font-bold tracking-tight transition-colors ${inkPrimary}`}>
            唤星
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive(link.to) ? `${inkPrimary} font-medium` : inkSecondary
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-3 flex items-center gap-2">
            <ThemeToggle onDark={onDark} />

            {isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    onDark
                      ? 'border-white/25 text-white hover:border-white/40'
                      : 'border-border-default text-text-primary hover:border-border-hover'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[80px] truncate">{user?.nickname || user?.phone}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-lg border border-border-default bg-white shadow-lg dark:bg-space-panel">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-gray-100 dark:hover:bg-space-float"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      用户中心
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-gray-100 dark:hover:bg-space-float"
                    >
                      <LogOut className="h-4 w-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/pricing"
                className={`mr-2 rounded-lg px-4 py-2 text-sm transition-colors ${inkSecondary}`}
              >
                免费体验
              </Link>
            )}

            {!isLoggedIn && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
              >
                登录
              </button>
            )}
          </div>
        </nav>

        {/* Mobile: theme toggle + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle onDark={onDark} />
          <button
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              onDark
                ? 'text-white hover:bg-white/10'
                : 'text-text-primary hover:bg-space-float'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="菜单"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-divider bg-space-black/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="移动导航">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-4 py-3 text-sm transition-colors ${
                  isActive(link.to)
                    ? 'bg-space-float text-text-primary font-medium'
                    : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
                >
                  用户中心
                </Link>
                <button
                  onClick={() => logout()}
                  className="rounded-lg px-4 py-3 text-left text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
                >
                  退出登录
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true)
                  setIsMobileMenuOpen(false)
                }}
                className="mt-2 rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300"
              >
                登录
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
