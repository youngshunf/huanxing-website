import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bot, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { listAgents } from '../../../api/agent'
import AgentCard from '../../../components/agent/AgentCard'
import CreateAgentModal from '../../../components/agent/CreateAgentModal'
import AgentStatusBadge from '../../../components/agent/AgentStatusBadge'
import type { AgentItem } from '../../../types/agent'

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listAgents({ page: 1, size: 50 })
      setAgents(data.items || [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '无法加载 Agent 列表')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const stats = useMemo(() => {
    const online = agents.filter((agent) => agent.status === 'running' || agent.gateway_status === 'running').length
    const pending = agents.filter((agent) => ['creating', 'created', 'ready', 'stopped'].includes(agent.status)).length
    const errors = agents.filter((agent) => agent.status === 'error' || agent.gateway_status === 'error' || agent.gateway_status === 'unhealthy').length
    return { total: agents.length, online, pending, errors }
  }, [agents])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-text-primary"><Bot className="h-7 w-7 text-star-purple" />AI Agent</h1>
          <p className="mt-2 max-w-2xl text-text-secondary">创建和管理你的云端托管 Agent，绑定 IM 后可持续在线。</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-star-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-star-purple-hover">
          <Plus className="h-4 w-4" />创建 Agent
        </button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-divider bg-space-panel p-4">
        <AgentStatusBadge status="ok" label={`全部 ${stats.total}`} />
        <AgentStatusBadge status="running" label={`在线 ${stats.online}`} />
        <AgentStatusBadge status="warning" label={`待配置 ${stats.pending}`} />
        <AgentStatusBadge status="error" label={`异常 ${stats.errors}`} />
      </div>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-divider bg-space-panel py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" /></div>
      ) : agents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-divider bg-space-panel p-10 text-center">
          <Bot className="mx-auto mb-4 h-10 w-10 text-star-purple" />
          <h2 className="text-lg font-semibold text-text-primary">还没有 Agent</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">创建你的第一个云端 Agent，绑定飞书或微信后，它可以在你常用的 IM 中持续在线。</p>
          <button onClick={() => setShowCreate(true)} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-star-purple px-4 py-2 text-sm font-medium text-white hover:bg-star-purple-hover"><Plus className="h-4 w-4" />创建 Agent</button>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent) => <AgentCard key={agent.agent_id} agent={agent} />)}
        </div>
      )}

      <CreateAgentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(agent) => {
          setShowCreate(false)
          setAgents((current) => [agent, ...current.filter((item) => item.agent_id !== agent.agent_id)])
          navigate(`/dashboard/agents/${agent.agent_id}`)
        }}
      />
    </div>
  )
}
