import { request } from './client'

/** 可用支付渠道 */
export interface PayChannel {
  id: number
  code: string   // wx_native / alipay_pc
  name: string   // 微信支付 / 支付宝
}

/** 订阅下单参数 */
export interface CreateSubscribeOrderParams {
  order_type?: 'subscribe'
  tier: string          // star_glow / star_shine / star_glory
  billing_cycle: string // monthly / yearly
  channel_code: string  // wx_native / alipay_pc
  auto_renew?: boolean
}

/** 积分包下单参数 */
export interface CreateCreditPackOrderParams {
  order_type: 'credit_pack'
  package_id: number
  channel_code: string
}

/**
 * 创建订单参数。
 *
 * 积分包购买必须和订阅走同一条真实下单链路：下单 → 第三方支付回调验签 → 履约事件 → 额度到账。
 * 原先官网调用的「模拟支付」接口把模拟成功当成真实购买成功，已在云端退役。
 */
export type CreateOrderParams = CreateSubscribeOrderParams | CreateCreditPackOrderParams

/** 创建订单响应 */
export interface CreateOrderResponse {
  order_no: string
  pay_amount: number        // 金额（分）
  channel_code: string
  qr_code_url: string | null   // 微信二维码内容
  pay_url: string | null        // 支付宝跳转 URL
  contract_no: string | null
  expire_time: string
}

/** 订单状态 */
export interface OrderStatus {
  order_no: string
  status: number  // 0=待支付 1=已支付 2=已退款 3=已关闭 4=已过期
  pay_amount: number
  success_time: string | null
}

/** 获取可用支付渠道 */
export function getChannels() {
  return request<PayChannel[]>({ method: 'GET', url: '/pay/app/channels' })
}

/** 创建支付订单 */
export function createOrder(data: CreateOrderParams) {
  return request<CreateOrderResponse>({ method: 'POST', url: '/pay/app/create', data })
}

/** 查询订单状态 */
export function getOrderStatus(orderNo: string) {
  return request<OrderStatus>({ method: 'GET', url: `/pay/app/status/${orderNo}` })
}

/** 取消订单 */
export function cancelOrder(orderNo: string) {
  return request<void>({ method: 'POST', url: `/pay/app/cancel/${orderNo}` })
}
