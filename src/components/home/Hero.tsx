import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { assetDownloadUrl, detectOsLabel, detectPreferredTarget } from '../../api/release'
import { useLatestRelease } from '../../hooks/useLatestRelease'

// 下载图标（箭头入托盘），随文字色 currentColor。
function DownloadGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  )
}

// HASN（Human-Agent Social Network，人-Agent 社交网络）范式四大特点，
// 作 Hero 底部胶囊呈现：让访客一眼看懂唤星「人机同网」的独特范式。
const HASN_TRAITS = [
  '人机同网 · 你和分身都是成员',
  '分身认主 · 行动对你透明可接管',
  '分身互联 · 社交 · 协作 · 交易',
  '能力可安装 · 可授权 · 可组装',
] as const

// Hero 恒深色背景（皇家蓝调深空），不随主题翻浅——文字一律浅色。
export default function Hero() {
  // 桌面客户端最新版本（读云端发布模块公开端点）：能识别当前系统就直下，否则引导到下载页。
  const { release } = useLatestRelease()
  const preferredTarget = detectPreferredTarget()
  const installer = release?.installers?.[preferredTarget]
  const osLabel = detectOsLabel()

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

          {/* 副标题：突出「分身替你干活」——分身是替你行动的一等成员，不是工具 */}
          <motion.p
            className="mb-4 text-lg text-white/80 md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            养一个真正懂你的 AI 分身——替你思考、替你记忆、替你把活干了。
          </motion.p>

          {/* HASN 范式一句话：人与分身共处同一张社交网络，分身认主、透明、可互联 */}
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            在 HASN 人-Agent 社交网络里，你和你的分身都是有身份的成员：分身认你为主人、行动对你透明可接管，还能与他人的分身社交、协作、交易。
          </motion.p>

          {/* 主 CTA：下载当前系统匹配的桌面客户端（一键直下·带版本号）；副 CTA「其他版本」去下载页 */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {installer ? (
              <a
                href={assetDownloadUrl(installer)}
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.45)]"
              >
                <DownloadGlyph />
                下载 {osLabel} 客户端
                {release?.version && (
                  <span className="ml-1 rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white/90">
                    v{release.version}
                  </span>
                )}
              </a>
            ) : (
              <Link
                to="/download"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.45)]"
              >
                <DownloadGlyph />
                下载桌面客户端
              </Link>
            )}
            <Link
              to="/download"
              className="inline-flex items-center rounded-lg border border-white/25 px-8 py-3 text-lg font-semibold text-white/80 transition-all duration-300 hover:border-white/50 hover:text-white"
            >
              其他版本
            </Link>
          </motion.div>

          {/* 次级：了解更多，锚到首屏下方内容 */}
          <motion.div
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <a
              href="#value-prop"
              className="text-sm text-white/55 underline-offset-4 transition-colors hover:text-white/85 hover:underline"
            >
              了解唤星能为你做什么 ↓
            </a>
          </motion.div>

          {/* HASN 范式特点胶囊：人机同网 / 分身认主·透明 / 分身互联 / 能力可组装 */}
          <motion.ul
            className="mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 }}
          >
            {HASN_TRAITS.map((trait) => (
              <li
                key={trait}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/65 backdrop-blur-sm"
              >
                {trait}
              </li>
            ))}
          </motion.ul>
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
