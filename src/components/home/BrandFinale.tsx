import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../shared/ScrollReveal'

// 品牌收尾只保留一个行动目标：下载桌面端开始第一项任务。
export default function BrandFinale() {
  return (
    <section className="relative z-10 overflow-hidden px-4 py-28 sm:px-6 md:px-8 lg:px-12 md:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[560px] w-[560px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <ScrollReveal>
          <motion.div
            className="mb-8 inline-block text-3xl"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ✦
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
            先把一件真实的事交给分身
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mx-auto mb-10 max-w-xl text-base leading-7 text-text-secondary md:text-lg">
            下载桌面端，创建你的第一个 AI 分身。从一项任务开始，让它在长期使用中真正理解你、代表你、帮助你。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/download"
              className="inline-block rounded-lg bg-star-purple px-8 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-star-purple-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star-purple focus-visible:ring-offset-2 focus-visible:ring-offset-space-black"
            >
              免费下载
            </Link>
            <Link
              to="/product"
              className="inline-block rounded-lg border border-border-default px-8 py-3 text-lg font-semibold text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-primary"
            >
              查看产品功能
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
