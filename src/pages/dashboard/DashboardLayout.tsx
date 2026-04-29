import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Coins, ArrowLeft, FileText, Target, PenTool, Share2, BarChart3, Lightbulb, Key, Bot } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'
import { useAuthStore } from '../../stores/useAuthStore'
import { useThemeStore } from '../../stores/useThemeStore'

const sidebarLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: '概览', end: true },
  { to: '/dashboard/docs', icon: FileText, label: '我的文档' },
  { to: '/dashboard/subscription', icon: CreditCard, label: '订阅管理' },
  { to: '/dashboard/credits', icon: Coins, label: '积分详情' },
  { to: '/dashboard/apikeys', icon: Key, label: 'API Keys' },
  { to: '/dashboard/agents', icon: Bot, label: 'AI Agent' },
]

const creatorLinks = [
  { to: '/dashboard/creator', icon: Target, label: '创作项目', end: true },
  { to: '/dashboard/creator/contents', icon: PenTool, label: '内容管理' },
  { to: '/dashboard/creator/publishes', icon: Share2, label: '发布记录' },
  { to: '/dashboard/creator/analytics', icon: BarChart3, label: '数据分析' },
  { to: '/dashboard/creator/topics', icon: Lightbulb, label: '选题池' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const logoSrc = resolvedTheme === 'dark'
    ? '/logos/logo-horizontal-dark.svg'
    : '/logos/logo-horizontal-light.svg'

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-space-black">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-divider bg-space-panel max-md:hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-divider px-5 py-4">
          <a href="/" className="flex items-center">
            <img src={logoSrc} alt="唤星" className="h-7" />
          </a>
        </div>

        {/* 导航 */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-star-purple/10 font-medium text-star-purple'
                    : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}

          {/* 创作中心分隔线 */}
          <div className="!my-3 border-t border-divider" />
          <div className="px-3 pb-1 text-xs font-medium text-text-secondary/60">创作中心</div>
          {creatorLinks.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-star-purple/10 font-medium text-star-purple'
                    : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* 底部用户信息 */}
        <div className="border-t border-divider px-3 py-4">
          <div className="mb-3 flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-star-purple to-star-blue text-xs font-bold text-white">
              {(user?.nickname || user?.phone || '?')[0]}
            </div>
            <div className="flex-1 truncate text-sm text-text-primary">
              {user?.nickname || user?.phone}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* 移动端顶栏 */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-divider bg-space-panel px-4 py-3 md:hidden">
        <a href="/" className="flex items-center">
          <img src={logoSrc} alt="唤星" className="h-7" />
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>

      {/* 主内容区 */}
      <main className="min-w-0 flex-1 max-md:pt-14 md:ml-60">
        <div className="relative z-20 flex items-center justify-end border-b border-divider px-6 py-3 max-md:hidden">
          <ThemeToggle />
        </div>
        <div className="overflow-hidden p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

// 移动端导航下拉
function MobileNav() {
  const { logout } = useAuthStore()

  return (
    <div className="group relative">
      <button className="flex h-9 w-9 items-center justify-center rounded-lg text-text-primary hover:bg-space-float">
        <LayoutDashboard className="h-5 w-5" />
      </button>
      <div className="invisible absolute right-0 top-full mt-1 w-44 overflow-hidden rounded-lg border border-border-default bg-white opacity-0 shadow-lg transition-all group-focus-within:visible group-focus-within:opacity-100 dark:bg-space-panel">
        {sidebarLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'text-star-purple' : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-space-float'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <div className="border-t border-divider" />
        <div className="px-3 py-1.5 text-xs text-text-secondary/60">创作中心</div>
        {creatorLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'text-star-purple' : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-space-float'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-gray-100 dark:hover:bg-space-float"
        >
          <ArrowLeft className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </div>
  )
}
