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
        {/* 中心发光八角星 — 忠实移植桌面端登录页 GlowingStar（缩小尺寸 + 更明显的中心发光球）*/}
        <div className="relative flex h-52 w-52 items-center justify-center md:h-72 md:w-72">
          {/* 外层大光晕 — 慢脉冲 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '170%',
              height: '170%',
              background:
                'radial-gradient(circle, rgba(37,99,235,0.20) 0%, rgba(29,78,216,0.10) 42%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* 中层光晕 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '112%',
              height: '112%',
              background:
                'radial-gradient(circle, rgba(96,165,250,0.22) 0%, rgba(37,99,235,0.16) 45%, transparent 72%)',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* 八角星 SVG — 四角外星 + 45° 旋转内星（忠实移植登录页），轻呼吸缩放 */}
          <motion.div
            className="relative h-36 w-36 md:h-48 md:w-48"
            style={{ filter: 'drop-shadow(0 0 28px rgba(147,197,253,0.75))' }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg aria-hidden="true" viewBox="0 0 256 256" className="h-full w-full">
              <defs>
                <linearGradient id="heroStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="50%" stopColor="#1D4ED8" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="heroStarInner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BFDBFE" />
                  <stop offset="52%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <radialGradient id="heroStarCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="34%" stopColor="#DBEAFE" />
                  <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* 轨道细环 */}
              <circle cx="128" cy="128" r="78" fill="none" stroke="#60A5FA" strokeOpacity="0.3" />
              {/* 外层四角星 */}
              <path
                d="M128 76c5.5 42.5 9.5 46.5 52 52-42.5 5.5-46.5 9.5-52 52-5.5-42.5-9.5-46.5-52-52 42.5-5.5 46.5-9.5 52-52Z"
                fill="url(#heroStarGrad)"
              />
              {/* 内层四角星（旋转45°补出八角，更亮更透）*/}
              <path
                d="M128 92c3.8 29.5 6.5 32.2 36 36-29.5 3.8-32.2 6.5-36 36-3.8-29.5-6.5-32.2-36-36 29.5-3.8 32.2-6.5 36-36Z"
                fill="url(#heroStarInner)"
                opacity="0.58"
                transform="rotate(45 128 128)"
              />
              {/* 中心发光球（比登录页更明显，贴合参考图）*/}
              <circle cx="128" cy="128" r="30" fill="url(#heroStarCore)" />
              <circle cx="128" cy="128" r="5" fill="white" opacity="0.95" />
              {/* 四角社交节点微光 */}
              <circle cx="188" cy="78" r="3" fill="#BFDBFE" opacity="0.75" />
              <circle cx="72" cy="82" r="3" fill="#60A5FA" opacity="0.75" />
              <circle cx="192" cy="170" r="2.5" fill="#93C5FD" opacity="0.65" />
              <circle cx="68" cy="168" r="2.5" fill="#BFDBFE" opacity="0.65" />
            </svg>
          </motion.div>

          {/* 中心白核脉冲光点 */}
          <motion.div
            className="pointer-events-none absolute h-3 w-3 rounded-full bg-white"
            style={{
              boxShadow:
                '0 0 20px rgba(255,255,255,0.9), 0 0 70px rgba(37,99,235,0.75)',
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
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
