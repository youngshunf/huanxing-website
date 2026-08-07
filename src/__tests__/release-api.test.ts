import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  assetDownloadUrl,
  detectOsLabel,
  detectPreferredTarget,
  formatFileSize,
  installersOf,
  PLATFORM_META,
  type ReleaseAsset,
  type ReleaseVersion,
} from '../api/release'

// 用真实 UA 字符串驱动平台探测，覆盖 mac/win/linux/兜底
function stubUserAgent(ua: string, platform = ''): void {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua)
  vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform)
}

const sampleAsset: ReleaseAsset = {
  id: 42,
  platform_target: 'darwin-aarch64',
  asset_kind: 'installer',
  download_url: 'https://cdn.example.com/唤星-0.2.0-aarch64.dmg',
  file_name: '唤星-0.2.0-aarch64.dmg',
  file_size: 120 * 1024 * 1024,
  sha256: null,
  signature: null,
  download_count: 0,
}

describe('release api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('detectPreferredTarget 认出 macOS 并默认 Apple 芯片', () => {
    stubUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit')
    expect(detectPreferredTarget()).toBe('darwin-aarch64')
    expect(detectOsLabel()).toBe('macOS')
  })

  it('detectPreferredTarget 认出 Windows', () => {
    stubUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit')
    expect(detectPreferredTarget()).toBe('windows-x86_64')
    expect(detectOsLabel()).toBe('Windows')
  })

  it('detectPreferredTarget 认出 Linux', () => {
    stubUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit')
    expect(detectPreferredTarget()).toBe('linux-x86_64')
    expect(detectOsLabel()).toBe('Linux')
  })

  it('detectPreferredTarget 未知 UA 兜底到 macOS Apple 芯片', () => {
    stubUserAgent('SomeUnknownAgent/1.0')
    expect(detectPreferredTarget()).toBe('darwin-aarch64')
  })

  it('assetDownloadUrl 走计数重定向端点而非 CDN 直链', () => {
    // 计数端点形如 <base>/release/open/download/{id}，且绝不用 asset.download_url
    const url = assetDownloadUrl(sampleAsset)
    expect(url).toMatch(/\/release\/open\/download\/42$/)
    expect(url).not.toContain('cdn.example.com')
  })

  it('formatFileSize 输出人类可读大小', () => {
    expect(formatFileSize(120 * 1024 * 1024)).toBe('120.0 MB')
    expect(formatFileSize(1536 * 1024 * 1024)).toBe('1.5 GB')
    expect(formatFileSize(0)).toBe('')
  })

  it('PLATFORM_META 覆盖 macOS 双架构 + Windows + Linux', () => {
    const targets = PLATFORM_META.map((m) => m.target)
    expect(targets).toContain('darwin-aarch64')
    expect(targets).toContain('darwin-x86_64')
    expect(targets).toContain('windows-x86_64')
    expect(targets).toContain('linux-x86_64')
  })

  it('installersOf 只保留安装包并按平台索引', () => {
    const updater = { ...sampleAsset, id: 43, asset_kind: 'updater' }
    const release: ReleaseVersion = {
      id: 3,
      version: '0.3.0',
      channel: 'stable',
      release_notes_md: '改进桌面端体验。',
      status: 'published',
      is_latest: false,
      release_tag: 'v0.3.0',
      published_time: '2026-07-29T00:00:00Z',
      created_time: '2026-07-29T00:00:00Z',
      assets: [sampleAsset, updater],
    }
    expect(installersOf(release)).toEqual({ 'darwin-aarch64': sampleAsset })
  })
})
