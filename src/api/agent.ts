import { request } from './client'
import type {
  AgentDetail,
  AgentItem,
  AgentListParams,
  AgentListResponse,
  AgentTemplate,
  ChannelActionResponse,
  ChannelBinding,
  ChatCompletionResponse,
  ChatMessage,
  CreateAgentPayload,
  DeleteAgentResponse,
  GatewayInfo,
  ManualChannelPayload,
  PersonaDocument,
  QrStatusResponse,
  StartQrResponse,
  SupportedChannelType,
  UpdateAgentPayload,
  UsageByModel,
  UsageSummary,
  UsageSummaryParams,
  WorkspaceInfo,
} from '../types/agent'

const AGENTS_URL = '/hermes/app/agents'
const TEMPLATES_URL = '/hermes/app/templates'
const USAGE_SUMMARY_URL = '/llm/usage/summary'

function chatStreamUrl(agentId: string) {
  const base = import.meta.env.VITE_API_BASE_URL || '/api/v1'
  return `${base}${AGENTS_URL}/${agentId}/chat/completions`
}

export function listAgents(params: AgentListParams = {}) {
  return request<AgentListResponse>({ method: 'GET', url: AGENTS_URL, params })
}

export function createAgent(payload: CreateAgentPayload) {
  return request<AgentItem>({ method: 'POST', url: AGENTS_URL, data: payload })
}

export function getAgent(agentId: string) {
  return request<AgentDetail>({ method: 'GET', url: `${AGENTS_URL}/${agentId}` })
}

export function updateAgent(agentId: string, payload: UpdateAgentPayload) {
  return request<AgentDetail>({ method: 'PATCH', url: `${AGENTS_URL}/${agentId}`, data: payload })
}

export function deleteAgent(agentId: string) {
  return request<DeleteAgentResponse>({ method: 'DELETE', url: `${AGENTS_URL}/${agentId}` })
}

export function getSoul(agentId: string) {
  return request<PersonaDocument>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/soul` })
}

export function saveSoul(agentId: string, content: string) {
  return request<PersonaDocument>({ method: 'PUT', url: `${AGENTS_URL}/${agentId}/soul`, data: { content } })
}

export function getUserProfile(agentId: string) {
  return request<PersonaDocument>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/user-profile` })
}

export function saveUserProfile(agentId: string, content: string) {
  return request<PersonaDocument>({ method: 'PUT', url: `${AGENTS_URL}/${agentId}/user-profile`, data: { content } })
}

export function listChannels(agentId: string) {
  return request<ChannelBinding[]>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/channels` })
}

export function startChannelQr(agentId: string, channel: SupportedChannelType, ttlSeconds = 300) {
  return request<StartQrResponse>({
    method: 'POST',
    url: `${AGENTS_URL}/${agentId}/channels/${channel}/qr/start`,
    data: { ttl_seconds: ttlSeconds },
  })
}

export function getChannelQrStatus(agentId: string, channel: SupportedChannelType, sessionId: string) {
  return request<QrStatusResponse>({
    method: 'GET',
    url: `${AGENTS_URL}/${agentId}/channels/${channel}/qr/${sessionId}/status`,
  })
}

export function manualBindChannel(agentId: string, channel: SupportedChannelType, payload: ManualChannelPayload) {
  return request<ChannelActionResponse>({
    method: 'POST',
    url: `${AGENTS_URL}/${agentId}/channels/${channel}/manual`,
    data: payload,
  })
}

export function testChannel(agentId: string, channel: SupportedChannelType) {
  return request<ChannelActionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/test` })
}

export function unbindChannel(agentId: string, channel: SupportedChannelType) {
  return request<ChannelActionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/unbind` })
}

export function getGatewayStatus(agentId: string) {
  return request<GatewayInfo>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/gateway/status` })
}

export function operateGateway(agentId: string, action: 'start' | 'restart' | 'stop') {
  return request<GatewayInfo>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/gateway/${action}` })
}

export function getWorkspaceStatus(agentId: string) {
  return request<WorkspaceInfo>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/workspace/status` })
}

export function sendChatCompletion(agentId: string, messages: ChatMessage[]) {
  return request<ChatCompletionResponse>({
    method: 'POST',
    url: `${AGENTS_URL}/${agentId}/chat/completions`,
    data: { messages, stream: false },
  })
}

interface ChatHistoryResponse {
  profile_id?: string
  session_id?: string | null
  messages: ChatMessage[]
  updated_at?: string | null
}

