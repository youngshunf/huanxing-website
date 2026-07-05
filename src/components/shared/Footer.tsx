import { Link } from 'react-router-dom'
import { Github, Twitter, MessageCircle } from 'lucide-react'

const navLinks = [
  { label: '首页', to: '/' },
  { label: '产品', to: '/product' },
  { label: '场景', to: '/scenes' },
  { label: '定价', to: '/pricing' },
  { label: '关于', to: '/about' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-divider px-4 py-12 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logos/icon-v6.png" alt="唤星 Astra" className="h-8 w-8 rounded-[10px]" />
            <span className="text-lg font-bold tracking-tight text-text-primary">唤星</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-6" aria-label="页脚导航">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social */}
        <div className="flex gap-4">
          {[Github, Twitter, MessageCircle].map((Icon, i) => (
            <button
              key={i}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-space-float hover:text-text-primary"
              aria-label={['GitHub', 'Twitter', '微信'][i]}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-8 max-w-6xl text-center text-xs text-text-tertiary">
        © {new Date().getFullYear()} 唤星 Astra. All rights reserved.
      </div>

      {/* ICP 备案 */}
      <div className="mx-auto mt-2 max-w-6xl text-center text-xs text-text-tertiary">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          滇ICP备20004726号-1
        </a>
      </div>
    </footer>
  )
}
