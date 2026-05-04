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
  UsageSummary,
  UsageSummaryParams,
  WorkspaceInfo,
} from '../types/agent'

const AGENTS_URL = '/hermes/app/agents'
const TEMPLATES_URL = '/hermes/app/templates'
const USAGE_SUMMARY_URL = '/llm/app/usage/summary'
const MOCK_STORAGE_KEY = 'huanxing_agent_mock_items'
const MOCK_PERSONA_KEY = 'huanxing_agent_mock_persona'

function shouldForceMock() {
  return (
    import.meta.env.VITE_HERMES_AGENT_MOCK === 'true' ||
    import.meta.env.VITE_HERMES_AGENT_MOCK === '1' ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('huanxing_agent_mock') === '1')
  )
}

function shouldUseMock(error: unknown) {
  // Mock fallback is opt-in: only kicks in when explicitly enabled via env or localStorage flag.
  if (!shouldForceMock()) return false
  if (error instanceof Error) {
    return /network|404|not found|failed|timeout/i.test(error.message)
  }
  return true
}

async function withMockFallback<T>(call: () => Promise<T>, fallback: () => T): Promise<T> {
  if (shouldForceMock()) return fallback()
  try {
    return await call()
  } catch (error) {
    if (!shouldUseMock(error)) throw error
    return fallback()
  }
}

async function withExplicitMockOnly<T>(call: () => Promise<T>, fallback: () => T): Promise<T> {
  if (shouldForceMock()) return fallback()
  return call()
}

const TEMPLATE_FALLBACK: AgentTemplate[] = [
  { app_id: 'assistant', name: '个人助理', description: '日常聊天、答疑、信息整理的全能伙伴。', emoji: '🤖', version: '1.0.0' },
  { app_id: 'finance', name: '理财管家', description: '梳理收支与投资偏好，帮你看懂自己的钱。', emoji: '💰', version: '1.0.0' },
  { app_id: 'health', name: '健康伙伴', description: '记录运动饮食与睡眠，温和提醒生活节奏。', emoji: '🌿', version: '1.0.0' },
  { app_id: 'media-creator', name: '内容创作', description: '帮你打磨灵感、生成稿件与社交贴文。', emoji: '✍️', version: '1.0.0' },
  { app_id: 'office', name: '办公助理', description: '会议纪要、待办整理、邮件起草一把抓。', emoji: '🗂️', version: '1.0.0' },
  { app_id: 'side-hustle', name: '副业搭档', description: '陪你跑通副业增长策略、客户跟进、产出节奏。', emoji: '🚀', version: '1.0.0' },
  { app_id: 'custom', name: '自定义', description: '从零开始定义角色与能力，最大灵活度。', emoji: '✨', version: '1.0.0' },
]

function chatStreamUrl(agentId: string) {
  const base = import.meta.env.VITE_API_BASE_URL || '/api/v1'
  return `${base}${AGENTS_URL}/${agentId}/chat/completions`
}

function nowIso() {
  return new Date().toISOString()
}

function readMockAgents(): AgentItem[] {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AgentItem[]
  } catch {
    // ignore corrupt local mock data
  }
  const seeded: AgentItem[] = [
    {
      agent_id: 'agt_demo_assistant',
      agent_name: '福仔',
      status: 'running',
      gateway_status: 'running',
      terminal_backend: 'docker',
      container_workspace: '/workspace',
      workspace_status: 'ready',
      llm_mode: 'platform',
      llm_model: 'openai/gpt-5.5',
      channel_summary: [
        { channel: 'feishu', status: 'bound', display_name: '飞书', updated_at: nowIso() },
        { channel: 'weixin', status: 'unbound', display_name: '微信', updated_at: nowIso() },
      ],
      last_active_at: nowIso(),
      created_at: nowIso(),
      updated_at: nowIso(),
    },
  ]
  writeMockAgents(seeded)
  return seeded
}

function writeMockAgents(items: AgentItem[]) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(items))
}

function readMockPersona(): Record<string, { soul: string; user_profile: string }> {
  try {
    const raw = localStorage.getItem(MOCK_PERSONA_KEY)
    if (raw) return JSON.parse(raw) as Record<string, { soul: string; user_profile: string }>
  } catch {
    // ignore corrupt local mock data
  }
  return {}
}

function writeMockPersona(value: Record<string, { soul: string; user_profile: string }>) {
  localStorage.setItem(MOCK_PERSONA_KEY, JSON.stringify(value))
}

