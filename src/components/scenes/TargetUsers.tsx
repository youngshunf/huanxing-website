import ScrollReveal from '../shared/ScrollReveal'

const users = [
  { icon: '📱', group: '内容创作者', pain: '选题枯竭、产出慢', value: '追踪热点、批量生成、数据优化' },
  { icon: '🚀', group: '创业者/副业者', pain: '精力有限、决策靠直觉', value: '市场分析、竞品监控、自动化运营' },
  { icon: '💰', group: '金融从业者', pain: '信息过载、分析耗时', value: '实时监控、深度分析、风险预警' },
  { icon: '💼', group: '职场人士', pain: '重复劳动、效率低下', value: '写邮件、做PPT、管日程' },
  { icon: '🤝', group: '社交达人', pain: '人脉复杂、容易遗忘', value: '记住所有关系、提醒重要日期' },
  { icon: '🌟', group: '普通用户', pain: '生活琐事多、记性差', value: '管理一切、提醒一切、分析一切' },
]

export default function TargetUsers() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              谁需要超级大脑？
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            每个希望变得更强的人
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u, i) => (
            <ScrollReveal key={u.group} delay={i * 0.08}>
              <div className="rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,92,231,0.1)]">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">{u.icon}</span>
                  <h3 className="font-semibold text-text-primary">{u.group}</h3>
                </div>
                <p className="mb-2 text-sm text-text-tertiary">😩 {u.pain}</p>
                <p className="text-sm text-star-purple">✦ {u.value}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
