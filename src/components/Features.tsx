import { Sparkles, Wifi, Zap } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-star-purple" />,
    title: '养成感',
    description: '你的分身由你塑造，记住你的偏好、习惯、风格，越用越像"你"。',
  },
  {
    icon: <Wifi className="h-8 w-8 text-star-blue" />,
    title: '全时在线',
    description: '7×24 小时后台运行，不错过任何重要信息，主动为你工作。',
  },
  {
    icon: <Zap className="h-8 w-8 text-star-gold" />,
    title: '无限可能',
    description: '不限于聊天，能连接你的工具、管理你的信息、执行你的任务。',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              核心价值
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            不是千人一面的助手，是独一无二的"你的分身"
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.15}>
              <div className="group min-w-0 rounded-xl border border-divider bg-space-panel px-6 py-8 transition-all duration-300 hover:border-border-hover hover:shadow-[0_0_20px_rgba(108,92,231,0.1)]">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-space-float">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="break-words leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
