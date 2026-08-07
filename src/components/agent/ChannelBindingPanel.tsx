import { useCallback, useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Plug, RefreshCw, ShieldCheck, Unplug } from 'lucide-react'
import { getChannelQrStatus, listChannels, manualBindChannel, startChannelQr, testChannel, unbindChannel } from '../../api/agent'
import type { ChannelBinding, ChannelStatus, SupportedChannelType } from '../../types/agent'
import AgentStatusBadge from './AgentStatusBadge'

const TERMINAL_QR_STATUSES: ChannelStatus[] = ['bound', 'expired', 'failed', 'cancelled']

export default function ChannelBindingPanel({ agentId, onChanged }: { agentId: string; onChanged?: () => void }) {
  const [channels, setChannels] = useState<ChannelBinding[]>([])
  const [loading, setLoading] = useState(true)
  const [busyChannel, setBusyChannel] = useState<SupportedChannelType | null>(null)
  const [qrSession, setQrSession] = useState<{ channel: SupportedChannelType; sessionId: string; status: ChannelStatus; expiresAt: string; image: string; message?: string | null } | null>(null)
  const [manualChannel, setManualChannel] = useState<SupportedChannelType | null>(null)
  const [manualAppId, setManualAppId] = useState('')
  const [manualSecret, setManualSecret] = useState('')
  const [notice, setNotice] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setChannels(await listChannels(agentId))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '渠道列表加载失败'
      setLoadError(msg)
      setChannels([])
    } finally {
      setLoading(false)
    }
  }, [agentId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!qrSession || TERMINAL_QR_STATUSES.includes(qrSession.status)) return undefined
    const timer = window.setInterval(async () => {
      const status = await getChannelQrStatus(agentId, qrSession.channel, qrSession.sessionId)
      setQrSession((current) => current && current.sessionId === qrSession.sessionId ? { ...current, status: status.status, message: status.message } : current)
      if (TERMINAL_QR_STATUSES.includes(status.status)) {
        window.clearInterval(timer)
        await refresh()
        onChanged?.()
      }
    }, 2000)
    return () => window.clearInterval(timer)
  }, [agentId, onChanged, qrSession, refresh])

  const channelHelp = useMemo(() => ({
    feishu: '适合团队通知、群聊 @、个人 DM',
    weixin: '适合个人私聊和常用移动沟通',
    qq: '适合 QQ 私聊和轻量社群沟通',
    wecom: '适合企业内部机器人，待公网回调能力开放',
    webhook: '适合服务端事件回调，后续开放',
  }), [])

  async function handleStartQr(channel: SupportedChannelType) {
    try {
      setBusyChannel(channel)
      const session = await startChannelQr(agentId, channel)
      const source = session.qrcode_img_content || session.qr_url || `${channel}:${session.session_id}`
      const image = session.qrcode_img_content?.startsWith('data:') ? session.qrcode_img_content : await QRCode.toDataURL(source, { margin: 1, width: 220 })
      setQrSession({ channel, sessionId: session.session_id, status: session.status, expiresAt: session.expires_at, image, message: session.message })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '无法生成二维码')
    } finally {
      setBusyChannel(null)
    }
  }

  async function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!manualChannel) return
    try {
      setBusyChannel(manualChannel)
      await manualBindChannel(agentId, manualChannel, { app_id: manualAppId, app_secret: manualSecret })
      setManualChannel(null)
      setManualAppId('')
      setManualSecret('')
      setNotice('已保存渠道配置，下一轮状态刷新后生效')
      await refresh()
      onChanged?.()
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '手动配置失败')
    } finally {
      setBusyChannel(null)
    }
  }

  async function handleTest(channel: SupportedChannelType) {
    setBusyChannel(channel)
    try {
      await testChannel(agentId, channel)
      setNotice('连接测试已完成')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '连接测试失败')
    } finally {
      setBusyChannel(null)
    }
  }

  async function handleUnbind(channel: SupportedChannelType) {
    if (!window.confirm('确定要解绑该渠道吗？解绑后 Agent 将无法继续通过该 IM 收发消息。')) return
    setBusyChannel(channel)
    try {
      await unbindChannel(agentId, channel)
      await refresh()
      onChanged?.()
    } finally {
      setBusyChannel(null)
    }
  }

  if (loading) {
    return <div className="rounded-xl border border-divider bg-space-panel p-8 text-center text-text-secondary">加载渠道状态...</div>
  }

  return (
    <div className="space-y-4">
      {loadError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>渠道列表加载失败：{loadError}</span>
          <button type="button" onClick={refresh} className="shrink-0 rounded-md border border-red-500/50 px-3 py-1 text-xs text-red-200 hover:bg-red-500/20">重试</button>
        </div>
      )}
      {notice && <div className="rounded-lg border border-star-blue/30 bg-star-blue/10 px-4 py-3 text-sm text-star-blue">{notice}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        {channels.map((channel) => (
          <div key={channel.channel} className="rounded-xl border border-divider bg-space-panel p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary"><Plug className="h-5 w-5 text-star-purple" />{channel.display_name}</h3>
                <p className="mt-1 text-sm text-text-secondary">{channelHelp[channel.channel]}</p>
              </div>
              <AgentStatusBadge status={channel.status} />
            </div>
            {channel.bound_account_display && <p className="mb-3 text-sm text-text-secondary">绑定账号：{channel.bound_account_display}</p>}
            {channel.last_error && <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{channel.last_error}</p>}
            {!channel.enabled && <p className="mb-3 rounded-lg bg-space-float px-3 py-2 text-sm text-text-secondary">{channel.disabled_reason || '暂未开放'}</p>}
            <div className="flex flex-wrap gap-2">
              <button disabled={!channel.enabled || busyChannel === channel.channel} onClick={() => handleStartQr(channel.channel)} className="rounded-lg border border-divider px-3 py-2 text-sm text-text-primary hover:border-star-purple/50 disabled:opacity-50">扫码绑定</button>
              <button disabled={!channel.enabled || busyChannel === channel.channel} onClick={() => setManualChannel(channel.channel)} className="rounded-lg border border-divider px-3 py-2 text-sm text-text-primary hover:border-star-purple/50 disabled:opacity-50">手动配置</button>
              {channel.status === 'bound' && <button disabled={busyChannel === channel.channel} onClick={() => handleTest(channel.channel)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10"><ShieldCheck className="h-4 w-4" />测试</button>}
              {channel.status === 'bound' && <button disabled={busyChannel === channel.channel} onClick={() => handleUnbind(channel.channel)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"><Unplug className="h-4 w-4" />解绑</button>}
            </div>
          </div>
        ))}
      </div>

      {qrSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-divider bg-space-panel p-6 text-center shadow-2xl">
            <h3 className="text-lg font-semibold text-text-primary">扫码绑定</h3>
            <p className="mt-1 text-sm text-text-secondary">请在过期前完成扫码确认</p>
            <img src={qrSession.image} alt="渠道绑定二维码" className="mx-auto my-5 h-56 w-56 rounded-lg bg-white p-2" />
            <AgentStatusBadge status={qrSession.status} />
            <p className="mt-3 text-sm text-text-secondary">{qrSession.message || `有效期至 ${new Date(qrSession.expiresAt).toLocaleTimeString('zh-CN')}`}</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => handleStartQr(qrSession.channel)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-divider px-3 py-2 text-sm text-text-primary hover:border-star-blue/50"><RefreshCw className="h-4 w-4" />重新生成</button>
              <button onClick={() => setQrSession(null)} className="flex-1 rounded-lg bg-space-float px-3 py-2 text-sm text-text-primary hover:bg-space-input">关闭</button>
            </div>
          </div>
        </div>
      )}

      {manualChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <form onSubmit={handleManualSubmit} className="w-full max-w-md rounded-2xl border border-divider bg-space-panel p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-text-primary">手动配置渠道</h3>
            <p className="mt-1 text-sm text-text-secondary">Secret 只用于提交，不会在页面回显。</p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm text-text-secondary">App ID</span>
              <input value={manualAppId} onChange={(event) => setManualAppId(event.target.value)} className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none" />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm text-text-secondary">Secret / Token</span>
              <input type="password" value={manualSecret} onChange={(event) => setManualSecret(event.target.value)} className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none" />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setManualChannel(null)} className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary">取消</button>
              <button disabled={busyChannel === manualChannel} className="rounded-lg bg-star-purple px-5 py-2 text-sm font-medium text-white hover:bg-star-purple-hover disabled:opacity-60">保存</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
