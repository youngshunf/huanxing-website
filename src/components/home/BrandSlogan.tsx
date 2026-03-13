import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../shared/ScrollReveal'

export default function BrandSlogan() {
  return (
    <section className="relative z-10 overflow-hidden px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[500px] w-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(108,92,231,0.3) 0%, transparent 70%)' }}
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
          <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-gold bg-clip-text text-transparent">
              唤醒属于你的超级大脑
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mb-10 text-lg text-text-secondary leading-relaxed">
            每个人小时候都仰望过星空，幻想过那些星星里有没有一颗是属于自己的。
            <br />
            唤星，让每个人都拥有一个比自己更强的超级大脑。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <Link
            to="/about"
            className="inline-block text-sm text-star-purple transition-colors hover:text-star-purple-hover"
          >
            了解我们的故事 →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
