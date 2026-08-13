import { Check, Cloud, KeyRound, Laptop, Share2 } from 'lucide-react'

import ScrollReveal from '../shared/ScrollReveal'

const advantages = [
  ['长期属于你', '分身有独立身份和明确主人，不是某个任务里的临时角色。'],
  ['跨设备与应用连续工作', '身份、记忆、授权和工作归属不依附于某一台设备或某一个应用。'],
  ['代表你，但不越过你', '对外通信和重要操作对你透明；涉及金钱、承诺和关键决定时，由你确认。'],
  ['数据权威在你手中', '产物默认留在生成设备，是否同步、分享以及分享给谁，都由你主动决定。'],
] as const

const flow = [
  { icon: Laptop, label: '本地生成', detail: '任务在你的设备执行' },
  { icon: Share2, label: '主动操作', detail: '你选择同步或分享' },
  { icon: KeyRound, label: '客户端加密', detail: '原件不以明文上云' },
  { icon: Cloud, label: '密文中转', detail: '云端仅协调同步授权' },
] as const

export default function PrivacyFlow() {
  return (
    <section id="privacy" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <ScrollReveal>
          <p className="mb-3 text-sm font-semibold text-star-purple">为什么是唤星</p>
          <h2 className="mb-8 text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
            你拥有的是分身，<br className="hidden md:block" />不是平台借给你的会话
          </h2>
          <div className="space-y-6">
            {advantages.map(([title, desc]) => (
              <div key={title} className="flex gap-4">
                <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-star-purple" />
                <div>
                  <h3 className="mb-1 font-semibold text-text-primary">{title}</h3>
                  <p className="text-base leading-7 text-text-secondary">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="overflow-hidden rounded-2xl border border-divider bg-space-panel">
            <div className="border-b border-divider px-6 py-5 md:px-8">
              <p className="mb-2 text-xs font-semibold text-star-purple">目标加密流程</p>
              <p className="font-semibold text-text-primary">产物如何离开你的设备</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">默认不离开。只有你主动同步或分享，才进入传输流程。</p>
            </div>
            <ol className="divide-y divide-divider px-6 md:px-8">
              {flow.map((step, index) => {
                const Icon = step.icon
                return (
                  <li key={step.label} className="grid grid-cols-[42px_1fr_auto] items-center gap-4 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-star-purple/10 text-star-purple">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{step.label}</p>
                      <p className="mt-1 text-sm text-text-secondary">{step.detail}</p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-text-tertiary">0{index + 1}</span>
                  </li>
                )
              })}
            </ol>
            <div className="bg-star-purple/5 px-6 py-5 text-sm leading-6 text-text-secondary md:px-8">
              客户端端到端加密正在建设。当前版本采用私有存储、服务端加密、访问控制与短期签名链接；
              完整加密链路上线前，我们不会宣称云端无法解密。
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
