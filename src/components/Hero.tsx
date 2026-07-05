import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useThemeStore } from '../stores/useThemeStore'
import { useLatestRelease } from '../hooks/useLatestRelease'
import { assetDownloadUrl, detectOsLabel, detectPreferredTarget } from '../api/release'

export default function Hero() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const isDark = resolvedTheme === 'dark'

  // 动态最新版本 + 当前平台首选安装包（拉取失败则降级到 /download 页）
  const { release, loading } = useLatestRelease()
  const preferredTarget = detectPreferredTarget()
  const preferredInstaller = release?.installers?.[preferredTarget] ?? null
  const osLabel = detectOsLabel()

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-8">
      {/* Star + Content 垂直排列 */}
      <div className="flex flex-col items-center">
        {/* Central glowing star */}
        <div className="relative flex h-40 w-40 items-center justify-center md:h-56 md:w-56">
          <motion.div
            className="absolute h-full w-full rounded-full"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(37, 99, 235,0.3) 0%, rgba(29, 78, 216,0.1) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(37, 99, 235,0.45) 0%, rgba(37, 99, 235,0.18) 40%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute h-20 w-20 rounded-full md:h-28 md:w-28"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(255,217,61,0.6) 0%, rgba(37, 99, 235,0.3) 50%, transparent 70%)'
                : 'radial-gradient(circle, rgba(37, 99, 235,0.55) 0%, rgba(37, 99, 235,0.25) 50%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute h-4 w-4 rounded-full md:h-5 md:w-5"
            style={{
              background: isDark ? 'white' : 'white',
              boxShadow: isDark
                ? '0 0 20px rgba(255,217,61,0.8), 0 0 60px rgba(37, 99, 235,0.5)'
                : '0 0 20px rgba(37, 99, 235,0.7), 0 0 60px rgba(37, 99, 235,0.4)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Content below star */}
        <div className="mt-8 text-center md:mt-12">
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
            人人都能拥有的 AI 数字分身。由你唤醒，由你养成，与你共同成长。
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#pricing"
                className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]"
              >
                开始唤星
              </a>

              {/* 下载桌面端：命中当前平台安装包则直下，否则跳下载页 */}
              {loading ? (
                <span className="inline-flex items-center gap-2 rounded-lg bg-space-panel px-7 py-3 text-lg font-semibold text-text-tertiary">
                  <Download className="h-5 w-5" />
                  获取最新版…
                </span>
              ) : preferredInstaller ? (
                <a
                  href={assetDownloadUrl(preferredInstaller)}
                  className="inline-flex items-center gap-2 rounded-lg bg-space-panel px-7 py-3 text-lg font-semibold text-text-primary ring-1 ring-star-blue/40 transition-all duration-300 hover:ring-star-blue hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                >
                  <Download className="h-5 w-5 text-star-blue" />
                  下载桌面端 · {osLabel}
                </a>
              ) : (
                <Link
                  to="/download"
                  className="inline-flex items-center gap-2 rounded-lg bg-space-panel px-7 py-3 text-lg font-semibold text-text-primary ring-1 ring-star-blue/40 transition-all duration-300 hover:ring-star-blue hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                >
                  <Download className="h-5 w-5 text-star-blue" />
                  下载桌面端
                </Link>
              )}
            </div>

            {/* 版本说明：动态回显最新版本号 + 跳全平台下载页 */}
            <p className="text-sm text-text-tertiary">
              {release?.version ? (
                <>
                  最新版本 <span className="font-medium text-text-secondary">v{release.version}</span>
                  <span className="mx-2 opacity-40">·</span>
                  支持 macOS / Windows / Linux
                </>
              ) : (
                <>桌面端支持 macOS / Windows / Linux</>
              )}
              <span className="mx-2 opacity-40">·</span>
              <Link to="/download" className="text-star-blue transition-colors hover:text-star-purple">
                查看所有平台 →
              </Link>
            </p>
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
