import { useState } from 'react'
import { X, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react'
import type { FolderTreeNode } from '../../types/doc'
import { useFolderStore } from '../../stores/useFolderStore'

interface MoveItemModalProps {
  title: string
  excludeId?: number  // 排除自身（防止移到自己下面）
  onConfirm: (targetFolderId: number | null) => Promise<void>
  onClose: () => void
}

export default function MoveItemModal({ title, excludeId, onConfirm, onClose }: MoveItemModalProps) {
  const { tree } = useFolderStore()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)

  function toggle(id: number) {
    const s = new Set(expanded)
    if (s.has(id)) s.delete(id); else s.add(id)
    setExpanded(s)
  }

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm(selectedId)
      onClose()
    } catch {
      alert('移动失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl border border-border-default bg-space-panel p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-text-tertiary hover:bg-space-float"><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-border-default bg-space-black p-2">
          {/* 根目录 */}
          <button
            onClick={() => setSelectedId(null)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              selectedId === null ? 'bg-star-purple/10 text-star-purple' : 'text-text-secondary hover:bg-space-float'
            }`}
          >
            <Folder className="h-4 w-4" /> 根目录
          </button>

          {tree.map((node) => (
            <PickerNode
              key={node.id}
              node={node}
              depth={0}
              excludeId={excludeId}
              selectedId={selectedId}
              expanded={expanded}
              onSelect={setSelectedId}
              onToggle={toggle}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-space-float">取消</button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-lg bg-star-purple px-4 py-2 text-sm font-medium text-white hover:bg-star-purple-hover disabled:opacity-50"
          >
            {loading ? '移动中...' : '确定移动'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PickerNode({
  node, depth, excludeId, selectedId, expanded, onSelect, onToggle,
}: {
  node: FolderTreeNode
  depth: number
  excludeId?: number
  selectedId: number | null
  expanded: Set<number>
  onSelect: (id: number) => void
  onToggle: (id: number) => void
}) {
  if (node.id === excludeId) return null
  const isExpanded = expanded.has(node.id)
  const isSelected = selectedId === node.id

  return (
    <div>
      <div
        className={`flex items-center gap-1 rounded-lg py-1.5 pr-2 text-sm transition-colors ${
          isSelected ? 'bg-star-purple/10 text-star-purple' : 'text-text-secondary hover:bg-space-float'
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <button onClick={() => { if (node.children.length) onToggle(node.id) }} className="shrink-0 p-0.5">
          {node.children.length ? (
            isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          ) : <span className="inline-block w-3.5" />}
        </button>
        <button onClick={() => onSelect(node.id)} className="flex min-w-0 flex-1 items-center gap-2 truncate">
          {isExpanded ? <FolderOpen className="h-4 w-4 shrink-0 text-star-gold" /> : <Folder className="h-4 w-4 shrink-0 text-star-gold" />}
          {node.name}
        </button>
      </div>
      {isExpanded && node.children
        .filter((c) => c.id !== excludeId)
        .map((child) => (
          <PickerNode key={child.id} node={child} depth={depth + 1} excludeId={excludeId} selectedId={selectedId} expanded={expanded} onSelect={onSelect} onToggle={onToggle} />
        ))}
    </div>
  )
}
