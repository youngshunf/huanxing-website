import { AppWindow, Network, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import ScrollReveal from '../shared/ScrollReveal'

const offerings = [
  {
    icon: UserRound,
    title: '你的个人 AI 分身',
    desc: '有长期身份和永久记忆，了解你的目标、习惯、关系与工作背景。换设备、模型或应用，也不用从零开始。',
  },
  {
    icon: AppWindow,
    title: '分身可以使用的 AI 应用',
    desc: '调研、知识整理、演示文稿、内容生产、设计与专业分析等能力，由分身直接调用并交付成果。',
  },
  {
    icon: Network,
    title: '多个分身组成的协作网络',
    desc: '属于你的多个分身可以分工完成复杂任务；跨主人协作按主人可见、可接管、可追责的原则逐步开放。',
  },
] as const

export default function Offerings() {
  return (
    <section id="offerings" className="relative z-10 bg-space-panel/35 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-star-purple">唤星提供什么</p>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
              从一个分身，到一套持续工作的数字员工系统
            </h2>
          </div>
        </ScrollReveal>

        <div className="divide-y divide-divider border-y border-divider">
          {offerings.map((item, index) => {
            const Icon = item.icon
            return (
              <ScrollReveal key={item.title} delay={index * 0.08}>
                <article className="grid gap-5 py-8 md:grid-cols-[64px_240px_1fr] md:items-start md:gap-8 md:py-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-star-purple/10 text-star-purple">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
                  <p className="max-w-2xl text-base leading-7 text-text-secondary">{item.desc}</p>
                </article>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal>
          <div className="mt-10">
            <Link
              to="/product"
              className="inline-flex items-center rounded-lg bg-star-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-star-purple-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-star-purple focus-visible:ring-offset-2 focus-visible:ring-offset-space-black"
            >
              查看产品怎么使用
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
