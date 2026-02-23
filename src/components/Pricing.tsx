import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'
import { useAuthStore } from '../stores/useAuthStore'
import { useSubscriptionStore } from '../stores/useSubscriptionStore'
import { useThemeStore } from '../stores/useThemeStore'
import type { SubscriptionTier } from '../types'

// 未登录且接口失败时的兜底数据
const fallbackPlans = [
  { name: 'free', display_name: '微星', monthly_price: 0, color: '#6E7681', features: ['每月积分：100', '可用模型：基础模型', '记忆保存：7天', '客服支持：社区支持'] },
  { name: 'pro', display_name: '明星', monthly_price: 128, color: '#6C5CE7', features: ['每月积分：1000', '可用模型：基础+进阶模型', '记忆存储', '版本管理', '客服支持：邮件支持'] },
  { name: 'advanced', display_name: '恒星', monthly_price: 238, color: '#00D2FF', features: ['每月积分：5000', '可用模型：全部模型', '记忆存储', '版本管理', '文件备份', '云存储', '客服支持：优先支持'], recommended: true },
  { name: 'flagship', display_name: '超新星', monthly_price: 598, color: '#FFD93D', features: ['每月积分：50000', '可用模型：全部模型+专属部署', '记忆存储', '版本管理', '文件备份', '云存储', '专属模型通道', 'SLA 保障', '客服支持：专属客服'] },
]

const tierColorMap: Record<string, string> = {
  '微星': '#6E7681',
  '明星': '#6C5CE7',
  '恒星': '#00D2FF',
  '超新星': '#FFD93D',
}

// 推荐等级
const recommendedTier = '恒星'

/**
 * 将 features JSON 直接转为展示列表
 * 数据库存中文 key，前端直接展示，不做映射
 */
function tierToFeatures(features: Record<string, unknown> | null | undefined): string[] {
  if (!features) return []
  return Object.entries(features)
    .map(([key, value]) => {
      if (value === false) return null
      if (value === true) return key
      if (value === -1) return `${key}：无限`
      return `${key}：${value}`
    })
    .filter((s): s is string => s !== null)
}

function tierToDisplayPlan(tier: SubscriptionTier) {
  return {
    name: tier.tier_name,
    display_name: tier.display_name,
    monthly_price: Number(tier.monthly_price),
    color: tierColorMap[tier.display_name] || '#6E7681',
    features: tierToFeatures(tier.features),
    recommended: tier.display_name === recommendedTier,
  }
}

export default function Pricing() {
  const { setShowLoginModal, isLoggedIn } = useAuthStore()
  const { tiers, fetchTiers } = useSubscriptionStore()
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTiers()
  }, [fetchTiers])

  const plans = tiers.length > 0
    ? tiers.map(tierToDisplayPlan)
    : fallbackPlans

  const panelBg = resolvedTheme === 'dark' ? '#161B22' : '#FFFFFF'

  const handleSubscribe = (planName: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    if (planName === 'free' || plans.find(p => p.name === planName)?.monthly_price === 0) {
      navigate('/dashboard')
    } else {
      navigate('/dashboard/subscription')
    }
  }

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
                    ? 'border-2 border-transparent'
                    : 'border border-divider bg-space-panel'
                }`}
                style={
                  plan.recommended
                    ? {
                        background: `linear-gradient(${panelBg}, ${panelBg}) padding-box, linear-gradient(135deg, #6C5CE7, #00D2FF) border-box`,
                      }
                    : undefined
                }
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-star-purple to-star-blue px-4 py-1 text-xs font-semibold text-white">
                    推荐
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className="mb-1 text-lg font-semibold"
                    style={{ color: plan.color }}
                  >
                    {plan.display_name}
                  </h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-text-primary">
                      {plan.monthly_price === 0 ? '免费' : `¥${plan.monthly_price}`}
                    </span>
                    {plan.monthly_price > 0 && (
                      <span className="ml-1 text-text-secondary">/月</span>
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
                  onClick={() => handleSubscribe(plan.name)}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    plan.recommended
                      ? 'text-white'
                      : 'border border-border-default bg-transparent text-text-primary hover:border-border-hover'
                  }`}
                  style={
                    plan.recommended
                      ? { background: 'linear-gradient(135deg, #6C5CE7, #00D2FF)' }
                      : undefined
                  }
                >
                  {plan.monthly_price === 0 ? '免费开始' : '立即订阅'}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
