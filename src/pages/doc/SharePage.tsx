import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Lock, AlertCircle, Clock, FileText, ExternalLink, Sun, Moon, Download, FileDown } from 'lucide-react'
import { getSharedDoc } from '../../api/doc'
import MarkdownRenderer from '../../components/doc/MarkdownRenderer'
import DocOutline, { extractHeadings } from '../../components/doc/DocOutline'
import type { DocItem } from '../../types/doc'

type PageState = 'loading' | 'password' | 'content' | 'expired' | 'error'
type ShareTheme = 'light' | 'dark'

function applyShareTheme(theme: ShareTheme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export default function SharePage() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<PageState>('loading')
  const [doc, setDoc] = useState<DocItem | null>(null)
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // 分享页独立主题，默认 light，不影响全局 theme store
  const [shareTheme, setShareTheme] = useState<ShareTheme>(() => {
    const theme = (localStorage.getItem('share_theme') as ShareTheme) || 'light'
    applyShareTheme(theme) // 立即同步应用，避免闪烁
    return theme
  })
  const prevThemeRef = useRef<string | null>(null)

  // 导出下拉菜单
  const [showExport, setShowExport] = useState(false)
  const exportMenuRef = useRef<HTMLDivElement>(null)

  // 从文档内容提取大纲
  const headings = useMemo(() => extractHeadings(doc?.content || ''), [doc?.content])

  // 进入分享页：应用分享页主题，离开时恢复原有主题和 title
  const prevTitleRef = useRef(document.title)
  useEffect(() => {
    prevThemeRef.current = localStorage.getItem('theme')
    applyShareTheme(shareTheme)
    return () => {
      document.title = prevTitleRef.current
      const prev = prevThemeRef.current
      if (prev === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [])

  // 主题变更时同步到 DOM
  useEffect(() => {
    applyShareTheme(shareTheme)
  }, [shareTheme])

  // 点击导出菜单外部时关闭
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExport(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
      document.title = `${data.title || '无标题文档'} - 唤星AI`
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

  function toggleTheme() {
    const next: ShareTheme = shareTheme === 'dark' ? 'light' : 'dark'
    setShareTheme(next)
    localStorage.setItem('share_theme', next)
  }

  function downloadMarkdown() {
    if (!doc) return
    const blob = new Blob([doc.content || ''], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title || '文档'}.md`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
    setShowExport(false)
  }

  function printToPdf() {
    setShowExport(false)
    setTimeout(() => window.print(), 150)
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
      {/* 顶部工具栏 — fixed */}
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-divider bg-space-panel/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-star-purple" />
            <h1 className="truncate text-sm font-medium text-text-primary sm:text-base">
              {doc?.title || '无标题文档'}
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
              aria-label="切换主题"
            >
              {shareTheme === 'dark'
                ? <Moon className="h-[18px] w-[18px]" />
                : <Sun className="h-[18px] w-[18px]" />
              }
            </button>

            {/* 导出 */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExport(!showExport)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
              >
                <Download className="h-4 w-4" />
                <span className="max-sm:hidden">导出</span>
              </button>
              {showExport && (
                <div className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-border-default bg-space-panel shadow-lg">
                  <button
                    onClick={downloadMarkdown}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
                  >
                    <FileText className="h-4 w-4" />
                    Markdown (.md)
                  </button>
                  <button
                    onClick={printToPdf}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
                  >
                    <FileDown className="h-4 w-4" />
                    打印 / 导出 PDF
                  </button>
                </div>
              )}
            </div>

            {/* 品牌链接 */}
            <a
              href="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary sm:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              唤星AI
            </a>
          </div>
        </div>
      </header>

      {/* 标题区域 — pt-20 补偿 fixed header，xl 下为大纲留出空间 */}
      <div className="mx-auto max-w-7xl px-4 pt-20 xl:ml-72 xl:mr-auto">
        <h1 className="mb-4 text-2xl font-bold text-text-primary sm:mb-6 sm:text-3xl">
          {doc?.title}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-text-tertiary sm:gap-4 sm:text-sm">
          {doc?.word_count ? <span>{doc.word_count} 字</span> : null}
          {doc?.tags && (
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(doc.tags)
                ? doc.tags
                : typeof doc.tags === 'string'
                  ? doc.tags.split(',')
                  : []
              )
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
      </div>

      {/* 左侧大纲 */}
      <DocOutline headings={headings} />

      {/* 文档正文 — xl 下为大纲留出空间 */}
      <main className="mx-auto max-w-7xl px-4 pb-16 xl:ml-72 xl:mr-auto">
        <MarkdownRenderer content={doc?.content || ''} />
      </main>

      {/* 底部品牌 */}
      <footer className="border-t border-divider py-6 text-center xl:ml-72">
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