function toDetail(item: AgentItem): AgentDetail {
  return {
    agent_id: item.agent_id,
    agent_name: item.agent_name,
    template: 'assistant',
    timezone: 'Asia/Shanghai',
    status: item.status,
    gateway: {
      agent_id: item.agent_id,
      status: item.gateway_status,
      api_server_reachable: item.gateway_status === 'running',
      restart_count: 0,
      started_at: item.gateway_status === 'running' ? item.updated_at : null,
      last_error: item.status === 'error' ? '运行状态异常，请尝试重启' : null,
    },
    workspace: {
      agent_id: item.agent_id,
      status: item.workspace_status,
      container_workspace: item.container_workspace || '/workspace',
      host_workspace_display: '/workspaces/已脱敏',
      file_count: 3,
      bytes_used: 20480,
      last_write_at: item.updated_at,
      write_lock: { locked: false, holder: null },
    },
    sandbox: {
      terminal_backend: item.terminal_backend,
      network_policy: '仅允许公开出站，阻断内部网络',
      mount_policy: '仅挂载工作区',
      ready: item.workspace_status !== 'error',
      last_error: null,
    },
    llm: {
      mode: item.llm_mode,
      provider: 'openai_compatible',
      model: item.llm_model,
      api_key_configured: true,
    },
    channels: defaultChannels(item.channel_summary),
    last_error: item.status === 'error' ? '最近一次运行操作失败' : null,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

function defaultChannels(summary: AgentItem['channel_summary']): ChannelBinding[] {
  const statusOf = (channel: SupportedChannelType) => summary.find((item) => item.channel === channel)?.status || 'unbound'
  return [
    { channel: 'feishu', display_name: '飞书', enabled: true, bind_mode: 'qr_or_manual', status: statusOf('feishu'), bound_account_display: statusOf('feishu') === 'bound' ? 'ou_****1001' : null },
    { channel: 'weixin', display_name: '微信', enabled: true, bind_mode: 'qr_or_manual', status: statusOf('weixin'), bound_account_display: statusOf('weixin') === 'bound' ? 'wx_****6688' : null },
    { channel: 'qq', display_name: 'QQ', enabled: true, bind_mode: 'qr_or_manual', status: statusOf('qq'), bound_account_display: statusOf('qq') === 'bound' ? 'qq_****8899' : null },
    { channel: 'wecom', display_name: '企业微信', enabled: false, bind_mode: 'webhook', status: 'unbound', disabled_reason: '预留公网回调能力后开放' },
  ]
}

function updateMockAgent(agentId: string, updater: (item: AgentItem) => AgentItem) {
  const agents = readMockAgents()
  const next = agents.map((item) => (item.agent_id === agentId ? updater(item) : item))
  writeMockAgents(next)
  return next.find((item) => item.agent_id === agentId)
}

export function listAgents(params: AgentListParams = {}) {
  return withMockFallback(
    () => request<AgentListResponse>({ method: 'GET', url: AGENTS_URL, params }),
    () => {
      let items = readMockAgents()
      if (params.status) items = items.filter((item) => item.status === params.status)
      if (params.channel) items = items.filter((item) => item.channel_summary.some((channel) => channel.channel === params.channel))
      return { items, total: items.length, page: params.page || 1, size: params.size || 20 }
    },
  )
}

export function createAgent(payload: CreateAgentPayload) {
  return withMockFallback(
    () => request<AgentItem>({ method: 'POST', url: AGENTS_URL, data: payload }),
    () => {
      const timestamp = nowIso()
      const agent: AgentItem = {
        agent_id: `agt_${Date.now().toString(36)}`,
        agent_name: payload.agent_name,
        status: payload.auto_start_gateway === false ? 'ready' : 'running',
        gateway_status: payload.auto_start_gateway === false ? 'stopped' : 'running',
        terminal_backend: 'docker',
        container_workspace: '/workspace',
        workspace_status: 'ready',
        llm_mode: 'platform',
        llm_model: 'openai/gpt-5.5',
        channel_summary: [],
        last_active_at: null,
        created_at: timestamp,
        updated_at: timestamp,
      }
      writeMockAgents([agent, ...readMockAgents()])
      const personas = readMockPersona()
      personas[agent.agent_id] = {
        soul: payload.soul || `# ${payload.agent_name}\n\n你是用户的个人助理。`,
        user_profile: payload.user_profile || '# User\n\n用户希望你记住这些偏好。',
      }
      writeMockPersona(personas)
      return agent
    },
  )
}

export function getAgent(agentId: string) {
  return withMockFallback(
    () => request<AgentDetail>({ method: 'GET', url: `${AGENTS_URL}/${agentId}` }),
    () => {
      const item = readMockAgents().find((agent) => agent.agent_id === agentId)
      if (!item) throw new Error('Agent 不存在')
      return toDetail(item)
    },
  )
}

export function updateAgent(agentId: string, payload: UpdateAgentPayload) {
  return withMockFallback(
    () => request<AgentDetail>({ method: 'PATCH', url: `${AGENTS_URL}/${agentId}`, data: payload }),
    () => {
      const item = updateMockAgent(agentId, (agent) => ({ ...agent, agent_name: payload.agent_name || agent.agent_name, updated_at: nowIso() }))
      if (!item) throw new Error('Agent 不存在')
      return toDetail(item)
    },
  )
}

export function deleteAgent(agentId: string) {
  return withMockFallback(
    () => request<DeleteAgentResponse>({ method: 'DELETE', url: `${AGENTS_URL}/${agentId}` }),
    () => {
      writeMockAgents(readMockAgents().filter((agent) => agent.agent_id !== agentId))
      return { agent_id: agentId, status: 'deleted' }
    },
  )
}

export function getSoul(agentId: string) {
  return withMockFallback(
    () => request<PersonaDocument>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/soul` }),
    () => ({ agent_id: agentId, kind: 'soul' as const, content: readMockPersona()[agentId]?.soul || '# Agent\n\n你是用户的个人助理。', updated_at: nowIso(), effective_policy: 'next_message' }),
  )
}

export function saveSoul(agentId: string, content: string) {
  return withMockFallback(
    () => request<PersonaDocument>({ method: 'PUT', url: `${AGENTS_URL}/${agentId}/soul`, data: { content } }),
    () => {
      const personas = readMockPersona()
      personas[agentId] = { soul: content, user_profile: personas[agentId]?.user_profile || '# User\n' }
      writeMockPersona(personas)
      return { agent_id: agentId, kind: 'soul' as const, content, updated_at: nowIso(), effective_policy: 'next_message' }
    },
  )
}

export function getUserProfile(agentId: string) {
  return withMockFallback(
    () => request<PersonaDocument>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/user-profile` }),
    () => ({ agent_id: agentId, kind: 'user_profile' as const, content: readMockPersona()[agentId]?.user_profile || '# User\n\n用户希望你记住这些偏好。', updated_at: nowIso(), effective_policy: 'next_message' }),
  )
}

