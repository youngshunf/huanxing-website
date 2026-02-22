import { Check } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const plans = [
  {
    name: '星尘',
    price: '免费',
    period: '',
    color: '#6E7681',
    recommended: false,
    features: ['每日 20 次对话', '基础记忆（7 天）', '单设备使用', '基础分身能力'],
  },
  {
    name: '星芒',
    price: '¥29',
    period: '/月',
    color: '#6C5CE7',
    recommended: true,
    features: ['每日 200 次对话', '长期记忆', '多设备同步', '分身个性化', '优先响应'],
  },
  {
    name: '星辰',
    price: '¥79',
    period: '/月',
    color: '#00D2FF',
    recommended: false,
    features: ['无限对话', '完整记忆', '工具连接', '优先响应', '高级分身能力'],
  },
  {
    name: '星耀',
    price: '¥199',
    period: '/月',
    color: '#FFD93D',
    recommended: false,
    features: ['一切无限', '专属模型', 'API 接口', '多分身支持', '专属客服'],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative z-10 px-4 py-24 sm:px-6 md:px-8 lg:px-12 md:py-32">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full min-w-0 flex-col rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_24px_rgba(108,92,231,0.15)] ${
                  plan.recommended
                    ? 'bg-space-panel'
                    : 'border border-divider bg-space-panel'
                }`}
                style={
                  plan.recommended
                    ? {
                        background: 'linear-gradient(#161B22, #161B22) padding-box, linear-gradient(135deg, #6C5CE7, #00D2FF) border-box',
                        border: '2px solid transparent',
                      }
                    : undefined
                }
              >
                {plan.recommended && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #6C5CE7, #00D2FF)' }}
                  >
                    推荐
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="mb-1 text-lg font-semibold"
                    style={{ color: plan.color }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="ml-1 text-text-secondary">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: plan.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    plan.recommended
                      ? 'text-white hover:brightness-110 hover:shadow-[0_0_16px_rgba(108,92,231,0.4)]'
                      : 'border border-border-default text-text-primary hover:border-border-hover hover:bg-space-float'
                  }`}
                  style={
                    plan.recommended
                      ? { background: 'linear-gradient(135deg, #6C5CE7, #00D2FF)' }
                      : undefined
                  }
                >
                  {plan.price === '免费' ? '免费开始' : '立即订阅'}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
