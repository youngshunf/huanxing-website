import { motion } from 'framer-motion'
import { useThemeStore } from '../../stores/useThemeStore'

export default function Hero() {
  const isDark = useThemeStore((s) => s.resolvedTheme) === 'dark'

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-8">
      <div className="flex flex-col items-center">
        {/* Central star — v2.0 logo + glow layers */}
        <div className="relative flex h-56 w-56 items-center justify-center md:h-80 md:w-80">
          {/* 最外层大光晕 — 呼吸脉冲 */}
          <motion.div
            className="absolute h-[500px] w-[500px] rounded-full md:h-[700px] md:w-[700px]"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(79,70,229,0.12) 30%, rgba(6,182,212,0.06) 50%, transparent 70%)'
                : 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.08) 30%, rgba(6,182,212,0.04) 50%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 中层光晕 */}
          <motion.div
            className="absolute h-64 w-64 rounded-full md:h-80 md:w-80"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Logo SVG — dark 用 icon-nobg，light 用 icon-light-nobg */}
          <motion.div
            className="relative h-48 w-48 md:h-64 md:w-64"
            style={{
              filter: isDark
                ? 'drop-shadow(0 0 40px rgba(124,58,237,0.5)) drop-shadow(0 0 80px rgba(79,70,229,0.3))'
                : 'drop-shadow(0 0 30px rgba(124,58,237,0.35)) drop-shadow(0 0 60px rgba(99,102,241,0.2))',
            }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={isDark ? '/logos/icon-nobg.svg' : '/logos/icon-light-nobg.svg'}
              alt="唤星"
              className="h-full w-full"
            />
          </motion.div>

          {/* 中心光核 */}
          <motion.div
            className="pointer-events-none absolute h-8 w-8 rounded-full md:h-10 md:w-10"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.15) 60%, transparent 80%)'
                : 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, rgba(99,102,241,0.3) 30%, rgba(99,102,241,0.08) 60%, transparent 80%)',
              boxShadow: isDark
                ? '0 0 20px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.3), 0 0 80px rgba(124,58,237,0.3)'
                : '0 0 15px rgba(124,58,237,0.4), 0 0 40px rgba(99,102,241,0.2)',
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Content below star */}
        <div className="mt-6 text-center md:mt-10">
          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              唤醒星辰的力量
            </span>
            <span className="mt-3 block text-text-primary md:mt-4">AI与你共生</span>
          </motion.h1>

          <motion.p
            className="mb-12 text-lg text-text-secondary md:whitespace-nowrap md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            你的专属 AI 超级大脑。能思考、能记忆、能行动，7×24 小时为你而战。
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="#beta-contact"
              className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(108,92,231,0.4)]"
            >
              立即体验
            </a>
            <a
              href="#pain-points"
              className="inline-block rounded-lg border border-border-default px-8 py-3 text-lg font-semibold text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-primary"
            >
              了解更多 ↓
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-text-tertiary p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-text-tertiary" />
        </div>
      </motion.div>
    </section>
  )
}
