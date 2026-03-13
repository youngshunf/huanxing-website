import ScrollReveal from '../shared/ScrollReveal'

const templates = [
  { icon: '📱', name: '自媒体赚钱', role: '比你更会做内容的运营大脑', skills: '热点追踪、爆款生成、多平台发布、数据分析' },
  { icon: '💰', name: '搞副业', role: '比你更会赚钱的商业大脑', skills: '项目评估、市场调研、商业计划、营销策略' },
  { icon: '💼', name: '金融助手', role: '比你更会分析的投资大脑', skills: '财经解读、投资分析、风险预警、理财规划' },
  { icon: '📊', name: '日常办公', role: '比你更高效的工作大脑', skills: '邮件撰写、PPT大纲、数据分析、会议纪要' },
  { icon: '🤝', name: '人脉管家', role: '比你更周到的社交大脑', skills: '关系图谱、人情往来、日期提醒、社交建议' },
  { icon: '🤖', name: '全能助理', role: '比你更全面的生活大脑', skills: '日程管理、信息整理、生活建议、健康提醒' },
]

export default function Templates() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              开箱即用的 Agent 模板
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            选择一个模板，快速拥有专属超级大脑
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.08}>
              <div className="rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,92,231,0.1)]">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{t.name}</h3>
                    <p className="text-xs text-star-purple">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{t.skills}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
