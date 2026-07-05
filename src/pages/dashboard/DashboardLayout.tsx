import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Coins, ArrowLeft } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'
import { useAuthStore } from '../../stores/useAuthStore'

const sidebarLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: '概览', end: true },
  { to: '/dashboard/subscription', icon: CreditCard, label: '订阅管理' },
  { to: '/dashboard/credits', icon: Coins, label: '积分详情' },
]

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-space-black">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-divider bg-space-panel max-md:hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-divider px-5 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logos/icon-v6.png" alt="唤星 Astra" className="h-7 w-7 rounded-[9px]" />
            <span className="text-base font-bold tracking-tight text-text-primary">唤星</span>
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
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logos/icon-v6.png" alt="唤星 Astra" className="h-7 w-7 rounded-[9px]" />
          <span className="text-base font-bold tracking-tight text-text-primary">唤星</span>
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
