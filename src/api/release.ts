// 桌面端发布 / 下载数据层（REL-P2）。
//
// 官网 Hero + /download 页消费云端「发布」模块的公开只读端点：
//   GET /api/v1/release/open/latest  → 当前 channel 最新版本 + 各平台 installer
// 端点无需鉴权，走 client.ts 的 request() 自动解包 {code,msg,data} 信封。
// 下载走计数重定向端点 /api/v1/release/open/download/{asset_id}（302 → 七牛 CDN），
// 以累加下载计数；直接用 CDN download_url 会绕过计数，故对外一律用重定向端点。
import { request } from './client'

// API 基址（prod 走 nginx 相对路径 /api/v1，dev 走后端域名）。
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

// 平台目标标识（对齐云端 release_asset.platform_target）。
export type PlatformTarget =
  | 'darwin-aarch64'
  | 'darwin-x86_64'
  | 'windows-x86_64'
  | 'linux-x86_64'

// 单个发布资产（installer 安装包 / updater 热更新包）。
export interface ReleaseAsset {
  id: number
  platform_target: string
  asset_kind: string // installer / updater
  download_url: string
  file_name: string
  file_size: number
  sha256: string | null
  signature: string | null
  download_count: number
}

// 最新版本响应（对齐云端 LatestReleaseResponse）。
export interface LatestRelease {
  version: string | null
  channel: string
  published_time: string | null
  release_notes_md: string | null
  // platform_target → installer 资产（仅含 installer，不含 updater）
  installers: Record<string, ReleaseAsset>
}

// 拉取最新版本；失败（端点未上线 / 尚无发布版本 / 网络错误）时返回 null，
// 交由 Hero / 下载页兜底为「敬请期待」而非白屏。
export async function getLatestRelease(channel = 'stable'): Promise<LatestRelease | null> {
  try {
    return await request<LatestRelease>({
      url: '/release/open/latest',
      method: 'GET',
      params: { channel },
    })
  } catch {
    // 静默降级：调用方据 null 兜底
    return null
  }
}

// 计数下载链接：走后端 302 重定向端点，累加下载计数后跳七牛 CDN。
export function assetDownloadUrl(asset: ReleaseAsset): string {
  return `${API_BASE}/release/open/download/${asset.id}`
}

// 平台展示元信息（下载页分组用）。
export interface PlatformMeta {
  target: PlatformTarget
  os: 'macos' | 'windows' | 'linux'
  label: string // 展示名，如「macOS（Apple 芯片）」
  arch: string
  hint: string // 选择提示
}

// 下载页平台清单（顺序即展示顺序）。
export const PLATFORM_META: readonly PlatformMeta[] = [
  {
    target: 'darwin-aarch64',
    os: 'macos',
    label: 'macOS（Apple 芯片）',
    arch: 'Apple Silicon',
    hint: 'M1 / M2 / M3 及更新款 Mac',
  },
  {
    target: 'darwin-x86_64',
    os: 'macos',
    label: 'macOS（Intel 芯片）',
    arch: 'Intel',
    hint: '2020 年前的 Intel 款 Mac',
  },
  { target: 'windows-x86_64', os: 'windows', label: 'Windows', arch: 'x64', hint: 'Windows 10 及以上（64 位）' },
  { target: 'linux-x86_64', os: 'linux', label: 'Linux', arch: 'x64', hint: 'AppImage / deb / rpm（64 位）' },
]

// 依据浏览器 UA 猜测当前操作系统对应的首选平台目标。
// macOS 无法从 JS 可靠区分 Apple Silicon / Intel（UA 一致），默认给 Apple 芯片，
// Intel 用户可在下载页显式选择 Intel 版。
export function detectPreferredTarget(): PlatformTarget {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined
  const ua = (nav?.userAgent || '').toLowerCase()
  const platform = (nav?.platform || '').toLowerCase()
  if (ua.includes('mac') || platform.includes('mac')) return 'darwin-aarch64'
  if (ua.includes('win') || platform.includes('win')) return 'windows-x86_64'
  if (ua.includes('linux') || platform.includes('linux')) return 'linux-x86_64'
  return 'darwin-aarch64'
}

// 当前 OS 的简短标签（Hero 下载按钮文案用）。
export function detectOsLabel(): string {
  const t = detectPreferredTarget()
  if (t.startsWith('darwin')) return 'macOS'
  if (t.startsWith('windows')) return 'Windows'
  return 'Linux'
}

// 人类可读的文件大小。
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return ''
  const mb = bytes / (1024 * 1024)
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb.toFixed(1)} MB`
}
