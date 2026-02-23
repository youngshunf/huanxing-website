import axios from 'axios'
import type { ApiResponse } from '../types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截：自动带 Authorization header
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['X-App-Code'] = 'huanxing'
  return config
})

// 响应拦截：统一错误处理，401 自动登出
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
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
