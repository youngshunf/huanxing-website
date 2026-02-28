import { create } from 'zustand'
import type { DocItem } from '../types/doc'
import * as docApi from '../api/doc'

interface DocState {
  // 文档列表
  docs: DocItem[]
  total: number
  page: number
  loading: boolean

  // 当前文档
  currentDoc: DocItem | null
  currentLoading: boolean

  // 操作
  fetchDocs: (params?: { page?: number; size?: number; title?: string; status?: string }) => Promise<void>
  fetchDoc: (pk: number) => Promise<DocItem>
  deleteDoc: (pk: number) => Promise<void>
  setCurrentDoc: (doc: DocItem | null) => void
  updateCurrentDoc: (updates: Partial<DocItem>) => void
}

export const useDocStore = create<DocState>((set, get) => ({
  docs: [],
  total: 0,
  page: 1,
  loading: false,

  currentDoc: null,
  currentLoading: false,

  fetchDocs: async (params) => {
    set({ loading: true })
    try {
      const data = await docApi.getMyDocs(params)
      set({
        docs: data.items || [],
        total: data.total || 0,
        page: params?.page || 1,
      })
    } catch (e) {
      console.error('获取文档列表失败:', e)
    } finally {
      set({ loading: false })
    }
  },

  fetchDoc: async (pk) => {
    set({ currentLoading: true })
    try {
      const doc = await docApi.getDoc(pk)
      set({ currentDoc: doc })
      return doc
    } catch (e) {
      console.error('获取文档详情失败:', e)
      throw e
    } finally {
      set({ currentLoading: false })
    }
  },

  deleteDoc: async (pk) => {
    await docApi.deleteDoc(pk)
    const { docs } = get()
    set({ docs: docs.filter((d) => d.id !== pk) })
  },

  setCurrentDoc: (doc) => set({ currentDoc: doc }),

  updateCurrentDoc: (updates) => {
    const { currentDoc } = get()
    if (currentDoc) {
      set({ currentDoc: { ...currentDoc, ...updates } })
    }
  },
}))
