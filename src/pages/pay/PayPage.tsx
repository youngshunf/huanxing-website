import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import QRCode from 'qrcode'
import {
  ArrowLeft, CreditCard, Loader2, CheckCircle2,
  XCircle, RefreshCw,
} from 'lucide-react'
import * as payApi from '../../api/pay'
import { getTiers } from '../../api/subscription'
import type { PayChannel, CreateOrderResponse } from '../../api/pay'
import type { SubscriptionTier } from '../../types'
import { useSubscriptionStore } from '../../stores/useSubscriptionStore'

/** 计费周期中文 */
const CYCLE_NAMES: Record<string, string> = {
  monthly: '月付',
  yearly: '年付',
}

/** 微信图标 SVG */
function WechatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.937 6.937 0 0 1-.315-2.055c0-3.965 3.613-7.177 8.073-7.177.39 0 .773.022 1.15.07C17.685 4.209 13.585 2.188 8.69 2.188zm-2.35 4.02c.58 0 1.05.47 1.05 1.053 0 .58-.47 1.053-1.05 1.053s-1.05-.47-1.05-1.053c0-.58.47-1.053 1.05-1.053zm4.96 0c.58 0 1.05.47 1.05 1.053 0 .58-.47 1.053-1.05 1.053s-1.05-.47-1.05-1.053c0-.58.47-1.053 1.05-1.053zm5.06 3.263c-3.848 0-6.996 2.789-6.996 6.226 0 3.44 3.148 6.228 6.996 6.228.71 0 1.396-.09 2.05-.265a.68.68 0 0 1 .567.079l1.413.832a.232.232 0 0 0 .124.04.22.22 0 0 0 .215-.22c0-.053-.022-.107-.036-.16l-.283-1.104a.467.467 0 0 1 .168-.526C22.595 19.478 24 17.58 24 15.697c0-3.437-3.148-6.226-6.996-6.226zm-2.18 3.416c.458 0 .83.373.83.833 0 .46-.372.833-.83.833a.832.832 0 0 1-.831-.833c0-.46.372-.833.83-.833zm4.36 0c.458 0 .83.373.83.833 0 .46-.372.833-.83.833a.832.832 0 0 1-.831-.833c0-.46.372-.833.83-.833z" />
    </svg>
  )
}

/** 支付宝图标 SVG */
function AlipayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.422 18.899c-1.722-.612-3.653-1.46-5.419-2.396.745-1.163 1.375-2.477 1.85-3.891h-3.72v-1.263h4.56V10.2h-4.56V7.986h-2.4c-.27 0-.27.234-.27.234V10.2H6.07v1.149h4.393v1.263H6.676v1.149h7.86a14.559 14.559 0 0 1-1.237 2.463C10.47 14.877 7.136 13.956 5.12 13.54l-.077-.018c-1.444-.283-2.188.12-2.417.537-.334.606-.13 1.633 1.068 2.345 1.15.684 3.038.785 4.503.219.48-.186.937-.437 1.374-.74 1.705 1.022 3.56 1.942 5.31 2.652C11.186 21.053 6.924 22 2.593 22H1.207v-1.26C.467 19.92 0 18.77 0 17.52V6.48C0 3.927 1.927 2 4.48 2h15.04C22.073 2 24 3.927 24 6.48v11.04c0 2.063-1.217 3.696-3.578 1.379zM7.283 17.799a4.476 4.476 0 0 1-2.6-.383c-.61-.363-.666-.782-.576-.963.09-.181.527-.348 1.218-.16 1.14.307 2.6.665 3.965 1.226a5.097 5.097 0 0 1-2.007.28z" />
    </svg>
  )
}

/** 判断渠道是否为订阅类型 */
function isSubscriptionChannel(code: string) {
  return code.includes('papay') || code.includes('cycle') || code.includes('contract') || code.includes('sub')
}

/** 渠道分组名和描述 */
function getChannelGroup(code: string): 'subscribe' | 'onetime' {
  return isSubscriptionChannel(code) ? 'subscribe' : 'onetime'
}

type Step = 'select' | 'paying' | 'success' | 'failed'

