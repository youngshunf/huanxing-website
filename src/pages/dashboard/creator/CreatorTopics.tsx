import { useEffect, useState } from 'react'
import { Lightbulb, Check, SkipForward, TrendingUp, Zap } from 'lucide-react'
import { useCreatorStore } from '../../../stores/useCreatorStore'

const STATUS_TABS = [
  { value: undefined, label: '全部' },
  { value: 0, label: '待处理' },
  { value: 1, label: '已采纳' },
  { value: 2, label: '已跳过' },
]

const STATUS_LABEL: Record<number, string> = {
  0: '待处理',
  1: '已采纳',
  2: '已跳过',
}

const STATUS_COLOR: Record<number, string> = {
  0: 'text-star-gold bg-star-gold/10',
  1: 'text-green-400 bg-green-400/10',
  2: 'text-text-secondary bg-space-float',
}

export default function CreatorTopics() {
  const { topics, topicsLoading, fetchTopics, adoptTopic, skipTopic } = useCreatorStore()
  const [activeStatus, setActiveStatus] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [actioningId, setActioningId] = useState<number | null>(null)

  useEffect(() => {
    fetchTopics({ status: activeStatus, page, page_size: 20 })
  }, [fetchTopics, activeStatus, page])

  const handleAdopt = async (id: number) => {
    setActioningId(id)
    try {
      await adoptTopic(id)
    } finally {
      setActioningId(null)
    }
  }

  const handleSkip = async (id: number) => {
    setActioningId(id)
    try {
      await skipTopic(id)
    } finally {
      setActioningId(null)
    }
  }

  const items = topics?.items || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">选题池</h1>
        <p className="mt-1 text-text-secondary">AI 推荐的选题，采纳后自动创建内容</p>
      </div>

      {/* 状态筛选 */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => { setActiveStatus(tab.value as number | undefined); setPage(1) }}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              activeStatus === tab.value
                ? 'bg-star-purple/10 font-medium text-star-purple'
                : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {topicsLoading && !topics ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-divider bg-space-panel py-20 text-text-secondary">
          <Lightbulb className="mb-3 h-10 w-10 opacity-40" />
          <p>暂无选题</p>
          <p className="mt-1 text-sm">AI 助手会自动为你推荐热门选题</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-divider bg-space-panel p-5 transition-all hover:border-star-purple/30"
              >
                {/* 标题 + 状态 */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-text-primary leading-tight">{t.title}</h3>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${STATUS_COLOR[t.status]}`}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </div>

                {/* 热度 + 潜力评分 */}
                <div className="mb-3 flex gap-4 text-sm">
                  {t.heat_index != null && (
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-star-gold" />
                      <span className="text-text-secondary">热度</span>
                      <span className="font-semibold text-star-gold">{t.heat_index.toFixed(1)}</span>
                    </div>
                  )}
                  {t.potential_score != null && (
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-star-blue" />
                      <span className="text-text-secondary">潜力</span>
                      <span className="font-semibold text-star-blue">{t.potential_score.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* 推荐理由 */}
                {t.reason && (
                  <p className="mb-4 text-sm text-text-secondary line-clamp-2">{t.reason}</p>
                )}

                {/* 采纳内容链接 */}
                {t.status === 1 && t.content_id && (
                  <div className="mb-3 text-xs text-green-400">
                    已创建内容 #{t.content_id}
                  </div>
                )}

                {/* 操作按钮（只有待处理状态显示） */}
                {t.status === 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdopt(t.id)}
                      disabled={actioningId === t.id}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-star-purple/10 px-3 py-2 text-sm font-medium text-star-purple transition-colors disabled:opacity-50 hover:bg-star-purple/20"
                    >
                      <Check className="h-4 w-4" />
                      采纳
                    </button>
                    <button
                      onClick={() => handleSkip(t.id)}
                      disabled={actioningId === t.id}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-divider px-3 py-2 text-sm text-text-secondary transition-colors disabled:opacity-50 hover:bg-space-float hover:text-text-primary"
                    >
                      <SkipForward className="h-4 w-4" />
                      跳过
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 分页 */}
          {topics && topics.total > 20 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-divider px-4 py-2 text-sm text-text-secondary disabled:opacity-40 hover:bg-space-float"
              >
                上一页
              </button>
              <span className="text-sm text-text-secondary">
                第 {page} 页 / 共 {Math.ceil(topics.total / 20)} 页
              </span>
              <button
                disabled={page >= Math.ceil(topics.total / 20)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-divider px-4 py-2 text-sm text-text-secondary disabled:opacity-40 hover:bg-space-float"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
