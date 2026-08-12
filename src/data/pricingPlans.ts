export interface PricingPlan {
  name: 'free' | 'lite' | 'pro' | 'max' | 'ultra'
  display_name: string
  monthly_price: number
  color: string
  features: string[]
  recommended?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'free',
    display_name: '免费版',
    monthly_price: 0,
    color: '#6E7681',
    features: ['每月积分：100', '云存储：10 GB', '分身数量：1', '客服支持：社区支持'],
  },
  {
    name: 'lite',
    display_name: '轻享版',
    monthly_price: 49,
    color: '#3B82F6',
    features: ['每月积分：500', '云存储：50 GB', '分身数量：2', '客服支持：邮件支持'],
  },
  {
    name: 'pro',
    display_name: '专业版',
    monthly_price: 99,
    color: '#2563EB',
    features: ['每月积分：1200', '云存储：200 GB', '分身数量：5', '客服支持：优先支持'],
    recommended: true,
  },
  {
    name: 'max',
    display_name: '高级版',
    monthly_price: 299,
    color: '#1D4ED8',
    features: ['每月积分：4000', '云存储：500 GB', '分身数量：10', '客服支持：优先支持'],
  },
  {
    name: 'ultra',
    display_name: '旗舰版',
    monthly_price: 699,
    color: '#B7791F',
    features: ['每月积分：10000', '云存储：1 TB', '分身数量：不限', '客服支持：专属客服'],
  },
]

export const tierColorMap: Record<string, string> = Object.fromEntries(
  pricingPlans.map((plan) => [plan.name, plan.color]),
)

export const tierDisplayColorMap: Record<string, string> = Object.fromEntries(
  pricingPlans.map((plan) => [plan.display_name, plan.color]),
)

export const recommendedTierKey = pricingPlans.find((plan) => plan.recommended)?.name
