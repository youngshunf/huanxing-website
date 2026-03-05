import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  ArrowLeft, CreditCard, Loader2, CheckCircle2,
  XCircle, Smartphone, Monitor, RefreshCw,
} from 'lucide-react'
import * as payApi from '../../api/pay'
import type { PayChannel, CreateOrderResponse } from '../../api/pay'
import { useSubscriptionStore } from '../../stores/useSubscriptionStore'

/** 套餐中文名映射 */
const TIER_NAMES: Record<string, string> = {
  star_glow: '星芒',
  star_shine: '星辰',
  star_glory: '星耀',
}

/** 计费周期中文 */
const CYCLE_NAMES: Record<string, string> = {
  monthly: '月付',
  yearly: '年付',
}

/** 渠道图标 */
function ChannelIcon({ code }: { code: string }) {
  if (code.startsWith('wx')) {
    return <Smartphone className="h-5 w-5 text-green-500" />
  }
  if (code.startsWith('alipay')) {
    return <Monitor className="h-5 w-5 text-blue-500" />
  }
  return <CreditCard className="h-5 w-5" />
}

type Step = 'select' | 'paying' | 'success' | 'failed'

export default function PayPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const tier = params.get('tier') || ''
  const cycle = params.get('cycle') || 'monthly'

  const [channels, setChannels] = useState<PayChannel[]>([])
  const [selectedCode, setSelectedCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [orderData, setOrderData] = useState<CreateOrderResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { fetchInfo } = useSubscriptionStore()

  // 获取可用渠道
  useEffect(() => {
    payApi.getChannels().then((list) => {
      setChannels(list)
      if (list.length > 0) setSelectedCode(list[0].code)
    }).catch(() => setErrorMsg('获取支付渠道失败'))
  }, [])

  // 轮询订单状态
  const startPolling = useCallback((orderNo: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const status = await payApi.getOrderStatus(orderNo)
        if (status.status === 1) {
          // 支付成功
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStep('success')
          fetchInfo()
        } else if (status.status >= 3) {
          // 已关闭/过期
          clearInterval(pollingRef.current!)
          pollingRef.current = null
          setStep('failed')
          setErrorMsg('订单已过期或已关闭')
        }
      } catch { /* 忽略轮询错误 */ }
    }, 3000) // 每 3 秒
  }, [fetchInfo])

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  // 提交订单
  const handlePay = async () => {
    if (!selectedCode || !tier) return
    setLoading(true)
    setErrorMsg('')
    try {
      const result = await payApi.createOrder({
        tier,
        billing_cycle: cycle,
        channel_code: selectedCode,
        auto_renew: false,
      })
      setOrderData(result)
      setStep('paying')

      // 支付宝直接跳转
      if (result.pay_url) {
        window.open(result.pay_url, '_blank')
      }

      // 开始轮询状态
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

  const tierName = TIER_NAMES[tier] || tier
  const cycleName = CYCLE_NAMES[cycle] || cycle

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
                ¥{orderData ? (orderData.pay_amount / 100).toFixed(2) : '--'}
              </p>
            </div>
          </div>
        </div>

        {/* Step: 选择支付方式 */}
        {step === 'select' && (
          <>
            <h2 className="mb-4 text-base font-semibold text-text-primary">选择支付方式</h2>
            <div className="mb-8 space-y-3">
              {channels.length === 0 && !errorMsg && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-text-secondary" />
                </div>
              )}
              {channels.map((ch) => (
                <button
                  key={ch.code}
                  onClick={() => setSelectedCode(ch.code)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 transition-all ${
                    selectedCode === ch.code
                      ? 'border-star-purple bg-star-purple/5'
                      : 'border-divider bg-space-panel hover:border-border-hover'
                  }`}
                >
                  <ChannelIcon code={ch.code} />
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
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={loading || !selectedCode}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-star-purple to-star-blue py-4 text-base font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
              确认支付
            </button>
          </>
        )}

        {/* Step: 等待支付 */}
        {step === 'paying' && orderData && (
          <div className="text-center">
            {/* 微信 — 显示二维码 */}
            {orderData.qr_code_url && (
              <div className="mb-6">
                <p className="mb-4 text-text-secondary">请使用微信扫描二维码完成支付</p>
                <div className="mx-auto inline-block rounded-xl border border-divider bg-white p-4">
                  <QRCodeSVG value={orderData.qr_code_url} size={220} />
                </div>
              </div>
            )}

            {/* 支付宝 — 提示已跳转 */}
            {orderData.pay_url && !orderData.qr_code_url && (
              <div className="mb-6">
                <Monitor className="mx-auto mb-4 h-16 w-16 text-blue-500" />
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
