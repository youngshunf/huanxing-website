import { request } from './client'
import type {
  CreatorProject,
  CreatorContent,
  CreatorContentDetail,
  CreatorPublish,
  AnalyticsOverview,
  AnalyticsTrend,
  TopContent,
  CreatorTopic,
  PagedResult,
} from '../types/creator'

const BASE = '/creator/app'

// ===== 项目 =====

export function getProjects() {
  return request<CreatorProject[]>({ method: 'GET', url: `${BASE}/projects` })
}

export function getProject(id: number) {
  return request<CreatorProject>({ method: 'GET', url: `${BASE}/projects/${id}` })
}

export function updateProject(id: number, data: Partial<{
  name: string
  description: string
  platform: string
  platforms: Record<string, unknown>
  avatar_url: string
}>) {
  return request<void>({ method: 'PUT', url: `${BASE}/projects/${id}`, data })
}

export function updateProjectProfile(id: number, data: Partial<{
  niche: string
  sub_niche: string
  persona: string
  target_audience: string
  tone: string
  keywords: Record<string, unknown>
  bio: string
  content_pillars: Record<string, unknown>
  posting_frequency: string
  best_posting_time: string
}>) {
  return request<void>({ method: 'PUT', url: `${BASE}/projects/${id}/profile`, data })
}

// ===== 内容 =====

export function getContents(params?: {
  status?: string
  project_id?: number
  page?: number
  page_size?: number
}) {
  return request<PagedResult<CreatorContent>>({ method: 'GET', url: `${BASE}/contents`, params })
}

export function getContent(id: number) {
  return request<CreatorContentDetail>({ method: 'GET', url: `${BASE}/contents/${id}` })
}

export function updateContentStatus(id: number, status: string) {
  return request<void>({ method: 'PUT', url: `${BASE}/contents/${id}/status`, data: { status } })
}

// ===== 发布记录 =====

export function getPublishes(params?: {
  platform?: string
  page?: number
  page_size?: number
}) {
  return request<PagedResult<CreatorPublish>>({ method: 'GET', url: `${BASE}/publishes`, params })
}

// ===== 数据分析 =====

export function getAnalyticsOverview(days?: number) {
  return request<AnalyticsOverview>({ method: 'GET', url: `${BASE}/analytics/overview`, params: days ? { days } : undefined })
}

export function getAnalyticsTrend(days?: number) {
  return request<AnalyticsTrend>({ method: 'GET', url: `${BASE}/analytics/trend`, params: days ? { days } : undefined })
}

export function getAnalyticsTop(params?: { metric?: string; limit?: number }) {
  return request<TopContent[]>({ method: 'GET', url: `${BASE}/analytics/top`, params })
}

// ===== 选题 =====

export function getTopics(params?: {
  project_id?: number
  status?: number
  page?: number
  page_size?: number
}) {
  return request<PagedResult<CreatorTopic>>({ method: 'GET', url: `${BASE}/topics`, params })
}

export function updateTopic(id: number, status: 1 | 2) {
  return request<unknown>({ method: 'PUT', url: `${BASE}/topics/${id}`, params: { status } })
}
