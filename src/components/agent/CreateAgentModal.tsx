import { useState } from 'react'
import { X } from 'lucide-react'
import { createAgent } from '../../api/agent'
import type { AgentItem, AgentTemplate } from '../../types/agent'

const TEMPLATE_OPTIONS: Array<{ value: AgentTemplate; label: string }> = [
  { value: 'assistant', label: '个人助理' },
  { value: 'office', label: '办公助理' },
  { value: 'creator', label: '内容创作' },
  { value: 'custom', label: '自定义' },
]

export default function CreateAgentModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (agent: AgentItem) => void }) {
  const [agentName, setAgentName] = useState('')
  const [template, setTemplate] = useState<AgentTemplate>('assistant')
  const [timezone, setTimezone] = useState('Asia/Shanghai')
  const [soul, setSoul] = useState('')
  const [userProfile, setUserProfile] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!agentName.trim()) {
      setError('请输入 Agent 名称')
      return
    }
    try {
      setSaving(true)
      setError('')
      const agent = await createAgent({
        agent_name: agentName.trim(),
        template,
        timezone,
        soul: soul.trim() || undefined,
        user_profile: userProfile.trim() || undefined,
        auto_start_gateway: true,
      })
      onCreated(agent)
      setAgentName('')
      setTemplate('assistant')
      setTimezone('Asia/Shanghai')
      setSoul('')
      setUserProfile('')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '创建失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-divider bg-space-panel p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">创建 Agent</h2>
            <p className="mt-1 text-sm text-text-secondary">填写基础信息和初始设定，创建后可继续绑定 IM 渠道。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-text-secondary hover:bg-space-float hover:text-text-primary"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">Agent 名称</span>
            <input value={agentName} onChange={(event) => setAgentName(event.target.value)} maxLength={40} placeholder="例如：福仔、工作助理" className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">模板</span>
            <select value={template} onChange={(event) => setTemplate(event.target.value as AgentTemplate)} className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none">
              {TEMPLATE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">时区</span>
            <input value={timezone} onChange={(event) => setTimezone(event.target.value)} className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">角色描述（SOUL.md，可跳过）</span>
            <textarea value={soul} onChange={(event) => setSoul(event.target.value)} rows={5} placeholder="它应该如何称呼你？主要帮你做什么？说话风格如何？" className="w-full resize-y rounded-lg border border-divider bg-space-black px-4 py-3 text-sm text-text-primary focus:border-star-purple focus:outline-none" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-text-secondary">用户偏好（USER.md，可跳过）</span>
            <textarea value={userProfile} onChange={(event) => setUserProfile(event.target.value)} rows={4} placeholder="希望 Agent 记住的基本信息、偏好和工作习惯。" className="w-full resize-y rounded-lg border border-divider bg-space-black px-4 py-3 text-sm text-text-primary focus:border-star-purple focus:outline-none" />
          </label>
        </div>
        {error && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary">取消</button>
          <button disabled={saving} className="rounded-lg bg-star-purple px-5 py-2 text-sm font-medium text-white hover:bg-star-purple-hover disabled:opacity-60">{saving ? '创建中...' : '创建 Agent'}</button>
        </div>
      </form>
    </div>
  )
}