export function saveUserProfile(agentId: string, content: string) {
  return withMockFallback(
    () => request<PersonaDocument>({ method: 'PUT', url: `${AGENTS_URL}/${agentId}/user-profile`, data: { content } }),
    () => {
      const personas = readMockPersona()
      personas[agentId] = { soul: personas[agentId]?.soul || '# Agent\n', user_profile: content }
      writeMockPersona(personas)
      return { agent_id: agentId, kind: 'user_profile' as const, content, updated_at: nowIso(), effective_policy: 'next_message' }
    },
  )
}

export function listChannels(agentId: string) {
  return withMockFallback(
    () => request<ChannelBinding[]>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/channels` }),
    () => {
      const item = readMockAgents().find((agent) => agent.agent_id === agentId)
      return defaultChannels(item?.channel_summary || [])
    },
  )
}

export function startChannelQr(agentId: string, channel: SupportedChannelType, ttlSeconds = 300) {
  return withExplicitMockOnly(
    () => request<StartQrResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/qr/start`, data: { ttl_seconds: ttlSeconds } }),
    () => ({ session_id: `${channel}_${Date.now().toString(36)}`, channel, status: 'waiting_scan' as const, expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString(), qr_url: `https://huanxing.ai/bind/${channel}`, qrcode_img_content: null, message: '请扫码确认绑定' }),
  )
}

export function getChannelQrStatus(agentId: string, channel: SupportedChannelType, sessionId: string) {
  return withExplicitMockOnly(
    () => request<QrStatusResponse>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/channels/${channel}/qr/${sessionId}/status` }),
    () => {
      const status = Date.now() % 3 === 0 ? 'bound' as const : 'waiting_scan' as const
      if (status === 'bound') {
        updateMockAgent(agentId, (agent) => ({
          ...agent,
          channel_summary: [
            ...agent.channel_summary.filter((item) => item.channel !== channel),
            { channel, status, display_name: channelLabel(channel), updated_at: nowIso() },
          ],
          updated_at: nowIso(),
        }))
      }
      return { session_id: sessionId, channel, status, message: status === 'bound' ? '绑定成功' : '等待扫码确认', updated_at: nowIso() }
    },
  )
}

export function manualBindChannel(agentId: string, channel: SupportedChannelType, payload: ManualChannelPayload) {
  return withExplicitMockOnly(
    () => request<ChannelActionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/manual`, data: payload }),
    () => {
      updateMockAgent(agentId, (agent) => ({
        ...agent,
        channel_summary: [...agent.channel_summary.filter((item) => item.channel !== channel), { channel, status: 'bound', display_name: channelLabel(channel), updated_at: nowIso() }],
        updated_at: nowIso(),
      }))
      return { channel, status: 'bound' as const, metadata: { configured: true } }
    },
  )
}

