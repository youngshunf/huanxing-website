import { useState, useEffect, useCallback } from 'react'
import { List, ChevronDown, ChevronRight, X } from 'lucide-react'

export interface TocItem {
  id: string
  text: string
  level: number
}

/** 树节点 */
interface TocTreeNode {
  item: TocItem
  children: TocTreeNode[]
}

/** 把扁平标题列表构建为树 */
function buildTree(headings: TocItem[]): TocTreeNode[] {
  const root: TocTreeNode[] = []
  const stack: TocTreeNode[] = []

  for (const item of headings) {
    const node: TocTreeNode = { item, children: [] }
    // 回退到合适的父级
    while (stack.length > 0 && stack[stack.length - 1].item.level >= item.level) {
      stack.pop()
    }
    if (stack.length === 0) {
      root.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }
  return root
}

/** 从 markdown 文本提取标题列表 */
export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = []
  const lines = markdown.split('\n')
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trimStart()

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    // 标准 Markdown 标题
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = cleanMarkdown(headingMatch[2])
      if (text) {
        headings.push({ id: slugify(text), text, level })
      }
      continue
    }

    // 粗体独占行 → 伪 h2
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*$|^__(.+?)__$/)
    if (boldMatch) {
      const text = cleanMarkdown(boldMatch[1] || boldMatch[2])
      if (text && text.length >= 2 && text.length <= 80) {
        headings.push({ id: slugify(text), text, level: 2 })
      }
    }
  }
  return headings
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .replace(/`/g, '')
    .replace(/~~/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim()
}

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
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  const tree = buildTree(headings)

  // 默认展开第一层
  useEffect(() => {
    const ids = new Set<string>()
    tree.forEach((n) => {
      if (n.children.length > 0) ids.add(n.item.id)
    })
    setExpanded(ids)
  }, [headings])

  // 滚动监听
  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-60px 0px -70% 0px', threshold: 0.1 }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  const handleClick = useCallback((node: TocTreeNode) => {
    // 滚动到对应位置
    const el = document.getElementById(node.item.id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'smooth' })
      setActiveId(node.item.id)
    }
    // 如果有子项，切换展开/折叠
    if (node.children.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(node.item.id)) {
          next.delete(node.item.id)
        } else {
          next.add(node.item.id)
        }
        return next
      })
    }
    setMobileOpen(false)
  }, [])

  if (headings.length === 0) return null

  function renderNode(node: TocTreeNode, depth: number) {
    const hasChildren = node.children.length > 0
    const isExpanded = expanded.has(node.item.id)
    const isActive = activeId === node.item.id

    return (
      <div key={node.item.id}>
        <button
          onClick={() => handleClick(node)}
          className={`group flex w-full items-start gap-1.5 rounded-md px-2 py-1.5 text-left text-[13px] leading-relaxed transition-all ${
            isActive
              ? 'bg-star-purple/10 font-medium text-star-purple'
              : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-tertiary" />
            ) : (
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-tertiary" />
            )
          ) : (
            <span className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          <span className="break-words">{node.item.text}</span>
        </button>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const tocContent = (
    <nav className="space-y-0.5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        <List className="h-3.5 w-3.5" />
        大纲
      </div>
      {tree.map((node) => renderNode(node, 0))}
    </nav>
  )

  return (
    <>
      {/* 桌面端：左侧 sticky 大纲 */}
      <aside className={`hidden xl:block ${className}`}>
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-2 pr-2">
          {tocContent}
        </div>
      </aside>

      {/* 移动端浮动按钮 */}
      <div className="xl:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-star-purple text-white shadow-lg shadow-star-purple/25 transition-transform hover:scale-105 active:scale-95"
          title="文档大纲"
        >
          <List className="h-5 w-5" />
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed bottom-0 left-0 top-0 z-50 w-72 overflow-y-auto border-r border-border-default bg-space-panel p-5 shadow-2xl">
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