export default function PayPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()

  const tier = params.get('tier') || ''
  const cycle = (params.get('cycle') || 'monthly') as 'monthly' | 'yearly'

  /** 切换计费周期 */
  const setCycle = (c: 'monthly' | 'yearly') => {
    setParams((prev) => {
      prev.set('cycle', c)
      return prev
    })
  }

  const [channels, setChannels] = useState<PayChannel[]>([])
  const [tierInfo, setTierInfo] = useState<SubscriptionTier | null>(null)
  const [selectedCode, setSelectedCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [agreeContract, setAgreeContract] = useState(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const { fetchInfo } = useSubscriptionStore()

  // 获取可用渠道 + 套餐价格
  useEffect(() => {
    payApi.getChannels().then((list) => {
      setChannels(list)
      if (list.length > 0) setSelectedCode(list[0].code)
    }).catch(() => setErrorMsg('获取支付渠道失败'))

    getTiers().then((tiers) => {
      const match = tiers.find(t => t.tier_name === tier)
      if (match) setTierInfo(match)
    }).catch(() => { /* 价格加载失败不阻塞 */ })
  }, [tier])

  // 轮询订单状态
  const startPolling = useCallback((orderNo: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const status = await payApi.getOrderStatus(orderNo)
        if (status.status === 1) {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStep('success')
          fetchInfo()
        } else if (status.status >= 3) {
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStep('failed')
          setErrorMsg('订单已过期或已关闭')
        }
      } catch { /* 忽略轮询错误 */ }
    }, 3000)
  }, [fetchInfo])

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // 渲染二维码到 canvas
  useEffect(() => {
    if (step === 'paying' && orderData?.qr_code_url && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, orderData.qr_code_url, {
        width: 220,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      })
    }
  }, [step, orderData])

  // 提交订单
  const handlePay = async () => {
    if (!selectedCode || !tier) return

    // 订阅渠道需要勾选协议
    if (isSubscriptionChannel(selectedCode) && !agreeContract) {
      setErrorMsg('请先阅读并同意自动续费服务协议')
      return
    }

    setLoading(true)
    setErrorMsg('')
    try {
      const result = await payApi.createOrder({
        tier,
        billing_cycle: cycle,
        channel_code: selectedCode,
        auto_renew: isSubscriptionChannel(selectedCode),
      })
      setOrderData(result)
      setStep('paying')

      if (result.pay_url) {
        window.open(result.pay_url, '_blank')
      }

      startPolling(result.order_no)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : '创建订单失败')
    } finally {
      setLoading(false)
    }
  }

  // 取消订单
  const handleCancel = async () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    if (orderData) {
      try { await payApi.cancelOrder(orderData.order_no) } catch { /* 忽略 */ }
    }
    setStep('select')
    setOrderData(null)
  }

  const tierName = tierInfo?.display_name || tier
  const cycleName = CYCLE_NAMES[cycle] || cycle

  // 实时价格（元），来自接口
  const monthlyPrice = tierInfo ? Number(tierInfo.monthly_price) : null
  const yearlyPrice = tierInfo?.yearly_price != null ? Number(tierInfo.yearly_price) : null
  const displayPrice = cycle === 'yearly' && yearlyPrice != null ? yearlyPrice : monthlyPrice
  const hasYearlyOption = yearlyPrice != null && yearlyPrice > 0

  // 年付折扣（节省百分比）
  const yearlyDiscount = tierInfo?.yearly_discount != null
    ? Math.round((1 - Number(tierInfo.yearly_discount)) * 100)
    : (monthlyPrice && yearlyPrice ? Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100) : null)

  // 当前选中的渠道是否为订阅类型
  const selectedIsSubscription = isSubscriptionChannel(selectedCode)

  // 分组渠道
  const onetimeChannels = channels.filter(ch => getChannelGroup(ch.code) === 'onetime')
  const subscribeChannels = channels.filter(ch => getChannelGroup(ch.code) === 'subscribe')

  // 无效参数
  if (!tier) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black">
        <div className="text-center">
          <p className="mb-4 text-text-secondary">缺少套餐参数</p>
          <Link to="/#pricing" className="text-star-purple hover:underline">返回选择套餐</Link>
        </div>
      </div>
    )
  }

  /** 渠道项 */
  function ChannelItem({ ch }: { ch: PayChannel }) {
    const isWechat = ch.code.startsWith('wx')
    return (
      <button
        key={ch.code}
        onClick={() => {
          setSelectedCode(ch.code)
          setErrorMsg('')
        }}
        className={`flex w-full items-center gap-4 rounded-xl border p-4 transition-all ${
          selectedCode === ch.code
            ? 'border-star-purple bg-star-purple/5'
            : 'border-divider bg-space-panel hover:border-border-hover'
        }`}
      >
        {isWechat
          ? <WechatIcon className="h-6 w-6 text-[#07C160]" />
          : <AlipayIcon className="h-6 w-6 text-[#1677FF]" />
        }
        <span className="flex-1 text-left font-medium text-text-primary">{ch.name}</span>
        <div
          className={`h-5 w-5 rounded-full border-2 transition-all ${
            selectedCode === ch.code
              ? 'border-star-purple bg-star-purple'
              : 'border-border-default'
          }`}
        >
          {selectedCode === ch.code && (
            <div className="flex h-full items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-space-black">
      {/* Header */}
      <div className="border-b border-divider bg-space-panel/50 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-text-primary">订阅支付</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* 订单摘要 */}
        <div className="mb-8 rounded-xl border border-divider bg-space-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">订阅套餐</p>
              <p className="mt-1 text-xl font-bold text-text-primary">
                唤星AI · {tierName}会员
              </p>
              <p className="mt-1 text-sm text-text-secondary">{cycleName}订阅</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">需支付</p>
              <p className="mt-1 text-3xl font-bold text-star-purple">
                ¥{orderData
                  ? (orderData.pay_amount / 100).toFixed(2)
                  : displayPrice != null
                    ? displayPrice.toFixed(2)
                    : '--'}
              </p>
              {displayPrice != null && cycle === 'yearly' && !orderData && (
                <p className="mt-1 text-xs text-text-tertiary">
                  约 ¥{(displayPrice / 12).toFixed(0)}/月
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step: 选择支付方式 */}
        {step === 'select' && (
          <>
            {/* 月/年切换 */}
            {hasYearlyOption && (
              <div className="mb-8">
                <div className="mx-auto flex w-fit rounded-xl border border-divider bg-space-panel p-1">
                  <button
                    onClick={() => setCycle('monthly')}
                    className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                      cycle === 'monthly'
                        ? 'bg-star-purple text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    按月付费
                  </button>
                  <button
                    onClick={() => setCycle('yearly')}
                    className={`relative rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                      cycle === 'yearly'
                        ? 'bg-star-purple text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    按年付费
                    {yearlyDiscount != null && yearlyDiscount > 0 && (
                      <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        省{yearlyDiscount}%
                      </span>
                    )}
                  </button>
                </div>
                {cycle === 'yearly' && yearlyDiscount != null && yearlyDiscount > 0 && monthlyPrice != null && (
                  <p className="mt-3 text-center text-xs text-text-tertiary">
                    年付 ¥{yearlyPrice?.toFixed(2)}，相当于 ¥{((yearlyPrice ?? 0) / 12).toFixed(0)}/月，
                    比月付节省 ¥{(monthlyPrice * 12 - (yearlyPrice ?? 0)).toFixed(0)}
                  </p>
                )}
              </div>
            )}

            {/* 一次性支付 */}
            {onetimeChannels.length > 0 && (
              <>
                <h2 className="mb-3 text-base font-semibold text-text-primary">单次支付</h2>
                <p className="mb-4 text-xs text-text-tertiary">支付一次，不自动续费，到期后需手动续订</p>
                <div className="mb-6 space-y-3">
                  {onetimeChannels.map((ch) => (
                    <ChannelItem key={ch.code} ch={ch} />
                  ))}
                </div>
              </>
            )}

            {/* 自动续费 */}
            {subscribeChannels.length > 0 && (
              <>
                <h2 className="mb-3 text-base font-semibold text-text-primary">自动续费</h2>
                <p className="mb-4 text-xs text-text-tertiary">签约自动扣款，每{cycle === 'yearly' ? '年' : '月'}自动续费，可随时取消</p>
                <div className="mb-4 space-y-3">
                  {subscribeChannels.map((ch) => (
                    <ChannelItem key={ch.code} ch={ch} />
                  ))}
                </div>

                {/* 订阅协议勾选 */}
                {selectedIsSubscription && (
                  <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-lg border border-divider bg-space-panel/50 p-4">
                    <input
                      type="checkbox"
                      checked={agreeContract}
                      onChange={(e) => {
                        setAgreeContract(e.target.checked)
                        setErrorMsg('')
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-default accent-star-purple"
                    />
                    <span className="text-sm leading-relaxed text-text-secondary">
                      我已阅读并同意
                      <a
                        href="/agreement/auto-renew"
                        target="_blank"
                        className="mx-1 text-star-purple hover:underline"
                      >
                        《自动续费服务协议》
                      </a>
                      ，授权唤星AI在订阅到期时自动从我的账户中扣款续费，我可随时在账户设置中取消。
                    </span>
                  </label>
                )}
              </>
            )}

            {/* 无渠道时loading */}
            {channels.length === 0 && !errorMsg && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-text-secondary" />
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading || !selectedCode}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-star-purple to-star-blue py-4 text-base font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
              {selectedIsSubscription ? '确认订阅' : '确认支付'}
              {displayPrice != null && ` ¥${displayPrice.toFixed(2)}`}
            </button>
          </>
        )}

        {/* Step: 等待支付 */}
        {step === 'paying' && orderData && (
          <div className="text-center">
            {orderData.qr_code_url && (
              <div className="mb-6">
                <p className="mb-4 text-text-secondary">
                  请使用{orderData.channel_code.startsWith('wx') ? '微信' : '支付宝'}扫描二维码完成支付
                </p>
                <div className="mx-auto inline-block rounded-xl border border-divider bg-white p-4">
                  <canvas ref={qrCanvasRef} />
                </div>
              </div>
            )}

            {orderData.pay_url && !orderData.qr_code_url && (
              <div className="mb-6">
                <AlipayIcon className="mx-auto mb-4 h-16 w-16 text-[#1677FF]" />
                <p className="mb-2 text-text-primary">已打开支付宝收银台</p>
                <p className="text-sm text-text-secondary">请在新窗口中完成支付</p>
                <a
                  href={orderData.pay_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm text-star-purple hover:underline"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  重新打开支付页面
                </a>
              </div>
            )}

            <div className="mb-6 flex items-center justify-center gap-2 text-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">等待支付结果...</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setStep('success')
                  if (pollingRef.current) clearInterval(pollingRef.current)
                  fetchInfo()
                }}
                className="rounded-lg border border-border-default px-6 py-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                我已完成支付
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-text-tertiary hover:text-red-500"
              >
                取消订单
              </button>
            </div>

            <p className="mt-6 text-xs text-text-tertiary">
              订单号: {orderData.order_no}
            </p>
          </div>
        )}

        {/* Step: 支付成功 */}
        {step === 'success' && (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-xl font-bold text-text-primary">支付成功</h2>
            <p className="mb-8 text-text-secondary">
              恭喜！你已成功订阅 <span className="font-semibold text-star-purple">{tierName}</span> 会员
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard/subscription')}
                className="rounded-xl bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-sm font-semibold text-white"
              >
                查看订阅详情
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-xl border border-border-default px-8 py-3 text-sm text-text-secondary hover:text-text-primary"
              >
                返回首页
              </button>
            </div>
          </div>
        )}

        {/* Step: 支付失败 */}
        {step === 'failed' && (
          <div className="py-10 text-center">
            <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-text-primary">支付未完成</h2>
            <p className="mb-8 text-text-secondary">{errorMsg || '订单已过期或支付失败，请重新下单'}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => { setStep('select'); setOrderData(null); setErrorMsg('') }}
                className="rounded-xl bg-gradient-to-br from-star-purple to-star-blue px-8 py-3 text-sm font-semibold text-white"
              >
                重新支付
              </button>
              <button
                onClick={() => navigate('/')}
                className="rounded-xl border border-border-default px-8 py-3 text-sm text-text-secondary"
              >
                返回首页
              </button>
            </div>
          </div>
        )}

        {/* 全局错误信息 */}
        {errorMsg && step === 'select' && (
          <p className="mt-4 text-center text-sm text-red-500">{errorMsg}</p>
        )}
      </div>
    </div>
  )
}
