import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Save, Share2, Download, Eye, Loader2,
} from 'lucide-react'
import { useDocStore } from '../../stores/useDocStore'
import VditorEditor from '../../components/doc/VditorEditor'
import SaveIndicator from '../../components/doc/SaveIndicator'
import ShareModal from '../../components/doc/ShareModal'
import DocExportMenu from '../../components/doc/DocExportMenu'
import useAutosave from '../../hooks/useAutosave'
import * as docApi from '../../api/doc'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentDoc, fetchDoc, updateCurrentDoc } = useDocStore()

  const isNew = id === 'new'
  const docId = isNew ? null : Number(id)

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showDraftRecover, setShowDraftRecover] = useState(false)
  const [draftContent, setDraftContent] = useState<string | null>(null)
  const contentRef = useRef('')  // 实时跟踪编辑器内容

  const { status, onContentChange, initSavedContent } = useAutosave({
    docId,
  })

  // 加载文档
  useEffect(() => {
    if (isNew) {
      setTitle('')
      initSavedContent('')
      setLoading(false)
      return
    }

    if (docId) {
      setLoading(true)
      fetchDoc(docId)
        .then(async (doc) => {
          setTitle(doc.title || '')
          initSavedContent(doc.content || '')

          // 检查是否有更新的草稿
          try {
            const autosave = await docApi.getAutosave(docId)
            if (autosave && autosave.content && autosave.updated_at) {
              const docTime = doc.updated_at ? new Date(doc.updated_at).getTime() : 0
              const draftTime = new Date(autosave.updated_at).getTime()
              if (draftTime > docTime && autosave.content !== doc.content) {
                setDraftContent(autosave.content)
                setShowDraftRecover(true)
              }
            }
          } catch { /* 没有草稿 */ }
        })
        .catch(() => navigate('/docs'))
        .finally(() => setLoading(false))
    }
  }, [docId, isNew])

  // 手动保存 (Ctrl+S)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [docId, title])

  // 保存主文档
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      if (isNew || !docId) {
        // 创建新文档
        const uuid = crypto.randomUUID()
        const content = contentRef.current
        const folderId = searchParams.get('folder')
        const result = await docApi.createDoc({
          uuid,
          title: title || '无标题文档',
          content,
          status: 'draft',
          folder_id: folderId ? Number(folderId) : undefined,
        })
        // 跳转到编辑页
        navigate(`/doc/${result.id}/edit`, { replace: true })
      } else {
        // 更新现有文档
        const content = contentRef.current || currentDoc?.content || ''
        await docApi.updateDoc(docId, {
          title: title || '无标题文档',
          content,
          word_count: content.length,
        })
        updateCurrentDoc({
          title,
          content,
          current_version: (currentDoc?.current_version || 0) + 1,
        })
      }
    } catch (e) {
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }, [docId, title, isNew, currentDoc])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-space-black">
        <Loader2 className="h-8 w-8 animate-spin text-star-purple" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-space-black">
      {/* 顶部工具栏 — 全屏宽度 */}
      <header className="sticky top-0 z-10 border-b border-divider bg-space-panel/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-2">
          {/* 左侧 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/docs')}
              className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <SaveIndicator status={saving ? 'saving' : status} version={currentDoc?.current_version} />
          </div>

          {/* 右侧操作 */}
          <div className="flex items-center gap-1">
            {!isNew && docId && (
              <button
                onClick={() => navigate(`/doc/${docId}/view`)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
              >
                <Eye className="h-4 w-4" />
                <span className="max-sm:hidden">预览</span>
              </button>
            )}
            {!isNew && docId && (
              <button
                onClick={() => setShowShare(true)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
              >
                <Share2 className="h-4 w-4" />
                <span className="max-sm:hidden">分享</span>
              </button>
            )}
            {!isNew && docId && (
              <div className="relative">
                <button
                  onClick={() => setShowExport(!showExport)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
                >
                  <Download className="h-4 w-4" />
                  <span className="max-sm:hidden">导出</span>
                </button>
                {showExport && (
                  <DocExportMenu
                    docId={docId}
                    docTitle={title || '文档'}
                    onClose={() => setShowExport(false)}
                  />
                )}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-star-purple px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? '保存中...' : '保存'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 标题输入 — 全屏宽度 */}
      <div className="px-6 pt-6 lg:px-12">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文档标题..."
          className="w-full border-none bg-transparent text-2xl font-bold text-text-primary placeholder-text-tertiary outline-none sm:text-3xl"
        />
      </div>

      {/* 编辑器 — 全屏宽度，撑满剩余高度 */}
      <div className="px-4 pb-0 lg:px-8">
        <VditorEditor
          initialContent={currentDoc?.content || ''}
          onChange={(value) => {
            contentRef.current = value
            onContentChange(value)
          }}
        />
      </div>

      {/* 草稿恢复提示 */}
      {showDraftRecover && draftContent && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-xl border border-star-purple/30 bg-space-panel p-4 shadow-xl">
          <p className="mb-3 text-sm text-text-primary">
            📝 检测到未保存的草稿，是否恢复？
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // TODO: 将 draftContent 设置到编辑器
                setShowDraftRecover(false)
              }}
              className="flex-1 rounded-lg bg-star-purple py-2 text-sm font-medium text-white hover:bg-star-purple-hover"
            >
              恢复草稿
            </button>
            <button
              onClick={() => setShowDraftRecover(false)}
              className="flex-1 rounded-lg border border-border-default py-2 text-sm text-text-secondary hover:bg-space-float"
            >
              忽略
            </button>
          </div>
        </div>
      )}

      {/* 分享弹窗 */}
      {showShare && docId && (
        <ShareModal
          docId={docId}
          currentToken={currentDoc?.share_token}
          onClose={() => setShowShare(false)}
          onShareUpdated={(token) => {
            updateCurrentDoc({ share_token: token || undefined })
          }}
        />
      )}
    </div>
  )
}
