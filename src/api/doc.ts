import client, { request } from './client'
import type { DocItem, DocListParams, DocCreateParams, DocUpdateParams, DocVersion, DocPageData } from '../types/doc'

const APP_PREFIX = '/huanxing/app/docs'
const OPEN_PREFIX = '/huanxing/open'

// ==================== 用户端接口 ====================

/** 我的文档列表 */
export async function getMyDocs(params?: DocListParams) {
  return request<DocPageData>({
    method: 'GET',
    url: APP_PREFIX,
    params,
  })
}

/** 文档详情 */
export async function getDoc(pk: number) {
  return request<DocItem>({
    method: 'GET',
    url: `${APP_PREFIX}/${pk}`,
  })
}

/** 创建文档 */
export async function createDoc(data: DocCreateParams) {
  return request<DocItem>({
    method: 'POST',
    url: APP_PREFIX,
    data,
  })
}

/** 更新文档 */
export async function updateDoc(pk: number, data: DocUpdateParams) {
  return request<void>({
    method: 'PUT',
    url: `${APP_PREFIX}/${pk}`,
    data,
  })
}

/** 删除文档 */
export async function deleteDoc(pk: number) {
  return request<void>({
    method: 'DELETE',
    url: `${APP_PREFIX}/${pk}`,
  })
}

// ==================== 自动保存 ====================

/** 自动保存草稿 */
export async function autosaveDoc(pk: number, content: string) {
  return request<void>({
    method: 'POST',
    url: `${APP_PREFIX}/${pk}/autosave`,
    data: { content },
  })
}

/** 获取草稿 */
export async function getAutosave(pk: number) {
  return request<{ content: string; updated_at: string } | null>({
    method: 'GET',
    url: `${APP_PREFIX}/${pk}/autosave`,
  })
}

// ==================== 版本历史 ====================

/** 版本列表 */
export async function getVersions(pk: number) {
  return request<DocVersion[]>({
    method: 'GET',
    url: `${APP_PREFIX}/${pk}/versions`,
  })
}

/** 版本详情 */
export async function getVersionDetail(pk: number, versionNumber: number) {
  return request<DocVersion>({
    method: 'GET',
    url: `${APP_PREFIX}/${pk}/versions/${versionNumber}`,
  })
}

/** 恢复版本 */
export async function restoreVersion(pk: number, versionNumber: number) {
  return request<void>({
    method: 'POST',
    url: `${APP_PREFIX}/${pk}/versions/${versionNumber}/restore`,
  })
}

// ==================== 分享 ====================

/** 生成/更新分享链接 */
export async function createShare(pk: number, params: {
  permission?: string
  expires_hours?: number
  password?: string
}) {
  return request<{ share_url: string }>({
    method: 'POST',
    url: `${APP_PREFIX}/${pk}/share`,
    params,
  })
}

/** 取消分享 */
export async function cancelShare(pk: number) {
  return request<void>({
    method: 'DELETE',
    url: `${APP_PREFIX}/${pk}/share`,
  })
}

// ==================== 导出 ====================

/** 导出文档（返回 blob） */
export async function exportDoc(pk: number, format: 'markdown' | 'pdf' | 'docx' = 'markdown') {
  const response = await client.get(`${APP_PREFIX}/${pk}/export`, {
    params: { format },
    responseType: 'blob',
  })
  return response
}

/** 触发文档下载 */
export function downloadDoc(pk: number, format: 'markdown' | 'pdf' | 'docx', filename: string) {
  exportDoc(pk, format).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  })
}

// ==================== 公开接口 ====================

/** 访问分享文档（无需登录） */
export async function getSharedDoc(shareToken: string, password?: string) {
  return request<DocItem>({
    method: 'GET',
    url: `${OPEN_PREFIX}/share/${shareToken}`,
    params: password ? { password } : undefined,
  })
}
