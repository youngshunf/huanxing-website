import { Database, Calendar, UserCheck, Heart, GitBranch } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const memoryTypes = [
  { icon: <Database className="h-6 w-6 text-star-purple" />, name: '长期记忆', file: 'MEMORY.md', desc: '对用户的深度理解，持续积累，永不遗忘' },
  { icon: <Calendar className="h-6 w-6 text-star-blue" />, name: '每日记忆', file: 'memory/YYYY-MM-DD.md', desc: '按天记录对话要点和重要事件' },
  { icon: <UserCheck className="h-6 w-6 text-star-gold" />, name: '用户画像', file: 'USER.md', desc: '用户的基本信息、偏好、习惯、性格' },
  { icon: <Heart className="h-6 w-6 text-star-purple" />, name: '分身人设', file: 'SOUL.md', desc: '用户自定义的分身性格和说话风格' },
  { icon: <GitBranch className="h-6 w-6 text-star-blue" />, name: '社会关系', file: 'RELATIONS.md', desc: '用户的完整社会关系图谱' },
]

export default function MemorySystem() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="text-star-blue">
              全量记忆系统
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            五种记忆类型协同，构建对你的完整理解
          </p>
        </ScrollReveal>

        <div className="space-y-4">
          {memoryTypes.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 0.1}>
              <div className="flex items-center gap-5 rounded-xl border border-divider bg-space-panel px-6 py-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(37, 99, 235,0.1)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-space-float">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-text-primary">{item.name}</h3>
                    <code className="rounded bg-space-float px-2 py-0.5 text-xs text-text-tertiary">{item.file}</code>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-10 rounded-xl bg-star-blue/5 p-6 text-center">
            <p className="text-base font-semibold text-text-primary">
              永久记忆是每个用户的基础能力
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              无论使用免费版还是付费版，你与分身共同积累的记忆都会持续保留。付费套餐只扩展积分、云存储、分身数量和客服支持。
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
