import { useEffect, useState } from 'react'
import { Coins, Package, Loader2 } from 'lucide-react'
import { useSubscriptionStore } from '../../stores/useSubscriptionStore'

const creditTypeMap: Record<string, string> = {
  monthly: '月度订阅',
  purchased: '购买积分',
  bonus: '赠送积分',
  yearly: '年度订阅',
  trial: '试用积分',
  subscription_upgrade: '升级赠送',
}

export default function Credits() {
  const {
    subscription,
    packages,
    creditHistory,
    loading,
    fetchInfo,
    fetchPackages,
    fetchCreditHistory,
    purchaseCredits,
  } = useSubscriptionStore()

  const [purchasing, setPurchasing] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchInfo()
    fetchPackages()
    fetchCreditHistory()
  }, [fetchInfo, fetchPackages, fetchCreditHistory])

  const handlePurchase = async (packageId: number) => {
    setPurchasing(packageId)
    setMessage('')
    try {
      const result = await purchaseCredits(packageId)
      if (result.success) {
        setMessage('购买成功！')
        fetchInfo()
        fetchCreditHistory()
      } else {
        setMessage(result.message || '购买失败')
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '购买失败')
    } finally {
      setPurchasing(null)
    }
  }

  const totalCredits = subscription?.current_credits ?? 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">积分详情</h1>
        <p className="mt-1 text-text-secondary">查看积分余额、购买积分包</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : (
        <>
          {/* 积分总览 */}
          <div className="mb-8 rounded-xl border border-divider bg-space-panel p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-star-gold/10">
                <Coins className="h-6 w-6 text-star-gold" />
              </div>
              <div>
                <div className="text-sm text-text-secondary">总剩余积分</div>
                <div className="text-3xl font-bold text-star-gold">{Number(totalCredits).toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 余额明细 */}
          {subscription?.balances && subscription.balances.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">余额明细</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subscription.balances.map((b) => {
                  const remaining = Number(b.remaining_amount)
                  const used = Number(b.used_amount)
                  const total = Number(b.original_amount)
                  const usagePercent = total > 0 ? (used / total) * 100 : 0
                  const isExpired = b.expires_at ? new Date(b.expires_at) < new Date() : false
                  const isDepleted = remaining <= 0
                  const isRed = isDepleted || isExpired
                  const isYellow = !isRed && usagePercent >= 80

                  const barColor = isRed
                    ? 'bg-red-500'
                    : isYellow
                      ? 'bg-yellow-500'
                      : 'bg-green-500'

                  const textColor = isRed
                    ? 'text-red-400'
                    : isYellow
                      ? 'text-yellow-400'
                      : 'text-text-primary'

                  return (
                    <div key={b.id} className="rounded-xl border border-divider bg-space-panel p-4">
                      <div className="mb-2 text-sm text-text-secondary">
                        {creditTypeMap[b.credit_type] || b.credit_type}
                        {isExpired && <span className="ml-2 text-xs text-red-400">已过期</span>}
                        {isDepleted && !isExpired && <span className="ml-2 text-xs text-red-400">已用完</span>}
                      </div>
                      <div className="mb-1 flex items-baseline gap-2">
                        <span className={`text-xl font-bold ${textColor}`}>{used}</span>
                        <span className="text-sm text-text-tertiary">/ {total}</span>
                      </div>
                      {/* 进度条 */}
                      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-space-float">
                        <div
                          className={`h-full rounded-full transition-all ${barColor}`}
                          style={{ width: `${isRed ? 100 : Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-tertiary">
                        过期：{b.expires_at ? new Date(b.expires_at).toLocaleDateString('zh-CN') : '永不过期'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 积分包购买 */}
          {packages.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">购买积分包</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="rounded-xl border border-divider bg-space-panel p-5 transition-all hover:border-star-gold/30">
                    <div className="mb-1 flex items-center gap-2">
                      <Package className="h-4 w-4 text-star-gold" />
                      <span className="font-medium text-text-primary">{pkg.package_name}</span>
                    </div>
                    <p className="mb-3 text-sm text-text-secondary">{pkg.description}</p>
                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-star-gold">{Number(pkg.credits).toLocaleString()}</span>
                      {pkg.bonus_credits > 0 && (
                        <span className="text-sm text-green-500">+{Number(pkg.bonus_credits)}</span>
                      )}
                      <span className="text-sm text-text-secondary">积分</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-text-primary">¥{Number(pkg.price)}</span>
                      <button
                        onClick={() => handlePurchase(pkg.id)}
                        disabled={purchasing === pkg.id}
                        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 disabled:opacity-60"
                      >
                        {purchasing === pkg.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        购买
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {message && (
                <p className={`mt-3 text-sm ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </div>
          )}

          {/* 积分历史（已过期记录） */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-text-primary">历史积分记录</h2>
            {creditHistory.length === 0 ? (
              <div className="rounded-xl border border-divider bg-space-panel py-12 text-center text-text-secondary">
                暂无历史记录
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-divider bg-space-panel">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-divider text-left text-text-secondary">
                      <th className="px-4 py-3 font-medium">发放时间</th>
                      <th className="px-4 py-3 font-medium">类型</th>
                      <th className="px-4 py-3 font-medium max-sm:hidden">描述</th>
                      <th className="px-4 py-3 text-right font-medium">总量</th>
                      <th className="px-4 py-3 text-right font-medium">已用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditHistory.map((h) => (
                      <tr key={h.id} className="border-b border-divider last:border-0">
                        <td className="px-4 py-3 text-text-secondary">
                          {new Date(h.granted_at).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-4 py-3 text-text-primary">{h.credit_type}</td>
                        <td className="px-4 py-3 text-text-secondary max-sm:hidden">{h.description || '-'}</td>
                        <td className="px-4 py-3 text-right font-medium text-text-primary">
                          {Number(h.original_amount)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-text-secondary">
                          {Number(h.used_amount)}
                        </td>
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
