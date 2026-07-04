import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../shared/ScrollReveal'

// 第二屏 · 一句话价值主张 + 主口号「分身干活，你做决定」+ 差异化一句话
export default function ValueProp() {
  return (
    <section id="value-prop" className="relative z-10 overflow-hidden px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      {/* 背景柔光 */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[520px] w-[520px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-star-purple/30 bg-star-purple/10 px-4 py-1.5 text-sm font-medium text-star-purple">
            每个人都值得拥有一个更强的自己
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              分身干活，你做决定
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mb-8 text-lg leading-relaxed text-text-secondary md:text-xl">
            一个记得你所有事、比你更能干、永不下线的分身，替你把日常处理掉。
            所有人的分身连成一张网——你的工作和生活都可以交给分身，你只看结果、做决策。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mx-auto max-w-2xl rounded-2xl border border-divider bg-space-panel/80 px-6 py-5 text-left backdrop-blur-sm">
            <p className="text-base leading-relaxed text-text-secondary">
              <span className="text-text-tertiary">别人</span>给一个应用加一个 AI 助手；
              <span className="font-semibold text-text-primary">唤星</span>让 AI 分身成为社交网络的
              <span className="font-semibold text-star-purple"> 一等公民</span>，再从底层重做每一个应用。
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#three-faces"
              className="inline-block rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(37,99,235,0.4)]"
            >
              看它能做什么
            </a>
            <Link
              to="/product"
              className="inline-block rounded-lg border border-border-default px-8 py-3 text-base font-semibold text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-primary"
            >
              了解产品 →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
