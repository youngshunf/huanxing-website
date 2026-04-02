import { useState, useEffect } from 'react'
import { Plus, Copy, Trash2, Key, AlertTriangle, Cpu } from 'lucide-react'
import { listApiKeys, createApiKey, deleteApiKey, type ApiKeyItem } from '../../api/apiKey'

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [createdKey, setCreatedKey] = useState<string | null>(null)

  const fetchKeys = async () => {
    try {
      setLoading(true)
      const data = await listApiKeys()
      setKeys(data || [])
    } catch (err: any) {
      alert('无法加载 API Keys: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const handleCreate = async () => {
    if (!newName.trim()) {
      alert('请输入设备名称')
      return
    }
    try {
      const resp = await createApiKey(newName.trim())
      setCreatedKey(resp.api_key)
      alert('API Key 创建成功')
      fetchKeys()
    } catch (err: any) {
      alert('创建失败: ' + err.message)
    }
  }

  const handleDelete = async (clientId: string) => {
    if (!window.confirm('确定要删除并吊销此 API Key 吗？相关节点将立即断开连接。')) return
    try {
      await deleteApiKey(clientId)
      alert('已吊销 API Key')
      fetchKeys()
    } catch (err: any) {
      alert('吊销失败: ' + err.message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-text-primary">HASN API Keys</h1>
        <button
          onClick={() => {
            setShowCreate(true)
            setCreatedKey(null)
            setNewName('')
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-star-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-star-purple/90"
        >
          <Plus className="h-4 w-4" />
          创建新 Key
        </button>
      </div>

      <p className="text-text-secondary">
        API Key 用于授权本地桌面端或您部署的云端大模型节点接入 唤星 (HASN) 统一网络。请妥善保管。
      </p>

      {/* 创建模态框 */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-divider bg-space-panel p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-text-primary">
              {createdKey ? 'API Key 已生成' : '创建新 API Key'}
            </h2>

            {!createdKey ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    节点设备名称
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="例如：办公室 Mac、我的腾讯云服务器"
                    className="w-full rounded-lg border border-divider bg-space-black px-4 py-2.5 text-text-primary focus:border-star-purple focus:outline-none"
                    maxLength={30}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="rounded-lg px-4 py-2 text-sm text-text-secondary hover:bg-space-float hover:text-text-primary"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreate}
                    className="rounded-lg bg-star-purple px-5 py-2 text-sm font-medium text-white hover:bg-star-purple/90"
                  >
                    生成
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                    <div>
                      <h3 className="font-medium text-orange-400">请立即复制并妥善保存</h3>
                      <p className="mt-1 text-sm text-orange-400/80">
                        出于安全原则，离开此页面后您将**无法再次查阅**此密钥明文。如果遗失，请在此处重新生成。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    readOnly
                    value={createdKey}
                    className="w-full rounded-lg border border-divider bg-space-black py-3 pl-4 pr-12 font-mono text-sm text-star-blue focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(createdKey)}
                    className="absolute right-2 top-2 rounded-md p-1.5 text-text-secondary hover:bg-space-float hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="rounded-lg bg-space-float px-5 py-2 text-sm font-medium text-text-primary hover:bg-space-float/80"
                  >
                    我已保存，关闭
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 列表 */}
      <div className="overflow-hidden rounded-xl border border-divider bg-space-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="border-b border-divider bg-space-black text-xs uppercase text-text-secondary/70">
              <tr>
                <th scope="col" className="px-6 py-4">节点名称</th>
                <th scope="col" className="px-6 py-4">API Key Hash标识</th>
                <th scope="col" className="px-6 py-4">创建时间</th>
                <th scope="col" className="px-6 py-4">最后使用</th>
                <th scope="col" className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-star-purple border-t-transparent" />
                  </td>
                </tr>
              ) : keys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary/60">
                    <Key className="mx-auto mb-3 h-8 w-8 opacity-20" />
                    <p>暂无 API Key</p>
                  </td>
                </tr>
              ) : (
                keys.map((k) => (
                  <tr key={k.client_id} className="transition-colors hover:bg-space-black/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Cpu className="h-4 w-4 flex-shrink-0 text-star-purple" />
                        <span className="font-medium text-text-primary">
                          {k.device_name || k.client_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="rounded bg-space-float px-2 py-1">
                        hasn_ak_...{k.client_id.slice(-4)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {k.created_time ? new Date(k.created_time).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {k.last_seen_at
                        ? new Date(k.last_seen_at).toLocaleDateString()
                        : <span className="text-orange-500/80">未使用</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(k.client_id)}
                        className="inline-flex items-center gap-1.5 rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
                        title="删除并吊销"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
