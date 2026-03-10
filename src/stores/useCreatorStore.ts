import { create } from 'zustand'
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
import * as creatorApi from '../api/creator'

interface CreatorState {
  // 项目
  projects: CreatorProject[]
  projectDetail: CreatorProject | null
  projectsLoading: boolean

  // 内容
  contents: PagedResult<CreatorContent> | null
  contentDetail: CreatorContentDetail | null
  contentsLoading: boolean

  // 发布记录
  publishes: PagedResult<CreatorPublish> | null
  publishesLoading: boolean

  // 分析
  overview: AnalyticsOverview | null
  trend: AnalyticsTrend | null
  topContents: TopContent[]
  analyticsLoading: boolean

  // 选题
  topics: PagedResult<CreatorTopic> | null
  topicsLoading: boolean

  // 方法
  fetchProjects: () => Promise<void>
  fetchProject: (id: number) => Promise<void>
  updateProject: (id: number, data: Parameters<typeof creatorApi.updateProject>[1]) => Promise<void>
  updateProjectProfile: (id: number, data: Parameters<typeof creatorApi.updateProjectProfile>[1]) => Promise<void>

  fetchContents: (params?: Parameters<typeof creatorApi.getContents>[0]) => Promise<void>
  fetchContentDetail: (id: number) => Promise<void>
  updateContentStatus: (id: number, status: string) => Promise<void>

  fetchPublishes: (params?: Parameters<typeof creatorApi.getPublishes>[0]) => Promise<void>

  fetchOverview: (days?: number) => Promise<void>
  fetchTrend: (days?: number) => Promise<void>
  fetchTopContents: (params?: Parameters<typeof creatorApi.getAnalyticsTop>[0]) => Promise<void>

  fetchTopics: (params?: Parameters<typeof creatorApi.getTopics>[0]) => Promise<void>
  adoptTopic: (id: number) => Promise<void>
  skipTopic: (id: number) => Promise<void>
}

export const useCreatorStore = create<CreatorState>((set, get) => ({
  projects: [],
  projectDetail: null,
  projectsLoading: false,

  contents: null,
  contentDetail: null,
  contentsLoading: false,

  publishes: null,
  publishesLoading: false,

  overview: null,
  trend: null,
  topContents: [],
  analyticsLoading: false,

  topics: null,
  topicsLoading: false,

  // ===== 项目 =====
  fetchProjects: async () => {
    set({ projectsLoading: true })
    try {
      const projects = await creatorApi.getProjects()
      set({ projects })
    } finally {
      set({ projectsLoading: false })
    }
  },

  fetchProject: async (id) => {
    set({ projectsLoading: true })
    try {
      const project = await creatorApi.getProject(id)
      set({ projectDetail: project })
    } finally {
      set({ projectsLoading: false })
    }
  },

  updateProject: async (id, data) => {
    await creatorApi.updateProject(id, data)
    // 刷新列表
    await get().fetchProjects()
  },

  updateProjectProfile: async (id, data) => {
    await creatorApi.updateProjectProfile(id, data)
    await get().fetchProject(id)
  },

  // ===== 内容 =====
  fetchContents: async (params) => {
    set({ contentsLoading: true })
    try {
      const contents = await creatorApi.getContents(params)
      set({ contents })
    } finally {
      set({ contentsLoading: false })
    }
  },

  fetchContentDetail: async (id) => {
    set({ contentsLoading: true })
    try {
      const detail = await creatorApi.getContent(id)
      set({ contentDetail: detail })
    } finally {
      set({ contentsLoading: false })
    }
  },

  updateContentStatus: async (id, status) => {
    await creatorApi.updateContentStatus(id, status)
    // 清空详情缓存，触发重新加载
    set({ contentDetail: null })
  },

  // ===== 发布记录 =====
  fetchPublishes: async (params) => {
    set({ publishesLoading: true })
    try {
      const publishes = await creatorApi.getPublishes(params)
      set({ publishes })
    } finally {
      set({ publishesLoading: false })
    }
  },

  // ===== 数据分析 =====
  fetchOverview: async (days) => {
    set({ analyticsLoading: true })
    try {
      const overview = await creatorApi.getAnalyticsOverview(days)
      set({ overview })
    } finally {
      set({ analyticsLoading: false })
    }
  },

  fetchTrend: async (days) => {
    const trend = await creatorApi.getAnalyticsTrend(days)
    set({ trend })
  },

  fetchTopContents: async (params) => {
    const topContents = await creatorApi.getAnalyticsTop(params)
    set({ topContents })
  },

  // ===== 选题 =====
  fetchTopics: async (params) => {
    set({ topicsLoading: true })
    try {
      const topics = await creatorApi.getTopics(params)
      set({ topics })
    } finally {
      set({ topicsLoading: false })
    }
  },

  adoptTopic: async (id) => {
    await creatorApi.updateTopic(id, 1)
    // 刷新选题列表
    await get().fetchTopics()
  },

  skipTopic: async (id) => {
    await creatorApi.updateTopic(id, 2)
    await get().fetchTopics()
  },
}))
