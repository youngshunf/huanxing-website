import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { slugify } from './docOutlineUtils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/** 自动给 h1-h6 生成 id 的通用组件工厂 */
function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = getTextContent(children)
    const id = slugify(text)
    return <Tag id={id} {...props}>{children}</Tag>
  }
}

/** 递归提取 children 中的纯文本 */
function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return getTextContent(children.props.children)
  }
  return ''
}

/** 
 * 自定义 <p> 组件：如果段落只包含一个 <strong>，
 * 视为伪标题，生成带 id 的 <p> 以支持大纲锚点跳转
 */
function SmartParagraph({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  // 判断是否是"粗体独占行"（段落内只有一个 strong 子元素）
  const childArray = Array.isArray(children) ? children : [children]
  const meaningful = childArray.filter(
    (c) => c !== null && c !== undefined && c !== '' && c !== '\n'
  )
  
  if (meaningful.length === 1) {
    const child = meaningful[0]
    if (
      child &&
      typeof child === 'object' &&
      'type' in child &&
      (child as React.ReactElement).type === 'strong'
    ) {
      const text = React.isValidElement<{ children?: React.ReactNode }>(child) ? getTextContent(child.props.children) : ''
      if (text && text.length >= 2 && text.length <= 80) {
        const id = slugify(text)
        return <p id={id} {...props}>{children}</p>
      }
    }
  }
  return <p {...props}>{children}</p>
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <article className={`hx-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: makeHeading('h1'),
          h2: makeHeading('h2'),
          h3: makeHeading('h3'),
          h4: makeHeading('h4'),
          h5: makeHeading('h5'),
          h6: makeHeading('h6'),
          // 段落：识别粗体独占行作为伪标题
          p: SmartParagraph,
          // 链接新标签打开
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          // 代码块包装
          pre: ({ children, ...props }) => (
            <div className="hx-code-block">
              <pre {...props}>{children}</pre>
            </div>
          ),
          // 图片居中 + 圆角
          img: ({ ...props }) => (
            <img {...props} className="hx-md-img" loading="lazy" />
          ),
          // 表格响应式包装
          table: ({ children, ...props }) => (
            <div className="hx-table-wrap">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