export function testChannel(agentId: string, channel: SupportedChannelType) {
  return withExplicitMockOnly(
    () => request<ChannelActionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/test` }),
    () => ({ channel, status: 'bound' as const, metadata: { test_result: 'ok' } }),
  )
}

export function unbindChannel(agentId: string, channel: SupportedChannelType) {
  return withExplicitMockOnly(
    () => request<ChannelActionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/unbind` }),
    () => {
      updateMockAgent(agentId, (agent) => ({ ...agent, channel_summary: agent.channel_summary.filter((item) => item.channel !== channel), updated_at: nowIso() }))
      return { channel, status: 'unbound' as const }
    },
  )
}

export function getGatewayStatus(agentId: string) {
  return withMockFallback(
    () => request<GatewayInfo>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/gateway/status` }),
    () => toDetail(readMockAgents().find((agent) => agent.agent_id === agentId) || readMockAgents()[0]).gateway,
  )
}

export function operateGateway(agentId: string, action: 'start' | 'restart' | 'stop') {
  return withMockFallback(
    () => request<GatewayInfo>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/gateway/${action}` }),
    () => {
      const status = action === 'stop' ? 'stopped' : 'running'
      const item = updateMockAgent(agentId, (agent) => ({ ...agent, status, gateway_status: status, updated_at: nowIso() }))
      if (!item) throw new Error('Agent 不存在')
      return toDetail(item).gateway
    },
  )
}

export function getWorkspaceStatus(agentId: string) {
  return withMockFallback(
    () => request<WorkspaceInfo>({ method: 'GET', url: `${AGENTS_URL}/${agentId}/workspace/status` }),
    () => toDetail(readMockAgents().find((agent) => agent.agent_id === agentId) || readMockAgents()[0]).workspace,
  )
}

export function sendChatCompletion(agentId: string, messages: ChatMessage[]) {
  return withMockFallback(
    () => request<ChatCompletionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/chat/completions`, data: { messages, stream: false } }),
    () => ({
      id: `chatcmpl_${Date.now().toString(36)}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      choices: [{ index: 0, message: { role: 'assistant' as const, content: '这是 Web Chat 的本地预览回复。后端接通后会返回真实 Agent 响应。' }, finish_reason: 'stop' }],
    }),
  )
}

function channelLabel(channel: SupportedChannelType) {
  const labels: Record<SupportedChannelType, string> = {
    feishu: '飞书',
    weixin: '微信',
    qq: 'QQ',
    wecom: '企业微信',
    webhook: 'Webhook',
  }
  return labels[channel]
}

export function listTemplates() {
  return withMockFallback<AgentTemplate[]>(
    () => request<AgentTemplate[]>({ method: 'GET', url: TEMPLATES_URL }),
    () => TEMPLATE_FALLBACK,
  )
}

export function getUsageSummary(agentId: string, params: UsageSummaryParams = {}) {
  const query: Record<string, string> = { agent_id: agentId }
  if (params.startTime) query.start_time = params.startTime
  if (params.endTime) query.end_time = params.endTime
  return withMockFallback<UsageSummary>(
    () => request<UsageSummary>({ method: 'GET', url: USAGE_SUMMARY_URL, params: query }),
    () => mockUsageSummary(agentId),
  )
}

function mockUsageSummary(agentId: string): UsageSummary {
  return {
    agent_id: agentId,
    total_tokens: 12480,
    total_cost: 1.86,
    start_time: null,
    end_time: nowIso(),
    by_model: [
      { model_name: 'openai/gpt-5.5', request_count: 32, total_tokens: 9120, total_cost: 1.42 },
      { model_name: 'anthropic/claude-sonnet-4-6', request_count: 11, total_tokens: 3360, total_cost: 0.44 },
    ],
  }
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
  if (shouldForceMock()) {
    const reply = '这是 Web Chat 的本地预览回复。后端接通后会返回真实 Agent 响应。'
    for (const chunk of reply.match(/.{1,8}/g) || [reply]) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }
      onChunk(chunk)
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
    return
  }

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
