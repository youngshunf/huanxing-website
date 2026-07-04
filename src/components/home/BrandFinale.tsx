import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../shared/ScrollReveal'

// 品牌收尾 · 仰望星空的故事 + 唤/星 + CTA
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
          <p className="mb-8 text-lg leading-relaxed text-text-secondary md:text-xl">
            每个人小时候都仰望过星空，幻想过其中一颗是属于自己的。
            <br />
            唤星，就是帮你找到那颗星，点亮它。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mb-10 space-y-1.5 text-base text-text-tertiary">
            <p><span className="font-semibold text-text-primary">唤</span> — 是你主动的选择，你唤醒它、塑造它。</p>
            <p><span className="font-semibold text-text-primary">星</span> — 是无限的可能，每颗星都独一无二。</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <h2 className="mb-10 text-3xl font-bold leading-tight md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              唤醒属于你的那颗星
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/pricing"
              className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]"
            >
              免费开始
            </Link>
            <Link
              to="/about"
              className="inline-block rounded-lg border border-border-default px-8 py-3 text-lg font-semibold text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-primary"
            >
              我们的故事 →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
