import { create } from 'zustand'
import type { FolderTreeNode } from '../types/doc'
import * as folderApi from '../api/folder'

interface FolderState {
  tree: FolderTreeNode[]
  currentFolderId: number | null
  expandedIds: Set<number>
  loading: boolean

  fetchTree: () => Promise<void>
  selectFolder: (id: number | null) => void
  toggleExpand: (id: number) => void
  createFolder: (name: string, parentId?: number | null) => Promise<void>
  deleteFolder: (id: number, recursive?: boolean) => Promise<void>
  renameFolder: (id: number, name: string) => Promise<void>
  moveFolder: (id: number, targetParentId: number | null) => Promise<void>
  moveDocument: (docId: number, targetFolderId: number | null) => Promise<void>
}

export const useFolderStore = create<FolderState>((set, get) => ({
  tree: [],
  currentFolderId: null,
  expandedIds: new Set(),
  loading: false,

  fetchTree: async () => {
    set({ loading: true })
    try {
      const tree = await folderApi.getFolderTree()
      set({ tree })
    } catch (e) {
      console.error('获取目录树失败:', e)
    } finally {
      set({ loading: false })
    }
  },

  selectFolder: (id) => {
    set({ currentFolderId: id })
  },

  toggleExpand: (id) => {
    const expanded = new Set(get().expandedIds)
    if (expanded.has(id)) {
      expanded.delete(id)
    } else {
      expanded.add(id)
    }
    set({ expandedIds: expanded })
  },

  createFolder: async (name, parentId = null) => {
    await folderApi.createFolder({ name, parent_id: parentId })
    await get().fetchTree()
  },

  deleteFolder: async (id, recursive = false) => {
    await folderApi.deleteFolder(id, recursive)
    // 如果删除的是当前选中目录，回到根
    if (get().currentFolderId === id) {
      set({ currentFolderId: null })
    }
    await get().fetchTree()
  },

  renameFolder: async (id, name) => {
    await folderApi.updateFolder(id, { name })
    await get().fetchTree()
  },

  moveFolder: async (id, targetParentId) => {
    await folderApi.moveFolder(id, targetParentId)
    await get().fetchTree()
  },

  moveDocument: async (docId, targetFolderId) => {
    await folderApi.moveDocument(docId, targetFolderId)
  },
}))
