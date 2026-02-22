import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const levels = [
  {
    name: '星尘',
    color: '#6E7681',
    glowColor: 'rgba(110, 118, 129, 0.3)',
    description: '初始阶段，分身刚刚苏醒',
    size: 'h-12 w-12 md:h-16 md:w-16',
  },
  {
    name: '星芒',
    color: '#6C5CE7',
    glowColor: 'rgba(108, 92, 231, 0.4)',
    description: '开始记住你的偏好和习惯',
    size: 'h-14 w-14 md:h-20 md:w-20',
  },
  {
    name: '星辰',
    color: '#00D2FF',
    glowColor: 'rgba(0, 210, 255, 0.4)',
    description: '深度理解你，主动为你工作',
    size: 'h-16 w-16 md:h-24 md:w-24',
  },
  {
    name: '星耀',
    color: '#FFD93D',
    glowColor: 'rgba(255, 217, 61, 0.5)',
    description: '完全体，另一个你',
    size: 'h-20 w-20 md:h-28 md:w-28',
  },
]

export default function GrowthSystem() {
  return (
    <section id="growth" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              养成进化
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            你的分身会不断成长，从暗淡到闪耀
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {levels.map((level, i) => (
            <ScrollReveal key={level.name} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 flex items-center justify-center">
                  <motion.div
                    className={`${level.size} rounded-full`}
                    style={{
                      background: `radial-gradient(circle, ${level.color} 0%, transparent 70%)`,
                      boxShadow: `0 0 30px ${level.glowColor}, 0 0 60px ${level.glowColor}`,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3,
                    }}
                  />
                  <div
                    className="absolute h-3 w-3 rounded-full md:h-4 md:w-4"
                    style={{
                      backgroundColor: level.color,
                      boxShadow: `0 0 10px ${level.color}`,
                    }}
                  />
                </div>
                <h3
                  className="mb-2 text-lg font-semibold md:text-xl"
                  style={{ color: level.color }}
                >
                  {level.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {level.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Progress line connecting levels - desktop only */}
        <ScrollReveal delay={0.3}>
          <div className="mx-auto mt-12 hidden max-w-3xl items-center md:flex">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-[#6E7681] via-[#6C5CE7] via-50% to-[#00D2FF]" />
            <div className="h-0.5 flex-1 bg-gradient-to-r from-[#00D2FF] to-[#FFD93D]" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
