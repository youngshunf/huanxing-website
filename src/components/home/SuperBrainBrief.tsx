import { Brain, BarChart3, Zap, Users, BookOpen, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../shared/ScrollReveal'

const abilities = [
  { icon: <Brain className="h-6 w-6" />, title: '记忆力', desc: '记住你说过的每一句话、每一个人', color: 'text-star-purple' },
  { icon: <BarChart3 className="h-6 w-6" />, title: '分析力', desc: '深度分析数据，给出决策建议', color: 'text-star-blue' },
  { icon: <Zap className="h-6 w-6" />, title: '执行力', desc: '同时处理多个任务，自动运营', color: 'text-star-gold' },
  { icon: <Users className="h-6 w-6" />, title: '社交力', desc: '记住所有人际关系，维护社交网络', color: 'text-star-purple' },
  { icon: <BookOpen className="h-6 w-6" />, title: '学习力', desc: '持续学习你的偏好，越用越懂你', color: 'text-star-blue' },
  { icon: <Clock className="h-6 w-6" />, title: '时间力', desc: '7×24 不休息，不错过任何机会', color: 'text-star-gold' },
]

export default function SuperBrainBrief() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              超级大脑，六大核心能力
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            不是千人一面的聊天助手，是全面超越真人的超级大脑
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {abilities.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <div className="flex items-start gap-4 rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
                <div className={`mt-0.5 ${item.color}`}>{item.icon}</div>
                <div>
                  <h3 className="mb-1 font-semibold text-text-primary">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-10 text-center">
            <Link
              to="/product"
              className="inline-block text-sm text-star-purple transition-colors hover:text-star-purple-hover"
            >
              详细了解超级大脑 →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
