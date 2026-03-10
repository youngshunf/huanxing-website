import { useEffect, useState } from 'react'
import { Target, ChevronDown, ChevronUp, Edit2, Users, Eye, ThumbsUp, Check } from 'lucide-react'
import { useCreatorStore } from '../../../stores/useCreatorStore'
import type { CreatorProject } from '../../../types/creator'

const PLATFORM_LABEL: Record<string, string> = {
  xiaohongshu: '小红书',
  douyin: '抖音',
  wechat: '微信',
  weibo: '微博',
  bilibili: 'B站',
}

export default function CreatorProjects() {
  const { projects, projectsLoading, fetchProjects } = useCreatorStore()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingProject, setEditingProject] = useState<CreatorProject | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">创作项目</h1>
        <p className="mt-1 text-text-secondary">管理你的创作项目与账号画像</p>
      </div>

      {projectsLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-divider bg-space-panel py-20 text-text-secondary">
          <Target className="mb-3 h-10 w-10 opacity-40" />
          <p>暂无创作项目</p>
          <p className="mt-1 text-sm">通过 AI 助手创建你的第一个创作项目</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              expanded={expandedId === p.id}
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
              onEdit={() => setEditingProject(p)}
            />
          ))}
        </div>
      )}

      {editingProject && (
        <EditProfileModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  )
}

function ProjectCard({
  project,
  expanded,
  onToggle,
  onEdit,
}: {
  project: CreatorProject
  expanded: boolean
  onToggle: () => void
  onEdit: () => void
}) {
  const { fetchProject, projectDetail, projectsLoading } = useCreatorStore()

  useEffect(() => {
    if (expanded) {
      fetchProject(project.id)
    }
  }, [expanded, project.id, fetchProject])

  const detail = expanded && projectDetail?.id === project.id ? projectDetail : null

  return (
    <div className="rounded-xl border border-divider bg-space-panel transition-all hover:border-star-purple/30">
      {/* 项目头部 */}
      <button
        className="flex w-full items-center gap-4 p-5 text-left"
        onClick={onToggle}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-star-purple/10">
          <Target className="h-5 w-5 text-star-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary truncate">{project.name}</span>
            {project.is_active && (
              <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                <Check className="h-3 w-3" />
                活跃
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-text-secondary">
            {PLATFORM_LABEL[project.platform] || project.platform}
            {project.description && <span className="ml-2 text-text-secondary/60">· {project.description}</span>}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-text-secondary" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-secondary" />
        )}
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="border-t border-divider px-5 pb-5">
          {projectsLoading && !detail ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
            </div>
          ) : (
            <div className="pt-4 space-y-4">
              {/* 画像信息 */}
              {detail?.profile ? (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">账号画像</h3>
                    <button
                      onClick={onEdit}
                      className="flex items-center gap-1.5 rounded-lg border border-divider px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-star-purple/50 hover:text-star-purple"
                    >
                      <Edit2 className="h-3 w-3" />
                      编辑画像
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {detail.profile.niche && (
                      <ProfileItem label="赛道" value={detail.profile.niche} />
                    )}
                    {detail.profile.persona && (
                      <ProfileItem label="人设" value={detail.profile.persona} />
                    )}
                    {detail.profile.target_audience && (
                      <ProfileItem label="目标受众" value={detail.profile.target_audience} />
                    )}
                    {detail.profile.tone && (
                      <ProfileItem label="内容调性" value={detail.profile.tone} />
                    )}
                    {detail.profile.posting_frequency && (
                      <ProfileItem label="发布频率" value={detail.profile.posting_frequency} />
                    )}
                    {detail.profile.bio && (
                      <ProfileItem label="简介" value={detail.profile.bio} className="sm:col-span-2 lg:col-span-3" />
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-space-float p-4 text-sm text-text-secondary">
                  暂无画像信息
                </div>
              )}

              {/* 平台账号 */}
              {detail?.accounts && detail.accounts.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-text-primary">平台账号</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {detail.accounts.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-lg border border-divider bg-space-float p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">
                            {PLATFORM_LABEL[a.platform] || a.platform}
                          </span>
                          {a.status && (
                            <span className="text-xs text-text-secondary">{a.status}</span>
                          )}
                        </div>
                        {a.nickname && (
                          <div className="mt-1 text-sm text-text-secondary">@{a.nickname}</div>
                        )}
                        <div className="mt-2 flex gap-4 text-xs text-text-secondary">
                          {a.followers != null && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {a.followers.toLocaleString()} 粉丝
                            </span>
                          )}
                          {a.avg_views != null && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              均 {a.avg_views.toLocaleString()} 阅读
                            </span>
                          )}
                          {a.avg_likes != null && (
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              均 {a.avg_likes.toLocaleString()} 点赞
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProfileItem({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`rounded-lg bg-space-float p-3 ${className}`}>
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 text-sm text-text-primary">{value}</div>
    </div>
  )
}

function EditProfileModal({
  project,
  onClose,
}: {
  project: CreatorProject
  onClose: () => void
}) {
  const { projectDetail, updateProjectProfile, fetchProject } = useCreatorStore()
  const profile = projectDetail?.id === project.id ? projectDetail.profile : null

  const [form, setForm] = useState({
    niche: profile?.niche || '',
    sub_niche: profile?.sub_niche || '',
    persona: profile?.persona || '',
    target_audience: profile?.target_audience || '',
    tone: profile?.tone || '',
    bio: profile?.bio || '',
    posting_frequency: profile?.posting_frequency || '',
  })
  const [saving, setSaving] = useState(false)

  // 若 projectDetail 加载完后，同步表单
  useEffect(() => {
    if (projectDetail?.id === project.id && projectDetail.profile) {
      const p = projectDetail.profile
      setForm({
        niche: p.niche || '',
        sub_niche: p.sub_niche || '',
        persona: p.persona || '',
        target_audience: p.target_audience || '',
        tone: p.tone || '',
        bio: p.bio || '',
        posting_frequency: p.posting_frequency || '',
      })
    }
  }, [projectDetail, project.id])

  // 加载项目详情
  useEffect(() => {
    if (!projectDetail || projectDetail.id !== project.id) {
      fetchProject(project.id)
    }
  }, [project.id, projectDetail, fetchProject])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProjectProfile(project.id, form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-divider bg-space-panel p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">编辑账号画像</h2>
        <div className="space-y-3">
          {(
            [
              { key: 'niche', label: '赛道/领域' },
              { key: 'sub_niche', label: '细分赛道' },
              { key: 'persona', label: '人设' },
              { key: 'target_audience', label: '目标受众' },
              { key: 'tone', label: '内容调性' },
              { key: 'posting_frequency', label: '发布频率' },
            ] as { key: keyof typeof form; label: string }[]
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-xs text-text-secondary">{label}</label>
              <input
                className="w-full rounded-lg border border-divider bg-space-float px-3 py-2 text-sm text-text-primary outline-none focus:border-star-purple/50"
                value={form[key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs text-text-secondary">简介文案</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-divider bg-space-float px-3 py-2 text-sm text-text-primary outline-none focus:border-star-purple/50"
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-divider px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-space-float"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-star-purple px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60 hover:opacity-90"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
