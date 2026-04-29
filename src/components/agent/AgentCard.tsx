import { Activity, Folder, MessageCircle, Plug, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import AgentStatusBadge from './AgentStatusBadge'
import type { AgentItem } from '../../types/agent'

function formatDate(value?: string | null) {
  if (!value) return '暂无活跃'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '暂无活跃'
  const diff = Date.now() - date.getTime()
  const minutes = Math.max(1, Math.round(diff / 60000))
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  return date.toLocaleDateString('zh-CN')
}

export default function AgentCard({ agent }: { agent: AgentItem }) {
  const boundChannels = agent.channel_summary.filter((channel) => channel.status === 'bound')

  return (
    <article className="rounded-xl border border-divider bg-space-panel p-5 transition-all hover:border-star-purple/40 hover:shadow-[0_0_18px_rgba(108,92,231,0.12)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold text-text-primary">{agent.agent_name}</h2>
            <AgentStatusBadge status={agent.status} />
            <AgentStatusBadge status={agent.gateway_status} label={`Gateway ${agent.gateway_status === 'running' ? '运行中' : '未运行'}`} />
          </div>
          <div className="grid gap-3 text-sm text-text-secondary sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-center gap-2"><Plug className="h-4 w-4 text-star-purple" />{boundChannels.length > 0 ? `${boundChannels.length} 个渠道已绑定` : '未绑定渠道'}</div>
            <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-star-blue" />最近活跃 {formatDate(agent.last_active_at)}</div>
            <div className="flex min-w-0 items-center gap-2"><Settings className="h-4 w-4 text-star-gold" /><span className="truncate">模型 {agent.llm_model || '平台默认'}</span></div>
            <div className="flex items-center gap-2"><Folder className="h-4 w-4 text-emerald-400" />Workspace {agent.workspace_status === 'ready' ? '可用' : agent.workspace_status}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {agent.channel_summary.length === 0 ? (
              <AgentStatusBadge status="unbound" label="渠道待绑定" />
            ) : agent.channel_summary.map((channel) => (
              <AgentStatusBadge key={channel.channel} status={channel.status} label={`${channel.display_name || channel.channel} ${channel.status === 'bound' ? '已绑定' : '待绑定'}`} />
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
          <Link to={`/dashboard/agents/${agent.agent_id}/chat`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-divider px-3 py-2 text-sm text-text-primary hover:border-star-blue/50 hover:text-star-blue">
            <MessageCircle className="h-4 w-4" />进入对话
          </Link>
          <Link to={`/dashboard/agents/${agent.agent_id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-star-purple px-3 py-2 text-sm font-medium text-white hover:bg-star-purple-hover">
            <Settings className="h-4 w-4" />管理
          </Link>
        </div>
      </div>
    </article>
  )
}
