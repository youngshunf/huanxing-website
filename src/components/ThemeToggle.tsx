import { Sun, Moon, Monitor } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '../stores/useThemeStore'

const options = [
  { value: 'light' as const, icon: Sun, label: '浅色' },
  { value: 'dark' as const, icon: Moon, label: '深色' },
  { value: 'system' as const, icon: Monitor, label: '跟随系统' },
]

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useThemeStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary dark:hover:bg-space-float"
        aria-label="切换主题"
      >
        <CurrentIcon className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-lg border border-border-default bg-white shadow-lg dark:bg-space-panel">
          {options.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                theme === value
                  ? 'bg-star-purple/10 text-star-purple'
                  : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-space-float'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
