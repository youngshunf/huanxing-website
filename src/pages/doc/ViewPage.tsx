import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Share2, Download, Loader2 } from 'lucide-react'
import { useDocStore } from '../../stores/useDocStore'
import MarkdownRenderer from '../../components/doc/MarkdownRenderer'
import DocOutline, { extractHeadings } from '../../components/doc/DocOutline'
import DocExportMenu from '../../components/doc/DocExportMenu'
import ShareModal from '../../components/doc/ShareModal'
import ThemeToggle from '../../components/ThemeToggle'

export default function ViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentDoc, currentLoading, fetchDoc, updateCurrentDoc } = useDocStore()
  const [showExport, setShowExport] = useState(false)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    if (id) fetchDoc(Number(id)).catch(() => navigate('/docs'))
  }, [id])

  // 从文档内容提取大纲
  const headings = useMemo(
    () => extractHeadings(currentDoc?.content || ''),
    [currentDoc?.content]
  )

  if (currentLoading || !currentDoc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black">
        <Loader2 className="h-8 w-8 animate-spin text-star-purple" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black">
      {/* 顶部工具栏 */}
      <header className="sticky top-0 z-10 border-b border-divider bg-space-panel/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate('/dashboard/docs')}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="max-sm:hidden">返回列表</span>
          </button>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => navigate(`/doc/${id}/edit`)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
            >
              <Pencil className="h-4 w-4" />
              <span className="max-sm:hidden">编辑</span>
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
            >
              <Share2 className="h-4 w-4" />
              <span className="max-sm:hidden">分享</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExport(!showExport)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
              >
                <Download className="h-4 w-4" />
                <span className="max-sm:hidden">导出</span>
              </button>
              {showExport && (
                <DocExportMenu
                  docId={currentDoc.id}
                  docTitle={currentDoc.title}
                  onClose={() => setShowExport(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 标题区域 — 全宽独占 */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-10">
        <h1 className="mb-4 text-2xl font-bold text-text-primary sm:mb-6 sm:text-3xl">
          {currentDoc.title}
        </h1>
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-text-tertiary sm:gap-4 sm:text-sm">
          {currentDoc.word_count ? <span>{currentDoc.word_count} 字</span> : null}
          <span>v{currentDoc.current_version}</span>
          {currentDoc.updated_at && (
            <span>更新于 {new Date(currentDoc.updated_at).toLocaleString('zh-CN')}</span>
          )}
          {currentDoc.tags && (
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(currentDoc.tags) ? currentDoc.tags : typeof currentDoc.tags === 'string' ? currentDoc.tags.split(',') : [])
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

      {/* 大纲 + 内容 并排 */}
      <div className="mx-auto flex max-w-6xl gap-6 px-4">
        {/* 左侧大纲 */}
        <DocOutline headings={headings} className="w-64 shrink-0" />

        {/* 文档正文 */}
        <main className="min-w-0 flex-1 pb-10">
          <MarkdownRenderer content={currentDoc.content || ''} />
        </main>
      </div>

      {/* 移动端大纲浮动按钮（DocOutline 内部处理） */}

      {/* 分享弹窗 */}
      {showShare && (
        <ShareModal
          docId={currentDoc.id}
          currentToken={currentDoc.share_token}
          onClose={() => setShowShare(false)}
          onShareUpdated={(token) => {
            updateCurrentDoc({ share_token: token || undefined })
          }}
        />
      )}
    </div>
  )
}
