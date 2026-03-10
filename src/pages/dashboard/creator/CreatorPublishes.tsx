import { useEffect, useState } from 'react'
import { Share2, Eye, ThumbsUp, MessageCircle, Bookmark, BarChart3 } from 'lucide-react'
import { useCreatorStore } from '../../../stores/useCreatorStore'

const PLATFORMS = ['全部', 'xiaohongshu', 'douyin', 'wechat', 'weibo', 'bilibili']
const PLATFORM_LABEL: Record<string, string> = {
  xiaohongshu: '小红书',
  douyin: '抖音',
  wechat: '微信',
  weibo: '微博',
  bilibili: 'B站',
}

export default function CreatorPublishes() {
  const { publishes, publishesLoading, fetchPublishes } = useCreatorStore()
  const [platform, setPlatform] = useState<string | undefined>(undefined)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPublishes({ platform, page, page_size: 20 })
  }, [fetchPublishes, platform, page])

  const items = publishes?.items || []
  const totalViews = items.reduce((s, p) => s + (p.views || 0), 0)
  const totalLikes = items.reduce((s, p) => s + (p.likes || 0), 0)
  const totalComments = items.reduce((s, p) => s + (p.comments || 0), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">发布记录</h1>
        <p className="mt-1 text-text-secondary">查看所有平台的发布数据</p>
      </div>

      {/* 统计卡片 */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Eye className="h-5 w-5 text-star-blue" />} label="总阅读" value={totalViews.toLocaleString()} />
        <StatCard icon={<ThumbsUp className="h-5 w-5 text-star-gold" />} label="总点赞" value={totalLikes.toLocaleString()} />
        <StatCard icon={<MessageCircle className="h-5 w-5 text-star-purple" />} label="总评论" value={totalComments.toLocaleString()} />
      </div>

      {/* 平台筛选 */}
      <div className="mb-5 flex items-center gap-2">
        <span className="text-sm text-text-secondary">平台：</span>
        <select
          value={platform ?? '全部'}
          onChange={(e) => {
            const v = e.target.value
            setPlatform(v === '全部' ? undefined : v)
            setPage(1)
          }}
          className="rounded-lg border border-divider bg-space-float px-3 py-1.5 text-sm text-text-primary outline-none focus:border-star-purple/50"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABEL[p] || p}
            </option>
          ))}
        </select>
      </div>

      {publishesLoading && !publishes ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-divider bg-space-panel py-20 text-text-secondary">
          <Share2 className="mb-3 h-10 w-10 opacity-40" />
          <p>暂无发布记录</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-divider bg-space-panel">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider text-left text-text-secondary">
                  <th className="px-4 py-3 font-medium">标题</th>
                  <th className="px-4 py-3 font-medium max-sm:hidden">平台</th>
                  <th className="px-4 py-3 font-medium">
                    <Eye className="inline h-3.5 w-3.5" />
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <ThumbsUp className="inline h-3.5 w-3.5" />
                  </th>
                  <th className="px-4 py-3 font-medium max-md:hidden">
                    <MessageCircle className="inline h-3.5 w-3.5" />
                  </th>
                  <th className="px-4 py-3 font-medium max-lg:hidden">
                    <Bookmark className="inline h-3.5 w-3.5" />
                  </th>
                  <th className="px-4 py-3 font-medium max-lg:hidden">
                    <BarChart3 className="inline h-3.5 w-3.5" /> 分享
                  </th>
                  <th className="px-4 py-3 font-medium max-md:hidden">发布时间</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-divider last:border-0 hover:bg-space-float/30">
                    <td className="px-4 py-3 text-text-primary">
                      <div className="max-w-[200px] truncate">
                        {p.publish_url ? (
                          <a
                            href={p.publish_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-star-blue hover:underline"
                          >
                            内容 #{p.content_id}
                          </a>
                        ) : (
                          <span>内容 #{p.content_id}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary max-sm:hidden">
                      {PLATFORM_LABEL[p.platform] || p.platform}
                    </td>
                    <td className="px-4 py-3 text-text-primary">{p.views?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-star-gold">{p.likes?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-text-primary max-md:hidden">{p.comments?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-text-primary max-lg:hidden">{p.favorites?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-text-primary max-lg:hidden">{p.shares?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-text-secondary max-md:hidden">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString('zh-CN') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {publishes && publishes.total > 20 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-divider px-4 py-2 text-sm text-text-secondary disabled:opacity-40 hover:bg-space-float"
              >
                上一页
              </button>
              <span className="text-sm text-text-secondary">
                第 {page} 页 / 共 {Math.ceil(publishes.total / 20)} 页
              </span>
              <button
                disabled={page >= Math.ceil(publishes.total / 20)}
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-divider bg-space-panel p-5">
      <div className="mb-3 flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-xl font-bold text-text-primary">{value}</div>
    </div>
  )
}
