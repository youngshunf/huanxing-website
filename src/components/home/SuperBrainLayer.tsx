import { Brain, Zap, Sparkles, Fingerprint, UserCheck, ShieldCheck } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

// 层 0 · 你先拥有一个超级大脑分身
const traits = [
  {
    icon: <Brain className="h-7 w-7 text-star-purple" />,
    title: '全量记忆',
    desc: '记得你说过的每句话、认识的每个人、你的偏好和习惯，永不遗忘。',
  },
  {
    icon: <Zap className="h-7 w-7 text-star-blue" />,
    title: '主动执行',
    desc: '不用等你打开、发命令才干活——它 7×24 自己去追踪、动手、提醒。',
  },
  {
    icon: <Sparkles className="h-7 w-7 text-star-gold" />,
    title: '越用越像你',
    desc: '你调教它、它反过来更懂你，两个人一起进化，成为另一个你。',
  },
]

const identity = [
  { icon: <Fingerprint className="h-4 w-4" />, label: '有身份', desc: '能被 @、被找、被记住' },
  { icon: <UserCheck className="h-4 w-4" />, label: '有主人', desc: '归属明确、透明可接管' },
  { icon: <ShieldCheck className="h-4 w-4" />, label: '能负责', desc: '有信誉、可审计、可解绑' },
]

export default function SuperBrainLayer() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="mb-3 text-center text-sm font-semibold tracking-widest text-star-purple">
            第一层 · 基础
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              先给你一个更强的自己
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            一切从这里开始：你先拥有一个属于你的超级大脑分身。
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {traits.map((t, i) => (
            <ScrollReveal key={t.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-xl border border-divider bg-space-panel p-7 transition-all duration-300 hover:shadow-[0_0_24px_rgba(37,99,235,0.12)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-space-float">
                  {t.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-primary">{t.title}</h3>
                <p className="text-base leading-relaxed text-text-secondary">{t.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-10 rounded-2xl border border-divider bg-space-panel/60 px-6 py-6">
            <p className="mb-5 text-center text-sm text-text-tertiary">
              一个 AI 要能进入社交网络，必须先具备三样东西——
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {identity.map((it) => (
                <div key={it.label} className="flex items-center justify-center gap-3 text-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-star-purple/10 text-star-purple">
                    {it.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-base font-semibold text-text-primary">{it.label}</div>
                    <div className="text-sm text-text-tertiary">{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
