export type AgentStatus =
  | 'creating'
  | 'created'
  | 'ready'
  | 'running'
  | 'stopped'
  | 'error'
  | 'deleting'
  | 'deleted'

export type GatewayStatus =
  | 'stopped'
  | 'starting'
  | 'running'
  | 'restarting'
  | 'stopping'
  | 'unhealthy'
  | 'error'

export type ChannelType = 'feishu' | 'weixin' | 'qq'
export type ReservedChannelType = 'wecom' | 'webhook'
export type SupportedChannelType = ChannelType | ReservedChannelType

export type ChannelStatus =
  | 'unbound'
  | 'created'
  | 'qr_ready'
  | 'waiting_scan'
  | 'scanned'
  | 'confirmed'
  | 'writing_config'
  | 'restarting_gateway'
  | 'testing_connection'
  | 'bound'
  | 'expired'
  | 'failed'
  | 'cancelled'

export type WorkspaceStatus = 'unknown' | 'creating' | 'ready' | 'active' | 'error'

export interface AgentTemplate {
  app_id: string
  name: string
  description: string
  emoji?: string
  icon_url?: string
  version: string
}

export interface UsageByModel {
  model_name: string
  request_count: number
  total_tokens: number
  total_cost: number
}

export interface UsageSummary {
  agent_id: string
  total_tokens: number
  total_cost: number
  by_model: UsageByModel[]
  start_time?: string | null
  end_time?: string | null
}

export interface UsageSummaryParams {
  startTime?: string
  endTime?: string
}

export interface ChannelBindingSummary {
  channel: SupportedChannelType
  status: ChannelStatus
  display_name?: string
  updated_at?: string | null
  last_error?: string | null
}

export interface AgentItem {
  agent_id: string
  agent_name: string
  status: AgentStatus
  gateway_status: GatewayStatus
  terminal_backend: 'docker' | string
  container_workspace: string
  workspace_status: WorkspaceStatus
  llm_mode: 'platform' | 'byok' | string
  llm_model: string
  channel_summary: ChannelBindingSummary[]
  last_active_at?: string | null
  created_at: string
  updated_at: string
}

export interface AgentListParams {
  status?: AgentStatus
  channel?: SupportedChannelType
  page?: number
  size?: number
}

export interface AgentListResponse {
  items: AgentItem[]
  total: number
  page: number
  size: number
}

export interface CreateAgentPayload {
  agent_name: string
  template?: string
  timezone: string
  soul?: string
  user_profile?: string
  auto_start_gateway?: boolean
}

export interface UpdateAgentPayload {
  agent_name?: string
  timezone?: string
}

export interface GatewayInfo {
  agent_id?: string
  status: GatewayStatus
  api_server_reachable?: boolean
  restart_count?: number
  started_at?: string | null
  last_error?: string | null
}

export interface WorkspaceInfo {
  agent_id?: string
  status: WorkspaceStatus
  container_workspace: string
  host_workspace_display?: string | null
  file_count?: number
  bytes_used?: number
  last_write_at?: string | null
  write_lock?: {
    locked: boolean
    holder?: string | null
  }
}

export interface SandboxInfo {
  terminal_backend: 'docker' | string
  network_policy: string
  mount_policy: string
  ready: boolean
  last_error?: string | null
}

export interface LlmInfo {
  mode: 'platform' | 'byok' | string
  provider?: string
  model: string
  api_key_configured: boolean
}

export interface AgentDetail {
  agent_id: string
  agent_name: string
  template: string
  timezone: string
  status: AgentStatus
  gateway: GatewayInfo
  workspace: WorkspaceInfo
  sandbox: SandboxInfo
  llm: LlmInfo
  channels: ChannelBinding[]
  last_error?: string | null
  created_at: string
  updated_at: string
}

export interface PersonaDocument {
  agent_id: string
  kind: 'soul' | 'user_profile'
  content: string
  updated_at?: string | null
  effective_policy?: 'next_message' | 'immediate' | string
  requires_gateway_restart?: boolean
}

export interface ChannelBinding {
  channel: SupportedChannelType
  display_name: string
  enabled: boolean
  bind_mode: 'qr_or_manual' | 'webhook' | 'manual' | string
  status: ChannelStatus
  bound_account_display?: string | null
  disabled_reason?: string | null
  last_error?: string | null
  updated_at?: string | null
}

export interface StartQrResponse {
  session_id: string
  channel: SupportedChannelType
  status: ChannelStatus
  expires_at: string
  qr_url?: string | null
  qrcode_img_content?: string | null
  message?: string | null
}

export interface QrStatusResponse {
  session_id: string
  channel: SupportedChannelType
  status: ChannelStatus
  message?: string | null
  metadata?: Record<string, string | number | boolean | null>
  updated_at?: string | null
}

export interface ManualChannelPayload {
  app_id?: string
  app_secret?: string
  token?: string
  domain?: string
  open_id?: string
}

export interface ChannelActionResponse {
  channel: SupportedChannelType
  status: ChannelStatus
  metadata?: Record<string, string | number | boolean | null>
  requires_gateway_restart?: boolean
}

export interface DeleteAgentResponse {
  agent_id: string
  status: AgentStatus
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created?: number
  model?: string
  choices?: Array<{
    index: number
    message?: ChatMessage
    finish_reason?: string | null
  }>
}
