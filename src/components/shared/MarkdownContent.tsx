import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
  className?: string
}

// 发布说明 Markdown：不启用原始 HTML，统一复用官网语义色与正文排版。
export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div className={`break-words text-base leading-7 text-text-secondary ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="mb-3 mt-5 text-lg font-semibold text-text-primary first:mt-0">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-3 mt-5 text-lg font-semibold text-text-primary first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-5 text-lg font-semibold text-text-primary first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-2 list-disc space-y-2 pl-5 marker:text-star-blue">{children}</ul>
          ),
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-2 pl-5">{children}</ol>,
          li: ({ children }) => <li className="pl-1 marker:text-star-blue">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-text-primary">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-star-blue pl-4 text-text-tertiary">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-star-blue underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-space-float px-1.5 py-0.5 font-mono text-sm text-text-primary">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
