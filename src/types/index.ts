// 用户信息
export interface UserInfo {
  uuid: string
  username: string
  nickname: string
  phone: string | null
  email: string | null
  avatar: string | null
  is_new_user?: boolean
}

// 登录响应
export interface LoginResponse {
  access_token: string
  access_token_expire_time: string
  refresh_token: string
  refresh_token_expire_time: string
  llm_token: string
  gateway_token: string
  is_new_user: boolean
  user: UserInfo
}

// LLM Token 响应
export interface LlmTokenResponse {
  api_token: string
  expires_at: string | null
}

// 订阅等级
export interface SubscriptionTier {
  id: number
  tier_name: string
  display_name: string
  monthly_credits: number
  monthly_price: number
  yearly_price: number | null
  yearly_discount: number | null
  features: Record<string, unknown> | null
}

// 积分余额
export interface CreditBalance {
  id: number
  credit_type: string
  original_amount: number
  used_amount: number
  remaining_amount: number
  expires_at: string | null
  granted_at: string
  source_type: string
  description: string | null
}

// 当前订阅信息
export interface SubscriptionInfo {
  user_id: number
  tier: string
  tier_display_name: string | null
  subscription_type: string
  monthly_credits: number
  current_credits: number
  used_credits: number
  purchased_credits: number
  monthly_remaining: number | null
  bonus_remaining: number | null
  billing_cycle_start: string
  billing_cycle_end: string
  subscription_start_date: string | null
  subscription_end_date: string | null
  next_grant_date: string | null
  status: string
  balances: CreditBalance[]
}

// 积分包
export interface CreditPackage {
  id: number
  package_name: string
  credits: number
  price: number
  bonus_credits: number
  description: string | null
}

// 升级价格计算结果
export interface UpgradeCalculation {
  can_upgrade: boolean
  message: string
  target_tier: string
  target_tier_display: string
  subscription_type: string
  original_price: number
  remaining_value: number
  final_price: number
  remaining_days: number
  current_tier: string
  current_subscription_type: string
}

// 支付结果
export interface PaymentResult {
  success: boolean
  order_id: string
  message: string
  new_credits: number | null
  new_tier: string | null
}

// 积分历史记录（复用 CreditBalance）
export type CreditHistory = CreditBalance

// 分页响应
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// API 通用响应
export interface ApiResponse<T = unknown> {
  code: number
  msg: string
  data: T
}
