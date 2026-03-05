import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ---------- Token 刷新状态管理 ----------
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

/**
 * 调用后端 refresh 接口，用 refresh_token 换取新的 access_token
 * 后端同时会返回新的 refresh_token（轮换策略）
 */
async function doRefreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  // 用独立的 axios 实例发请求，避免被拦截器循环处理
  const resp = await axios.post<ApiResponse<{
    access_token: string
    access_token_expire_time: string
    session_uuid: string
    new_refresh_token?: string
    new_refresh_token_expire_time?: string
  }>>(
    `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' }, timeout: 10000 },
  )

  const { code, data } = resp.data
  if (code !== 200 || !data?.access_token) {
    throw new Error('Refresh failed')
  }

  // 更新 localStorage
  localStorage.setItem('accessToken', data.access_token)
  if (data.new_refresh_token) {
    localStorage.setItem('refreshToken', data.new_refresh_token)
  }

  return data.access_token
}

/** 清除登录态并跳转首页 */
function forceLogout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  window.location.href = '/'
}

// ---------- 请求拦截：自动带 Authorization header ----------
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-App-Code'] = 'huanxing'
  return config
})

// ---------- 响应拦截：401 时自动刷新 token ----------
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // 非 401 或者已经重试过 → 直接抛错
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // 没有 refresh_token → 直接登出
    if (!localStorage.getItem('refreshToken')) {
      forceLogout()
      return Promise.reject(error)
    }

    // 如果已经有一个刷新请求在跑，排队等结果
    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken: string) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          }
          originalRequest._retry = true
          resolve(client(originalRequest))
        })
      })
    }

    // 标记正在刷新
    isRefreshing = true
    originalRequest._retry = true

    try {
      const newToken = await doRefreshToken()

      // 通知排队的请求
      refreshQueue.forEach((cb) => cb(newToken))
      refreshQueue = []

      // 用新 token 重发当前请求
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      }
      return client(originalRequest)
    } catch {
      // 刷新也失败了 → 登出
      refreshQueue.forEach((cb) => cb(''))
      refreshQueue = []
      forceLogout()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

// 通用请求方法，自动解包 ApiResponse
export async function request<T>(config: Parameters<typeof client.request>[0]): Promise<T> {
  const response = await client.request<ApiResponse<T>>(config)
  const { code, msg, data } = response.data
  if (code !== 0 && code !== 200) {
    throw new Error(msg || '请求失败')
  }
  return data
}

export default client
