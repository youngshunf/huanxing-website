import { Github, Twitter, MessageCircle } from 'lucide-react'

const navLinks = [
  { label: '特性', href: '#features' },
  { label: '养成', href: '#growth' },
  { label: '定价', href: '#pricing' },
]

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-divider px-4 py-12 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-star-purple to-star-blue">
            <span className="text-xs text-white">✦</span>
          </div>
          <span className="text-lg font-bold text-text-primary">唤星</span>
          <span className="text-sm text-text-tertiary">Stellara</span>
        </div>

        {/* Nav */}
        <nav className="flex gap-6" aria-label="页脚导航">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </a>
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

      <div className="mx-auto mt-8 max-w-6xl text-center text-xs text-text-tertiary">
        © {new Date().getFullYear()} 唤星 Stellara. All rights reserved.
      </div>
    </footer>
  )
}
