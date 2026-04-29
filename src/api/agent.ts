import { request } from './client'
import type {
  AgentDetail,
  AgentItem,
  AgentListParams,
  AgentListResponse,
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
  WorkspaceInfo,
} from '../types/agent'

const AGENTS_URL = '/hermes/app/agents'
const MOCK_STORAGE_KEY = 'huanxing_agent_mock_items'
const MOCK_PERSONA_KEY = 'huanxing_agent_mock_persona'

function shouldUseMock(error: unknown) {
  if (import.meta.env.VITE_HERMES_AGENT_MOCK === '0') return false
  if (error instanceof Error) {
    return /network|404|not found|failed|timeout/i.test(error.message)
  }
  return true
}

async function withMockFallback<T>(call: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await call()
  } catch (error) {
    if (!shouldUseMock(error)) throw error
    return fallback()
  }
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
      llm_model: 'anthropic/claude-sonnet-4.5',
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
        llm_model: 'anthropic/claude-sonnet-4.5',
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
  return withMockFallback(
    () => request<StartQrResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/qr/start`, data: { ttl_seconds: ttlSeconds } }),
    () => ({ session_id: `${channel}_${Date.now().toString(36)}`, channel, status: 'waiting_scan' as const, expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString(), qr_url: `https://huanxing.ai/bind/${channel}`, qrcode_img_content: null, message: '请扫码确认绑定' }),
  )
}

export function getChannelQrStatus(agentId: string, channel: SupportedChannelType, sessionId: string) {
  return withMockFallback(
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
  return withMockFallback(
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
  return withMockFallback(
    () => request<ChannelActionResponse>({ method: 'POST', url: `${AGENTS_URL}/${agentId}/channels/${channel}/test` }),
    () => ({ channel, status: 'bound' as const, metadata: { test_result: 'ok' } }),
  )
}

export function unbindChannel(agentId: string, channel: SupportedChannelType) {
  return withMockFallback(
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
