export interface TocItem {
  id: string
  text: string
  level: number
}

/** 从 markdown 文本提取标题列表 */
export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = []
  const lines = markdown.split('\n')
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trimStart()

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = cleanMarkdown(headingMatch[2])
      if (text) headings.push({ id: slugify(text), text, level })
      continue
    }

    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*$|^__(.+?)__$/)
    if (boldMatch) {
      const text = cleanMarkdown(boldMatch[1] || boldMatch[2])
      if (text && text.length >= 2 && text.length <= 80) headings.push({ id: slugify(text), text, level: 2 })
    }
  }
  return headings
}

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .replace(/`/g, '')
    .replace(/~~/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
}
