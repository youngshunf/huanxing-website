import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Eye, ThumbsUp, MessageCircle, BarChart3 } from 'lucide-react'
import { useCreatorStore } from '../../../stores/useCreatorStore'

const DAYS_OPTIONS = [
  { value: 7, label: '近7天' },
  { value: 14, label: '近14天' },
  { value: 30, label: '近30天' },
]

export default function CreatorAnalytics() {
  const {
    overview,
    trend,
    topContents,
    analyticsLoading,
    fetchOverview,
    fetchTrend,
    fetchTopContents,
  } = useCreatorStore()

  const [days, setDays] = useState(7)
  const [topMetric, setTopMetric] = useState<string>('views')

  useEffect(() => {
    fetchOverview(days)
    fetchTrend(days)
  }, [fetchOverview, fetchTrend, days])

  useEffect(() => {
    fetchTopContents({ metric: topMetric, limit: 10 })
  }, [fetchTopContents, topMetric])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">数据分析</h1>
        <p className="mt-1 text-text-secondary">查看创作数据趋势与内容排行</p>
      </div>

      {analyticsLoading && !overview ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : (
        <>
          {/* 统计卡片 */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Eye className="h-5 w-5 text-star-blue" />}
              label="总阅读"
              value={(overview?.total_views ?? 0).toLocaleString()}
            />
            <StatCard
              icon={<ThumbsUp className="h-5 w-5 text-star-gold" />}
              label="总点赞"
              value={(overview?.total_likes ?? 0).toLocaleString()}
            />
            <StatCard
              icon={<MessageCircle className="h-5 w-5 text-star-purple" />}
              label="总评论"
              value={(overview?.total_comments ?? 0).toLocaleString()}
            />
            <StatCard
              icon={<BarChart3 className="h-5 w-5 text-green-400" />}
              label="发布篇数"
              value={(overview?.total_publishes ?? 0).toLocaleString()}
            />
          </div>

          {/* 趋势图 */}
          <div className="mb-6 rounded-xl border border-divider bg-space-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">发布趋势</h2>
              <div className="flex gap-2">
                {DAYS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDays(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      days === opt.value
                        ? 'bg-star-purple/10 font-medium text-star-purple'
                        : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {trend && trend.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trend.trend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d35" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#8b949e', fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)}
                  />
                  <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8 }}
                    labelStyle={{ color: '#e6edf3' }}
                    itemStyle={{ color: '#8b949e' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e' }} />
                  <Line type="monotone" dataKey="views" name="阅读" stroke="#00D2FF" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="likes" name="点赞" stroke="#FFD93D" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="comments" name="评论" stroke="#6C5CE7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-40 items-center justify-center text-text-secondary text-sm">
                暂无趋势数据
              </div>
            )}
          </div>

          {/* 内容排行 */}
          <div className="rounded-xl border border-divider bg-space-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">内容排行</h2>
              <select
                value={topMetric}
                onChange={(e) => setTopMetric(e.target.value)}
                className="rounded-lg border border-divider bg-space-float px-3 py-1.5 text-sm text-text-primary outline-none focus:border-star-purple/50"
              >
                <option value="views">按阅读</option>
                <option value="likes">按点赞</option>
                <option value="comments">按评论</option>
                <option value="shares">按分享</option>
                <option value="favorites">按收藏</option>
              </select>
            </div>
            {topContents.length === 0 ? (
              <div className="py-10 text-center text-sm text-text-secondary">暂无数据</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-divider text-left text-text-secondary">
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">标题</th>
                      <th className="px-4 py-3 font-medium">阅读</th>
                      <th className="px-4 py-3 font-medium">点赞</th>
                      <th className="px-4 py-3 font-medium max-md:hidden">评论</th>
                      <th className="px-4 py-3 font-medium max-md:hidden">收藏</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topContents.map((c, idx) => (
                      <tr key={c.content_id} className="border-b border-divider last:border-0 hover:bg-space-float/30">
                        <td className="px-4 py-3 text-text-secondary">{idx + 1}</td>
                        <td className="px-4 py-3 text-text-primary max-w-[200px] truncate">{c.title}</td>
                        <td className="px-4 py-3 text-star-blue">{c.total_views.toLocaleString()}</td>
                        <td className="px-4 py-3 text-star-gold">{c.total_likes.toLocaleString()}</td>
                        <td className="px-4 py-3 text-text-primary max-md:hidden">{c.total_comments.toLocaleString()}</td>
                        <td className="px-4 py-3 text-text-primary max-md:hidden">{c.total_favorites.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
