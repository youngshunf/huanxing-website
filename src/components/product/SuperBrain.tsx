import { Brain, BarChart3, Zap, Users, BookOpen, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '../shared/ScrollReveal'

const abilities = [
  { icon: <Brain className="h-8 w-8" />, title: '记忆力', desc: '记住你说过的每一句话、每一个人、每一件事', vs: '真人会忘 → 唤星永不遗忘', color: 'text-star-purple', glow: 'rgba(37, 99, 235,0.2)' },
  { icon: <BarChart3 className="h-8 w-8" />, title: '分析力', desc: '深度分析数据、趋势、风险，给出决策建议', vs: '真人靠直觉 → 唤星靠数据', color: 'text-star-blue', glow: 'rgba(29, 78, 216,0.2)' },
  { icon: <Zap className="h-8 w-8" />, title: '执行力', desc: '同时处理多个任务，自动运营、自动发布', vs: '一次做一件事 → 同时处理多个', color: 'text-star-gold', glow: 'rgba(255,217,61,0.2)' },
  { icon: <Users className="h-8 w-8" />, title: '社交力', desc: '记住所有人际关系，维护社交网络', vs: '记不住人 → 帮你维护所有关系', color: 'text-star-purple', glow: 'rgba(37, 99, 235,0.2)' },
  { icon: <BookOpen className="h-8 w-8" />, title: '学习力', desc: '持续学习你的偏好和习惯，越用越懂你', vs: '需要反复交代 → 越用越懂你', color: 'text-star-blue', glow: 'rgba(29, 78, 216,0.2)' },
  { icon: <Clock className="h-8 w-8" />, title: '时间力', desc: '7×24 不休息，不错过任何机会', vs: '要睡觉 → 永远在线', color: 'text-star-gold', glow: 'rgba(255,217,61,0.2)' },
]

export default function SuperBrain() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              六大核心能力
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            全面超越真人的超级大脑
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {abilities.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <motion.div
                className="group flex h-full flex-col rounded-xl border border-divider bg-space-panel p-6 transition-all duration-300"
                whileHover={{ boxShadow: `0 0 30px ${item.glow}` }}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-space-float ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">{item.title}</h3>
                <p className="mb-4 flex-1 text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                <div className="border-t border-divider pt-3">
                  <p className="text-xs text-text-tertiary">{item.vs}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
