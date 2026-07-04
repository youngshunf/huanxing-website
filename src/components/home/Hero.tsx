import { motion } from 'framer-motion'

// Hero 恒深色背景（皇家蓝调深空），不随主题翻浅——文字一律浅色。
export default function Hero() {
  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-8"
      style={{
        background:
          'radial-gradient(120% 80% at 50% 0%, #16295c 0%, #0b1330 42%, #070a12 100%)',
      }}
    >
      <div className="relative z-10 flex flex-col items-center">
        {/* 中心星仔 — V6 logo + 皇家蓝光晕 */}
        <div className="relative flex h-56 w-56 items-center justify-center md:h-80 md:w-80">
          {/* 最外层大光晕 — 呼吸脉冲 */}
          <motion.div
            className="absolute h-[500px] w-[500px] rounded-full md:h-[700px] md:w-[700px]"
            style={{
              background:
                'radial-gradient(circle, rgba(37,99,235,0.30) 0%, rgba(37,99,235,0.14) 30%, rgba(29,78,216,0.06) 50%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 中层柔光 */}
          <motion.div
            className="absolute h-64 w-64 rounded-full md:h-80 md:w-80"
            style={{
              background:
                'radial-gradient(circle, rgba(96,165,250,0.22) 0%, rgba(96,165,250,0.08) 40%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 八角星芒 — 星仔背后的放射星光（沿用旧 hero 造型，重上皇家蓝；缓慢旋转+脉冲）*/}
          <motion.div
            className="pointer-events-none absolute h-72 w-72 md:h-[26rem] md:w-[26rem]"
            style={{ filter: 'drop-shadow(0 0 22px rgba(37,99,235,0.45))' }}
            animate={{ rotate: 360, scale: [1, 1.06, 1] }}
            transition={{
              rotate: { duration: 64, repeat: Infinity, ease: 'linear' },
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <svg viewBox="-60 -60 120 120" className="h-full w-full">
              <defs>
                <linearGradient id="heroBurstOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="heroBurstInner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>
              {/* 外层星芒（上下左右四角）*/}
              <path
                d="M0 -52 C5.5 -9.5, 9.5 -5.5, 52 0 C9.5 5.5, 5.5 9.5, 0 52 C-5.5 9.5, -9.5 5.5, -52 0 C-9.5 -5.5, -5.5 -9.5, 0 -52 Z"
                fill="url(#heroBurstOuter)"
                opacity="0.85"
              />
              {/* 内层星芒（旋转45°补出八角，更亮）*/}
              <path
                d="M0 -36 C3.8 -6.5, 6.5 -3.8, 36 0 C6.5 3.8, 3.8 6.5, 0 36 C-3.8 6.5, -6.5 3.8, -36 0 C-6.5 -3.8, -3.8 -6.5, 0 -36 Z"
                fill="url(#heroBurstInner)"
                opacity="0.6"
                transform="rotate(45)"
              />
            </svg>
          </motion.div>

          {/* 中心白色光核 — 让八角星芒成为完整发光星（星仔已挪至右下角助手气泡）*/}
          <motion.div
            className="pointer-events-none absolute h-12 w-12 rounded-full md:h-16 md:w-16"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(219,234,254,0.75) 35%, rgba(96,165,250,0.28) 60%, transparent 80%)',
              boxShadow:
                '0 0 26px rgba(255,255,255,0.8), 0 0 64px rgba(96,165,250,0.5)',
            }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* 星仔下方文案 */}
        <div className="mt-6 text-center md:mt-10">
          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-[#93C5FD] to-[#3B82F6] bg-clip-text text-transparent">
              唤醒星辰的力量
            </span>
            <span className="mt-3 block text-white md:mt-4">AI与你共生</span>
          </motion.h1>

          <motion.p
            className="mb-12 text-lg text-white/70 md:whitespace-nowrap md:text-xl"
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
              className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.45)]"
            >
              立即体验
            </a>
            <a
              href="#pain-points"
              className="inline-block rounded-lg border border-white/25 px-8 py-3 text-lg font-semibold text-white/80 transition-all duration-300 hover:border-white/50 hover:text-white"
            >
              了解更多 ↓
            </a>
          </motion.div>
        </div>
      </div>

      {/* 滚动提示 */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  )
}
