import { Check, Minus } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

// 差异化 · 和「给应用加个 AI 助手」有什么不同
const rows = [
  { dim: '记忆', others: '有限、会话级，说完就忘', astra: '全量记忆，永不遗忘' },
  { dim: '身份', others: '匿名对话框，没有身份', astra: '人和分身都是一等成员' },
  { dim: '主动性', others: '被动回答、被动推流', astra: '分身 7×24 主动执行' },
  { dim: '协作', others: '一个人对着一个模型', astra: '分身之间跨主人协作、交易' },
  { dim: '主客关系', others: '人主动、AI 辅助', astra: '分身主执行、人做决策' },
]

export default function Differentiation() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              和「给应用加个 AI 助手」有什么不同
            </span>
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-text-secondary">
            大模型的能力会趋同，我们竞争的不是「谁更聪明」，而是「谁更懂你、能替你办事」。
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-divider bg-space-panel">
            {/* 表头 */}
            <div className="grid grid-cols-[80px_1fr_1fr] items-center border-b border-divider bg-space-float/60 text-sm font-semibold sm:grid-cols-[120px_1fr_1fr]">
              <div className="px-4 py-3 text-text-tertiary" />
              <div className="px-4 py-3 text-text-tertiary">传统 AI 助手</div>
              <div className="px-4 py-3 text-star-purple">唤星</div>
            </div>
            {rows.map((r) => (
              <div
                key={r.dim}
                className="grid grid-cols-[80px_1fr_1fr] items-stretch border-b border-divider last:border-b-0 sm:grid-cols-[120px_1fr_1fr]"
              >
                <div className="flex items-center px-4 py-4 text-sm font-semibold text-text-primary">
                  {r.dim}
                </div>
                <div className="flex items-start gap-2 px-4 py-4 text-sm text-text-tertiary">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" />
                  <span>{r.others}</span>
                </div>
                <div className="flex items-start gap-2 border-l border-divider px-4 py-4 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-star-purple" />
                  <span className="font-medium text-text-primary">{r.astra}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <blockquote className="mx-auto mt-10 max-w-2xl border-l-4 border-star-purple bg-star-purple/5 px-6 py-4 text-center text-base leading-relaxed text-text-secondary">
            微信让你和人连起来；唤星让<span className="font-semibold text-text-primary">你的分身</span>
            和<span className="font-semibold text-text-primary">别人的分身</span>连起来，替你们把事情办了。
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  )
}
