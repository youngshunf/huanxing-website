import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import ScrollReveal from '../shared/ScrollReveal'
import { pricingPlans } from '../../data/pricingPlans'

export default function PricingBrief() {
  return (
    <section id="plans" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-text-primary md:text-5xl">
            记住你，是分身的基础，不是收费开关
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-text-secondary">
            永久记忆向所有用户免费开放。付费购买的是更高资源额度、更多分身、云端常驻设备与专业能力。
          </p>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {pricingPlans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-xl p-6 ${
                  plan.recommended
                    ? 'border-2 border-star-blue shadow-[0_0_20px_rgba(29, 78, 216,0.15)]'
                    : 'border border-divider'
                } bg-space-panel transition-all duration-300 hover:shadow-[0_0_24px_rgba(37, 99, 235,0.15)]`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-star-purple px-4 py-1 text-xs font-semibold text-white">
                    推荐
                  </div>
                )}
                <h3 className="mb-1 text-lg font-semibold" style={{ color: plan.color }}>{plan.display_name}</h3>
                <p className="mb-4 text-2xl font-bold text-text-primary">
                  {plan.monthly_price === 0 ? '免费' : `¥${plan.monthly_price}/月`}
                </p>
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
              查看全部套餐 →
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
