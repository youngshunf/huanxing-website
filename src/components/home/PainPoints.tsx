import { BotMessageSquare, CircleHelp, History, Workflow } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const painPoints = [
  {
    icon: <History className="h-6 w-6 text-star-purple" />,
    pain: '每个平台都要重新认识你',
    solution: '换一个 AI、应用或设备，又要重新交代背景、偏好和正在做的事。',
  },
  {
    icon: <BotMessageSquare className="h-6 w-6 text-star-blue" />,
    pain: 'AI 给了答案，执行仍然留给你',
    solution: '写完建议以后，你还要自己打开应用、搬运内容、推进流程。',
  },
  {
    icon: <Workflow className="h-6 w-6 text-star-purple" />,
    pain: '任务完成了，关系和经验没有留下',
    solution: '一次任务结束，联系人、工作背景和处理方法也跟着断掉。',
  },
  {
    icon: <CircleHelp className="h-6 w-6 text-star-blue" />,
    pain: 'AI 开始替你行动，责任却不够清晰',
    solution: '谁授权、对谁说了什么、什么时候需要你确认，必须始终说得清楚。',
  },
]

export default function PainPoints() {
  return (
    <section id="pain-points" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="mb-3 text-center text-sm font-semibold text-star-purple">我们解决什么问题</p>
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-text-primary md:text-5xl">
            AI 越来越强，为什么你还是越来越忙？
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            唤星解决的不是“再多一个 AI 入口”，而是让一个属于你的分身持续记住、持续负责、持续工作。
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((item, i) => (
            <ScrollReveal key={item.pain} delay={i * 0.1}>
              <article className="flex h-full flex-col border-t border-divider py-6 lg:py-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-star-purple/10">
                  {item.icon}
                </div>
                <h3 className="mb-3 text-lg font-semibold leading-snug text-text-primary">{item.pain}</h3>
                <p className="mt-auto text-base leading-7 text-text-secondary">{item.solution}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
