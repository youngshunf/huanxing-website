import { request } from './client'
import type {
  SubscriptionInfo,
  SubscriptionTier,
  CreditPackage,
  UpgradeCalculation,
  CreditHistory,
} from '../types'

// ===== 需要登录（app/）=====

// 获取当前订阅信息
export function getMyInfo() {
  return request<SubscriptionInfo>({ method: 'GET', url: '/user_tier/app/subscription/info' })
}

// 获取积分历史记录
export function getBalanceHistory() {
  return request<CreditHistory[]>({
    method: 'GET',
    url: '/user_tier/app/subscription/balances/history',
  })
}

// 计算升级价格
export function calculateUpgrade(tierName: string, subscriptionType: string) {
  return request<UpgradeCalculation>({
    method: 'POST',
    url: '/user_tier/app/subscription/upgrade/calculate',
    data: { tier_name: tierName, subscription_type: subscriptionType },
  })
}

// 升级订阅与购买积分包不再有「模拟支付」接口：
// 两者都走 api/pay.ts 的真实下单（createOrder）+ 支付回调履约，见 pages/pay/PayPage。

// ===== 不需要登录（open/）=====

// 获取等级列表（定价页公开展示）
export function getTiers() {
  return request<SubscriptionTier[]>({ method: 'GET', url: '/user_tier/open/tiers' })
}

// 获取积分包列表（定价页公开展示）
export function getPackages() {
  return request<CreditPackage[]>({ method: 'GET', url: '/user_tier/open/packages' })
}
