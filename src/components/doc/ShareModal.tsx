import { useState } from 'react'
import { X, Copy, Check, Link2, Lock, Clock, Trash2 } from 'lucide-react'
import { createShare, cancelShare } from '../../api/doc'

interface ShareModalProps {
  docId: number
  currentToken?: string | null
  onClose: () => void
  onShareUpdated?: (token: string | null) => void
}

const EXPIRE_OPTIONS = [
  { value: 24, label: '24 小时' },
  { value: 72, label: '3 天' },
  { value: 168, label: '7 天' },
  { value: 720, label: '30 天' },
  { value: 0, label: '永久' },
]

export default function ShareModal({ docId, currentToken, onClose, onShareUpdated }: ShareModalProps) {
  const [permission, setPermission] = useState('view')
  const [expiresHours, setExpiresHours] = useState(72)
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [shareUrl, setShareUrl] = useState(
    currentToken ? `${window.location.origin}/s/${currentToken}` : ''
  )
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {
        permission,
        expires_hours: expiresHours || 87600, // 0 = 10年 ≈ 永久
      }
      if (usePassword && password) params.password = password

      const result = await createShare(docId, params as any)
      const url = result.share_url?.startsWith('http')
        ? result.share_url
        : `${window.location.origin}/s/${result.share_url}`
      setShareUrl(url)
      onShareUpdated?.(result.share_url)
    } catch (e) {
      alert('生成分享链接失败')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('确定要取消分享吗？')) return
    try {
      await cancelShare(docId)
      setShareUrl('')
      onShareUpdated?.(null)
    } catch {
      alert('取消分享失败')
    }
  }

  function handleCopy() {
    // clipboard API 在 HTTP 环境下不可用，使用 fallback
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => fallbackCopy(shareUrl))
    } else {
      fallbackCopy(shareUrl)
    }
  }

  function fallbackCopy(text: string) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('复制失败，请手动复制链接')
    }
    document.body.removeChild(textarea)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-space-panel p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* 标题 */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">分享文档</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-text-tertiary hover:bg-space-float hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 已有分享链接 */}
        {shareUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-border-default bg-space-input p-3">
              <Link2 className="h-4 w-4 shrink-0 text-star-purple" />
              <span className="flex-1 truncate text-sm text-text-primary">{shareUrl}</span>
              <button
                onClick={handleCopy}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-all ${
                  copied ? 'bg-green-600' : 'bg-star-purple hover:bg-star-purple-hover'
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> 已复制</span>
                ) : (
                  <span className="flex items-center gap-1"><Copy className="h-3.5 w-3.5" /> 复制</span>
                )}
              </button>
            </div>
            <button
              onClick={handleCancel}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              取消分享
            </button>
          </div>
        ) : (
          /* 设置分享 */
          <div className="space-y-4">
            {/* 权限 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">权限</label>
              <div className="flex gap-2">
                {['view', 'edit'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPermission(p)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                      permission === p
                        ? 'bg-star-purple text-white'
                        : 'border border-border-default text-text-secondary hover:bg-space-float'
                    }`}
                  >
                    {p === 'view' ? '只读' : '可编辑'}
                  </button>
                ))}
              </div>
            </div>

            {/* 过期时间 */}
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-text-secondary">
                <Clock className="h-3.5 w-3.5" />
                有效期
              </label>
              <div className="flex flex-wrap gap-2">
                {EXPIRE_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setExpiresHours(value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      expiresHours === value
                        ? 'bg-star-purple text-white'
                        : 'border border-border-default text-text-secondary hover:bg-space-float'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="mb-2 flex items-center gap-3 text-sm font-medium text-text-secondary">
                <Lock className="h-3.5 w-3.5" />
                密码保护
                <button
                  onClick={() => setUsePassword(!usePassword)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    usePassword ? 'bg-star-purple' : 'bg-space-input'
                  }`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    usePassword ? 'left-[18px]' : 'left-0.5'
                  }`} />
                </button>
              </label>
              {usePassword && (
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="设置访问密码"
                  className="w-full rounded-lg border border-border-default bg-space-input px-3 py-2 text-sm text-text-primary outline-none focus:border-star-purple"
                />
              )}
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-star-purple py-2.5 text-sm font-medium text-white transition-colors hover:bg-star-purple-hover disabled:opacity-50"
            >
              {loading ? '生成中...' : '生成分享链接'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
