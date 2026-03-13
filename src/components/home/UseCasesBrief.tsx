import { Link } from 'react-router-dom'
import ScrollReveal from '../shared/ScrollReveal'

const useCases = [
  { icon: '📱', title: '自媒体赚钱', desc: '追踪热点、自动生成内容、多平台发布' },
  { icon: '💰', title: '投资理财', desc: '监控市场动态、分析财报、风险预警' },
  { icon: '🤝', title: '人脉管理', desc: '记住所有关系、提醒生日、维护人情' },
  { icon: '📊', title: '职场效率', desc: '写邮件报告、整理会议纪要、管项目' },
  { icon: '🚀', title: '创业决策', desc: '竞品分析、市场调研、商业计划' },
  { icon: '🤖', title: '日常生活', desc: '管理日程、提醒事项、记住所有偏好' },
]

export default function UseCasesBrief() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              你会让超级大脑做什么？
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            六大场景，覆盖工作与生活的方方面面
          </p>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.08}>
              <Link
                to="/scenes"
                className="group flex items-start gap-4 rounded-xl border border-divider bg-space-panel p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(108,92,231,0.1)]"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="mb-1 font-semibold text-text-primary group-hover:text-star-purple transition-colors">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-10 text-center">
            <Link
              to="/scenes"
              className="inline-block text-sm text-star-purple transition-colors hover:text-star-purple-hover"
            >
              查看全部场景详情 →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
