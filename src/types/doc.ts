// 文档相关类型定义

export interface FolderTreeNode {
  id: number
  uuid: string
  name: string
  icon?: string
  parent_id: number | null
  sort_order: number
  doc_count: number
  children: FolderTreeNode[]
}

export interface FolderContents {
  folder_id: number | null
  sub_folders: {
    id: number
    uuid: string
    name: string
    icon?: string
    sort_order: number
  }[]
  documents: DocItem[]
}

export interface DocItem {
  id: number
  uuid: string
  user_id: number
  title: string
  content?: string
  summary?: string
  tags?: string
  word_count: number
  status: string
  is_public: boolean
  created_by: string
  agent_id?: string
  folder_id?: number | null
  share_token?: string
  share_password?: string
  share_permission?: string
  share_expires_at?: string
  current_version: number
  created_at: string
  updated_at?: string
  deleted_at?: string
}

export interface DocListParams {
  page?: number
  size?: number
  title?: string
  status?: string
}

export interface DocCreateParams {
  title: string
  content?: string
  summary?: string
  tags?: string
  word_count?: number
  status?: string
  is_public?: boolean
  folder_id?: number | null
}

export interface DocUpdateParams {
  title?: string
  content?: string
  summary?: string
  tags?: string
  word_count?: number
  status?: string
  is_public?: boolean
}

export interface DocVersion {
  id: number
  document_id: number
  version_number: number
  content: string
  word_count: number
  created_by: number
  change_summary?: string
  created_at: string
}

export interface ShareSettings {
  permission: string
  expires_hours: number
  password?: string
}

export interface DocPageData {
  items: DocItem[]
  total: number
  page: number
  size: number
}
