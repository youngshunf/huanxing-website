import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Lock, AlertCircle, Clock, FileText, ExternalLink } from 'lucide-react'
import { getSharedDoc } from '../../api/doc'
import MarkdownRenderer from '../../components/doc/MarkdownRenderer'
import type { DocItem } from '../../types/doc'

type PageState = 'loading' | 'password' | 'content' | 'expired' | 'error'

export default function SharePage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<PageState>('loading')
  const [doc, setDoc] = useState<DocItem | null>(null)
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 首次加载（不带密码）
  useEffect(() => {
    if (!token) return
    loadDocument()
  }, [token])

  async function loadDocument(pwd?: string) {
    setState('loading')
    setPasswordError('')
    try {
      const data = await getSharedDoc(token!, pwd)
      setDoc(data)
      setState('content')
    } catch (e: any) {
      const msg = e?.message || ''
      if (msg.includes('密码') || msg.includes('password')) {
        setState('password')
        if (pwd) setPasswordError('密码不正确，请重新输入')
      } else if (msg.includes('过期') || msg.includes('expired')) {
        setState('expired')
      } else {
        setErrorMsg(msg || '文档加载失败')
        setState('error')
      }
    }
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    loadDocument(password)
  }

  // ========== 加载中 ==========
  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
          <p className="text-sm text-text-secondary">加载文档中...</p>
        </div>
      </div>
    )
  }

  // ========== 密码输入 ==========
  if (state === 'password') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border-default bg-space-panel p-6 shadow-xl">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-star-purple/10">
              <Lock className="h-6 w-6 text-star-purple" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">此文档需要密码</h2>
            <p className="text-center text-sm text-text-secondary">请输入密码以查看文档内容</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                autoFocus
                className="w-full rounded-lg border border-border-default bg-space-input px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-star-purple"
              />
              {passwordError && (
                <p className="mt-2 text-xs text-red-400">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-star-purple px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover"
            >
              确认
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ========== 过期 ==========
  if (state === 'expired') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black px-4">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">分享链接已过期</h2>
          <p className="text-sm text-text-secondary">请联系文档所有者重新生成分享链接</p>
          <a
            href="/"
            className="mt-4 rounded-lg bg-star-purple px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover"
          >
            返回首页
          </a>
        </div>
      </div>
    )
  }

  // ========== 错误 ==========
  if (state === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black px-4">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">无法加载文档</h2>
          <p className="text-sm text-text-secondary">{errorMsg}</p>
          <a
            href="/"
            className="mt-4 rounded-lg bg-star-purple px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover"
          >
            返回首页
          </a>
        </div>
      </div>
    )
  }

  // ========== 文档内容 ==========
  return (
    <div className="min-h-screen bg-space-black">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-10 border-b border-divider bg-space-panel/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-star-purple" />
            <h1 className="truncate text-sm font-medium text-text-primary sm:text-base">
              {doc?.title || '无标题文档'}
            </h1>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            唤星AI
          </a>
        </div>
      </header>

      {/* 文档内容 */}
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        {/* 标题 */}
        <h1 className="mb-6 text-2xl font-bold text-text-primary sm:mb-8 sm:text-3xl">
          {doc?.title}
        </h1>

        {/* 元信息 */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-text-tertiary sm:mb-8 sm:gap-4 sm:text-sm">
          {doc?.word_count ? <span>{doc.word_count} 字</span> : null}
          {doc?.tags && (
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(doc.tags) ? doc.tags : typeof doc.tags === 'string' ? doc.tags.split(',') : [])
                .filter(Boolean)
                .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-star-purple/10 px-2 py-0.5 text-xs text-star-purple"
                >
                  {typeof tag === 'string' ? tag.trim() : tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Markdown 正文 */}
        <MarkdownRenderer content={doc?.content || ''} />
      </main>

      {/* 底部品牌 */}
      <footer className="border-t border-divider py-6 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs text-text-tertiary transition-colors hover:text-star-purple"
        >
          <span>✨ 由唤星AI生成</span>
          <span>·</span>
          <span className="underline">了解更多</span>
        </a>
      </footer>
    </div>
  )
}
