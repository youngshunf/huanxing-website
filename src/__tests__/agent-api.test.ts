import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getUsageSummary,
  listTemplates,
  sendChatCompletionStream,
} from '../api/agent'
import client from '../api/client'
import type { ChatMessage } from '../types/agent'

function makeStreamFromChunks(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  })
}

describe('agent api', () => {
  beforeEach(() => {
    localStorage.removeItem('huanxing_agent_mock')
    localStorage.setItem('accessToken', 'test-token')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('listTemplates maps response shape', async () => {
    const fakeTemplates = [
      { app_id: 'assistant', name: '助理', description: '日常助理', emoji: '🤖', version: '1.0.0' },
      { app_id: 'finance', name: '理财', description: '理财助手', emoji: '💰', version: '1.0.0' },
      { app_id: 'health', name: '健康', description: '健康伙伴', emoji: '🌿', version: '1.0.0' },
      { app_id: 'media-creator', name: '创作', description: '内容创作', emoji: '✍️', version: '1.0.0' },
      { app_id: 'office', name: '办公', description: '办公助理', emoji: '🗂️', version: '1.0.0' },
      { app_id: 'side-hustle', name: '副业', description: '副业搭档', emoji: '🚀', version: '1.0.0' },
      { app_id: 'custom', name: '自定义', description: '自由组合', emoji: '✨', version: '1.0.0' },
    ]
    const spy = vi.spyOn(client, 'request').mockResolvedValue({
      data: { code: 200, msg: 'ok', data: fakeTemplates },
    } as never)

    const result = await listTemplates()
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET', url: '/hermes/app/templates' }))
    expect(result).toHaveLength(7)
    expect(result[0]).toMatchObject({ app_id: 'assistant', name: '助理', emoji: '🤖', version: '1.0.0' })
    expect(result.map((item) => item.app_id)).toContain('finance')
  })

  it('getUsageSummary aggregates by_model entries', async () => {
    const payload = {
      agent_id: 'agt_test',
      total_tokens: 5000,
      total_cost: 0.42,
      by_model: [
        { model_name: 'openai/gpt-5.5', request_count: 12, total_tokens: 3500, total_cost: 0.30 },
        { model_name: 'anthropic/claude-sonnet-4-6', request_count: 4, total_tokens: 1500, total_cost: 0.12 },
      ],
    }
    const spy = vi.spyOn(client, 'request').mockResolvedValue({
      data: { code: 200, msg: 'ok', data: payload },
    } as never)

    const result = await getUsageSummary('agt_test')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: '/llm/app/usage/summary',
        params: { agent_id: 'agt_test' },
      }),
    )
    expect(result.total_tokens).toBe(5000)
    expect(result.by_model).toHaveLength(2)
    expect(result.by_model[0]).toMatchObject({ model_name: 'openai/gpt-5.5', request_count: 12 })
  })

  it('sendChatCompletionStream parses SSE frames into chunk callbacks', async () => {
    const stream = makeStreamFromChunks([
      'data: {"choices":[{"delta":{"content":"Hello "}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"World"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"!"}}]}\n\n',
      'data: [DONE]\n\n',
    ])
    const fetchMock = vi.fn(async () => new Response(stream, { status: 200, headers: { 'content-type': 'text/event-stream' } }))
    vi.stubGlobal('fetch', fetchMock)

    const messages: ChatMessage[] = [{ role: 'user', content: 'hi' }]
    const chunks: string[] = []
    await sendChatCompletionStream('agt_1', messages, (delta) => chunks.push(delta))

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit | undefined]
    const init = call[1]
    expect(init?.method).toBe('POST')
    const body = JSON.parse(String(init?.body))
    expect(body.stream).toBe(true)
    expect(body.messages).toEqual(messages)
    expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer test-token')

    expect(chunks).toEqual(['Hello ', 'World', '!'])
    expect(chunks.join('')).toBe('Hello World!')
  })

  it('sendChatCompletionStream stops at [DONE] sentinel', async () => {
    const stream = makeStreamFromChunks([
      'data: {"choices":[{"delta":{"content":"part"}}]}\n\n',
      'data: [DONE]\n\n',
      'data: {"choices":[{"delta":{"content":"after-done"}}]}\n\n',
    ])
    vi.stubGlobal('fetch', vi.fn(async () => new Response(stream, { status: 200 })))

    const chunks: string[] = []
    await sendChatCompletionStream('agt_1', [{ role: 'user', content: 'hi' }], (delta) => chunks.push(delta))

    expect(chunks).toEqual(['part'])
  })

  it('sendChatCompletionStream rejects when AbortSignal is aborted', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      return await new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal
        if (signal?.aborted) {
          reject(new DOMException('Aborted', 'AbortError'))
          return
        }
        signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const onChunk = vi.fn()
    const promise = sendChatCompletionStream('agt_1', [{ role: 'user', content: 'hi' }], onChunk, controller.signal)
    controller.abort()
    await expect(promise).rejects.toThrowError(/Aborted/i)
    expect(onChunk).not.toHaveBeenCalled()
  })
})
