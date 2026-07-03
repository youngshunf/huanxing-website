// 网页发布分享查看器（WEBSHARE-C）—— 官网 `/s/{slug}` 接管。
//
// 四态 + 边界：
//   public / unlisted → 直接嵌制品内容；
//   password          → 输口令 → 解锁换票 → 嵌内容；
//   private           → 需登录：未登录弹官网登录弹窗，登录后按 slug 换 owner 票 → 嵌内容；
//                       登录了但非发布者本人 → 「无权查看」（后端 by-slug 返 404）；
//   过期 / 撤销 / 不存在 → 诚实空态。
// 制品在 `sandbox="allow-scripts"` 的跨域 opaque-origin iframe 内渲染（内容域 CSP 兜底）。
import { Loader2, Lock, Maximize2, ShieldAlert, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  getShareMeta,
  issueViewTicketBySlug,
  shareContentUrl,
  unlockShare,
  type ShareMeta,
} from '../../api/publishShare'
import { useAuthStore } from '../../stores/useAuthStore'

type Phase = 'loading' | 'ready' | 'password' | 'need_login' | 'no_access' | 'expired' | 'not_found' | 'error'

export default function PublishSharePage() {
  const { slug } = useParams<{ slug: string }>()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const setShowLoginModal = useAuthStore((s) => s.setShowLoginModal)

  const [phase, setPhase] = useState<Phase>('loading')
  const [meta, setMeta] = useState<ShareMeta | null>(null)
  const [contentUrl, setContentUrl] = useState<string | null>(null)
  const [errMsg, setErrMsg] = useState('')
  const [password, setPassword] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [unlocking, setUnlocking] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // private + 已登录：按 slug 换 owner 票 → 嵌内容；404 = 非本人 → 无权
  const resolvePrivate = useCallback(async (currentSlug: string) => {
    try {
      const ticket = await issueViewTicketBySlug(currentSlug)
      setContentUrl(shareContentUrl(currentSlug, ticket.ticket))
      setPhase('ready')
    } catch {
      setPhase('no_access')
    }
  }, [])

  // 拉 meta 决定初始态
  useEffect(() => {
    if (!slug) {
      setPhase('not_found')
      return
    }
    let cancelled = false
    setPhase('loading')
    setContentUrl(null)
    void (async () => {
      const result = await getShareMeta(slug)
      if (cancelled) return
      if (result.status === 'not_found') {
        setPhase('not_found')
        return
      }
      if (result.status === 'error') {
        setErrMsg(result.message)
        setPhase('error')
        return
      }
      const m = result.meta
      setMeta(m)
      if (m.expired || !m.available) {
        setPhase('expired')
        return
      }
      if (m.visibility === 'public' || m.visibility === 'unlisted') {
        setContentUrl(shareContentUrl(slug))
        setPhase('ready')
        return
      }
      if (m.visibility === 'password') {
        setPhase('password')
        return
      }
      // private
      if (isLoggedIn) {
        void resolvePrivate(slug)
      } else {
        setPhase('need_login')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, isLoggedIn, resolvePrivate])

  // 未登录 private：登录成功后自动换票续开
  useEffect(() => {
    if (phase === 'need_login' && isLoggedIn && slug) {
      setPhase('loading')
      void resolvePrivate(slug)
    }
  }, [phase, isLoggedIn, slug, resolvePrivate])

  // 页签标题
  useEffect(() => {
    if (meta?.title && phase === 'ready') {
      document.title = `${meta.title} · 唤星`
    }
  }, [meta?.title, phase])

  async function handleUnlock() {
    if (!slug || !password.trim()) return
    setUnlocking(true)
    setPwErr('')
    try {
      const ticket = await unlockShare(slug, password)
      setContentUrl(shareContentUrl(slug, ticket.ticket))
      setPhase('ready')
    } catch (error) {
      setPwErr(error instanceof Error ? error.message : '口令错误')
    } finally {
      setUnlocking(false)
    }
  }

  function requestFullscreen() {
    iframeRef.current?.requestFullscreen?.()
  }

  // ---- 已就绪：全屏级查看器（顶栏 + 制品 iframe）----
  if (phase === 'ready' && contentUrl) {
    return (
      <div className="flex h-screen flex-col bg-white">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="truncate text-sm font-medium text-slate-900">{meta?.title || '分享'}</span>
          </div>
          {meta?.allow_present && (
            <button
              type="button"
              onClick={requestFullscreen}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100"
            >
              <Maximize2 className="h-4 w-4" />
              全屏
            </button>
          )}
        </header>
        <iframe
          ref={iframeRef}
          title={meta?.title || '分享内容'}
          src={contentUrl}
          sandbox="allow-scripts"
          allow="fullscreen"
          allowFullScreen
          className="min-h-0 w-full flex-1 border-0"
        />
      </div>
    )
  }

  // ---- 其余态：居中卡片 ----
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100">
        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-3 py-4 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="text-sm">正在打开分享…</p>
          </div>
        )}

        {phase === 'password' && (
          <>
            <Lock className="mx-auto mb-4 h-8 w-8 text-blue-600" />
            <h1 className="mb-1 text-base font-semibold text-slate-900">该分享受口令保护</h1>
            <p className="mb-5 text-sm text-slate-500">请输入访问口令后查看</p>
            <input
              type="password"
              value={password}
              autoFocus
              placeholder="请输入访问口令"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleUnlock}
              disabled={unlocking || !password.trim()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {unlocking && <Loader2 className="h-4 w-4 animate-spin" />}
              查看
            </button>
            {pwErr && <p className="mt-3 text-sm text-red-600">{pwErr}</p>}
          </>
        )}

        {phase === 'need_login' && (
          <>
            <Lock className="mx-auto mb-4 h-8 w-8 text-blue-600" />
            <h1 className="mb-1 text-base font-semibold text-slate-900">这是一个私密分享</h1>
            <p className="mb-5 text-sm text-slate-500">仅发布者本人可查看，请登录唤星账号后打开</p>
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              登录后查看
            </button>
          </>
        )}

        {phase === 'no_access' && (
          <>
            <ShieldAlert className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h1 className="mb-1 text-base font-semibold text-slate-900">无权查看该分享</h1>
            <p className="text-sm text-slate-500">这是一个私密分享，仅发布者本人可打开</p>
          </>
        )}

        {phase === 'expired' && (
          <>
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h1 className="mb-1 text-base font-semibold text-slate-900">该分享暂不可用</h1>
            <p className="text-sm text-slate-500">分享可能已过期或内容尚未就绪</p>
          </>
        )}

        {phase === 'not_found' && (
          <>
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-slate-400" />
            <h1 className="mb-1 text-base font-semibold text-slate-900">分享不存在</h1>
            <p className="text-sm text-slate-500">链接可能有误，或分享已被撤销</p>
          </>
        )}

        {phase === 'error' && (
          <>
            <ShieldAlert className="mx-auto mb-4 h-8 w-8 text-red-500" />
            <h1 className="mb-1 text-base font-semibold text-slate-900">加载失败</h1>
            <p className="text-sm text-slate-500">{errMsg || '请稍后重试'}</p>
          </>
        )}
      </div>
    </div>
  )
}
