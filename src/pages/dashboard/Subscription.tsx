import { useEffect, useState } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { useSubscriptionStore } from '../../stores/useSubscriptionStore'
import * as subApi from '../../api/subscription'
import type { UpgradeCalculation } from '../../types'

export default function Subscription() {
  const { subscription, tiers, loading, fetchInfo, fetchTiers, upgrade } = useSubscriptionStore()
  const [calculating, setCalculating] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [calcResult, setCalcResult] = useState<UpgradeCalculation | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchInfo()
    fetchTiers()
  }, [fetchInfo, fetchTiers])

  const currentTierName = subscription?.tier_display_name || '星尘'

  const tierColorMap: Record<string, string> = {
    '星尘': '#6E7681',
    '星芒': '#6C5CE7',
    '星辰': '#00D2FF',
    '星耀': '#FFD93D',
  }

  const handleCalculate = async (tierName: string) => {
    setSelectedTier(tierName)
    setCalcResult(null)
    setMessage('')
    setCalculating(true)
    try {
      const result = await subApi.calculateUpgrade(tierName, 'monthly')
      setCalcResult(result)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '计算失败')
    } finally {
      setCalculating(false)
    }
  }

  const handleUpgrade = async () => {
    if (!selectedTier) return
    setUpgrading(true)
    setMessage('')
    try {
      const result = await upgrade(selectedTier, 'monthly')
      if (result.success) {
        setMessage('升级成功！')
        setCalcResult(null)
        setSelectedTier(null)
        fetchInfo()
      } else {
        setMessage(result.message || '升级失败')
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '升级失败')
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">订阅管理</h1>
        <p className="mt-1 text-text-secondary">查看当前等级，升级解锁更多能力</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : (
        <>
          {/* 当前订阅 */}
          <div className="mb-8 rounded-xl border border-divider bg-space-panel p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: `radial-gradient(circle, ${tierColorMap[currentTierName] || '#6E7681'} 0%, transparent 70%)`,
                  boxShadow: `0 0 20px ${tierColorMap[currentTierName] || '#6E7681'}40`,
                }}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tierColorMap[currentTierName], boxShadow: `0 0 8px ${tierColorMap[currentTierName]}` }}
                />
              </div>
              <div>
                <div className="text-sm text-text-secondary">当前等级</div>
                <div className="text-xl font-bold" style={{ color: tierColorMap[currentTierName] }}>
                  {currentTierName}
                </div>
              </div>
              {subscription?.subscription_end_date && (
                <div className="ml-auto text-sm text-text-secondary">
                  到期：{new Date(subscription.subscription_end_date).toLocaleDateString('zh-CN')}
                </div>
              )}
            </div>
          </div>

          {/* 等级列表 */}
          <h2 className="mb-4 text-lg font-semibold text-text-primary">全部等级</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => {
              const isCurrent = tier.display_name === currentTierName
              const color = tierColorMap[tier.display_name] || '#6E7681'
              const isSelected = selectedTier === tier.tier_name

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-xl border p-5 transition-all ${
                    isCurrent
                      ? 'border-star-purple/40 bg-star-purple/5'
                      : isSelected
                        ? 'border-star-blue/40 bg-star-blue/5'
                        : 'border-divider bg-space-panel hover:border-border-hover'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-2.5 right-3 rounded-full bg-star-purple px-2.5 py-0.5 text-xs font-medium text-white">
                      当前
                    </div>
                  )}

                  <h3 className="mb-1 text-lg font-semibold" style={{ color }}>
                    {tier.display_name}
                  </h3>
                  <div className="mb-4 flex items-baseline">
                    <span className="text-2xl font-bold text-text-primary">
                      {tier.monthly_price === 0 ? '免费' : `¥${tier.monthly_price}`}
                    </span>
                    {tier.monthly_price > 0 && <span className="ml-1 text-sm text-text-secondary">/月</span>}
                  </div>

                  <div className="mb-5 text-sm text-text-secondary">
                    每月 {tier.monthly_credits} 积分
                  </div>

                  {!isCurrent && tier.monthly_price > 0 && (
                    <button
                      onClick={() => handleCalculate(tier.tier_name)}
                      disabled={calculating && isSelected}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-default py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-star-purple hover:text-star-purple disabled:opacity-50"
                    >
                      {calculating && isSelected ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                      升级到{tier.display_name}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* 升级确认 */}
          {calcResult && (
            <div className="mt-6 rounded-xl border border-star-purple/30 bg-star-purple/5 p-6">
              <h3 className="mb-3 text-lg font-semibold text-text-primary">确认升级</h3>
              <p className="mb-2 text-sm text-text-secondary">{calcResult.message}</p>
              <div className="mb-4 flex items-baseline gap-2">
                {calcResult.original_price !== calcResult.final_price && (
                  <span className="text-sm text-text-tertiary line-through">¥{calcResult.original_price}</span>
                )}
                <span className="text-2xl font-bold text-star-purple">¥{calcResult.final_price}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-star-purple to-star-blue px-6 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {upgrading && <Loader2 className="h-4 w-4 animate-spin" />}
                  确认升级
                </button>
                <button
                  onClick={() => {
                    setCalcResult(null)
                    setSelectedTier(null)
                  }}
                  className="rounded-lg border border-border-default px-6 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className={`mt-4 text-sm ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </>
      )}
    </div>
  )
}
