import { useEffect, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { createAgent, listTemplates } from '../../api/agent'
import type { AgentItem, AgentTemplate } from '../../types/agent'

interface CreateAgentModalProps {
  open: boolean
  onClose: () => void
  onCreated: (agent: AgentItem) => void
}

export default function CreateAgentModal({ open, onClose, onCreated }: CreateAgentModalProps) {
  const [templates, setTemplates] = useState<AgentTemplate[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [templatesError, setTemplatesError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [agentName, setAgentName] = useState('')
  const [timezone, setTimezone] = useState('Asia/Shanghai')
  const [soul, setSoul] = useState('')
  const [userProfile, setUserProfile] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadTemplates() {
    setTemplatesLoading(true)
    setTemplatesError('')
    try {
      const data = await listTemplates()
      setTemplates(data)
      if (data.length > 0) {
        setSelectedTemplate((current) => (current && data.some((item) => item.app_id === current) ? current : data[0].app_id))
      }
    } catch (loadError) {
      setTemplatesError(loadError instanceof Error ? loadError.message : '模板加载失败')
    } finally {
      setTemplatesLoading(false)
    }
  }

  useEffect(() => {
    if (!open) return
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null

  function resetForm() {
    setAgentName('')
    setTimezone('Asia/Shanghai')
    setSoul('')
    setUserProfile('')
    setError('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!selectedTemplate) {
      setError('请选择一个模板')
      return
    }
    if (!agentName.trim()) {
      setError('请输入 Agent 名称')
      return
    }
    try {
      setSaving(true)
      setError('')
      const agent = await createAgent({
        agent_name: agentName.trim(),
        template: selectedTemplate,
        timezone,
        soul: soul.trim() || undefined,
        user_profile: userProfile.trim() || undefined,
        auto_start_gateway: true,
      })
      onCreated(agent)
      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '创建失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-divider bg-space-panel p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">创建 Agent</h2>
            <p className="mt-1 text-sm text-text-secondary">先选择一个 Agent 模板，再填写基础信息和初始设定。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary hover:bg-space-float hover:text-text-primary"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">选择模板</h3>
            {!templatesLoading && (
              <button
                type="button"
                onClick={loadTemplates}
                className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-star-purple"
              >
                <RefreshCw className="h-3.5 w-3.5" />刷新
              </button>
            )}
          </div>
          {templatesLoading ? (
            <TemplateGridSkeleton />
          ) : templatesError ? (
            <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <span>{templatesError}</span>
              <button type="button" onClick={loadTemplates} className="rounded border border-red-500/30 px-3 py-1 text-xs hover:bg-red-500/20">
                重试
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="template-grid">
              {templates.map((template) => {
                const active = template.app_id === selectedTemplate
                return (
                  <button
                    type="button"
                    key={template.app_id}
                    onClick={() => setSelectedTemplate(template.app_id)}
                    aria-pressed={active}
                    data-testid={`template-card-${template.app_id}`}
                    className={`flex h-full flex-col gap-2 rounded-xl border p-4 text-left transition-colors ${active ? 'border-star-purple bg-star-purple/10 shadow-[0_0_16px_rgba(37, 99, 235,0.18)]' : 'border-divider bg-space-black hover:border-star-purple/40'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">{template.emoji || '⭐'}</span>
                      <span className="font-semibold text-text-primary">{template.name}</span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-3">{template.description}</p>
                    <span className="mt-auto text-[10px] uppercase tracking-wide text-text-secondary/70">v{template.version}</span>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">Agent 名称</span>
            <input
              value={agentName}
              onChange={(event) => setAgentName(event.target.value)}
              maxLength={40}
              placeholder="例如：福仔、工作助理"
              className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">时区</span>
            <input
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">角色描述（SOUL.md，可跳过）</span>
            <textarea
              value={soul}
              onChange={(event) => setSoul(event.target.value)}
              rows={5}
              placeholder="它应该如何称呼你？主要帮你做什么？说话风格如何？"
              className="w-full resize-y rounded-lg border border-divider bg-space-black px-4 py-3 text-sm text-text-primary focus:border-star-purple focus:outline-none"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">用户偏好（USER.md，可跳过）</span>
            <textarea
              value={userProfile}
              onChange={(event) => setUserProfile(event.target.value)}
              rows={4}
              placeholder="希望 Agent 记住的基本信息、偏好和工作习惯。"
              className="w-full resize-y rounded-lg border border-divider bg-space-black px-4 py-3 text-sm text-text-primary focus:border-star-purple focus:outline-none"
            />
          </label>
        </div>

        {error && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving || !selectedTemplate || !agentName.trim()}
            className="rounded-lg bg-star-purple px-5 py-2 text-sm font-medium text-white hover:bg-star-purple-hover disabled:opacity-60"
          >
            {saving ? '创建中...' : '创建 Agent'}
          </button>
        </div>
      </form>
    </div>
  )
}

function TemplateGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="template-grid-skeleton">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl border border-divider bg-space-black"
        />
      ))}
    </div>
  )
}
