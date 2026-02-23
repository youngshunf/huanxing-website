import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Coins, TrendingUp, Star } from 'lucide-react'
import { useSubscriptionStore } from '../../stores/useSubscriptionStore'
import { useAuthStore } from '../../stores/useAuthStore'

export default function Overview() {
  const { subscription, loading, fetchInfo } = useSubscriptionStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const creditTypeMap: Record<string, string> = {
    monthly: '月度订阅',
    purchased: '购买积分',
    bonus: '赠送积分',
    yearly: '年度订阅',
    trial: '试用积分',
    subscription_upgrade: '升级赠送',
  }

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  const tierColorMap: Record<string, string> = {
    '星尘': '#6E7681',
    '星芒': '#6C5CE7',
    '星辰': '#00D2FF',
    '星耀': '#FFD93D',
  }

  const tierName = subscription?.tier_display_name || '星尘'
  const tierColor = tierColorMap[tierName] || '#6E7681'
  const totalCredits = subscription?.current_credits ?? 0

  return (
    <div>
      {/* 欢迎 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          你好，{user?.nickname || user?.phone || '星友'}
        </h1>
        <p className="mt-1 text-text-secondary">欢迎回到唤星控制台</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : (
        <>
          {/* 概览卡片 */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OverviewCard
              icon={<Star className="h-5 w-5" style={{ color: tierColor }} />}
              label="当前等级"
              value={tierName}
              valueColor={tierColor}
            />
            <OverviewCard
              icon={<CreditCard className="h-5 w-5 text-star-purple" />}
              label="订阅状态"
              value={subscription?.status === 'active' ? '生效中' : '未订阅'}
            />
            <OverviewCard
              icon={<Coins className="h-5 w-5 text-star-gold" />}
              label="剩余积分"
              value={totalCredits.toLocaleString()}
            />
            <OverviewCard
              icon={<TrendingUp className="h-5 w-5 text-star-blue" />}
              label="到期时间"
              value={
                subscription?.subscription_end_date
                  ? new Date(subscription.subscription_end_date).toLocaleDateString('zh-CN')
                  : subscription?.billing_cycle_end
                    ? new Date(subscription.billing_cycle_end).toLocaleDateString('zh-CN')
                    : '-'
              }
            />
          </div>

          {/* 快捷操作 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate('/dashboard/subscription')}
              className="flex items-center gap-4 rounded-xl border border-divider bg-space-panel p-5 text-left transition-all hover:border-star-purple/30 hover:shadow-[0_0_16px_rgba(108,92,231,0.1)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-star-purple/10">
                <CreditCard className="h-5 w-5 text-star-purple" />
              </div>
              <div>
                <div className="font-medium text-text-primary">管理订阅</div>
                <div className="text-sm text-text-secondary">查看等级详情、升级订阅</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/dashboard/credits')}
              className="flex items-center gap-4 rounded-xl border border-divider bg-space-panel p-5 text-left transition-all hover:border-star-gold/30 hover:shadow-[0_0_16px_rgba(255,217,61,0.1)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-star-gold/10">
                <Coins className="h-5 w-5 text-star-gold" />
              </div>
              <div>
                <div className="font-medium text-text-primary">积分详情</div>
                <div className="text-sm text-text-secondary">查看余额、购买积分包</div>
              </div>
            </button>
          </div>

          {/* 积分余额列表 */}
          {subscription?.balances && subscription.balances.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">积分余额</h2>
              <div className="overflow-hidden rounded-xl border border-divider bg-space-panel">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-divider text-left text-text-secondary">
                      <th className="px-4 py-3 font-medium">类型</th>
                      <th className="px-4 py-3 font-medium">已用</th>
                      <th className="px-4 py-3 font-medium">总量</th>
                      <th className="px-4 py-3 font-medium max-sm:hidden">剩余</th>
                      <th className="px-4 py-3 font-medium">过期时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.balances.map((b) => {
                      const used = Number(b.used_amount)
                      const total = Number(b.original_amount)
                      const remaining = Number(b.remaining_amount)
                      const isExpired = b.expires_at ? new Date(b.expires_at) < new Date() : false
                      const isDepleted = remaining <= 0
                      const isRed = isDepleted || isExpired

                      return (
                        <tr key={b.id} className="border-b border-divider last:border-0">
                          <td className="px-4 py-3 text-text-primary">
                            {creditTypeMap[b.credit_type] || b.credit_type}
                            {isExpired && <span className="ml-2 text-xs text-red-400">已过期</span>}
                            {isDepleted && !isExpired && <span className="ml-2 text-xs text-red-400">已用完</span>}
                          </td>
                          <td className={`px-4 py-3 font-medium ${isRed ? 'text-red-400' : 'text-star-gold'}`}>{used}</td>
                          <td className="px-4 py-3 text-text-primary">{total}</td>
                          <td className="px-4 py-3 text-text-secondary max-sm:hidden">{remaining}</td>
                          <td className="px-4 py-3 text-text-secondary">
                            {b.expires_at ? new Date(b.expires_at).toLocaleDateString('zh-CN') : '永不过期'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function OverviewCard({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="rounded-xl border border-divider bg-space-panel p-5">
      <div className="mb-3 flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div
        className="text-xl font-bold text-text-primary"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
    </div>
  )
}
