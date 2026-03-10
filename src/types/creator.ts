// ===== 创作项目相关 =====

export interface CreatorProject {
  id: number
  name: string
  platform: string
  platforms: Record<string, unknown> | null
  description: string | null
  is_active: boolean
  avatar_url: string | null
  created_time: string
  profile?: CreatorProfile | null
  accounts?: CreatorAccount[]
}

export interface CreatorProfile {
  id: number
  niche: string
  sub_niche: string | null
  persona: string | null
  target_audience: string | null
  tone: string | null
  keywords: Record<string, unknown> | null
  bio: string | null
  content_pillars: Record<string, unknown> | null
  posting_frequency: string | null
  best_posting_time: string | null
}

export interface CreatorAccount {
  id: number
  platform: string
  nickname: string | null
  account_id: string | null
  followers: number | null
  avg_views: number | null
  avg_likes: number | null
  status: string | null
}

// ===== 内容相关 =====

export interface CreatorContent {
  id: number
  project_id: number
  title: string
  status: string
  target_platforms: Record<string, unknown> | null
  pipeline_mode: string | null
  created_time: string
  updated_time: string | null
}

export interface CreatorContentStage {
  id: number
  stage: string
  content_text: string | null
  file_url: string | null
  status: string | null
  version: number | null
  source_type: string | null
  created_time: string
}

export interface CreatorContentDetail extends CreatorContent {
  content_tracks: Record<string, unknown> | null
  viral_pattern_id: number | null
  meta_data: Record<string, unknown> | null
  stages: CreatorContentStage[]
  publishes: CreatorPublish[]
}

// ===== 发布记录相关 =====

export interface CreatorPublish {
  id: number
  content_id: number
  platform: string
  publish_url: string | null
  status: string | null
  views: number | null
  likes: number | null
  comments: number | null
  shares: number | null
  favorites: number | null
  published_at: string | null
  created_time: string
}

// ===== 数据分析相关 =====

export interface AnalyticsOverview {
  period_days: number
  project_count: number
  total_contents: number
  recent_contents: number
  total_publishes: number
  total_views: number
  total_likes: number
  total_comments: number
  total_shares: number
  total_favorites: number
  total_engagement: number
  status_distribution: Record<string, number>
}

export interface TrendPoint {
  date: string
  views: number
  likes: number
  comments: number
  publishes: number
}

export interface AnalyticsTrend {
  days: number
  trend: TrendPoint[]
}

export interface TopContent {
  content_id: number
  title: string
  status: string
  total_views: number
  total_likes: number
  total_comments: number
  total_shares: number
  total_favorites: number
}

// ===== 选题相关 =====

export interface CreatorTopic {
  id: number
  project_id: number
  title: string
  potential_score: number | null
  heat_index: number | null
  reason: string | null
  keywords: Record<string, unknown> | null
  creative_angles: Record<string, unknown> | null
  status: number  // 0-待处理 1-已采纳 2-已跳过
  content_id: number | null
  created_time: string
}

// ===== 通用分页结构 =====

export interface PagedResult<T> {
  total: number
  page: number
  page_size: number
  items: T[]
}
