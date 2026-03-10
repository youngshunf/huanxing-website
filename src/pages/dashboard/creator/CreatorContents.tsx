import { useEffect, useState } from 'react'
import { PenTool, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { useCreatorStore } from '../../../stores/useCreatorStore'
import type { CreatorContent } from '../../../types/creator'

const STATUS_TABS = [
  { value: undefined, label: '全部' },
  { value: 'idea', label: '创意' },
  { value: 'drafting', label: '创作中' },
  { value: 'reviewing', label: '审核中' },
  { value: 'ready', label: '待发布' },
  { value: 'published', label: '已发布' },
  { value: 'completed', label: '已完成' },
  { value: 'archived', label: '已归档' },
]

const STATUS_COLOR: Record<string, string> = {
  idea: 'text-star-gold bg-star-gold/10',
  researching: 'text-blue-400 bg-blue-400/10',
  drafting: 'text-star-purple bg-star-purple/10',
  reviewing: 'text-orange-400 bg-orange-400/10',
  ready: 'text-green-400 bg-green-400/10',
  published: 'text-star-blue bg-star-blue/10',
  analyzing: 'text-pink-400 bg-pink-400/10',
  completed: 'text-text-secondary bg-space-float',
  archived: 'text-text-secondary bg-space-float',
}

const STATUS_LABEL: Record<string, string> = {
  idea: '创意',
  researching: '调研中',
  drafting: '创作中',
  reviewing: '审核中',
  ready: '待发布',
  published: '已发布',
  analyzing: '分析中',
  completed: '已完成',
  archived: '已归档',
}

export default function CreatorContents() {
  const { contents, contentsLoading, fetchContents, contentDetail, fetchContentDetail } = useCreatorStore()
  const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchContents({ status: activeStatus, page, page_size: 20 })
  }, [fetchContents, activeStatus, page])

  const handleToggle = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      fetchContentDetail(id)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">内容管理</h1>
        <p className="mt-1 text-text-secondary">查看和管理所有创作内容</p>
      </div>

      {/* 状态筛选 Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => { setActiveStatus(tab.value); setPage(1) }}
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

      {contentsLoading && !contents ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : !contents || contents.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-divider bg-space-panel py-20 text-text-secondary">
          <PenTool className="mb-3 h-10 w-10 opacity-40" />
          <p>暂无内容</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {contents.items.map((c) => (
              <ContentCard
                key={c.id}
                content={c}
                expanded={expandedId === c.id}
                onToggle={() => handleToggle(c.id)}
                detail={expandedId === c.id && contentDetail?.id === c.id ? contentDetail : null}
                detailLoading={contentsLoading}
              />
            ))}
          </div>

          {/* 分页 */}
          {contents.total > 20 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-divider px-4 py-2 text-sm text-text-secondary disabled:opacity-40 hover:bg-space-float"
              >
                上一页
              </button>
              <span className="text-sm text-text-secondary">
                第 {page} 页 / 共 {Math.ceil(contents.total / 20)} 页
              </span>
              <button
                disabled={page >= Math.ceil(contents.total / 20)}
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

function ContentCard({
  content,
  expanded,
  onToggle,
  detail,
  detailLoading,
}: {
  content: CreatorContent
  expanded: boolean
  onToggle: () => void
  detail: ReturnType<typeof useCreatorStore.getState>['contentDetail']
  detailLoading: boolean
}) {
  return (
    <div className="rounded-xl border border-divider bg-space-panel transition-all hover:border-star-purple/20">
      <button
        className="flex w-full items-center gap-4 p-4 text-left"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-text-primary truncate">{content.title}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[content.status] || 'text-text-secondary bg-space-float'}`}>
              {STATUS_LABEL[content.status] || content.status}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(content.created_time).toLocaleDateString('zh-CN')}
            </span>
            {content.pipeline_mode && (
              <span>{content.pipeline_mode}</span>
            )}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-text-secondary" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-divider px-4 pb-4">
          {detailLoading && !detail ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
            </div>
          ) : detail ? (
            <div className="pt-4 space-y-4">
              {/* 阶段产出 */}
              {detail.stages.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    阶段产出
                  </h4>
                  <div className="space-y-2">
                    {detail.stages.map((s) => (
                      <div key={s.id} className="rounded-lg bg-space-float p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-star-purple">{s.stage}</span>
                          {s.version && (
                            <span className="text-xs text-text-secondary">v{s.version}</span>
                          )}
                        </div>
                        {s.content_text && (
                          <p className="mt-2 text-sm text-text-primary line-clamp-3 whitespace-pre-wrap">
                            {s.content_text}
                          </p>
                        )}
                        {s.file_url && (
                          <a
                            href={s.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 block text-xs text-star-blue hover:underline"
                          >
                            查看文件
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 发布记录 */}
              {detail.publishes.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    发布记录
                  </h4>
                  <div className="overflow-hidden rounded-lg border border-divider">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-divider text-left text-text-secondary">
                          <th className="px-3 py-2 font-medium">平台</th>
                          <th className="px-3 py-2 font-medium">状态</th>
                          <th className="px-3 py-2 font-medium">阅读</th>
                          <th className="px-3 py-2 font-medium">点赞</th>
                          <th className="px-3 py-2 font-medium max-sm:hidden">发布时间</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.publishes.map((p) => (
                          <tr key={p.id} className="border-b border-divider last:border-0">
                            <td className="px-3 py-2 text-text-primary">{p.platform}</td>
                            <td className="px-3 py-2 text-text-secondary">{p.status || '-'}</td>
                            <td className="px-3 py-2 text-text-primary">{p.views ?? '-'}</td>
                            <td className="px-3 py-2 text-text-primary">{p.likes ?? '-'}</td>
                            <td className="px-3 py-2 text-text-secondary max-sm:hidden">
                              {p.published_at ? new Date(p.published_at).toLocaleDateString('zh-CN') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
