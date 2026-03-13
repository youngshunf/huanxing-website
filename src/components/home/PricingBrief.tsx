import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'

const plans = [
  { name: '微星', price: '免费', color: '#6E7681', features: ['每月 100 积分', '基础模型', '7 天记忆'] },
  { name: '明星', price: '¥128/月', color: '#6C5CE7', features: ['每月 1000 积分', '基础+进阶模型', '永久记忆'] },
  { name: '恒星', price: '¥238/月', color: '#00D2FF', features: ['每月 5000 积分', '全部模型', '永久记忆', '云备份'], recommended: true },
  { name: '超新星', price: '¥598/月', color: '#FFD93D', features: ['每月 50000 积分', '全部+专属模型', '永久记忆', '专属客服'] },
]

export default function PricingBrief() {
  return (
    <section className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            <span className="bg-gradient-to-r from-star-purple to-star-blue bg-clip-text text-transparent">
              选择你的星
            </span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            每个人都值得一颗星，从免费开始体验
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-xl p-6 ${
                  plan.recommended
                    ? 'border-2 border-star-blue shadow-[0_0_20px_rgba(0,210,255,0.15)]'
                    : 'border border-divider'
                } bg-space-panel transition-all duration-300 hover:shadow-[0_0_24px_rgba(108,92,231,0.15)]`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-star-purple to-star-blue px-4 py-1 text-xs font-semibold text-white">
                    推荐
                  </div>
                )}
                <h3 className="mb-1 text-lg font-semibold" style={{ color: plan.color }}>{plan.name}</h3>
                <p className="mb-4 text-2xl font-bold text-text-primary">{plan.price}</p>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="h-4 w-4 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-10 text-center">
            <Link
              to="/pricing"
              className="inline-block text-sm text-star-purple transition-colors hover:text-star-purple-hover"
            >
              查看详细定价方案 →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
