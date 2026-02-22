import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-8">
      {/* Central glowing star */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute h-64 w-64 rounded-full md:h-80 md:w-80"
          style={{
            background: 'radial-gradient(circle, rgba(108,92,231,0.3) 0%, rgba(0,210,255,0.1) 40%, transparent 70%)',
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
          className="absolute h-32 w-32 rounded-full md:h-40 md:w-40"
          style={{
            background: 'radial-gradient(circle, rgba(255,217,61,0.6) 0%, rgba(108,92,231,0.3) 50%, transparent 70%)',
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
          className="absolute h-4 w-4 rounded-full bg-white md:h-5 md:w-5"
          style={{
            boxShadow: '0 0 20px rgba(255,217,61,0.8), 0 0 60px rgba(108,92,231,0.5)',
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

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
            唤醒星辰的力量
          </span>
          <br />
          <span className="text-text-primary">AI与你共生</span>
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-xl text-lg text-text-secondary md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          人人都能拥有的 AI 数字分身。由你唤醒，由你养成，与你共同成长。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <a
            href="#pricing"
            className="inline-block rounded-lg px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_24px_rgba(108,92,231,0.4)]"
            style={{
              background: 'linear-gradient(135deg, #6C5CE7 0%, #00D2FF 100%)',
            }}
          >
            开始唤星
          </a>
        </motion.div>
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
