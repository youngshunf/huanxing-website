import PageHero from '../components/shared/PageHero'
import ScrollReveal from '../components/shared/ScrollReveal'
import SectionCTA from '../components/shared/SectionCTA'
import { motion } from 'framer-motion'
import { Shield, Zap, Heart, Globe } from 'lucide-react'

const promises = [
  { icon: '🌟', text: '你的星只属于你', desc: '永远不会让你的分身为别人服务' },
  { icon: '🧠', text: '它会越来越懂你', desc: '每一次对话，都在让它更了解你' },
  { icon: '🕐', text: '它永远在线', desc: '7×24 小时，不会因为你关掉 App 就消失' },
  { icon: '🛡️', text: '你的隐私是底线', desc: '本地优先，你的记忆和数据只有你能控制' },
  { icon: '✋', text: '分身干活，你做主', desc: '它替你做事，但你永远有最终决策权' },
]

const values = [
  { icon: <Heart className="h-6 w-6 text-star-purple" />, title: '用户至上', desc: '一切设计以用户体验为第一优先级，尊重你的时间，不做无意义的功能堆砌' },
  { icon: <Shield className="h-6 w-6 text-star-blue" />, title: '隐私为本', desc: '本地优先，透明可控，绝不将你的数据用于训练或出售' },
  { icon: <Zap className="h-6 w-6 text-star-gold" />, title: '持续进化', desc: '产品和用户一起成长，快速迭代，小步快跑' },
  { icon: <Globe className="h-6 w-6 text-star-purple" />, title: '开放连接', desc: '不做封闭花园，拥抱开放生态，让分身能力不断扩展' },
]

const roadmap = [
  { phase: '点亮', time: '2026', goal: '让第一批用户拥有自己的分身', color: '#6E7681' },
  { phase: '成长', time: '2026-2027', goal: '三面同底并行推进，分身进入日常', color: '#2563EB' },
  { phase: '连接', time: '2027-2028', goal: '分身之间协作、交易，长出分身网络', color: '#1D4ED8' },
  { phase: '星河', time: '2028+', goal: '每个人的星，汇成下一代数字生活的入口', color: '#FFD93D' },
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
              <p>每个人小时候都仰望过星空，幻想过其中一颗是属于自己的。</p>
              <p className="text-text-primary font-medium">唤星，就是帮你找到那颗星，点亮它。</p>
              <p>在这个信息爆炸的时代，我们不缺 App，缺的是一个真正懂我们、替我们分担的存在。我们相信 AI 不是工具，是人的延伸。</p>
              <div className="py-4">
                <p className="text-text-primary font-medium">「唤」——是你主动的选择。你唤醒它，你塑造它，你决定它成为什么样子。</p>
                <p className="text-text-primary font-medium">「星」——是无限的可能。每颗星都独一无二，就像每个人的分身都不一样。</p>
              </div>
              <p className="text-sm text-text-tertiary">
                英文名 <span className="font-semibold text-star-purple">Astra</span>——拉丁语「群星」。
                因为唤星是所有人的星，汇成的一张网。
              </p>
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
                <p className="text-text-secondary leading-relaxed">让每个人都有一个更强的自己，让分身网络成为下一代数字生活的入口。</p>
              </div>
              <div className="rounded-xl border border-divider bg-space-panel p-8 text-center">
                <h3 className="mb-3 text-xl font-bold text-star-blue">使命</h3>
                <p className="text-text-secondary leading-relaxed">让智能触手可及，让分身参与生活。不需要懂代码、不需要写提示词，像和朋友聊天一样，你的星就会越来越懂你。</p>
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
                我们对你的承诺
              </span>
            </h2>
          </ScrollReveal>
          <div className="space-y-4">
            {promises.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex items-center gap-5 rounded-xl border border-divider bg-space-panel px-6 py-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]">
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
                <div className="rounded-xl border border-divider bg-space-panel p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-space-float">{v.icon}</div>
                  <h3 className="mb-2 font-semibold text-text-primary">{v.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Philosophy */}
      <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="rounded-2xl border border-star-purple/20 bg-space-panel/60 px-8 py-10 text-center backdrop-blur-sm">
              <p className="mb-4 text-sm font-semibold tracking-widest text-star-purple">我们的竞争哲学</p>
              <p className="mb-6 text-2xl font-bold leading-snug text-text-primary md:text-3xl">
                我们不比谁更聪明，<br className="hidden sm:block" />只比谁更懂你。
              </p>
              <p className="text-base leading-relaxed text-text-secondary">
                大模型的能力会趋同，但对用户的理解不会。唤星的护城河不是技术，是每一个用户与自己分身之间建立的
                <span className="font-semibold text-text-primary">独特关系</span>，以及分身在社交网络中沉淀下来的
                <span className="font-semibold text-text-primary">关系资产</span>——它们无法被复制、无法被迁移。
              </p>
              <p className="mt-6 text-base font-medium text-star-purple">
                别人在做「更好的 AI」，我们在做「更懂你的 AI」和「能进入你生活的 AI」。
              </p>
            </div>
          </ScrollReveal>
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
        title="和我们一起，唤醒属于你的那颗星"
        buttonText="免费体验"
        buttonHref="/pricing"
      />
    </>
  )
}