export function getChatHistory(agentId: string) {
  return request<ChatHistoryResponse>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/chat/history` })
}

export function listTemplates() {
  return request<AgentTemplate[]>({ method: 'GET', url: TEMPLATES_URL })
}

function isoToUnix(value: string): string {
  const ms = new Date(value).getTime()
  if (Number.isNaN(ms)) throw new Error(`非法时间格式: ${value}`)
  return String(Math.floor(ms / 1000))
}

// new-api raw quota 单位换算：500000 quota ≈ 1 USD（new-api 默认系数）
const QUOTA_PER_USD = 500000

interface BackendUsageRow {
  model_name?: string
  prompt_tokens?: number
  completion_tokens?: number
  quota?: number
  request_count?: number
}

interface BackendUsagePayload {
  agent_id?: string
  period?: [number, number]
  by_model?: BackendUsageRow[]
}

function adaptUsageSummary(raw: BackendUsagePayload | UsageSummary | null | undefined, agentId: string): UsageSummary {
  // 同时兼容 backend 已返出 frontend type（含 total_tokens）的情况
  if (raw && 'total_tokens' in raw && Array.isArray((raw as UsageSummary).by_model)) {
    return raw as UsageSummary
  }
  const backend = (raw ?? {}) as BackendUsagePayload
  const rows = backend.by_model ?? []
  const by_model: UsageByModel[] = rows.map((row) => {
    const total_tokens = (row.prompt_tokens ?? 0) + (row.completion_tokens ?? 0)
    return {
      model_name: row.model_name ?? 'unknown',
      request_count: row.request_count ?? 0,
      total_tokens,
      total_cost: (row.quota ?? 0) / QUOTA_PER_USD,
    }
  })
  const total_tokens = by_model.reduce((sum, r) => sum + r.total_tokens, 0)
  const total_cost = by_model.reduce((sum, r) => sum + r.total_cost, 0)
  const period = backend.period
  return {
    agent_id: backend.agent_id ?? agentId,
    total_tokens,
    total_cost,
    start_time: period?.[0] ? new Date(period[0] * 1000).toISOString() : null,
    end_time: period?.[1] ? new Date(period[1] * 1000).toISOString() : null,
    by_model,
  }
}

export async function getUsageSummary(agentId: string, params: UsageSummaryParams = {}): Promise<UsageSummary> {
  const query: Record<string, string> = { agent_id: agentId }
  if (params.startTime) query.start_time = isoToUnix(params.startTime)
  if (params.endTime) query.end_time = isoToUnix(params.endTime)
  const raw = await request<BackendUsagePayload>({ method: 'GET', url: USAGE_SUMMARY_URL, params: query })
  return adaptUsageSummary(raw, agentId)
}

interface SseFrame {
  delta?: string
  finishReason?: string | null
  done: boolean
}

function parseSseFrame(raw: string): SseFrame | null {
  // Each frame is one or more lines separated by newlines; concatenate `data:` lines per the spec.
  const lines = raw.split(/\r?\n/)
  const dataParts: string[] = []
  for (const line of lines) {
    if (line.startsWith('data:')) {
      dataParts.push(line.slice(5).trimStart())
    }
  }
  if (dataParts.length === 0) return null
  const payload = dataParts.join('\n').trim()
  if (!payload) return null
  if (payload === '[DONE]') return { done: true }
  try {
    const parsed = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string }; finish_reason?: string | null; message?: { content?: string } }>
      error?: { message?: string }
    }
    if (parsed.error?.message) {
      throw new Error(parsed.error.message)
    }
    const choice = parsed.choices?.[0]
    const delta = choice?.delta?.content ?? choice?.message?.content ?? ''
    return { delta, finishReason: choice?.finish_reason ?? null, done: false }
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Drop malformed frames silently rather than killing the stream.
      return null
    }
    throw error
  }
}

export async function sendChatCompletionStream(
  agentId: string,
  messages: ChatMessage[],
  onChunk: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    'X-App-Code': 'huanxing',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(chatStreamUrl(agentId), {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, stream: true }),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`Chat 请求失败 (HTTP ${response.status})${errorText ? `: ${errorText.slice(0, 200)}` : ''}`)
  }

  const body = response.body
  if (!body) {
    throw new Error('当前环境不支持流式响应')
  }

  const reader = body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let separatorIndex = buffer.indexOf('\n\n')
      while (separatorIndex !== -1) {
        const rawFrame = buffer.slice(0, separatorIndex)
        buffer = buffer.slice(separatorIndex + 2)
        const frame = parseSseFrame(rawFrame)
        if (frame?.done) {
          return
        }
        if (frame?.delta) {
          onChunk(frame.delta)
        }
        separatorIndex = buffer.indexOf('\n\n')
      }
    }
    // Drain any remaining frame in the buffer (in case stream closed without trailing blank line).
    const remaining = buffer.trim()
    if (remaining) {
      const frame = parseSseFrame(remaining)
      if (frame && !frame.done && frame.delta) onChunk(frame.delta)
    }
  } finally {
    reader.releaseLock?.()
  }
}
