import { Check, Loader2, AlertCircle, Minus } from 'lucide-react'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface SaveIndicatorProps {
  status: SaveStatus
  version?: number
}

const STATUS_CONFIG = {
  saved: { icon: Check, text: '已保存', color: 'text-green-400' },
  saving: { icon: Loader2, text: '保存中...', color: 'text-yellow-400', spin: true },
  unsaved: { icon: Minus, text: '未保存', color: 'text-text-tertiary' },
  error: { icon: AlertCircle, text: '保存失败', color: 'text-red-400' },
}

export default function SaveIndicator({ status, version }: SaveIndicatorProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-1.5 text-xs ${config.color}`}>
      <Icon className={`h-3.5 w-3.5 ${'spin' in config && config.spin ? 'animate-spin' : ''}`} />
      <span>
        {config.text}
        {status === 'saved' && version ? ` v${version}` : ''}
      </span>
    </div>
  )
}
