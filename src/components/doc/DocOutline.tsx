import { useState, useEffect, useCallback } from 'react'
import { List, ChevronRight, X } from 'lucide-react'

export interface TocItem {
  id: string
  text: string
  level: number
}

/** 从 markdown 文本提取标题列表 */
export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = []
  const lines = markdown.split('\n')
  let inCodeBlock = false

  for (const line of lines) {
    // 跳过代码块内的 # 号
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/[*_`~\[\]]/g, '').trim() // 去掉 markdown 格式符号
      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fff-]/g, '') // 保留中文、字母、数字、连字符
      headings.push({ id, text, level })
    }
  }
  return headings
}

/** 生成标题的 slug ID（和 extractHeadings 保持一致） */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
}

interface DocOutlineProps {
  headings: TocItem[]
  className?: string
}

export default function DocOutline({ headings, className = '' }: DocOutlineProps) {
  const [activeId, setActiveId] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  // 滚动监听：高亮当前可见标题
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到最靠近顶部的可见标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0.1 }
    )

    // 给所有标题元素添加观察
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(id)
      setMobileOpen(false)
    }
  }, [])

  if (headings.length === 0) return null

  const minLevel = Math.min(...headings.map((h) => h.level))

  const tocContent = (
    <nav className="space-y-0.5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        <List className="h-3.5 w-3.5" />
        大纲
      </div>
      {headings.map(({ id, text, level }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[13px] leading-snug transition-all ${
            activeId === id
              ? 'bg-star-purple/10 font-medium text-star-purple'
              : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
          }`}
          style={{ paddingLeft: `${(level - minLevel) * 14 + 8}px` }}
        >
          <ChevronRight
            className={`h-3 w-3 shrink-0 transition-transform ${
              activeId === id ? 'text-star-purple' : 'text-text-tertiary opacity-0 group-hover:opacity-100'
            }`}
          />
          <span className="truncate">{text}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <>
      {/* 桌面端：右侧固定大纲 */}
      <aside className={`hidden xl:block ${className}`}>
        <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto rounded-xl border border-border-default bg-space-panel p-4">
          {tocContent}
        </div>
      </aside>

      {/* 移动端/平板：浮动按钮 + 弹出面板 */}
      <div className="xl:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-star-purple text-white shadow-lg shadow-star-purple/25 transition-transform hover:scale-105 active:scale-95"
          title="文档大纲"
        >
          <List className="h-5 w-5" />
        </button>

        {/* 蒙层 + 侧滑面板 */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed bottom-0 right-0 top-0 z-50 w-72 overflow-y-auto border-l border-border-default bg-space-panel p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">文档大纲</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1 text-text-secondary hover:bg-space-float hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {tocContent}
            </div>
          </>
        )}
      </div>
    </>
  )
}
