import { useEffect, useRef, useCallback } from 'react'
import { useThemeStore } from '../../stores/useThemeStore'

interface VditorEditorProps {
  initialContent: string
  onChange: (content: string) => void
}

const VDITOR_CDN = 'https://cdn.jsdelivr.net/npm/vditor@3.10.8'

let cssLoaded = false
let jsLoaded = false
let jsLoadPromise: Promise<void> | null = null

function ensureCSS() {
  if (cssLoaded) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `${VDITOR_CDN}/dist/index.css`
  document.head.appendChild(link)
  cssLoaded = true
}

function ensureJS(): Promise<void> {
  if (jsLoaded) return Promise.resolve()
  if (jsLoadPromise) return jsLoadPromise
  jsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${VDITOR_CDN}/dist/index.min.js`
    script.onload = () => { jsLoaded = true; resolve() }
    script.onerror = reject
    document.head.appendChild(script)
  })
  return jsLoadPromise
}

function forceFullWidth(root: HTMLElement) {
  root.querySelectorAll('.vditor-reset').forEach((el) => {
    const e = el as HTMLElement
    e.style.setProperty('padding-left', '24px', 'important')
    e.style.setProperty('padding-right', '24px', 'important')
    e.style.setProperty('max-width', '100%', 'important')
  })
  root.querySelectorAll('.vditor-wysiwyg, .vditor-ir, .vditor-sv, .vditor-preview, .vditor-content').forEach((el) => {
    const e = el as HTMLElement
    e.style.setProperty('max-width', '100%', 'important')
    e.style.setProperty('width', '100%', 'important')
  })
}

/**
 * 检测纯文本是否像 Markdown（不是代码）
 */
function looksLikeMarkdown(text: string): boolean {
  const lines = text.split('\n').slice(0, 30)
  let mdSignals = 0
  for (const line of lines) {
    const trimmed = line.trimStart()
    if (/^#{1,6}\s/.test(trimmed)) mdSignals += 2
    if (/^[-*+]\s/.test(trimmed)) mdSignals++
    if (/^\d+\.\s/.test(trimmed)) mdSignals++
    if (/^>\s/.test(trimmed)) mdSignals++
    if (/^\|.*\|/.test(trimmed)) mdSignals++
    if (/^---+$/.test(trimmed)) mdSignals++
    if (/\[.*\]\(.*\)/.test(trimmed)) mdSignals++
    if (/\*\*.*\*\*/.test(trimmed)) mdSignals++
  }
  return mdSignals >= 2
}

export default function VditorEditor({ initialContent, onChange }: VditorEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const vditorRef = useRef<any>(null)
  const contentSetRef = useRef(false)
  const onChangeRef = useRef(onChange)
  const pasteHandlerRef = useRef<((e: ClipboardEvent) => void) | null>(null)
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  onChangeRef.current = onChange

  const calcHeight = useCallback(() => {
    if (!containerRef.current) return 500
    const rect = containerRef.current.getBoundingClientRect()
    return Math.max(400, window.innerHeight - rect.top - 16)
  }, [])

  useEffect(() => {
    ensureCSS()
    let destroyed = false

    ensureJS().then(() => {
      if (destroyed || !editorRef.current) return
      if (vditorRef.current) {
        vditorRef.current.destroy()
        vditorRef.current = null
      }
      editorRef.current.innerHTML = ''

      const Vditor = (window as any).Vditor
      const isDark = document.documentElement.classList.contains('dark')
      vditorRef.current = new Vditor(editorRef.current, {
        cdn: VDITOR_CDN,
        value: '',
        mode: 'ir',
        height: calcHeight(),
        width: '100%',
        placeholder: '开始编写文档...',
        theme: isDark ? 'dark' : 'classic',
        preview: {
          theme: {
            current: isDark ? 'dark' : 'light',
            path: `${VDITOR_CDN}/dist/css/content-theme`,
          },
          hljs: {
            style: isDark ? 'native' : 'github',
          },
        },
        toolbar: [
          'headings', 'bold', 'italic', 'strike', '|',
          'list', 'ordered-list', 'check', 'quote', '|',
          'code', 'inline-code', 'link', 'table', '|',
          'line', 'undo', 'redo', '|',
          'edit-mode', 'fullscreen', 'outline',
        ],
        toolbarConfig: { pin: false },
        cache: { enable: false },
        input: (value: string) => {
          onChangeRef.current(value)
        },
        after: () => {
          if (destroyed) return
          if (initialContent && !contentSetRef.current) {
            vditorRef.current?.setValue(initialContent)
            contentSetRef.current = true
          }
          if (editorRef.current) {
            forceFullWidth(editorRef.current)
          }

          // 绑定粘贴拦截到 editorRef 容器上（capture 阶段）
          // 不再依赖 pre.vditor-reset，因为 IR 模式可能用 div 而不是 pre
          if (editorRef.current) {
            const handler = (event: Event) => {
              const e = event as ClipboardEvent
              const textPlain = e.clipboardData?.getData('text/plain') || ''
              const textHTML = e.clipboardData?.getData('text/html') || ''

              console.log('[VditorPaste] triggered! textPlain length:', textPlain.length,
                'textHTML length:', textHTML.length,
                'looksLikeMd:', looksLikeMarkdown(textPlain))

              if (!textPlain || !looksLikeMarkdown(textPlain)) {
                console.log('[VditorPaste] Not intercepting — not markdown')
                return
              }

              console.log('[VditorPaste] Intercepting! Using insertValue')
              e.preventDefault()
              e.stopPropagation()
              e.stopImmediatePropagation()

              if (vditorRef.current) {
                vditorRef.current.insertValue(textPlain)
              }
            }

            editorRef.current.addEventListener('paste', handler, true)
            pasteHandlerRef.current = handler as (e: ClipboardEvent) => void
          }
        },
      })
    })

    return () => {
      destroyed = true
      // 清理 paste handler
      if (editorRef.current && pasteHandlerRef.current) {
        editorRef.current.removeEventListener('paste', pasteHandlerRef.current as EventListener, true)
      }
      if (vditorRef.current) {
        vditorRef.current.destroy()
        vditorRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialContent || contentSetRef.current) return
    const trySet = () => {
      if (vditorRef.current) {
        try {
          vditorRef.current.setValue(initialContent)
          contentSetRef.current = true
          if (editorRef.current) {
            setTimeout(() => {
              if (editorRef.current) forceFullWidth(editorRef.current)
            }, 100)
          }
        } catch {
          setTimeout(trySet, 200)
        }
      } else {
        setTimeout(trySet, 200)
      }
    }
    trySet()
  }, [initialContent])

  useEffect(() => {
    const onResize = () => {
      if (!editorRef.current) return
      const vEl = editorRef.current.querySelector('.vditor') as HTMLElement
      if (vEl) vEl.style.height = `${calcHeight()}px`
      forceFullWidth(editorRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [calcHeight])

  useEffect(() => {
    if (!editorRef.current) return
    const observer = new MutationObserver((mutations) => {
      if (!editorRef.current) return
      let needsFix = false
      for (const m of mutations) {
        if (m.type === 'childList') { needsFix = true; break }
        if (m.type === 'attributes' && m.attributeName === 'style') {
          const target = m.target as HTMLElement
          if (target.classList.contains('vditor-reset')) {
            const pl = target.style.paddingLeft
            if (pl && pl !== '24px') { needsFix = true; break }
          }
        }
      }
      if (needsFix) forceFullWidth(editorRef.current)
    })
    observer.observe(editorRef.current, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['style'],
    })
    return () => observer.disconnect()
  }, [])

  // 响应主题切换
  useEffect(() => {
    if (!vditorRef.current) return
    const isDark = resolvedTheme === 'dark'
    vditorRef.current.setTheme(
      isDark ? 'dark' : 'classic',           // 编辑器整体主题
      isDark ? 'dark' : 'light',             // 内容区主题
      isDark ? 'native' : 'github',          // 代码高亮主题
    )
  }, [resolvedTheme])

  return (
    <div ref={containerRef} className="vditor-wrapper">
      <div ref={editorRef} />
    </div>
  )
}

export function useVditorInstance(ref: React.MutableRefObject<any>) {
  return {
    getValue: () => ref.current?.getValue() || '',
    setValue: (content: string) => ref.current?.setValue(content),
  }
}
