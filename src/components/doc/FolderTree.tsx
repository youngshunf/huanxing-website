import { useState, useRef, useEffect } from 'react'
import {
  ChevronRight, ChevronDown, Folder, FolderOpen,
  Plus, Pencil, Trash2, Move, MoreHorizontal,
} from 'lucide-react'
import type { FolderTreeNode } from '../../types/doc'
import { useFolderStore } from '../../stores/useFolderStore'

interface FolderTreeProps {
  onCreateFolder: (parentId: number | null) => void
  onMoveItem?: (type: 'folder', id: number) => void
}

export default function FolderTree({ onCreateFolder, onMoveItem }: FolderTreeProps) {
  const { tree, currentFolderId, selectFolder } = useFolderStore()

  return (
    <div className="flex flex-col">
      {/* 根目录 */}
      <button
        onClick={() => selectFolder(null)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
          currentFolderId === null
            ? 'bg-star-purple/10 text-star-purple font-medium'
            : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
        }`}
      >
        <Folder className="h-4 w-4 shrink-0" />
        <span className="truncate">全部文档</span>
      </button>

      {/* 目录树 */}
      <div className="mt-1">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            onCreateFolder={onCreateFolder}
            onMoveItem={onMoveItem}
          />
        ))}
      </div>

      {/* 新建目录按钮 */}
      <button
        onClick={() => onCreateFolder(currentFolderId)}
        className="mt-3 flex items-center gap-2 rounded-lg border border-dashed border-border-default px-3 py-2 text-xs text-text-tertiary transition-colors hover:border-star-purple/30 hover:text-star-purple"
      >
        <Plus className="h-3.5 w-3.5" />
        新建目录
      </button>
    </div>
  )
}

function TreeNode({
  node, depth, onCreateFolder, onMoveItem,
}: {
  node: FolderTreeNode
  depth: number
  onCreateFolder: (parentId: number | null) => void
  onMoveItem?: (type: 'folder', id: number) => void
}) {
  const { currentFolderId, expandedIds, selectFolder, toggleExpand, deleteFolder, renameFolder } = useFolderStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(node.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const isExpanded = expandedIds.has(node.id)
  const isSelected = currentFolderId === node.id
  const hasChildren = node.children.length > 0

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [renaming])

  function handleClick() {
    selectFolder(node.id)
    if (hasChildren) toggleExpand(node.id)
  }

  async function handleRename() {
    if (newName.trim() && newName !== node.name) {
      await renameFolder(node.id, newName.trim())
    }
    setRenaming(false)
  }

  async function handleDelete() {
    const hasContent = hasChildren || node.doc_count > 0
    const msg = hasContent
      ? `「${node.name}」下有内容，确定递归删除吗？`
      : `确定删除目录「${node.name}」吗？`
    if (!confirm(msg)) return
    await deleteFolder(node.id, hasContent)
  }

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-lg py-1.5 pr-1 transition-colors ${
          isSelected
            ? 'bg-star-purple/10 text-star-purple'
            : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
        }`}
        style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
      >
        {/* 展开/折叠 */}
        <button
          onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(node.id) }}
          className="shrink-0 p-0.5"
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <span className="inline-block w-3.5" />
          )}
        </button>

        {/* 图标 */}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-star-gold" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-star-gold" />
        )}

        {/* 名称（编辑/只读） */}
        {renaming ? (
          <input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setRenaming(false) }}
            className="min-w-0 flex-1 rounded bg-space-input px-1.5 py-0.5 text-sm text-text-primary outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            onClick={handleClick}
            className="min-w-0 flex-1 truncate text-left text-sm"
          >
            {node.icon ? `${node.icon} ` : ''}{node.name}
          </button>
        )}

        {/* 文档数 */}
        {node.doc_count > 0 && !renaming && (
          <span className="shrink-0 text-xs text-text-tertiary">{node.doc_count}</span>
        )}

        {/* 操作菜单 */}
        {!renaming && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="invisible shrink-0 rounded p-0.5 text-text-tertiary hover:bg-space-float hover:text-text-primary group-focus-within:visible group-hover:visible"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            {menuOpen && (
              <ContextMenu
                onClose={() => setMenuOpen(false)}
                onRename={() => { setRenaming(true); setMenuOpen(false) }}
                onDelete={handleDelete}
                onCreateSub={() => { onCreateFolder(node.id); setMenuOpen(false) }}
                onMove={onMoveItem ? () => { onMoveItem('folder', node.id); setMenuOpen(false) } : undefined}
              />
            )}
          </div>
        )}
      </div>

      {/* 子节点 */}
      {isExpanded && node.children.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          onCreateFolder={onCreateFolder}
          onMoveItem={onMoveItem}
        />
      ))}
    </div>
  )
}

function ContextMenu({
  onClose, onRename, onDelete, onCreateSub, onMove,
}: {
  onClose: () => void
  onRename: () => void
  onDelete: () => void
  onCreateSub: () => void
  onMove?: () => void
}) {
  useEffect(() => {
    const handler = () => onClose()
    setTimeout(() => document.addEventListener('click', handler), 0)
    return () => document.removeEventListener('click', handler)
  }, [onClose])

  return (
    <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-border-default bg-space-panel shadow-lg">
      <button onClick={onCreateSub} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-space-float hover:text-text-primary">
        <Plus className="h-3 w-3" /> 新建子目录
      </button>
      <button onClick={onRename} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-space-float hover:text-text-primary">
        <Pencil className="h-3 w-3" /> 重命名
      </button>
      {onMove && (
        <button onClick={onMove} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-space-float hover:text-text-primary">
          <Move className="h-3 w-3" /> 移动
        </button>
      )}
      <div className="my-0.5 border-t border-divider" />
      <button onClick={onDelete} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
        <Trash2 className="h-3 w-3" /> 删除
      </button>
    </div>
  )
}
