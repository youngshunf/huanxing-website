import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bot, Send } from 'lucide-react'
import { getAgent, sendChatCompletion } from '../../../api/agent'
import type { AgentDetail, ChatMessage } from '../../../types/agent'

export default function AgentChatPage() {
  const { agentId = '' } = useParams()
  const [agent, setAgent] = useState<AgentDetail | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const loadAgent = useCallback(async () => {
    setAgent(await getAgent(agentId))
  }, [agentId])

  useEffect(() => {
    loadAgent()
  }, [loadAgent])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    try {
      const completion = await sendChatCompletion(agentId, nextMessages)
      const reply = completion.choices?.[0]?.message?.content || 'Agent 暂未返回内容。'
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages([...nextMessages, { role: 'assistant', content: error instanceof Error ? error.message : '发送失败，请稍后重试。' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl flex-col overflow-hidden rounded-xl border border-divider bg-space-panel max-md:h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between gap-3 border-b border-divider px-4 py-3">
        <div className="min-w-0">
          <Link to={`/dashboard/agents/${agentId}`} className="mb-1 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-star-purple"><ArrowLeft className="h-4 w-4" />返回管理</Link>
          <h1 className="truncate text-lg font-semibold text-text-primary">{agent?.agent_name || 'Agent'} Web Chat</h1>
        </div>
        <Bot className="h-6 w-6 shrink-0 text-star-purple" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="mx-auto mt-16 max-w-md text-center text-text-secondary">
            <Bot className="mx-auto mb-4 h-10 w-10 text-star-purple" />
            <h2 className="text-lg font-semibold text-text-primary">开始网页对话</h2>
            <p className="mt-2 text-sm">这里通过 cloud-backend 的 Agent Chat API 发送非流式消息，后端未接通时会显示本地预览回复。</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-star-purple text-white' : 'border border-divider bg-space-black text-text-primary'}`}>{message.content}</div>
          </div>
        ))}
        {sending && <div className="text-sm text-text-secondary">Agent 正在回复...</div>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-divider p-3">
        <div className="flex gap-2">
          <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} placeholder="输入你想让 Agent 完成的任务..." className="min-h-12 flex-1 resize-none rounded-lg border border-divider bg-space-black px-4 py-3 text-sm text-text-primary focus:border-star-purple focus:outline-none" />
          <button disabled={sending || !input.trim()} className="inline-flex w-12 shrink-0 items-center justify-center rounded-lg bg-star-purple text-white hover:bg-star-purple-hover disabled:opacity-50"><Send className="h-5 w-5" /></button>
        </div>
      </form>
    </div>
  )
}
