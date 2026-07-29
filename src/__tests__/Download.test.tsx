import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { LatestRelease, ReleaseVersion } from '../api/release'
import Download from '../pages/Download'

const latestRelease: LatestRelease = {
  version: '0.3.1',
  channel: 'stable',
  published_time: '2026-07-30T00:00:00Z',
  release_notes_md: '修复桌面端启动问题，并改进本机发布流程。',
  installers: {
    'darwin-aarch64': {
      id: 1,
      platform_target: 'darwin-aarch64',
      asset_kind: 'installer',
      download_url: 'https://cdn.example.com/mac-arm.dmg',
      file_name: 'mac-arm.dmg',
      file_size: 100,
      sha256: 'a',
      signature: null,
      download_count: 0,
    },
    'darwin-x86_64': {
      id: 2,
      platform_target: 'darwin-x86_64',
      asset_kind: 'installer',
      download_url: 'https://cdn.example.com/mac-intel.dmg',
      file_name: 'mac-intel.dmg',
      file_size: 100,
      sha256: 'b',
      signature: null,
      download_count: 0,
    },
    'windows-x86_64': {
      id: 3,
      platform_target: 'windows-x86_64',
      asset_kind: 'installer',
      download_url: 'https://cdn.example.com/windows.exe',
      file_name: 'windows.exe',
      file_size: 100,
      sha256: 'c',
      signature: null,
      download_count: 0,
    },
  },
}

vi.mock('../hooks/useLatestRelease', () => ({
  useLatestRelease: () => ({ release: latestRelease, loading: false }),
}))

vi.mock('../hooks/useReleaseHistory', () => ({
  useReleaseHistory: () => ({ releases: [] as ReleaseVersion[], loading: false }),
}))

vi.mock('../components/shared/ScrollReveal', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

describe('下载页', () => {
  beforeEach(() => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    )
  })

  it('在每个可下载平台卡片展示当前版本，并显示真实更新内容', () => {
    render(
      <MemoryRouter>
        <Download />
      </MemoryRouter>,
    )

    expect(screen.getAllByText('v0.3.1')).toHaveLength(3)
    expect(screen.getByText('v0.3.1 更新内容')).toBeInTheDocument()
    expect(
      screen.getByText('修复桌面端启动问题，并改进本机发布流程。'),
    ).toBeInTheDocument()
    expect(screen.queryByText('所有安装包均经过')).not.toBeInTheDocument()
  })
})
