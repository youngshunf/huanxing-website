import { useEffect, useRef } from 'react'
import { useThemeStore } from '../../stores/useThemeStore'

interface MarkdownRendererProps {
  content: string
  className?: string
}

declare global {
  interface Window {
    Vditor: {
      preview: (el: HTMLElement, markdown: string, options?: Record<string, unknown>) => void
    }
  }
}

// CDN 资源
const VDITOR_CDN = 'https://cdn.jsdelivr.net/npm/vditor@3.10.8'

let cssLoaded = false
let jsLoaded = false
let jsLoadPromise: Promise<void> | null = null

function loadCSS() {
  if (cssLoaded) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `${VDITOR_CDN}/dist/index.css`
  document.head.appendChild(link)
  cssLoaded = true
}

function loadJS(): Promise<void> {
  if (jsLoaded) return Promise.resolve()
  if (jsLoadPromise) return jsLoadPromise
  jsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${VDITOR_CDN}/dist/index.min.js`
    script.onload = () => {
      jsLoaded = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
  return jsLoadPromise
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const renderedRef = useRef('')
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)

  useEffect(() => {
    loadCSS()
  }, [])

  useEffect(() => {
    if (!content || !containerRef.current) return
    // 主题变化时也需要重新渲染
    if (renderedRef.current === content + resolvedTheme) return
    renderedRef.current = content + resolvedTheme

    const isDark = resolvedTheme === 'dark'

    loadJS().then(() => {
      if (containerRef.current && window.Vditor) {
        window.Vditor.preview(containerRef.current, content, {
          cdn: VDITOR_CDN,
          mode: isDark ? 'dark' : 'light',
          theme: {
            current: isDark ? 'dark' : 'light',
            path: `${VDITOR_CDN}/dist/css/content-theme`,
          },
          hljs: {
            lineNumber: true,
            style: isDark ? 'native' : 'github',
          },
          markdown: {
            toc: true,
          },
        })
      }
    })
  }, [content, resolvedTheme])

  return (
    <div
      ref={containerRef}
      className={`vditor-reset prose prose-sm max-w-none dark:prose-invert sm:prose-base ${className}`}
    />
  )
}
