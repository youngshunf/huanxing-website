import { request } from './client'
import type { LoginResponse, LlmTokenResponse } from '../types'

// 发送验证码
export function sendCode(phone: string) {
  return request<void>({
    method: 'POST',
    url: '/auth/send-code',
    data: { phone },
  })
}

// 手机号验证码登录（新用户自动注册）
export function phoneLogin(phone: string, code: string) {
  return request<LoginResponse>({
    method: 'POST',
    url: '/auth/phone-login',
    data: { phone, code },
  })
}

// 获取 LLM Token
export function getLlmToken() {
  return request<LlmTokenResponse>({
    method: 'POST',
    url: '/auth/llm-token',
  })
}
