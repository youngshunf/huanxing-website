import { FileDown, FileText, FileType } from 'lucide-react'
import { downloadDoc } from '../../api/doc'
import { useEffect, useRef } from 'react'

interface DocExportMenuProps {
  docId: number
  docTitle: string
  onClose: () => void
}

const formats = [
  { key: 'markdown' as const, label: 'Markdown (.md)', icon: FileText, ext: '.md' },
  { key: 'pdf' as const, label: 'PDF (.pdf)', icon: FileDown, ext: '.pdf' },
  { key: 'docx' as const, label: 'Word (.docx)', icon: FileType, ext: '.docx' },
]

export default function DocExportMenu({ docId, docTitle, onClose }: DocExportMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-48 overflow-hidden rounded-lg border border-border-default bg-space-panel shadow-lg"
    >
      {formats.map(({ key, label, icon: Icon, ext }) => (
        <button
          key={key}
          onClick={() => {
            downloadDoc(docId, key, `${docTitle}${ext}`)
            onClose()
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-space-float hover:text-text-primary"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
