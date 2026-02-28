import { request } from './client'
import type { FolderTreeNode, FolderContents } from '../types/doc'

const APP_PREFIX = '/huanxing/app/folders'
const DOC_PREFIX = '/huanxing/app/docs'

/** 获取目录树 */
export async function getFolderTree() {
  return request<FolderTreeNode[]>({
    method: 'GET',
    url: APP_PREFIX,
  })
}

/** 创建目录 */
export async function createFolder(data: {
  name: string
  parent_id?: number | null
  icon?: string
  description?: string
}) {
  return request<{ id: number; uuid: string; name: string; path: string }>({
    method: 'POST',
    url: APP_PREFIX,
    data,
  })
}

/** 获取目录内容（子目录 + 文档列表） */
export async function getFolderContents(folderId: number) {
  return request<FolderContents>({
    method: 'GET',
    url: `${APP_PREFIX}/${folderId}`,
  })
}

/** 更新目录 */
export async function updateFolder(id: number, data: {
  name?: string
  icon?: string
  description?: string
  sort_order?: number
}) {
  return request<void>({
    method: 'PUT',
    url: `${APP_PREFIX}/${id}`,
    data,
  })
}

/** 删除目录 */
export async function deleteFolder(id: number, recursive: boolean = false) {
  return request<void>({
    method: 'DELETE',
    url: `${APP_PREFIX}/${id}`,
    params: { recursive },
  })
}

/** 移动目录 */
export async function moveFolder(id: number, targetParentId: number | null) {
  return request<{ updated: number }>({
    method: 'POST',
    url: `${APP_PREFIX}/${id}/move`,
    data: { target_parent_id: targetParentId },
  })
}

/** 移动文档到目录 */
export async function moveDocument(docId: number, targetFolderId: number | null) {
  return request<void>({
    method: 'POST',
    url: `${DOC_PREFIX}/${docId}/move`,
    data: { target_folder_id: targetFolderId },
  })
}
