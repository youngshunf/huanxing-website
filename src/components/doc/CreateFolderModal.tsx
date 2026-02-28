import { useState } from 'react'
import { X, FolderPlus } from 'lucide-react'
import { useFolderStore } from '../../stores/useFolderStore'

interface CreateFolderModalProps {
  parentId: number | null
  onClose: () => void
}

export default function CreateFolderModal({ parentId, onClose }: CreateFolderModalProps) {
  const { createFolder } = useFolderStore()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createFolder(name.trim(), parentId)
      onClose()
    } catch (err) {
      alert('创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl border border-border-default bg-space-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-star-purple" />
            <h3 className="text-lg font-semibold text-text-primary">新建目录</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-text-tertiary hover:bg-space-float hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入目录名称..."
            className="mb-4 w-full rounded-lg border border-border-default bg-space-input px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-star-purple"
          />
          {parentId !== null && (
            <p className="mb-4 text-xs text-text-tertiary">将创建为子目录</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-space-float"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="rounded-lg bg-star-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
