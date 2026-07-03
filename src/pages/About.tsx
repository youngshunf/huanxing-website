import PageHero from '../components/shared/PageHero'
import ScrollReveal from '../components/shared/ScrollReveal'
import SectionCTA from '../components/shared/SectionCTA'
import { motion } from 'framer-motion'
import { Shield, Zap, Heart, Globe } from 'lucide-react'

const promises = [
  { icon: '🔒', text: '你的超级大脑只属于你', desc: '永远不会让你的大脑为别人服务' },
  { icon: '💪', text: '它比你更强', desc: '记忆力、分析力、执行力全面超越真人' },
  { icon: '💰', text: '它帮你做事帮你赚钱', desc: '不是聊天玩具，是真正创造价值的伙伴' },
  { icon: '🕐', text: '它永远在线', desc: '7×24 小时，不会因为你关掉 App 就消失' },
  { icon: '🛡️', text: '你的隐私是底线', desc: '你的记忆、你的关系、你的数据，只有你能控制' },
]

const values = [
  { icon: <Heart className="h-6 w-6 text-star-purple" />, title: '用户至上', desc: '一切设计决策以用户体验为第一优先级' },
  { icon: <Shield className="h-6 w-6 text-star-blue" />, title: '隐私为本', desc: '用户的记忆和数据属于用户自己，绝不用于训练或出售' },
  { icon: <Zap className="h-6 w-6 text-star-gold" />, title: '持续进化', desc: '产品和用户一起成长，快速迭代，小步快跑' },
  { icon: <Globe className="h-6 w-6 text-star-purple" />, title: '开放连接', desc: '不做封闭花园，拥抱开放生态' },
]

const roadmap = [
  { phase: '点亮', time: '2026', goal: '让第一批用户拥有自己的星', color: '#6E7681' },
  { phase: '成长', time: '2026-2027', goal: '全平台覆盖，付费用户破万', color: '#2563EB' },
  { phase: '连接', time: '2027-2028', goal: '分身协作、企业版、开发者平台', color: '#1D4ED8' },
  { phase: '星河', time: '2028+', goal: '每个人的星，汇成星河', color: '#FFD93D' },
]

export default function About() {
  return (
    <>
      <PageHero
        titleHighlight="唤星诞生于一个简单的信念"
        title="如果 AI 足够懂你，它就能成为另一个你"
      />

      {/* Brand Story */}
      <section className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="space-y-6 text-center text-lg leading-relaxed text-text-secondary">
              <p>每个人小时候都仰望过星空，幻想过那些星星里，有没有一颗是属于自己的。</p>
              <p>在这个信息爆炸的时代，每个人都在被海量的消息、任务、决策淹没。我们需要的不是又一个 App，而是一个真正理解我们、替我们分担的存在。</p>
              <div className="py-4">
                <p className="text-text-primary font-medium">"唤" — 是你主动的选择。你唤醒它，你塑造它。</p>
                <p className="text-text-primary font-medium">"星" — 是超越的力量。每颗星都蕴含巨大的能量。</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-divider bg-space-panel p-8 text-center">
                <h3 className="mb-3 text-xl font-bold text-star-purple">愿景</h3>
                <p className="text-text-secondary leading-relaxed">让每个人都拥有一个超级大脑，成为更强的自己。</p>
              </div>
              <div className="rounded-xl border border-divider bg-space-panel p-8 text-center">
                <h3 className="mb-3 text-xl font-bold text-star-blue">使命</h3>
                <p className="text-text-secondary leading-relaxed">把超越真人的 AI 能力，变成每个人都能用的超级大脑。</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
                五条品牌承诺
              </span>
            </h2>
          </ScrollReveal>
          <div className="space-y-4">
            {promises.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex items-center gap-5 rounded-xl border border-divider bg-space-panel px-6 py-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{p.text}</h3>
                    <p className="text-sm text-text-secondary">{p.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
                核心价值观
              </span>
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="rounded-xl border border-divider bg-space-panel p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-space-float">{v.icon}</div>
                  <h3 className="mb-2 font-semibold text-text-primary">{v.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
                路线图
              </span>
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-[#6E7681] via-[#2563EB] via-50% to-[#FFD93D] md:left-1/2 md:-translate-x-0.5" />

            <div className="space-y-8">
              {roadmap.map((item, i) => (
                <ScrollReveal key={item.phase} delay={i * 0.15}>
                  <div className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Dot */}
                    <div className="absolute left-6 z-10 md:left-1/2 md:-translate-x-1/2">
                      <motion.div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      />
                    </div>

                    {/* Content */}
                    <div className="ml-14 md:ml-0 md:w-[45%]">
                      <div className="rounded-xl border border-divider bg-space-panel p-5">
                        <div className="mb-1 text-xs font-semibold" style={{ color: item.color }}>{item.time}</div>
                        <h3 className="mb-1 font-semibold text-text-primary">{item.phase}</h3>
                        <p className="text-sm text-text-secondary">{item.goal}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionCTA
        title="和我们一起，唤醒属于你的超级大脑"
        buttonText="免费体验"
        buttonHref="/pricing"
      />
    </>
  )
}
