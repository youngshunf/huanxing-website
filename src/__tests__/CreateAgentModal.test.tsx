import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CreateAgentModal from '../components/agent/CreateAgentModal'
import type { AgentItem, AgentTemplate, CreateAgentPayload } from '../types/agent'

const SAMPLE_TEMPLATES: AgentTemplate[] = [
  { app_id: 'assistant', name: '个人助理', description: '日常助理', emoji: '🤖', version: '1.0.0' },
  { app_id: 'finance', name: '理财管家', description: '理财助手', emoji: '💰', version: '1.0.0' },
  { app_id: 'health', name: '健康伙伴', description: '健康伙伴', emoji: '🌿', version: '1.0.0' },
  { app_id: 'media-creator', name: '内容创作', description: '内容创作', emoji: '✍️', version: '1.0.0' },
  { app_id: 'office', name: '办公助理', description: '办公助理', emoji: '🗂️', version: '1.0.0' },
  { app_id: 'side-hustle', name: '副业搭档', description: '副业搭档', emoji: '🚀', version: '1.0.0' },
  { app_id: 'custom', name: '自定义', description: '自由组合', emoji: '✨', version: '1.0.0' },
]

const listTemplatesMock = vi.fn()
const createAgentMock = vi.fn()

vi.mock('../api/agent', () => ({
  listTemplates: () => listTemplatesMock(),
  createAgent: (payload: CreateAgentPayload) => createAgentMock(payload),
}))

describe('CreateAgentModal', () => {
  beforeEach(() => {
    listTemplatesMock.mockReset()
    createAgentMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders one card per fetched template', async () => {
    listTemplatesMock.mockResolvedValue(SAMPLE_TEMPLATES)
    render(<CreateAgentModal open onClose={() => {}} onCreated={() => {}} />)

    await waitFor(() => expect(listTemplatesMock).toHaveBeenCalledTimes(1))
    for (const template of SAMPLE_TEMPLATES) {
      expect(await screen.findByTestId(`template-card-${template.app_id}`)).toBeInTheDocument()
    }
    const grid = screen.getByTestId('template-grid')
    expect(grid.querySelectorAll('[data-testid^="template-card-"]')).toHaveLength(SAMPLE_TEMPLATES.length)
  })

  it('keeps the selected template highlighted across re-selection', async () => {
    listTemplatesMock.mockResolvedValue(SAMPLE_TEMPLATES)
    const user = userEvent.setup()
    render(<CreateAgentModal open onClose={() => {}} onCreated={() => {}} />)

    const healthCard = await screen.findByTestId('template-card-health')
    expect(screen.getByTestId('template-card-assistant')).toHaveAttribute('aria-pressed', 'true')

    await user.click(healthCard)
    expect(healthCard).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('template-card-assistant')).toHaveAttribute('aria-pressed', 'false')

    await user.click(screen.getByTestId('template-card-finance'))
    expect(screen.getByTestId('template-card-finance')).toHaveAttribute('aria-pressed', 'true')
    await user.click(healthCard)
    expect(healthCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('submits createAgent with the selected template app_id', async () => {
    listTemplatesMock.mockResolvedValue(SAMPLE_TEMPLATES)
    const created: AgentItem = {
      agent_id: 'agt_xyz',
      agent_name: '理财管家',
      status: 'running',
      gateway_status: 'running',
      terminal_backend: 'docker',
      container_workspace: '/workspace',
      workspace_status: 'ready',
      llm_mode: 'platform',
      llm_model: 'openai/gpt-5.5',
      channel_summary: [],
      last_active_at: null,
      created_at: '2026-05-04T00:00:00.000Z',
      updated_at: '2026-05-04T00:00:00.000Z',
    }
    createAgentMock.mockResolvedValue(created)
    const onCreated = vi.fn()
    const user = userEvent.setup()
    render(<CreateAgentModal open onClose={() => {}} onCreated={onCreated} />)

    await screen.findByTestId('template-card-finance')
    await user.click(screen.getByTestId('template-card-finance'))

    const nameInput = screen.getByPlaceholderText(/福仔|工作助理/) as HTMLInputElement
    await user.type(nameInput, '理财管家')

    const submit = screen.getByRole('button', { name: /创建 Agent/ })
    await user.click(submit)

    await waitFor(() => expect(createAgentMock).toHaveBeenCalledTimes(1))
    expect(createAgentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        agent_name: '理财管家',
        template: 'finance',
        timezone: 'Asia/Shanghai',
        auto_start_gateway: true,
      }),
    )
    expect(onCreated).toHaveBeenCalledWith(created)
  })
})
