import { RefreshCw, MessageSquare, Brain, Clock } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const painPoints = [
  {
    icon: <RefreshCw className="h-7 w-7 text-star-purple" />,
    pain: 'AI 千人一面，每次都从零开始',
    solution: '全量记忆，永不遗忘',
  },
  {
    icon: <MessageSquare className="h-7 w-7 text-star-blue" />,
    pain: 'AI 只能聊天，说完就完了',
    solution: '帮你做事，帮你赚钱',
  },
  {
    icon: <Brain className="h-7 w-7 text-star-gold" />,
    pain: '人际关系复杂，记不住忘得快',
    solution: '完整社会关系图谱',
  },
  {
    icon: <Clock className="h-7 w-7 text-star-purple" />,
    pain: '信息过载，机会稍纵即逝',
    solution: '7×24 主动盯着，主动提醒',
  },
]

export default function PainPoints() {
  return (
    <section id="pain-points" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              你是不是也遇到了这些问题？
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            传统 AI 助手只是工具，唤星是你的超级大脑
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="group flex h-full flex-col rounded-xl border border-divider bg-space-panel p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,92,231,0.1)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-space-float">
                  {item.icon}
                </div>
                <p className="mb-4 text-sm font-medium text-text-primary leading-relaxed">
                  😩 {item.pain}
                </p>
                <div className="mt-auto border-t border-divider pt-4">
                  <p className="text-sm font-semibold text-star-purple">
                    ✦ {item.solution}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
