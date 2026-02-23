import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, ShieldCheck, Loader2 } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import { sendCode } from '../api/auth'

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [sending, setSending] = useState(false)
  const [logging, setLogging] = useState(false)
  const [error, setError] = useState('')

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // 重置表单
  useEffect(() => {
    if (!showLoginModal) {
      setPhone('')
      setCode('')
      setError('')
      setCountdown(0)
    }
  }, [showLoginModal])

  const handleSendCode = useCallback(async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    setError('')
    setSending(true)
    try {
      await sendCode(phone)
      setCountdown(60)
    } catch (e) {
      setError(e instanceof Error ? e.message : '验证码发送失败')
    } finally {
      setSending(false)
    }
  }, [phone])

  const handleLogin = useCallback(async () => {
    if (!/^1\d{10}$/.test(phone)) {
      setError('请输入正确的手机号')
      return
    }
    if (!/^\d{4,6}$/.test(code)) {
      setError('请输入正确的验证码')
      return
    }
    setError('')
    setLogging(true)
    try {
      await login(phone, code)
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败，请重试')
    } finally {
      setLogging(false)
    }
  }, [phone, code, login])

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 遮罩 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          {/* 弹窗 */}
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border-default bg-space-panel shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 顶部渐变装饰 */}
            <div className="h-1 w-full bg-gradient-to-r from-star-purple to-star-blue" />

            <div className="p-6">
              {/* 关闭按钮 */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-space-float hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>

              {/* 标题 */}
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-text-primary">登录唤星</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  新用户将自动注册
                </p>
              </div>

              {/* 手机号 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 rounded-lg border border-border-default bg-space-input px-3 py-2.5 transition-colors focus-within:border-star-purple">
                  <Phone className="h-4 w-4 text-text-tertiary" />
                  <input
                    type="tel"
                    placeholder="请输入手机号"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                  />
                </div>
              </div>

              {/* 验证码 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 rounded-lg border border-border-default bg-space-input px-3 py-2.5 transition-colors focus-within:border-star-purple">
                  <ShieldCheck className="h-4 w-4 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={countdown > 0 || sending}
                    className="shrink-0 text-sm font-medium text-star-purple transition-colors hover:text-star-purple-hover disabled:text-text-tertiary"
                  >
                    {sending ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
              </div>

              {/* 错误提示 */}
              {error && (
                <p className="mb-4 text-center text-sm text-red-500">{error}</p>
              )}

              {/* 登录按钮 */}
              <button
                onClick={handleLogin}
                disabled={logging}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-star-purple to-star-blue py-3 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110 disabled:opacity-60"
              >
                {logging && <Loader2 className="h-4 w-4 animate-spin" />}
                {logging ? '登录中...' : '登录'}
              </button>

              {/* 协议 */}
              <p className="mt-4 text-center text-xs text-text-tertiary">
                登录即表示同意{' '}
                <span className="text-star-purple">用户协议</span>
                {' '}和{' '}
                <span className="text-star-purple">隐私政策</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
