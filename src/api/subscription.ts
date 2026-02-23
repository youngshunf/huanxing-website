import { request } from './client'
import type {
  SubscriptionInfo,
  SubscriptionTier,
  CreditPackage,
  UpgradeCalculation,
  PaymentResult,
  CreditHistory,
} from '../types'

// 获取当前订阅信息
export function getMyInfo() {
  return request<SubscriptionInfo>({ method: 'GET', url: '/user_tier/my/subscription/info' })
}

// 获取等级列表
export function getTiers() {
  return request<SubscriptionTier[]>({ method: 'GET', url: '/user_tier/my/subscription/tiers' })
}

// 获取积分包列表
export function getPackages() {
  return request<CreditPackage[]>({ method: 'GET', url: '/user_tier/my/subscription/packages' })
}

// 计算升级价格
export function calculateUpgrade(tierName: string, subscriptionType: string) {
  return request<UpgradeCalculation>({
    method: 'POST',
    url: '/user_tier/my/subscription/upgrade/calculate',
    data: { tier_name: tierName, subscription_type: subscriptionType },
  })
}

// 升级订阅
export function upgrade(tierName: string, subscriptionType: string) {
  return request<PaymentResult>({
    method: 'POST',
    url: '/user_tier/my/subscription/upgrade',
    data: { tier_name: tierName, subscription_type: subscriptionType },
  })
}

// 购买积分包
export function purchaseCredits(packageId: number) {
  return request<PaymentResult>({
    method: 'POST',
    url: '/user_tier/my/subscription/purchase',
    data: { package_id: packageId },
  })
}

// 获取积分历史记录
export function getBalanceHistory() {
  return request<CreditHistory[]>({
    method: 'GET',
    url: '/user_tier/my/subscription/balances/history',
  })
}
