import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Activity, Bot, Folder, MessageCircle, Play, RefreshCw, Save, Square, Trash2 } from 'lucide-react'
import { deleteAgent, getAgent, getSoul, getUserProfile, getWorkspaceStatus, operateGateway, saveSoul, saveUserProfile, updateAgent } from '../../../api/agent'
import AgentStatusBadge from '../../../components/agent/AgentStatusBadge'
import ChannelBindingPanel from '../../../components/agent/ChannelBindingPanel'
import type { AgentDetail } from '../../../types/agent'

type Tab = 'overview' | 'settings' | 'channels' | 'workspace' | 'runtime'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'overview', label: '概览' },
  { key: 'settings', label: '设定' },
  { key: 'channels', label: 'IM 渠道' },
  { key: 'workspace', label: '工作区' },
  { key: 'runtime', label: '运行状态' },
]

export default function AgentDetailPage() {
  const { agentId = '' } = useParams()
  const [agent, setAgent] = useState<AgentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const refresh = useCallback(async () => {
    if (!agentId) return
    setLoading(true)
    try {
      setAgent(await getAgent(agentId))
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function handleGateway(action: 'start' | 'restart' | 'stop') {
    if (action === 'stop' && !window.confirm('确定要停止 Gateway 吗？停止后 IM 和 Web Chat 将暂时不可用。')) return
    setBusy(true)
    try {
      const gateway = await operateGateway(agentId, action)
      setAgent((current) => current ? { ...current, gateway, status: gateway.status === 'running' ? 'running' : current.status } : current)
      setNotice(action === 'restart' ? 'Gateway 重启请求已发送' : 'Gateway 状态已更新')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('确定要删除这个 Agent 吗？业务记录将被移除，工作区默认保留用于审计和恢复。')) return
    await deleteAgent(agentId)
    navigate('/dashboard/agents')
  }

  const boundCount = useMemo(() => agent?.channels.filter((channel) => channel.status === 'bound').length || 0, [agent])

  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" /></div>
  if (!agent) return <div className="rounded-xl border border-divider bg-space-panel p-8 text-text-secondary">Agent 不存在或暂无权限访问。</div>

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-xl border border-divider bg-space-panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold text-text-primary">{agent.agent_name}</h1>
              <AgentStatusBadge status={agent.status} />
              <AgentStatusBadge status={agent.gateway.status} label={`Gateway ${agent.gateway.status}`} />
            </div>
            <p className="text-sm text-text-secondary">{agent.template} · {agent.llm.model || '平台默认模型'} · Workspace {agent.workspace.status === 'ready' ? '可用' : agent.workspace.status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/dashboard/agents/${agent.agent_id}/chat`} className="inline-flex items-center gap-2 rounded-lg border border-divider px-3 py-2 text-sm text-text-primary hover:border-star-blue/50 hover:text-star-blue"><MessageCircle className="h-4 w-4" />进入对话</Link>
            <button disabled={busy} onClick={() => handleGateway('restart')} className="inline-flex items-center gap-2 rounded-lg bg-star-purple px-3 py-2 text-sm font-medium text-white hover:bg-star-purple-hover disabled:opacity-60"><RefreshCw className="h-4 w-4" />重启 Gateway</button>
            <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" />删除</button>
          </div>
        </div>
      </div>

      {notice && <div className="rounded-lg border border-star-blue/30 bg-star-blue/10 px-4 py-3 text-sm text-star-blue">{notice}</div>}

      <div className="overflow-x-auto rounded-xl border border-divider bg-space-panel p-2">
        <div className="flex min-w-max gap-1">
          {TABS.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`rounded-lg px-4 py-2 text-sm transition-colors ${tab === item.key ? 'bg-star-purple/10 font-medium text-star-purple' : 'text-text-secondary hover:bg-space-float hover:text-text-primary'}`}>{item.label}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && <OverviewTab agent={agent} boundCount={boundCount} />}
      {tab === 'settings' && <SettingsTab agent={agent} onUpdated={setAgent} />}
      {tab === 'channels' && <ChannelBindingPanel agentId={agent.agent_id} onChanged={refresh} />}
      {tab === 'workspace' && <WorkspaceTab agent={agent} onRefresh={async () => setAgent({ ...agent, workspace: await getWorkspaceStatus(agent.agent_id) })} />}
      {tab === 'runtime' && <RuntimeTab agent={agent} busy={busy} onGateway={handleGateway} />}
    </div>
  )
}

function OverviewTab({ agent, boundCount }: { agent: AgentDetail; boundCount: number }) {
  const cards: Array<{ label: string; value: string; icon: React.ReactNode; status: React.ComponentProps<typeof AgentStatusBadge>['status'] }> = [
    { label: 'Gateway', value: agent.gateway.status, icon: <Activity className="h-5 w-5 text-star-blue" />, status: agent.gateway.status },
    { label: 'IM 渠道', value: `${boundCount} 个已绑定`, icon: <Bot className="h-5 w-5 text-star-purple" />, status: boundCount > 0 ? 'ok' : 'warning' },
    { label: 'Workspace', value: agent.workspace.status, icon: <Folder className="h-5 w-5 text-emerald-400" />, status: agent.workspace.status },
    { label: '最近活跃', value: agent.updated_at ? new Date(agent.updated_at).toLocaleString('zh-CN') : '暂无', icon: <MessageCircle className="h-5 w-5 text-star-gold" />, status: 'ok' },
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => <div key={card.label} className="rounded-xl border border-divider bg-space-panel p-5"><div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">{card.icon}{card.label}</div><div className="mb-3 text-lg font-semibold text-text-primary">{card.value}</div><AgentStatusBadge status={card.status} /></div>)}
      </div>
      <div className="rounded-xl border border-divider bg-space-panel p-5">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">最近事件</h2>
        <div className="space-y-3 text-sm text-text-secondary">
          <p>{new Date(agent.updated_at).toLocaleTimeString('zh-CN')} Agent 状态已同步</p>
          <p>{new Date(agent.created_at).toLocaleTimeString('zh-CN')} Workspace 挂载就绪</p>
          {boundCount > 0 && <p>{new Date(agent.updated_at).toLocaleTimeString('zh-CN')} IM 渠道绑定成功</p>}
        </div>
      </div>
    </div>
  )
}

function SettingsTab({ agent, onUpdated }: { agent: AgentDetail; onUpdated: (agent: AgentDetail) => void }) {
  const [name, setName] = useState(agent.agent_name)
  const [timezone, setTimezone] = useState(agent.timezone)
  const [soul, setSoul] = useState('')
  const [userProfile, setUserProfile] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadPersona() {
      const [soulDoc, userDoc] = await Promise.all([getSoul(agent.agent_id), getUserProfile(agent.agent_id)])
      if (!cancelled) {
        setSoul(soulDoc.content)
        setUserProfile(userDoc.content)
      }
    }
    loadPersona()
    return () => { cancelled = true }
  }, [agent.agent_id])

  async function handleSave() {
    setSaving(true)
    try {
      const [updated] = await Promise.all([
        updateAgent(agent.agent_id, { agent_name: name.trim(), timezone: timezone.trim() }),
        saveSoul(agent.agent_id, soul),
        saveUserProfile(agent.agent_id, userProfile),
      ])
      onUpdated(updated)
      setNotice('已保存，下一轮对话生效')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <div className="rounded-xl border border-divider bg-space-panel p-5">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">基础信息</h2>
        <label className="block"><span className="mb-1.5 block text-sm text-text-secondary">名称</span><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none" /></label>
        <label className="mt-4 block"><span className="mb-1.5 block text-sm text-text-secondary">时区</span><input value={timezone} onChange={(event) => setTimezone(event.target.value)} className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none" /></label>
        <p className="mt-4 text-sm text-text-secondary">模板：{agent.template}</p>
      </div>
      <div className="rounded-xl border border-divider bg-space-panel p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-text-primary">Persona</h2><button disabled={saving} onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-star-purple px-3 py-2 text-sm font-medium text-white hover:bg-star-purple-hover disabled:opacity-60"><Save className="h-4 w-4" />保存</button></div>
        {notice && <p className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{notice}</p>}
        <label className="block"><span className="mb-1.5 block text-sm text-text-secondary">SOUL.md</span><textarea value={soul} onChange={(event) => setSoul(event.target.value)} rows={8} className="w-full resize-y rounded-lg border border-divider bg-space-black px-4 py-3 font-mono text-sm text-text-primary focus:border-star-purple focus:outline-none" /></label>
        <label className="mt-4 block"><span className="mb-1.5 block text-sm text-text-secondary">USER.md</span><textarea value={userProfile} onChange={(event) => setUserProfile(event.target.value)} rows={6} className="w-full resize-y rounded-lg border border-divider bg-space-black px-4 py-3 font-mono text-sm text-text-primary focus:border-star-purple focus:outline-none" /></label>
      </div>
    </div>
  )
}

function WorkspaceTab({ agent, onRefresh }: { agent: AgentDetail; onRefresh: () => Promise<void> }) {
  return (
    <div className="rounded-xl border border-divider bg-space-panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold text-text-primary">工作区与执行沙箱</h2><button onClick={onRefresh} className="rounded-lg border border-divider px-3 py-2 text-sm text-text-primary hover:border-star-purple/50">刷新</button></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="挂载状态" value={agent.workspace.status} />
        <Info label="容器目录" value={agent.workspace.container_workspace || '/workspace'} />
        <Info label="文件数量" value={`${agent.workspace.file_count ?? 0}`} />
        <Info label="已用空间" value={`${Math.round((agent.workspace.bytes_used || 0) / 1024)} KB`} />
        <Info label="终端后端" value={agent.sandbox.terminal_backend} />
        <Info label="网络策略" value={agent.sandbox.network_policy} />
      </div>
      <p className="mt-4 text-sm text-text-secondary">宿主机真实路径和 profile 路径不会在浏览器中展示。</p>
    </div>
  )
}

function RuntimeTab({ agent, busy, onGateway }: { agent: AgentDetail; busy: boolean; onGateway: (action: 'start' | 'restart' | 'stop') => Promise<void> }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-divider bg-space-panel p-5">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Gateway</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Info label="状态" value={agent.gateway.status} /><Info label="API 可达" value={agent.gateway.api_server_reachable ? '可达' : '不可达'} /><Info label="重启次数" value={`${agent.gateway.restart_count ?? 0}`} /><Info label="启动时间" value={agent.gateway.started_at ? new Date(agent.gateway.started_at).toLocaleString('zh-CN') : '-'} /></div>
        {agent.gateway.last_error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{agent.gateway.last_error}</p>}
        <div className="mt-5 flex flex-wrap gap-2"><button disabled={busy} onClick={() => onGateway('start')} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"><Play className="h-4 w-4" />启动</button><button disabled={busy} onClick={() => onGateway('restart')} className="inline-flex items-center gap-2 rounded-lg border border-star-blue/30 px-3 py-2 text-sm text-star-blue hover:bg-star-blue/10"><RefreshCw className="h-4 w-4" />重启</button><button disabled={busy} onClick={() => onGateway('stop')} className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"><Square className="h-4 w-4" />停止</button></div>
      </div>
      <div className="rounded-xl border border-divider bg-space-panel p-5"><h2 className="mb-4 text-lg font-semibold text-text-primary">执行沙箱</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Info label="就绪" value={agent.sandbox.ready ? '正常' : '异常'} /><Info label="挂载策略" value={agent.sandbox.mount_policy} /><Info label="网络隔离" value={agent.sandbox.network_policy} /></div></div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg border border-divider bg-space-black p-4"><div className="text-xs text-text-secondary">{label}</div><div className="mt-1 break-words text-sm font-medium text-text-primary">{value}</div></div>
}
