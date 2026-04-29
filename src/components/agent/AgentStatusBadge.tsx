import type { AgentStatus, ChannelStatus, GatewayStatus, WorkspaceStatus } from '../../types/agent'

type Status = AgentStatus | GatewayStatus | ChannelStatus | WorkspaceStatus | 'ok' | 'warning'

const LABELS: Record<string, string> = {
  creating: '创建中',
  created: '已创建',
  ready: '待配置',
  running: '在线',
  stopped: '已停止',
  error: '异常',
  deleting: '删除中',
  deleted: '已删除',
  starting: '启动中',
  restarting: '重启中',
  stopping: '停止中',
  unhealthy: '不健康',
  unknown: '未知',
  active: '运行中',
  unbound: '未绑定',
  qr_ready: '二维码就绪',
  waiting_scan: '等待扫码',
  scanned: '已扫码',
  confirmed: '已确认',
  writing_config: '写入配置',
  restarting_gateway: '重启中',
  testing_connection: '测试中',
  bound: '已绑定',
  expired: '已过期',
  failed: '失败',
  cancelled: '已取消',
  ok: '正常',
  warning: '注意',
}

function toneClass(status: Status) {
  if (['running', 'ready', 'bound', 'ok'].includes(status)) return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
  if (['creating', 'starting', 'restarting', 'stopping', 'waiting_scan', 'scanned', 'confirmed', 'writing_config', 'testing_connection', 'active', 'qr_ready'].includes(status)) return 'border-star-blue/25 bg-star-blue/10 text-star-blue'
  if (['error', 'unhealthy', 'failed'].includes(status)) return 'border-red-500/25 bg-red-500/10 text-red-400'
  if (['expired', 'cancelled', 'warning'].includes(status)) return 'border-orange-500/25 bg-orange-500/10 text-orange-400'
  return 'border-divider bg-space-float text-text-secondary'
}

export default function AgentStatusBadge({ status, label }: { status: Status; label?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass(status)}`}>
      {label || LABELS[status] || status}
    </span>
  )
}
