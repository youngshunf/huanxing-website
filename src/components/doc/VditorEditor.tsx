import { useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Markdown } from 'tiptap-markdown'
import { common, createLowlight } from 'lowlight'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare, Quote, Code, FileCode,
  Link2, Image as ImageIcon, Minus,
  Undo, Redo,
} from 'lucide-react'

const lowlight = createLowlight(common)

interface EditorProps {
  initialContent: string
  onChange: (content: string) => void
}

/** 安全获取 Markdown 内容 */
function getMarkdown(editor: any): string {
  try {
    if (editor?.storage?.markdown?.getMarkdown) {
      return editor.storage.markdown.getMarkdown()
    }
  } catch { /* ignore */ }
  // 回退：从 HTML 获取文本
  return editor?.getText?.() || ''
}

export default function RichMarkdownEditor({ initialContent, onChange }: EditorProps) {
  const initialSet = useRef(false)
  const skipUpdate = useRef(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: '开始编写文档...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'hx-editor-link' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'hx-editor-img' },
      }),
      TableKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: false }),
      Underline,
      CodeBlockLowlight.configure({ lowlight }),
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor: ed }) => {
      // 跳过 setContent 触发的 onUpdate（初始加载）
      if (skipUpdate.current) return
      const md = getMarkdown(ed)
      if (md) {
        console.log('[Editor] onUpdate → onChange, length:', md.length)
        onChangeRef.current(md)
      }
    },
    editorProps: {
      attributes: {
        class: 'hx-tiptap-editor',
      },
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData
        if (!clipboardData) return false

        const html = clipboardData.getData('text/html')
        const text = clipboardData.getData('text/plain')
        if (!text || !html) return false

        // VSCode / IDE 复制的 HTML 是语法高亮的 <div>+<span> 结构，不含语义化标签。
        // 如果 HTML 中没有任何语义化元素，说明来自代码编辑器，
        // 此时忽略 HTML，直接用 tiptap-markdown 的 clipboardTextParser 解析 Markdown 文本。
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        const hasSemanticHtml = !!(
          parsed.querySelector('h1, h2, h3, h4, h5, h6') ||
          parsed.querySelector('strong, b, em, i') ||
          parsed.querySelector('table, ul, ol, li') ||
          parsed.querySelector('blockquote') ||
          parsed.querySelector('a[href]')
        )

        if (!hasSemanticHtml) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mdParser = view.someProp('clipboardTextParser') as any
          if (mdParser) {
            try {
              const slice = mdParser(text, view.state.$from, false, view)
              if (slice) {
                view.dispatch(view.state.tr.replaceSelection(slice))
                return true
              }
            } catch { /* 降级为默认行为 */ }
          }
        }

        return false
      },
    },
  })

  // 初始内容加载
  useEffect(() => {
    if (editor && initialContent && !initialSet.current) {
      initialSet.current = true
      skipUpdate.current = true
      editor.commands.setContent(initialContent)
      console.log('[Editor] setContent done, skipUpdate will restore in 100ms')
      // 等待足够时间让 setContent 触发的 onUpdate 完成
      setTimeout(() => {
        skipUpdate.current = false
        console.log('[Editor] skipUpdate restored to false')
      }, 100)
    }
  }, [editor, initialContent])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('输入链接地址:', 'https://')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('输入图片地址:', 'https://')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex h-full flex-col">
      {/* 工具栏 */}
      <div className="border-b border-divider bg-space-panel px-4 py-1.5 sm:px-8 md:px-12 lg:px-20 xl:px-32">
        <div className="flex flex-wrap items-center gap-0.5">
        <ToolBtn
          icon={Undo} label="撤销"
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolBtn
          icon={Redo} label="重做"
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
        />
        <Divider />
        <ToolBtn
          icon={Bold} label="加粗"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolBtn
          icon={Italic} label="斜体"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolBtn
          icon={UnderlineIcon} label="下划线"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolBtn
          icon={Strikethrough} label="删除线"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <Divider />
        <ToolBtn
          icon={Heading1} label="标题1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolBtn
          icon={Heading2} label="标题2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolBtn
          icon={Heading3} label="标题3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <Divider />
        <ToolBtn
          icon={List} label="无序列表"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolBtn
          icon={ListOrdered} label="有序列表"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolBtn
          icon={CheckSquare} label="任务列表"
          active={editor.isActive('taskList')}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />
        <Divider />
        <ToolBtn
          icon={Quote} label="引用"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolBtn
          icon={Code} label="行内代码"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
        <ToolBtn
          icon={FileCode} label="代码块"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <Divider />
        <ToolBtn icon={Link2} label="链接" active={editor.isActive('link')} onClick={addLink} />
        <ToolBtn icon={ImageIcon} label="图片" active={false} onClick={addImage} />
        <ToolBtn
          icon={Minus} label="分隔线"
          active={false}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
        </div>
      </div>

      {/* 编辑内容区 */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-space-black">
        <EditorContent editor={editor} className="px-4 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-20 xl:px-32" />
      </div>
    </div>
  )
}

// === 工具栏按钮组件 ===

function ToolBtn({
  icon: Icon, label, active, onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`rounded-md p-1.5 transition-colors ${
        active
          ? 'bg-star-purple/15 text-star-purple'
          : 'text-text-secondary hover:bg-space-float hover:text-text-primary'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-divider" />
}
