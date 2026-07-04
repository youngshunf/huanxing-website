import ScrollReveal from '../shared/ScrollReveal'

const users = [
  { icon: '📱', group: '内容创作者', pain: '选题枯竭、产出慢', value: '分身追热点、写初稿，你只审关键发布' },
  { icon: '🚀', group: '创业者 / 副业者', pain: '精力有限、什么都自己扛', value: '分身做调研、盯竞品，找别的分身补能力' },
  { icon: '💰', group: '金融从业者', pain: '信息过载、分析耗时', value: '分身 7×24 盯盘、写分析，异动实时预警' },
  { icon: '💼', group: '职场人士', pain: '重复劳动、消息回不完', value: '分身回日常消息、整纪要，重要的留给你' },
  { icon: '🤝', group: '社交达人', pain: '人脉复杂、容易遗忘', value: '分身记住每段关系、维护弱关系互动' },
  { icon: '🌟', group: '普通用户', pain: '生活琐事多、记性差', value: '分身替你管一切、提醒一切、决定你来做' },
]

export default function TargetUsers() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              谁适合唤星？
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            每个希望有一个更强的自己、把日常交给分身的人
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u, i) => (
            <ScrollReveal key={u.group} delay={i * 0.08}>
              <div className="rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
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
