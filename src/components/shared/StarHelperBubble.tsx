import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'

// 右下角浮动「星仔小助手」— 帮助信息入口。
// 现放起步产品介绍 + 快捷入口；将来在此扩充产品使用指引内容。
const quickLinks = [
  { label: '产品介绍', desc: '唤星能为你做什么', to: '/product' },
  { label: '应用场景', desc: '看看别人怎么用', to: '/scenes' },
  { label: '定价方案', desc: '选择适合你的档位', to: '/pricing' },
]

export default function StarHelperBubble() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* 弹出卡片 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-divider bg-white shadow-2xl dark:bg-space-panel"
            role="dialog"
            aria-label="唤星小助手"
          >
            {/* 头部 — 皇家蓝 */}
            <div className="flex items-start gap-3 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-5 py-4 text-white">
              <img
                src="/logos/star-v6.png"
                alt="星仔"
                className="h-10 w-10 shrink-0 object-contain drop-shadow"
              />
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold">唤星小助手</div>
                <div className="text-sm text-white/85">你好，我是星仔 👋</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 正文 */}
            <div className="px-5 py-4">
              <p className="text-sm leading-relaxed text-text-secondary">
                唤星是你的专属 AI 超级大脑——能思考、能记忆、能行动，7×24 小时为你而战。想先了解什么？
              </p>

              <div className="mt-4 space-y-1.5">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-space-float"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-text-primary">{link.label}</div>
                      <div className="text-xs text-text-tertiary">{link.desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-star-purple" />
                  </Link>
                ))}
              </div>

              <p className="mt-4 text-xs text-text-tertiary">更多使用指引即将上线 ✨</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浮动星仔按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="打开唤星小助手"
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-[0_6px_20px_rgba(37,99,235,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_28px_rgba(37,99,235,0.6)] active:scale-95"
      >
        <motion.img
          src="/logos/star-v6.png"
          alt="唤星助手"
          className="h-9 w-9 object-contain drop-shadow"
          animate={open ? { rotate: 0 } : { y: [0, -2, 0] }}
          transition={open ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </button>
    </div>
  )
}
