import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bot, RotateCcw, Send } from 'lucide-react'
import { getAgent, sendChatCompletionStream } from '../../../api/agent'
import type { AgentDetail, ChatMessage } from '../../../types/agent'

interface DisplayMessage extends ChatMessage {
  streaming?: boolean
}

export default function AgentChatPage() {
  const { agentId = '' } = useParams()
  const [agent, setAgent] = useState<AgentDetail | null>(null)
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [streamError, setStreamError] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastPayloadRef = useRef<ChatMessage[] | null>(null)

  const loadAgent = useCallback(async () => {
    setAgent(await getAgent(agentId))
  }, [agentId])

  useEffect(() => {
    loadAgent()
  }, [loadAgent])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const runStream = useCallback(async (payload: ChatMessage[]) => {
    setSending(true)
    setStreamError('')
    setMessages([...payload, { role: 'assistant', content: '', streaming: true }])
    const controller = new AbortController()
    abortRef.current = controller
    lastPayloadRef.current = payload

    try {
      await sendChatCompletionStream(agentId, payload, (delta) => {
        setMessages((current) => {
          if (current.length === 0) return current
          const last = current[current.length - 1]
          if (last.role !== 'assistant') return current
          return [...current.slice(0, -1), { ...last, content: last.content + delta, streaming: true }]
        })
      }, controller.signal)
      setMessages((current) => {
        if (current.length === 0) return current
        const last = current[current.length - 1]
        if (last.role !== 'assistant') return current
        return [...current.slice(0, -1), { ...last, streaming: false }]
      })
    } catch (error) {
      if (controller.signal.aborted) {
        setMessages((current) =>
          current.filter((message, index) => !(index === current.length - 1 && message.role === 'assistant' && !message.content)),
        )
        return
      }
      setStreamError(error instanceof Error ? error.message : '连接中断')
      setMessages((current) => {
        if (current.length === 0) return current
        const last = current[current.length - 1]
        if (last.role !== 'assistant') return current
        return [
          ...current.slice(0, -1),
          { ...last, content: last.content || '连接中断，点击重试', streaming: false },
        ]
      })
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
      }
      setSending(false)
    }
  }, [agentId])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    const baseMessages: ChatMessage[] = messages
      .filter((message) => !message.streaming)
      .map(({ role, content: text }) => ({ role, content: text }))
    const nextPayload: ChatMessage[] = [...baseMessages, { role: 'user', content }]
    setInput('')
    await runStream(nextPayload)
  }

  function handleRetry() {
    if (sending) return
    const payload = lastPayloadRef.current
    if (!payload || payload.length === 0) return
    runStream(payload)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl flex-col overflow-hidden rounded-xl border border-divider bg-space-panel max-md:h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between gap-3 border-b border-divider px-4 py-3">
        <div className="min-w-0">
          <Link
            to={`/dashboard/agents/${agentId}`}
            className="mb-1 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-star-purple"
          >
            <ArrowLeft className="h-4 w-4" />返回管理
          </Link>
          <h1 className="truncate text-lg font-semibold text-text-primary">{agent?.agent_name || 'Agent'} Web Chat</h1>
        </div>
        <Bot className="h-6 w-6 shrink-0 text-star-purple" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="mx-auto mt-16 max-w-md text-center text-text-secondary">
            <Bot className="mx-auto mb-4 h-10 w-10 text-star-purple" />
            <h2 className="text-lg font-semibold text-text-primary">开始网页对话</h2>
            <p className="mt-2 text-sm">这里通过 cloud-backend 的 Agent Chat API 流式接收回复，每个 token 会即时呈现。</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-star-purple text-white' : 'border border-divider bg-space-black text-text-primary'}`}
            >
              {message.content}
              {message.streaming && <span className="ml-0.5 inline-block animate-pulse text-star-purple">▋</span>}
            </div>
          </div>
        ))}
        {streamError && (
          <div className="flex items-center justify-center gap-2 text-sm text-red-400">
            <span>{streamError}</span>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 rounded border border-red-500/40 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />重试
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-divider p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={2}
            placeholder="输入你想让 Agent 完成的任务..."
            className="min-h-12 flex-1 resize-none rounded-lg border border-divider bg-space-black px-4 py-3 text-sm text-text-primary focus:border-star-purple focus:outline-none"
          />
          <button
            disabled={sending || !input.trim()}
            className="inline-flex w-12 shrink-0 items-center justify-center rounded-lg bg-star-purple text-white hover:bg-star-purple-hover disabled:opacity-50"
            aria-label="发送"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
