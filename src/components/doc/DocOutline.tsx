import { useState, useEffect, useCallback } from 'react'
import { List, ChevronDown, ChevronRight, X } from 'lucide-react'

import type { TocItem } from './docOutlineUtils'

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

interface DocOutlineProps {
  headings: TocItem[]
}

export default function DocOutline({ headings }: DocOutlineProps) {
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
    window.setTimeout(() => setExpanded(ids), 0)
  }, [headings, tree])

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
      {/* 桌面端：fixed 定位，始终可见 */}
      <aside className="hidden xl:block fixed left-0 top-14 bottom-0 w-64 overflow-y-auto border-r border-border-default bg-space-black/50 backdrop-blur-sm px-4 py-4">
        {tocContent}
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
