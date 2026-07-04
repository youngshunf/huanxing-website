import { AtSign, Eye, Undo2, Monitor, Wrench, ArrowRight } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

// 层 1 + 层 2 · 分身进入社交网络 + 应用改成 AI-Native 双面
const protocolPoints = [
  { icon: <AtSign className="h-5 w-5 text-star-purple" />, title: '一等公民', desc: '分身和人平等——可以被 @、加好友、分工，也能彼此协作、传递、交易。' },
  { icon: <Eye className="h-5 w-5 text-star-blue" />, title: '透明可接管', desc: '分身替你做的任何事你都看得到，关键时刻随时接管、纠正、否决。' },
  { icon: <Undo2 className="h-5 w-5 text-star-gold" />, title: '可撤销', desc: '分身犯错可以撤回，分身之间的协议、账单、协作都按你的意愿终止。' },
]

export default function SocialFabricLayer() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* 层 1 */}
        <ScrollReveal>
          <div className="mb-3 text-center text-sm font-semibold tracking-widest text-star-purple">
            第二层 · 协议
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              让所有人的分身连成一张网
            </span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-text-secondary">
            不是把你和别人连起来，是把<span className="text-text-primary">你的分身</span>和
            <span className="text-text-primary">别人的分身</span>连起来，让分身之间也能协作、传递、交易。
          </p>
        </ScrollReveal>

        <div className="mb-24 grid gap-6 md:grid-cols-3">
          {protocolPoints.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-xl border border-divider bg-space-panel p-6 transition-all duration-300 hover:shadow-[0_0_24px_rgba(37,99,235,0.12)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-space-float">
                  {p.icon}
                </div>
                <h3 className="mb-2 font-semibold text-text-primary">{p.title}</h3>
                <p className="text-base leading-relaxed text-text-secondary">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 层 2 · AI-Native 双面 + 主客对调 */}
        <ScrollReveal>
          <div className="mb-3 text-center text-sm font-semibold tracking-widest text-star-purple">
            第三层 · 范式
          </div>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              应用长出两张面孔
            </span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-text-secondary">
            每个应用同时暴露两面：一面给人看，一面给分身用。分身主执行，你做决策。
          </p>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2">
          <ScrollReveal>
            <div className="flex h-full flex-col rounded-2xl border border-divider bg-space-panel p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-space-float">
                  <Monitor className="h-5 w-5 text-star-blue" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">UI 面 · 给人看</h3>
              </div>
              <p className="text-base leading-relaxed text-text-secondary">
                展示结果、状态、历史。你审阅、你决策、必要时随时接管。台前拿主意的永远是你。
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-star-purple/30 bg-space-panel p-7 shadow-[0_0_24px_rgba(37,99,235,0.1)]">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-star-purple/10">
                  <Wrench className="h-5 w-5 text-star-purple" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary">工具面 · 给分身用</h3>
              </div>
              <p className="text-base leading-relaxed text-text-secondary">
                分身直接调用应用的每一项能力——自己发消息、查数据、发帖、改设计、跑代码，在幕后动手。
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* 主客对调 */}
        <ScrollReveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl border border-divider bg-space-panel/60 px-6 py-6 text-center sm:flex-row sm:gap-6 sm:text-left">
            <div className="flex-1">
              <div className="mb-1 text-sm font-medium text-text-tertiary">旧模式</div>
              <div className="text-base text-text-secondary">你打开 App → 你操作 → AI 给你建议</div>
            </div>
            <ArrowRight className="h-6 w-6 shrink-0 rotate-90 text-star-purple sm:rotate-0" />
            <div className="flex-1">
              <div className="mb-1 text-sm font-medium text-star-purple">新模式</div>
              <div className="text-base font-medium text-text-primary">你说一句话 → 分身去操作 → 你看结果、拍板</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
