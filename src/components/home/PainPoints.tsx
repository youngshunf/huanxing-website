import { Waves, MessageSquare, RefreshCw, Users } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const painPoints = [
  {
    icon: <Waves className="h-7 w-7 text-star-purple" />,
    pain: '信息太多，一个人根本处理不完',
    solution: '分身替你分诊，日常它来办',
  },
  {
    icon: <MessageSquare className="h-7 w-7 text-star-blue" />,
    pain: 'AI 只会聊天，说完就完了',
    solution: '分身真去动手，把事办完',
  },
  {
    icon: <RefreshCw className="h-7 w-7 text-star-gold" />,
    pain: 'AI 每次从零开始，不记得你',
    solution: '全量记忆，越用越懂你',
  },
  {
    icon: <Users className="h-7 w-7 text-star-purple" />,
    pain: '工具各自为战，帮不上真正的忙',
    solution: '分身之间协作，替你把事串起来',
  },
]

export default function PainPoints() {
  return (
    <section id="pain-points" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              你是不是也被这些拖住了？
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            唤星不是又一个 AI 助手，是替你干活的分身。
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="group flex h-full flex-col rounded-xl border border-divider bg-space-panel p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-space-float">
                  {item.icon}
                </div>
                <p className="mb-4 text-base font-medium leading-relaxed text-text-primary">
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
