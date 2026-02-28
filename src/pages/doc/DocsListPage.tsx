import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Plus, Eye, Pencil, Download, Trash2,
  MoreHorizontal, Loader2, Sparkles,
} from 'lucide-react'
import { useDocStore } from '../../stores/useDocStore'
import DocExportMenu from '../../components/doc/DocExportMenu'
import type { DocItem } from '../../types/doc'

const STATUS_TABS = [
  { key: '', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'published', label: '已发布' },
  { key: 'archived', label: '已归档' },
]

export default function DocsListPage() {
  const navigate = useNavigate()
  const { docs, loading, fetchDocs, deleteDoc } = useDocStore()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [menuDocId, setMenuDocId] = useState<number | null>(null)
  const [exportDocId, setExportDocId] = useState<number | null>(null)

  useEffect(() => {
    fetchDocs({ page: 1, size: 20, title: searchText || undefined, status: statusFilter || undefined })
  }, [statusFilter])

  function handleSearch() {
    fetchDocs({ page: 1, size: 20, title: searchText || undefined, status: statusFilter || undefined })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch()
  }

  async function handleDelete(doc: DocItem) {
    if (!confirm(`确定要删除「${doc.title}」吗？`)) return
    try {
      await deleteDoc(doc.id)
    } catch {
      alert('删除失败')
    }
  }

  return (
    <div className="min-h-screen bg-space-black">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-10 border-b border-divider bg-space-panel/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-text-primary">📄 我的文档</h1>
            <button
              onClick={() => navigate('/doc/new/edit')}
              className="flex items-center gap-2 rounded-lg bg-star-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover"
            >
              <Plus className="h-4 w-4" />
              新建文档
            </button>
          </div>

          {/* 搜索栏 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索文档标题..."
                className="w-full rounded-lg border border-border-default bg-space-input py-2 pl-9 pr-4 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-star-purple"
              />
            </div>
          </div>

          {/* 状态筛选 */}
          <div className="mt-3 flex gap-1">
            {STATUS_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === key
                    ? 'bg-star-purple text-white'
                    : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 文档列表 */}
      <main className="mx-auto max-w-4xl px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-star-purple" />
          </div>
        ) : docs.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-star-purple/10">
              <Sparkles className="h-10 w-10 text-star-purple" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-text-primary">还没有文档</h3>
            <p className="mb-6 text-sm text-text-secondary">
              AI 会帮你创建文档，也可以自己新建 ✨
            </p>
            <button
              onClick={() => navigate('/doc/new/edit')}
              className="rounded-lg bg-star-purple px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover"
            >
              新建文档
            </button>
          </div>
        ) : (
          /* 卡片列表 */
          <div className="grid gap-3 sm:grid-cols-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="group relative rounded-xl border border-border-default bg-space-panel p-4 transition-all hover:border-star-purple/30 hover:shadow-lg hover:shadow-star-purple/5"
              >
                {/* 标题行 */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3
                    className="cursor-pointer truncate text-base font-semibold text-text-primary transition-colors hover:text-star-purple"
                    onClick={() => navigate(`/doc/${doc.id}/view`)}
                  >
                    {doc.title || '无标题文档'}
                  </h3>
                  {doc.agent_id && (
                    <span className="shrink-0 rounded bg-star-purple/10 px-1.5 py-0.5 text-xs text-star-purple">
                      🤖 AI
                    </span>
                  )}
                </div>

                {/* 摘要 */}
                {doc.summary && (
                  <p className="mb-3 line-clamp-2 text-sm text-text-secondary">
                    {doc.summary}
                  </p>
                )}

                {/* 标签 + 字数 */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {doc.tags?.split(',').filter(Boolean).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-space-float px-2 py-0.5 text-xs text-text-tertiary"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                  {doc.word_count > 0 && (
                    <span className="text-xs text-text-tertiary">{doc.word_count}字</span>
                  )}
                </div>

                {/* 底部：时间 + 操作 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">
                    {doc.updated_at
                      ? new Date(doc.updated_at).toLocaleDateString('zh-CN')
                      : new Date(doc.created_at).toLocaleDateString('zh-CN')}
                    {' 更新'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => navigate(`/doc/${doc.id}/view`)}
                      className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-space-float hover:text-text-primary"
                      title="查看"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/doc/${doc.id}/edit`)}
                      className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-space-float hover:text-text-primary"
                      title="编辑"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuDocId(menuDocId === doc.id ? null : doc.id)}
                        className="rounded-md p-1.5 text-text-tertiary transition-colors hover:bg-space-float hover:text-text-primary"
                        title="更多"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menuDocId === doc.id && (
                        <DocContextMenu
                          doc={doc}
                          onClose={() => setMenuDocId(null)}
                          onDelete={() => handleDelete(doc)}
                          onExport={() => {
                            setExportDocId(doc.id)
                            setMenuDocId(null)
                          }}
                        />
                      )}
                    </div>
                    {exportDocId === doc.id && (
                      <div className="relative">
                        <DocExportMenu
                          docId={doc.id}
                          docTitle={doc.title}
                          onClose={() => setExportDocId(null)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// 右键/更多菜单
function DocContextMenu({ doc, onClose, onDelete, onExport }: {
  doc: DocItem
  onClose: () => void
  onDelete: () => void
  onExport: () => void
}) {
  const navigate = useNavigate()

  useEffect(() => {
    function handleClick() {
      onClose()
    }
    setTimeout(() => document.addEventListener('click', handleClick), 0)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border-default bg-space-panel shadow-lg">
      <button
        onClick={() => navigate(`/doc/${doc.id}/view`)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary"
      >
        <Eye className="h-3.5 w-3.5" /> 查看
      </button>
      <button
        onClick={() => navigate(`/doc/${doc.id}/edit`)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary"
      >
        <Pencil className="h-3.5 w-3.5" /> 编辑
      </button>
      <button
        onClick={onExport}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary"
      >
        <Download className="h-3.5 w-3.5" /> 导出
      </button>
      <div className="my-1 border-t border-divider" />
      <button
        onClick={onDelete}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
      >
        <Trash2 className="h-3.5 w-3.5" /> 删除
      </button>
    </div>
  )
}
