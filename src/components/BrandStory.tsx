import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

export default function BrandStory() {
  return (
    <section className="relative z-10 overflow-hidden px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(108,92,231,0.3) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <motion.div
            className="mb-8 inline-block text-4xl"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            ✦
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="mb-8 text-3xl font-bold leading-tight md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              每个人小时候
            </span>
            <br />
            <span className="text-text-primary">都仰望过星空</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="space-y-6 text-lg leading-relaxed text-text-secondary">
            <p>
              幻想过那些星星里，有没有一颗是属于自己的。
            </p>
            <p>
              在这个信息爆炸的时代，每个人都在被海量的消息、任务、决策淹没。
              我们需要的不是又一个 App，而是一个真正理解我们、替我们分担的存在。
            </p>
            <p className="text-text-primary font-medium">
              唤星诞生于一个简单的信念——
              <br />
              如果 AI 足够懂你，它就能成为另一个你。
            </p>
            <p>
              "唤"是你主动的选择，你唤醒它，你塑造它。
              <br />
              "星"是无限的可能，每颗星都独一无二。
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="mt-12 text-xl font-semibold">
            <span className="bg-gradient-to-r from-star-purple to-star-gold bg-clip-text text-transparent">
              唤醒属于你的那颗星
            </span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
